import { prisma } from "../../lib/prisma";
import ApiError from "../../middlewares/ApiError";
import httpStatus from "http-status";




const createReviewIntoDB = async (
    customerId: string,
    payload: {
        bookingId: string;
        rating: number;
        comment?: string
    }) => {
    const booking = await prisma.booking.findUnique({
        where:
        {
            id: payload.bookingId
        },

        include:
        {
            review: true
        },
    });

    if (!booking) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Booking not found');
    }

    if (booking.customerId !== customerId) {
        throw new ApiError(httpStatus.FORBIDDEN, 'You are not allowed to review this booking');
    }

    if (booking.status !== 'COMPLETED') {
        throw new ApiError(httpStatus.BAD_REQUEST, 'You can only review completed jobs');
    }

    if (booking.review) {
        throw new ApiError(httpStatus.CONFLICT, 'You have already reviewed this booking');
    }

    return prisma.$transaction(async tx => {
        const review = await tx.review.create({
            data: {
                bookingId: booking.id,
                customerId,
                technicianId: booking.technicianId,
                rating: payload.rating,
                comment: payload.comment,
            },
        });

        const stats = await tx.review.aggregate({
            where: { technicianId: booking.technicianId },
            _avg: { rating: true },
            _count: { rating: true },
        });

        await tx.technicianProfile.update({
            where:
            {
                id: booking.technicianId
            },

            data:
            {
                totalReviews: stats._count.rating,
            },
        });

        return review;
    });
};


// 02

const getReviewsForTechnicianFromDB = async (technicianId: string) => {
    return prisma.review.findMany({
        where: {
            technicianId
        },

        include: {
            customer: {
                select:
                {
                    id: true,
                    name: true
                }
            }
        },
        orderBy: { createdAt: 'desc' },
    });
};

export const reviewService = {

    createReviewIntoDB,
    getReviewsForTechnicianFromDB
}