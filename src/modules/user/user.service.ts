import ApiError from "../../middlewares/ApiError";
import { prisma } from "../../lib/prisma";
import httpStatus from "http-status";
import { paginationHelper } from "../../utils/paginationHelper";
import { Prisma } from "../../../generated/prisma/client";
import { IServiceFilters } from "./user.interface";


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


const getServiceByIdFromDB = async (id: number) => {
    const service = await prisma.service.findUnique({
        where:
        {
            id
        },
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
                            name: true
                        }
                    }
                }
            },
        },
    });

    if (!service) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Service not found');
    }

    return service;
};

export const userService = {

    getAllServicesFromDB,
    getServiceByIdFromDB,
};