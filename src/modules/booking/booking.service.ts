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


const getBookingByIdFromDB = async (bookingId: string, userId: string, role: string) => {
    const booking = await prisma.booking.findUnique({
        where: {
            id: bookingId
        },
        include: {
            service: true,
            customer: {
                select: {
                    id: true,
                    name: true
                }
            },
            technician: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                }
            },

            payment: true,
            review: true,
        },
    });

    if (!booking) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Booking not found');
    }

    const isOwnerCustomer = role === 'CUSTOMER' && booking.customerId === userId;
    const isOwnerTechnician = role === 'TECHNICIAN' && booking.technician.userId === userId;
    const isAdmin = role === 'ADMIN';

    if (!isOwnerCustomer && !isOwnerTechnician && !isAdmin) {
        throw new ApiError(httpStatus.FORBIDDEN, 'You are not allowed to view this booking');
    }

    return booking;
};


const cancelBookingIntoDB = async (bookingId: string, customerId: string) => {

    const booking = await prisma.booking.findUnique({
        where: {
            id: bookingId
        }
    });

    if (!booking) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Booking not found');
    }

    if (booking.customerId !== customerId) {
        throw new ApiError(httpStatus.FORBIDDEN, 'You are not allowed to cancel this booking');
    }

    const nonCancellableStatuses = ['IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'DECLINED'];

    if (nonCancellableStatuses.includes(booking.status)) {
        throw new ApiError(
            httpStatus.BAD_REQUEST,
            `Booking cannot be cancelled once it is ${booking.status}`
        );
    }

    return prisma.booking.update({
        where: {
            id: bookingId
        },
        data: {
            status: 'CANCELLED'
        }
    });
};



export const bookingService = {
    createBookingIntoDB,
    getMyBookingsFromDB,
    getBookingByIdFromDB,
    cancelBookingIntoDB,


};