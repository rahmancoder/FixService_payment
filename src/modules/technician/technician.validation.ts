import { z } from "zod";

const updateProfileZodSchema = z.object({
    body: z.object({
        bio: z.string().trim().optional(),

        skills: z.array(z.string().trim()).optional(),

        experience: z.coerce.number().nonnegative("Experience cannot be negative").optional(),

        pricingRate: z.coerce.number().nonnegative("Pricing rate cannot be negative").optional(),

        location: z.string().trim().optional(),
    }),
});

const updateAvailabilityZodSchema = z.object({
    body: z.object({

        slots: z.array(z.object({
            dayOfWeek: z.enum([
                "SUNDAY",
                "MONDAY",
                "TUESDAY",
                "WEDNESDAY",
                "THURSDAY",
                "FRIDAY",
                "SATURDAY",
            ]),

            startTime: z.string().trim(),

            endTime: z.string().trim(),

            isActive: z.boolean().optional(),
        })
        ).min(1, "At least one availability slot is required"),

    }),
});

const updateBookingStatusZodSchema = z.object({
    body: z.object({
        status: z.enum([
            "ACCEPTED",
            "DECLINED",
            "IN_PROGRESS",
            "COMPLETED",
        ]),
    }),
});

export const technicianValidation = {
    updateProfileZodSchema,
    updateAvailabilityZodSchema,
    updateBookingStatusZodSchema,
};