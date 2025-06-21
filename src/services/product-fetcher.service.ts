import type { z } from "zod";

import type { ValkeyClient } from "@/cache/valkey";
import type { DbType } from "@/db/pg/db";

import { product } from "@/db/pg/db/schema";
import productRating from "@/db/pg/db/schema/product-rating";
import { productSchema } from "@/presentation/validation/product.schema";

type Product = z.infer<typeof productSchema>;

export class ProductFetcherService {
    constructor(private readonly db: DbType, private readonly redisClient: ValkeyClient) { }

    async checkIfExists(productId: number): Promise<Product | null> {
        const key = `product:${productId}`;
        const cachedProduct = await this.redisClient.get(key);
        if (cachedProduct) {
            const result = productSchema.safeParse(JSON.parse(cachedProduct));

            if (result.success) {
                return result.data;
            }
        }

        const fetchedProduct = await fetch(`https://fakestoreapi.com/products/${productId}`);

        if (!fetchedProduct.ok) {
            return null;
        }

        const response = await fetchedProduct.json();

        const result = productSchema.safeParse(JSON.parse(response));

        if (!result.success) {
            return null;
        }

        const data = result.data;

        await this.db.transaction(async (tx) => {
            const insertion = {
                title: data.title,
                id: data.productId,
                unitPrice: String(data.price),
                image: data.image,
            };

            await tx.insert(product).values(insertion).onConflictDoUpdate({
                target: product.id,
                set: insertion,
            });

            if (data.review) {
                await tx.insert(productRating).values({
                    rating: String(data.review.rate),
                    count: data.review.count,
                    productId: data.productId,
                }).onConflictDoUpdate(
                    {
                        target: product.id,
                        set: {
                            rating: String(data.review.rate),
                        },
                    },
                );
            }
        });

        this.redisClient.set(key, JSON.stringify(data));
        this.redisClient.expire(key, 24 * 60 * 60);
        return data;
    }
}
