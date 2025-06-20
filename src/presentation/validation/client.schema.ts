import { z } from "zod";

export const clientSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
});

export const patchClientSchema = z.object({
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
}).optional();
