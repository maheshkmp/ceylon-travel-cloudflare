import { NextResponse } from "next/server";
import type { ApiResponse, ApiMeta, PaginationMeta } from "@repo/types";

export function ok<T>(data: T, meta?: ApiMeta, status: 200 | 201 = 200) {
  return NextResponse.json<ApiResponse<T>>(
    {
      data,
      error: null,
      meta: {
        ...meta,
        timestamp: new Date().toISOString(),
      },
    },
    { status }
  );
}

export function created<T>(data: T, meta?: ApiMeta) {
  return ok(data, meta, 201);
}

export function noContent() {
  return new Response(null, { status: 204 });
}

export function paginated<T>(data: T[], pagination: PaginationMeta) {
  return NextResponse.json<ApiResponse<T[]>>({
    data,
    error: null,
    meta: {
      pagination,
      timestamp: new Date().toISOString(),
    },
  });
}

export function badRequest(message: string, details?: Record<string, string[]>) {
  return NextResponse.json<ApiResponse>(
    {
      data: null,
      error: { code: "BAD_REQUEST", message, details, status: 400 },
      meta: {},
    },
    { status: 400 }
  );
}

export function unauthorized(message = "Unauthorized") {
  return NextResponse.json<ApiResponse>(
    {
      data: null,
      error: { code: "UNAUTHORIZED", message, status: 401 },
      meta: {},
    },
    { status: 401 }
  );
}

export function forbidden(message = "Forbidden") {
  return NextResponse.json<ApiResponse>(
    {
      data: null,
      error: { code: "FORBIDDEN", message, status: 403 },
      meta: {},
    },
    { status: 403 }
  );
}

export function notFound(resource = "Resource") {
  return NextResponse.json<ApiResponse>(
    {
      data: null,
      error: { code: "NOT_FOUND", message: `${resource} not found`, status: 404 },
      meta: {},
    },
    { status: 404 }
  );
}

export function buildPaginationMeta(
  total: number,
  page: number,
  pageSize: number
): PaginationMeta {
  const totalPages = Math.ceil(total / pageSize);
  return {
    page,
    pageSize,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}
