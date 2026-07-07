import { NextFunction, Request, Response } from "express";

import httpStatus from "http-status";
import { technicianService } from "./technician.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";


// 01
const updateTechnicianProfile = async (req: Request, res: Response) => {
    try {
        const payload = req.body;

        const userId = req.user?.id;

        const technician = await technicianService.updateTechnicianProfileIntoDB(userId as string, payload);

        res.status(httpStatus.OK).json({
            success: true,
            statusCode: httpStatus.OK,
            message: "Technician profile updated successfully",
            technician,
        });
    }


    catch (error) {
        console.error("Error updating technician profile:", error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            statusCode: httpStatus.INTERNAL_SERVER_ERROR,
            message: "Failed to update technician profile",
            error: (error as Error).message
        });
    }
}



// 02


const updateTechnicianAvailability = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const userId = req.user?.id;

    const slots = req.body.slots;
    const result = await technicianService.updateTechnicianAvailabilityIntoDB(userId as string, slots);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Availability updated successfully',
        data: result,
    });

}


);






// 03

const getTechnicianBookings = async (req: Request, res: Response) => {
    try {
        // Assuming you have a service function to get bookings for a technician
    }

    catch (error) { }

}





// 04
const updateTechnicianBookings = async (req: Request, res: Response) => {
    try {
        // Assuming you have a service function to get bookings for a technician
    }

    catch (error) { }

}

export const technicianController = {
    updateTechnicianProfile,
    updateTechnicianAvailability,
    getTechnicianBookings,
    updateTechnicianBookings,
};
