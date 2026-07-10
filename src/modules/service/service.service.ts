import { prisma } from "../../lib/prisma";

import ApiError from "../../middlewares/ApiError";
import httpStatus from "http-status";
import { paginationHelper } from "../../utils/paginationHelper";
import { Prisma } from "../../../generated/prisma/client";


type IServiceFilters = {
    searchTerm?: string;
    categoryId?: number;

    page?: string;
    limit?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
};


// 01
const createServiceIntoDB = async (
    technicianUserId: string,
    payload: {
        title: string;
        description?: string;
        price: number;
        categoryId: number;
        location?: string;
    }
) => {
    const technicianProfile = await prisma.technicianProfile.findUnique({
        where: { userId: technicianUserId },
    });

    if (!technicianProfile) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Technician profile not found');
    }

    const category = await prisma.category.findUnique({ where: { id: payload.categoryId } });
    if (!category) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
    }

    return prisma.service.create({
        data: { ...payload, technicianId: technicianProfile.id },
    });
};


//02

const getAllServicesFromDB = async (filters: IServiceFilters) => {

    const { searchTerm, categoryId, ...paginationOptions } = filters;

    const { page, limit, skip } = paginationHelper.calculatePagination(paginationOptions);

    const andConditions: Prisma.ServiceWhereInput[] = [
        {
            isActive: true
        }
    ];

    if (searchTerm) {
        andConditions.push({
            OR: [
                {
                    title: {
                        contains: searchTerm,
                        mode: 'insensitive'
                    }
                },

                {
                    description:
                    {
                        contains: searchTerm,
                        mode: 'insensitive'
                    }
                },
            ],
        });
    }

    if (categoryId) andConditions.push({ categoryId });




    const whereConditions: Prisma.ServiceWhereInput = { AND: andConditions };

    const result = await prisma.service.findMany({
        where: whereConditions,
        skip,
        take: limit,

        include:
        {
            category: true,
            technician:
            {
                include:
                {
                    user:
                    {
                        select:

                        {
                            id: true,
                            name: true,
                        }

                    }
                }
            },
        },
    });

    const total = await prisma.service.count({ where: whereConditions });

    return {
        meta: { page, limit, total },
        data: result
    };
};


const updateServiceIntoDB = async (
    serviceId: number,
    technicianUserId: string,
    payload: Partial<{
        title: string;
        description: string;
        price: number;
        categoryId: number;
        location: string;
        isActive: boolean;
    }>) => {
    const technicianProfile = await prisma.technicianProfile.findUnique({
        where: {
            userId: technicianUserId
        },
    });

    const service = await prisma.service.findUnique({
        where: {
            id: serviceId
        }
    });

    if (!service) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Service not found');
    }

    if (!technicianProfile || service.technicianId !== technicianProfile.id) {
        throw new ApiError(httpStatus.FORBIDDEN, 'You are not allowed to update this service');
    }

    return prisma.service.update({
        where: {
            id: serviceId
        },
        data: payload
    });
};


export const serviceService = {
    createServiceIntoDB,
    getAllServicesFromDB,
    updateServiceIntoDB
};