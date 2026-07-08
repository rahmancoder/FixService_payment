import { NextFunction, Request, Response } from "express";

import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { paymentService } from "./payment.service";



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

export const paymentController = {

    createPayment,
    confirmPayment,

};
