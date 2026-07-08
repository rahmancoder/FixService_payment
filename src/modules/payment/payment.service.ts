
import { prisma } from "../../lib/prisma";
import { v4 as uuidv4 } from 'uuid';
import ApiError from "../../middlewares/ApiError";
import httpStatus from "http-status";
import { stripe } from "../../lib/stripe";
import config from "../../config";


const createPaymentIntoDB = async (userId: string, bookingId: string) => {

    const booking = await prisma.booking.findUnique({
        where:
        {
            id: bookingId
        },

        include:
        {
            service: true,
            payment: true
        },

    });


    if (!booking) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Booking not found');
    }


    if (booking.customerId !== userId) {
        throw new ApiError(httpStatus.FORBIDDEN, 'You are not allowed to pay for this booking');
    }


    if (booking.status !== 'ACCEPTED') {
        throw new ApiError(
            httpStatus.BAD_REQUEST,
            'Payment can only be made for bookings accepted by the technician'
        );
    }

    if (booking.payment) {
        throw new ApiError(httpStatus.CONFLICT, 'Payment already initiated for this booking');
    }

    const transactionId = `FXN-${uuidv4()}`;

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: [
            {
                price_data: {
                    currency: 'bdt',
                    product_data: { name: booking.service.title },
                    unit_amount: Math.round(booking.service.price * 100),
                },
                quantity: 1,
            },
        ],

        metadata:
        {
            bookingId: booking.id,
            transactionId,
            userId
        },

        // success_url: `${process.env.app_url || 'http://localhost:5000'}/payments/success?session_id={CHECKOUT_SESSION_ID}`,
        // cancel_url: `${process.env.app_url || 'http://localhost:5000'}/payments/cancel?success=false`,

        success_url: `${config.app_url || 'http://localhost:5000'}/payments/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${config.app_url || 'http://localhost:5000'}/payments/cancel?success=false`,
    });


    await prisma.payment.create({

        data:
        {
            transactionId,
            bookingId: booking.id,
            userId,
            amount: booking.service.price,
            provider: 'STRIPE',
            status: 'PENDING',
            stripeSessionId: session.id,
        },
    });

    return {
        sessionId: session.id,
        sessionUrl: session.url,
        transactionId
    };
};



const confirmPaymentIntoDB = async (sessionId: string) => {

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Payment session not found');
    }

    const { bookingId, transactionId } = session.metadata || {};


    if (!bookingId || !transactionId) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid payment session metadata');
    }


    const payment = await prisma.payment.findUnique({
        where:
        {
            transactionId
        }

    });

    if (!payment) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Payment record not found');
    }

    if (session.payment_status === 'paid') {

        const updatedPayment = await prisma.$transaction(async tx => {

            const p = await tx.payment.update({
                where:
                {
                    transactionId
                },

                data:
                {
                    status: 'COMPLETED',
                    method: session.payment_method_types?.[0] || 'card',
                    paidAt: new Date(),
                },

            });

            await tx.booking.update({
                where:
                {
                    id: bookingId
                },
                data:
                {
                    status: 'PAID'
                }

            });

            return p;
        });

        return updatedPayment;
    }

    await prisma.payment.update({
        where:
        {
            transactionId
        },
        data:
        {
            status: 'FAILED'
        }

    });

    throw new ApiError(httpStatus.BAD_REQUEST, 'Payment was not completed successfully');
};


const handleWebhookEvent = async (event: {
    type: string;
    data:
    {
        object:
        {
            metadata?: Record<string, string>;
            payment_method_types?: string[]
        }
    };
}) => {

    if (event.type === 'checkout.session.completed') {

        const session = event.data.object;
        const transactionId = session.metadata?.transactionId;

        const bookingId = session.metadata?.bookingId;

        if (transactionId && bookingId) {
            await prisma.$transaction(async tx => {
                await tx.payment.update({
                    where:
                    {
                        transactionId
                    },

                    data:
                    {
                        status: 'COMPLETED',
                        method: session.payment_method_types?.[0] || 'card',
                        paidAt: new Date(),
                    },
                });

                await tx.booking.update({
                    where:
                    {
                        id: bookingId
                    },
                    data:
                    {
                        status: 'PAID'
                    }
                });

            });
        }
    }

    return {
        received: true
    };
};



export const paymentService = {
    createPaymentIntoDB,
    confirmPaymentIntoDB,
    handleWebhookEvent,


};