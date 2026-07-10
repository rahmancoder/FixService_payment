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

    }),
});

const updateBookingStatusZodSchema = z.object({
    body: z.object({

    }),
});

export const TechnicianValidation = {
    updateProfileZodSchema,
    updateAvailabilityZodSchema,
    updateBookingStatusZodSchema,
};