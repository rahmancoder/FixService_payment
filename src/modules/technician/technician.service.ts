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
const updateTechnicianAvailabilityIntoDB = async (payload: any) => {
    // Implementation for updating technician availability in the database
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