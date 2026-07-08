import { prisma } from "../../lib/prisma";

import ApiError from "../../middlewares/ApiError";
import httpStatus from "http-status";


const getAllCategoriesFromDB = async () => {

    return prisma.category.findMany({

        orderBy:
        {
            name: 'asc'
        }
    });
};


const getCategoryByIdFromDB = async (id: number) => {

    const category = await prisma.category.findUnique({
        where:
        {
            id
        }
    });


    if (!category) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
    }
    return category;
};




export const categoryService = {

    getAllCategoriesFromDB,
    getCategoryByIdFromDB,
}