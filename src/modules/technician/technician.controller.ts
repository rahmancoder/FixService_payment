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


const getAllTechnicians = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const result = await technicianService.getAllTechniciansFromDB(req.query);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'All Or Searched Technicians retrieved successfully',
        meta: result.meta,
        data: result.data,
    });
});


// 04


const getTechnicianById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const technicianId = req.params.id;
    const result = await technicianService.getTechnicianByIdFromDB(technicianId as string);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Technician profile retrieved successfully',
        data: result,
    });
});






// 05
const updateTechnicianBookingsStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const userId = req.user?.id;
    const bookingId = req.params.id;

    const status = req.body.status;

    const result = await technicianService.updateTechnicianBookingsStatusIntoDB(
        userId as string,
        bookingId as string,
        status
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Booking status updated successfully',
        data: result,
    });
});


const getTechnicianBookings = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const userId = req.user?.id;
    const status = req.query.status;

    // console.log(req.user);
    // console.log(userId);

    const result = await technicianService.getTechnicianBookingsFromDB(userId as string, status as string | undefined)
    // const result = await technicianService.getTechnicianBookingsFromDB(userId as string)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Technician's bookings retrieved successfully",
        data: result,
    });
});




export const technicianController = {
    updateTechnicianProfile,
    updateTechnicianAvailability,

    getAllTechnicians,
    getTechnicianById,

    updateTechnicianBookingsStatus,
    getTechnicianBookings,
};
