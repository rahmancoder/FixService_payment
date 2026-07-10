import { z } from "zod";

const registerZodSchema = z.object({
    body: z.object({
        name: z.string().min(2, "Name must be at least 3 characters"),

        email: z.email("Invalid email address"),

        password: z.string().min(6, "Password must be at least 6 characters"),

        role: z.enum(["CUSTOMER", "TECHNICIAN"]),

    }),
});


const loginZodSchema = z.object({
    body: z.object({
        email: z.email("Invalid email address"),
        password: z.string(),
    }),
});

export const authValidation = {
    registerZodSchema,
    loginZodSchema,
};