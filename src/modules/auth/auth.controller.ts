import { NextFunction, Request, Response } from "express";

import httpStatus from "http-status";
import { authService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import { catchAsync } from "../../utils/catchAsync";

const registerUser = async (req: Request, res: Response) => {
    try {

        const payload = req.body;
        const user = await authService.registerUserIntoDB(payload);
        res.status(httpStatus.CREATED).json({
            success: true,
            statusCode: httpStatus.CREATED,
            message: "User registered successfully",
            user,
        });
    }

    catch (error) {
        console.error("Error registering user:", error);
        // res.status(500).json({ message: "Internal server error" });

        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            statusCode: httpStatus.INTERNAL_SERVER_ERROR,
            message: "Failed to register user",
            error: (error as Error).message
        })

    }

    // res.status(201).json({ message: "User registered successfully" });
}

const loginUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;

    const { accessToken, refreshToken } = await authService.loginUserIntoDB(payload);

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24 // 24 hour or 1 day
    })

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 day
    })

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User logged in successfully",
        data: { accessToken, refreshToken }
    });
});

export const authController = {
    registerUser,
    loginUser,
};