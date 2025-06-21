import { and, eq } from "drizzle-orm";

import type { AppRouteHandler } from "@/lib/types";

import { valkeyClient } from "@/cache/valkey";
import { db } from "@/db/pg/db";
import { favourite } from "@/db/pg/db/schema";
import { favouritesSchemaArray } from "@/presentation/validation/favourite.schema";
import { ProductFetcherService } from "@/services/product-fetcher.service";
import * as StatusCode from "src/http/status-code";

import type { CreateRoute, GetOneRoute, ListRoute, RemoveRoute } from "./favourite.routes";

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const { userId } = c.req.valid("param");


  const favouriteObjects = await db.query.favourite.findMany({
    with: {
      product: {
        with: {
          rating: true
        }
      }
    },
    where(fields, { eq }) {
      return eq(fields.clientId, userId);
    },
  });

  const toSchemas = favouriteObjects.map((favouriteObject) => {
    return {
      id: favouriteObject.id,
      productId: favouriteObject.productId!,
      clientId: favouriteObject.clientId!,
      price: Number(favouriteObject.product?.unitPrice),
      title: favouriteObject.product?.title ?? "",
      image: favouriteObject.product?.image ?? undefined,
      ...(favouriteObject?.product?.rating && {
        review: {
          rate: Number(favouriteObject?.product?.rating?.rating ?? 0),
          count: Number(favouriteObject?.product?.rating?.count ?? 0),
        },
      }),
    };
  });

  return c.json(toSchemas);
};

export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const fav = c.req.valid("json");
  const user = c.req.param("userId");

  const key = `favourites:${user}`;
  const cachedFavs = await valkeyClient.get(key);
  const jsonObject = cachedFavs ? JSON.parse(cachedFavs) : [];
  const cachedObjects = favouritesSchemaArray.safeParse(jsonObject);
  const hasFav = cachedObjects.data ?? [];

  if (!hasFav.some(el => el.productId === fav.productId)) {
    const userHasDbFavourite = await db.select({ id: favourite.id }).from(favourite).where(
      and(
        eq(favourite.clientId, Number(user)),
        eq(favourite.productId, fav.productId),
      ),
    ).limit(1);
    if (userHasDbFavourite.length === 0) {
      const productFetcherService = new ProductFetcherService(db, valkeyClient);
      if (await productFetcherService.checkIfExists(fav.productId) === null) {
        return c.json({ error: "Este email já está em uso" }, StatusCode.BAD_REQUEST);
      }

      await db.insert(favourite).values({ clientId: Number(user), productId: fav.productId });
      await valkeyClient.set(key, JSON.stringify([...hasFav, fav]));
      await valkeyClient.expire(key, 24 * 60 * 60);

      return c.json({ message: 'Favourite Created' }, StatusCode.OK);
    }
  }

  return c.json({
    error: "This client already has the designated favourite",
    id: user,
  }, StatusCode.BAD_REQUEST);
};

export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const { userId } = c.req.valid("param");


  const favouriteObject = await db.query.favourite.findFirst({
    with: {
      product: {
        with: {
          rating: true
        }
      }
    },
    where(fields, { eq, and }) {
      return and(eq(fields.id, id), eq(fields.clientId, userId));
    },
  });

  if (!favouriteObject || !favouriteObject.product) {
    return c.json(
      {
        message: "NotFound",
      },
      StatusCode.NOT_FOUND,
    );
  }

  return c.json({
    productId: favouriteObject.productId!,
    clientId: favouriteObject.clientId!,
    price: Number(favouriteObject.product?.unitPrice),
    title: favouriteObject.product?.title,
    image: favouriteObject.product?.image ?? undefined,
    ...(favouriteObject?.product?.rating && {
      review: {
        rate: Number(favouriteObject?.product?.rating?.rating ?? 0),
        count: Number(favouriteObject?.product?.rating?.count ?? 0),
      },
    }),
  }, StatusCode.OK);
};

export const remove: AppRouteHandler<RemoveRoute> = async (c) => {
  const { id } = c.req.valid("param");
  await db.delete(favourite)
    .where(eq(favourite.id, id));

  return c.body(null, StatusCode.NO_CONTENT);
};
