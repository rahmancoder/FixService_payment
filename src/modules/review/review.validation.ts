import { z } from "zod";

const reviewcreateZodSchema = z.object({
    body: z.object({
        bookingId: z.uuid("Invalid Booking ID"),

        rating: z.coerce.number().int("Rating must be an integer")
            .min(1, "Rating must be at least 1")
            .max(5, "Rating cannot be more than 5"),

        comment: z.string().trim().optional(),
    }),
});

export const reviewValidation = {
    reviewcreateZodSchema,
};