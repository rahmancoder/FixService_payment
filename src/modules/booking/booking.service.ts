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


const getMyBookingsFromDB = async (userId: string, role: string) => {
    if (role === 'CUSTOMER') {
        return prisma.booking.findMany({
            where: {
                customerId: userId
            },
            include: {
                service: true,
                technician: {
                    include:
                    {
                        user:
                        {
                            select:
                            {
                                id: true,
                                name: true
                            }
                        }
                    }
                },
                payment: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    throw new ApiError(httpStatus.FORBIDDEN, 'Only customers can access this endpoint');
};


export const bookingService = {
    createBookingIntoDB,
    getMyBookingsFromDB,


};