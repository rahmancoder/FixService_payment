import { NextFunction, Request, Response } from "express";

import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { categoryService } from "./category.service";

const createCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const result = await categoryService.createCategoryIntoDB(req.body);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Category created successfully',
        data: result,
    });
});


export const categoryController = {
    createCategory,
};
