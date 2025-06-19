import type {
  ClientErrorStatusCode,
  ContentfulStatusCode,
  ContentlessStatusCode,
  ServerErrorStatusCode,
  SuccessStatusCode,
} from "hono/utils/http-status";

export interface ContentlessSuccessResponse {
  data?: undefined;
  error?: never;
  status: Exclude<SuccessStatusCode, ContentfulStatusCode>;
  headers?: Record<string, string>;
}

export interface ContentFulSuccessResponse<T> {
  data: T;
  error?: never;
  status: Exclude<SuccessStatusCode, ContentlessStatusCode>;
  headers?: Record<string, string>;
}

export interface ErrorResponse {
  data?: null;
  error: Error;
  status: ClientErrorStatusCode | ServerErrorStatusCode;
  headers?: Record<string, string>;
}

export type HttpResponse<T>
  = | ContentFulSuccessResponse<T>
  | ContentlessSuccessResponse
  | ErrorResponse;

export interface HttpController<
  T = Record<string | number | symbol, never>,
  R = unknown,
> {
  handle: (request: T) => Promise<HttpResponse<R>>;
}

export type ContentFulResponse<T>
  = | ContentFulSuccessResponse<T>
  | ErrorResponse;

export interface ContentFulHttpController<T, R extends Record<string, unknown>>
  extends HttpController<T, NonNullable<R>> {
  handle: (request: T) => Promise<ContentFulResponse<R>>;
}

export interface ContentlessHttpController<T>
  extends HttpController<T, undefined> {
  handle: (request: T) => Promise<HttpResponse<undefined>>;
}
