import { NextFunction, Request, Response } from "express";

import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { categoryService } from "./category.service";

const getAllCategories = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const result = await categoryService.getAllCategoriesFromDB();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Categories retrieved successfully',
        data: result,
    });
});


const getCategoryById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const categoryId = Number(req.params.id);

    const result = await categoryService.getCategoryByIdFromDB(categoryId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Category retrieved successfully',
        data: result,
    });
});

export const categoryController = {
    getAllCategories,
    getCategoryById,
};
