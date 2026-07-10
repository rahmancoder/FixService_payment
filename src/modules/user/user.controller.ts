import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { userService } from "./user.service";

const getAllServices = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


    const services = await userService.getAllServicesFromDB(req.query);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Services retrieved successfully',
        meta: services.meta,
        data: services.data,
    });
});


const getServiceById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const serviceId = Number(req.params.id);
    const result = await userService.getServiceByIdFromDB(serviceId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Service retrieved successfully',
        data: result,
    });
});

export const userController = {

    getAllServices,
    getServiceById,

};