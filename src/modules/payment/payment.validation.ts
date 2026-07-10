import { z } from "zod";

const createPaymentZodSchema = z.object({
    body: z.object({
        bookingId: z.uuid("Invalid Booking ID"),
    }),
});

export const paymentValidation = {
    createPaymentZodSchema,
};