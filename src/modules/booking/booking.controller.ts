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


const getMyBookings = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const userRole = req.user?.role;

    const result = await bookingService.getMyBookingsFromDB(userId as string, userRole as string);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Bookings retrieved successfully',
        data: result,
    });
});


const getBookingById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const paramId = req.params.id;
    const userId = req.user?.id;
    const userRole = req.user?.role;

    const result = await bookingService.getBookingByIdFromDB(paramId as string,
        userId as string, userRole as string);


    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Booking retrieved successfully',
        data: result,
    });
});


const cancelBooking = catchAsync(async (req: Request, res: Response) => {

    const paramId = req.params.id;
    const userId = req.user?.id;
    const result = await bookingService.cancelBookingIntoDB(paramId as string, userId as string);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Booking cancelled successfully',
        data: result,
    });
});


export const bookingController = {
    createBooking,
    getMyBookings,
    getBookingById,
    cancelBooking,

};
