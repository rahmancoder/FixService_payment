import { prisma } from "../../lib/prisma";
import ApiError from "../../middlewares/ApiError";
import httpStatus from 'http-status';



// 01
const updateTechnicianProfileIntoDB = async (
    userId: string,
    payload: Partial<{
        bio: string;
        skills: string[];
        experience: number;
        serviceRate: number;
        location: string;
    }>
) => {
    const profile = await prisma.technicianProfile.findUnique({ where: { userId } });

    if (!profile) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Technician profile not found');
    }

    return prisma.technicianProfile.update({ where: { userId }, data: payload });
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
    const profile = await prisma.technicianProfile.findUnique({ where: { userId } });

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

        return tx.availability.findMany({ where: { technicianId: profile.id } });
    });
};




// 03
const getTechnicianBookingsFromDB = async (technicianId: string) => {
    // Implementation for fetching technician bookings from the database
};



// 04
const updateTechnicianBookingsIntoDB = async (technicianId: string) => {
    // Implementation for updating technician bookings in the database
};





export const technicianService = {
    updateTechnicianProfileIntoDB,
    updateTechnicianAvailabilityIntoDB,

    getTechnicianBookingsFromDB,
    updateTechnicianBookingsIntoDB,
};