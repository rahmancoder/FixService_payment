
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
                    unit_amount: Math.round(booking.service.price * 1),
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
        },
    });

    return {
        sessionId: session.id,
        sessionUrl: session.url,
        transactionId
    };
};



export const paymentService = {
    createPaymentIntoDB,

};