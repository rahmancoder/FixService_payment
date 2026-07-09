import { NextFunction, Request, Response } from "express";

import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { paymentService } from "./payment.service";
import config from "../../config";
import { stripe } from "../../lib/stripe";
import ApiError from "../../middlewares/ApiError";



const createPayment = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const bookingId = req.body.bookingId;

    const result = await paymentService.createPaymentIntoDB(userId as string, bookingId);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Payment session created successfully',
        data: result,
    });
});



// Callback-based confirmation - frontend calls this after redirect from Stripe Checkout
const confirmPayment = catchAsync(async (req: Request, res: Response) => {

    const { sessionId } = req.body;
    const result = await paymentService.confirmPaymentIntoDB(sessionId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Payment confirmed successfully',
        data: result,
    });
});




// Stripe webhook - requires raw body, mounted before json() body-parser in app.ts
const stripeWebhook = catchAsync(async (req: Request, res: Response) => {

    const payload = req.body;
    const signature = req.headers['stripe-signature'] as string;
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            payload,
            signature,
            config.stripe_webhook_secret
        );
    }

    catch (error) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Stripe webhook signature');
    }


    const result = await paymentService.handleWebhookEvent(event as any);
    res.status(httpStatus.OK).json(result);
});


const getMyPayments = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const result = await paymentService.getMyPaymentsFromDB(userId as string);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Payment history retrieved successfully',
        data: result,
    });
});

const getPaymentById = catchAsync(async (req: Request, res: Response) => {
    const paramId = req.params.id;
    const userId = req.user?.id;
    const userRole = req.user?.role;

    const result = await paymentService.getPaymentByIdFromDB(
        paramId as string,
        userId as string,
        userRole as string
    );
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Payment details retrieved successfully',
        data: result,
    });
});


export const paymentController = {

    createPayment,
    confirmPayment,
    stripeWebhook,
    getMyPayments,
    getPaymentById,

};




