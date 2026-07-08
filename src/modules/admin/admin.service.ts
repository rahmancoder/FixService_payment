import { prisma } from "../../lib/prisma";
import ApiError from "../../middlewares/ApiError";
import httpStatus from "http-status";
import { paginationHelper } from "../../utils/paginationHelper";
import { Prisma } from "../../../generated/prisma/client";


const createCategoryIntoDB = async (
    payload: {
        name: string;
        description?: string
    }) => {
    const existing = await prisma.category.findUnique({
        where:
        {
            name: payload.name
        }
    });


    if (existing) {
        throw new ApiError(httpStatus.CONFLICT, 'Category with this name already exists');
    }
    return prisma.category.create({
        data: payload
    });

};




const getAllUsersFromDB = async (
    filters:
        {
            role?: string;
            searchTerm?: string;

            page?: string;
            limit?: string;
        }) => {
    const { role, searchTerm, ...paginationOptions } = filters;

    const { page, limit, skip } = paginationHelper.calculatePagination(paginationOptions);

    const andConditions: Prisma.UserWhereInput[] = [];

    if (role) andConditions.push({
        role: role as any
    });

    if (searchTerm) {
        andConditions.push({
            OR: [
                {
                    name:
                    {
                        contains: searchTerm,
                        mode: 'insensitive'
                    }
                },

                {
                    email:
                    {
                        contains: searchTerm,
                        mode: 'insensitive'
                    }
                },
            ],
        });
    }

    const whereConditions: Prisma.UserWhereInput = andConditions.length
        ? { AND: andConditions }
        : {};

    const result = await prisma.user.findMany({
        where: whereConditions,
        skip,
        take: limit,
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            createdAt: true,
        },
    });

    const total = await prisma.user.count({ where: whereConditions });

    return {
        meta: { page, limit, total },
        data: result
    };
};




const updateUserStatusIntoDB = async (userId: string, status: 'ACTIVE' | 'BANNED') => {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    if (user.role === 'ADMIN') {
        throw new ApiError(httpStatus.FORBIDDEN, 'Cannot change status of an admin account');
    }

    return prisma.user.update({ where: { id: userId }, data: { status } });
};



export const adminService = {

    createCategoryIntoDB,
    getAllUsersFromDB,
    updateUserStatusIntoDB,
}