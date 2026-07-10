import { z } from "zod";

const bookingcreateZodSchema = z.object({
    body: z.object({
        serviceId: z.coerce.number().int("Service ID must be an integer").positive("Service ID must be greater than 0"),

        scheduledAt: z.iso.datetime("Invalid scheduled date/time format"),

        address: z.string().trim().optional(),

        notes: z.string().trim().optional(),
    }),
});

export const bookingValidation = {
    bookingcreateZodSchema,
};