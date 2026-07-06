import { Request, Response } from "express";

import httpStatus from "http-status";
import { authService } from "./auth.service";

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

const loginUser = (req: Request, res: Response) => {
    // Implement the logic for user login here
    res.status(200).json({ message: "User logged in successfully" });
}

export const authController = {
    registerUser,
    loginUser,
};