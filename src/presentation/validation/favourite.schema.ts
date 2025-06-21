// Produtos favoritos devem exibir: ID, título, imagem, preço e review (se houver).

import { z } from "zod";

import { priceSchema } from "./price.schema";

export const favouriteSchema = z.object({
    productId: z.number().positive(),
    title: z.string().nonempty(),
    image: z.string().optional(),
    price: priceSchema,
    review: z.object({
        rate: z.number().min(1).max(5),
        count: z.number().positive(),
    }).optional(),
});

export const favouritesSchemaArray = z.array(favouriteSchema);
