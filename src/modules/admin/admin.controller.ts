import { NextFunction, Request, Response } from "express";

import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { adminService } from "./admin.service";


const createCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const result = await adminService.createCategoryIntoDB(req.body);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Category created successfully',
        data: result,
    });
});


const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const result = await adminService.getAllUsersFromDB(req.query);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Users retrieved successfully',
        meta: result.meta,
        data: result.data,
    });
});


const updateUserStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    const status = req.body.status;

    const result = await adminService.updateUserStatusIntoDB(userId as string, status);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User status updated successfully',
        data: result,
    });
});


const getAllBookings = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const result = await adminService.getAllBookingsFromDB(req.query);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Bookings retrieved successfully',
        meta: result.meta,
        data: result.data,
    });
});

export const adminController = {
    createCategory,
    getAllUsers,
    updateUserStatus,
    getAllBookings,
};
