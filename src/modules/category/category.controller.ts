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



const updateCategory = catchAsync(async (req: Request, res: Response) => {
    const paramId = Number(req.params.id);
    const payload = req.body;

    const result = await categoryService.updateCategoryIntoDB(paramId, payload);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Category updated successfully',
        data: result,
    });
});


const deleteCategory = catchAsync(async (req: Request, res: Response) => {

    const paramId = Number(req.params.id);

    const result = await categoryService.deleteCategoryIntoDB(paramId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Category deleted successfully',
        data: result,
    });
});


export const categoryController = {
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
};
