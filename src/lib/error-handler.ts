import type { Context } from "hono";

import process from "node:process";

import { AppError } from "@/protocols/exceptions/index.js";

import type { AppBindings } from "./types.js";

export class ErrorHandler {
  public static handleError(err: Error, c: Context<AppBindings>) {
    c.var.logger.error(err);

    const isTrustedError = err instanceof AppError && err.isOperational;

    if (isTrustedError) {
      process.exit(1);
    }

    return c.json({ message: "An internal error occured", error: err });
  }
}
