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

const updateCategoryIntoDB = async (
    id: number,

    payload: {
        name?: string;
        description?: string
    }) => {

    await getCategoryByIdFromDB(id);

    return prisma.category.update({
        where: {
            id
        },
        data: payload
    });
};


const deleteCategoryIntoDB = async (id: number) => {

    await getCategoryByIdFromDB(id);

    return prisma.category.delete({
        where: {
            id
        }
    });
};


export const categoryService = {

    getAllCategoriesFromDB,
    getCategoryByIdFromDB,
    updateCategoryIntoDB,
    deleteCategoryIntoDB
}