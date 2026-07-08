import { prisma } from "../../lib/prisma";

import ApiError from "../../middlewares/ApiError";
import httpStatus from "http-status";



const createBookingIntoDB = async (
    customerId: string,
    payload: {
        serviceId: number;
        scheduledAt: string;
        address?: string;
        notes?: string
    }) => {
    const service = await prisma.service.findUnique({
        where:
        {
            id: payload.serviceId
        }
    });

    if (!service || !service.isActive) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Service not found or unavailable');
    }

    return prisma.booking.create({

        data: {
            customerId,
            technicianId: service.technicianId,
            serviceId: service.id,
            scheduledAt: new Date(payload.scheduledAt),
            address: payload.address,
            notes: payload.notes,
        },
    });
};


export const bookingService = {
    createBookingIntoDB,

};