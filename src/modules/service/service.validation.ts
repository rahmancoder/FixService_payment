import { z } from "zod";

const servicecreateZodSchema = z.object({
    body: z.object({

        categoryId: z.coerce.number().int("Invalid Category ID"),

        title: z.string().trim().min(2, "Title must be at least 2 characters"),

        description: z.string().optional(),

        price: z.number().positive("Price must be greater than 0"),

        location: z.string().optional(),
    }),
});


export const serviceValidation = {
    servicecreateZodSchema,

};