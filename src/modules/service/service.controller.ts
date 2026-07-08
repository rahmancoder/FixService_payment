
import { NextFunction, Request, Response } from "express";

import httpStatus from "http-status";
import { serviceService } from "./service.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

//01
const createService = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!.id
    const payload = req.body;
    const result = await serviceService.createServiceIntoDB(userId, payload);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Service created successfully',
        data: result,
    });
});



//02
const getAllServices = catchAsync(async (req: Request, res: Response) => {


    const services = await serviceService.getAllServicesFromDB(req.query);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Services retrieved successfully',
        meta: services.meta,
        data: services.data,
    });
});



export const serviceController = {
    getAllServices,
    createService
};
