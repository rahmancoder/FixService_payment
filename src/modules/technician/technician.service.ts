import { prisma } from "../../lib/prisma";
import ApiError from "../../middlewares/ApiError";
import httpStatus from 'http-status';
import { ITechnicianFilters } from "./technician.interface";
import { paginationHelper } from "../../utils/paginationHelper";
import { Prisma } from "../../../generated/prisma/client";



// 01
const updateTechnicianProfileIntoDB = async (
    userId: string,
    payload: Partial<{
        bio: string;
        skills: string[];
        experience: number;
        serviceRate: number;
        location: string;
    }>) => {
    const profile = await prisma.technicianProfile.findUnique({
        where:
        {
            userId
        }

    });

    if (!profile) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Technician profile not found');
    }

    return prisma.technicianProfile.update({
        where:
        {
            userId
        },

        data: payload
    });
};






// 02
const updateTechnicianAvailabilityIntoDB = async (
    userId: string,
    slots: {
        dayOfWeek: string;
        startTime: string;
        endTime: string;
        isActive?: boolean;
    }[]
) => {
    const profile = await prisma.technicianProfile.findUnique({
        where:
        {
            userId
        }
    });

    if (!profile) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Technician profile not found');
    }

    return prisma.$transaction(async tx => {
        await tx.availability.deleteMany({ where: { technicianId: profile.id } });

        await tx.availability.createMany({
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data: slots.map(slot => ({
                technicianId: profile.id,
                dayOfWeek: slot.dayOfWeek,
                startTime: slot.startTime,
                endTime: slot.endTime,
                isActive: slot.isActive ?? true,
            })) as any,
        });

        return tx.availability.findMany({
            where:
            {
                technicianId: profile.id
            }
        });
    });
};



// 03





const getAllTechniciansFromDB = async (filters: ITechnicianFilters) => {

    const { searchTerm, location, skill, ...paginationOptions } = filters;

    const { page, limit, skip, sortOrder } =
        paginationHelper.calculatePagination(paginationOptions);

    const andConditions: Prisma.TechnicianProfileWhereInput[] = [];

    if (searchTerm) {
        andConditions.push({
            OR: [
                {
                    user:
                    {
                        name:
                        {
                            contains: searchTerm,
                            mode: 'insensitive'
                        }
                    }
                },

                {
                    bio:
                    {
                        contains: searchTerm,
                        mode: 'insensitive'
                    }
                },

            ],
        });
    }

    if (location) andConditions.push({
        location:
        {
            contains: location,
            mode: 'insensitive'
        }
    });


    if (skill) andConditions.push({
        skills:
        {
            has: skill

        }
    });

    const whereConditions: Prisma.TechnicianProfileWhereInput = andConditions.length ? {
        AND: andConditions
    } : {};

    const result = await prisma.technicianProfile.findMany({
        where: whereConditions,
        skip,
        take: limit,
        include:
        {
            user:
            {
                select:
                {
                    id: true,
                    name: true,
                    email: true

                }
            },

            services: true,
        },
    });

    const total = await prisma.technicianProfile.count(
        {
            where: whereConditions
        }
    );

    return {
        meta: { page, limit, total },
        data: result
    };
};


// 04

const getTechnicianByIdFromDB = async (id: string) => {

    const technician = await prisma.technicianProfile.findUnique({

        where:
        {
            id

        },

        include:
        {
            user:
            {
                select:
                {
                    id: true,
                    name: true,
                    email: true

                }
            },

            services:
            {
                include:
                {
                    category: true
                }
            },
            availability: true,

            reviews:
            {
                include:
                {
                    customer:
                    {
                        select:
                        {
                            id: true,
                            name: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' },
            },
        },
    });

    if (!technician) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Technician not found');
    }

    return technician;
};




// 05

const updateTechnicianBookingsStatusIntoDB = async (
    technicianId: string,
    bookingId: string,
    status: 'ACCEPTED' | 'DECLINED' | 'IN_PROGRESS' | 'COMPLETED') => {

    const profile = await prisma.technicianProfile.findUnique({
        where:
        {
            userId: technicianId
        }
    });


    if (!profile) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Technician profile not found');
    }


    const booking = await prisma.booking.findUnique({
        where:
        {
            id: bookingId

        }
    });

    if (!booking || booking.technicianId !== profile.id) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Booking not found for this technician');
    }



    return prisma.booking.update({
        where:
        {
            id: bookingId
        },

        data:
        {
            status
        }
    });
};




export const technicianService = {
    updateTechnicianProfileIntoDB,
    updateTechnicianAvailabilityIntoDB,

    getAllTechniciansFromDB,
    getTechnicianByIdFromDB,

    updateTechnicianBookingsStatusIntoDB,
};