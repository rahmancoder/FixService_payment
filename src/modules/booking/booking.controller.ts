import { Request, Response, NextFunction } from "express";
import { sendResponse } from "../../utils/sendResponse";
import { catchAsync } from "../../utils/catchAsync";
import httpStatus from "http-status";
import { bookingService } from "./booking.service";

const createBooking = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const userId = req.user?.id;

    const result = await bookingService.createBookingIntoDB(userId as string, req.body);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Booking created successfully',
        data: result,
    });
});


export const bookingController = {
    createBooking,

};
