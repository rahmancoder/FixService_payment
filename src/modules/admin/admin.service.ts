import { prisma } from "../../lib/prisma";
import ApiError from "../../middlewares/ApiError";
import httpStatus from "http-status";


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

export const adminService = {

    createCategoryIntoDB,
}