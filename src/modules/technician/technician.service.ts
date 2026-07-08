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

    const { page, limit, skip, sortBy, sortOrder } =
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
        orderBy:
        {
            [sortBy]: sortOrder

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

        },
    });

    if (!technician) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Technician not found');
    }

    return technician;
};


// 05
const getTechnicianBookingsFromDB = async (technicianId: string) => {
    // Implementation for fetching technician bookings from the database
};



// 06
const updateTechnicianBookingsIntoDB = async (technicianId: string) => {
    // Implementation for updating technician bookings in the database
};





export const technicianService = {
    updateTechnicianProfileIntoDB,
    updateTechnicianAvailabilityIntoDB,

    getAllTechniciansFromDB,
    getTechnicianByIdFromDB,

    getTechnicianBookingsFromDB,
    updateTechnicianBookingsIntoDB,
};