import { createRouter } from "@/lib/create-app";

import * as routes from "./favourite.routes";
import * as handlers from "./favourites.handlers";

const router = createRouter()
  .openapi(routes.list, handlers.list)
  .openapi(routes.create, handlers.create)
  .openapi(routes.getOne, handlers.getOne)
  .openapi(routes.remove, handlers.remove);

export default router;
