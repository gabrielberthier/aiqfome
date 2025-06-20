import { z } from "zod";

export const priceSchema = z.union([
    z.string().transform(x => x.replace(/[^0-9.-]+/g, "")),
    z.number(),
]).pipe(z.coerce.number().min(0.0001));

export type Input = z.input<typeof priceSchema>;
// type Input = string | number

export type Output = z.output<typeof priceSchema>;
