
import { NextFunction, Request, Response } from "express";

import httpStatus from "http-status";
import { serviceService } from "./service.service";

const getAllServices = async (req: Request, res: Response) => {
    try {
        const services = await serviceService.getAllServicesFromDB();
        res.status(200).json({
            success: true,
            statusCode: 200,
            message: "Services retrieved successfully",
            data: services
        });
    }


    catch (error) {
        console.error("Error retrieving services:", error);
        res.status(500).json({
            success: false,
            statusCode: 500,
            message: "Failed to retrieve services",
            error: (error as Error).message
        });
    }
};

export const serviceController = {
    getAllServices
};
