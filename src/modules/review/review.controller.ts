import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { reviewService } from "./review.service";


const createReview = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const userId = req.user?.id;
    const payload = req.body;
    const result = await reviewService.createReviewIntoDB(userId as string, payload);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Review submitted successfully',
        data: result,
    });
});



const getReviewsForTechnician = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const technicianId = req.params.technicianId;
    const result = await reviewService.getReviewsForTechnicianFromDB(technicianId as string);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Reviews retrieved successfully',
        data: result,
    });
});

export const reviewController = {
    createReview,
    getReviewsForTechnician
};
