// ─── API Response Types ────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  data: T | null;
  error: ApiError | null;
  meta?: ApiMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
  status: number;
}

export interface ApiMeta {
  pagination?: PaginationMeta;
  requestId?: string;
  timestamp?: string;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// ─── Query Types ───────────────────────────────────────────────────────────

export interface PaginationQuery {
  page?: number;
  pageSize?: number;
}

export interface SortQuery {
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface FilterQuery {
  search?: string;
  [key: string]: string | number | boolean | undefined;
}

export type ListQuery = PaginationQuery & SortQuery & FilterQuery;

// ─── Auth Types ────────────────────────────────────────────────────────────

export type Role = "user" | "admin" | "teacher" | "student" | "affiliates";

export interface JwtPayload {
  sub: string;       // user id
  email: string;
  role: Role;
  sessionId: string;
  iat: number;
  exp: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatarUrl: string | null;
}

// ─── User Types ────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatarUrl: string | null;
  phoneNumber: string | null;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Organization Types ────────────────────────────────────────────────────

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  plan: Plan;
  createdAt: string;
  updatedAt: string;
}

export type Plan = "free" | "pro" | "enterprise";

export interface OrgMember {
  userId: string;
  orgId: string;
  role: "owner" | "admin" | "member";
  joinedAt: string;
  user: Pick<User, "id" | "email" | "name" | "avatarUrl">;
}

// ─── Utility Types ─────────────────────────────────────────────────────────

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type MaybePromise<T> = T | Promise<T>;

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

// ─── File/Upload Types ─────────────────────────────────────────────────────

export interface UploadedFile {
  key: string;
  url: string;
  size: number;
  mimeType: string;
  name: string;
}

export interface PresignedUpload {
  uploadUrl: string;
  key: string;
  fields?: Record<string, string>;
  expiresAt: number;
}

// ─── Audit Log Types ───────────────────────────────────────────────────────

export interface AuditLog {
  id: string;
  userId: string | null;
  orgId: string | null;
  action: string;
  resource: string;
  resourceId: string | null;
  status: "success" | "warning" | "failed";
  metadata: Record<string, unknown>;
  ipAddress: string | null;
  userAgent: string | null;
  location: string | null;
  userName: string | null;
  userEmail: string | null;
  createdAt: string;
}

export interface AuditLogStats {
  total: number;
  successCount: number;
  warningCount: number;
  failedCount: number;
  byAction: { action: string; count: number }[];
  last24h: number;
  last7d: number;
  last30d: number;
}

// ─── Itinerary Types ───────────────────────────────────────────────────────

export interface ItineraryDay {
  day: string;
  title: string;
  place: string;
  body: string;
  img: string;
  activities: string[];
  travelTime: string;
  meals: { b: boolean; l: boolean; d: boolean };
  accommodation: string;
}

export interface ItineraryNeedToKnow {
  title: string;
  detail: string;
}

export interface ItineraryFaq {
  question: string;
  answer: string;
}

export interface Itinerary {
  id: string;
  title: string;
  slug: string;
  duration: string;
  price: string;
  pace: string;
  travelStyle: string;
  bestFor: string;
  tags: string[];
  heroImg: string;
  mapImg: string;
  overview: string;
  highlights: string[];
  days: ItineraryDay[];
  inclusions: string[];
  exclusions: string[];
  needToKnow: ItineraryNeedToKnow[];
  faqs?: ItineraryFaq[];
  createdAt: string;
  updatedAt: string;
}

export type CreateItineraryInput = Omit<Itinerary, "id" | "createdAt" | "updatedAt">;
export type UpdateItineraryInput = Partial<CreateItineraryInput>;

// ─── Destination Types ─────────────────────────────────────────────────────

export interface Destination {
  id: string;
  name: string;
  slug: string;
  region: string;
  image: string;
  tagline: string;
  description: string | null;
  featured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export type CreateDestinationInput = Omit<Destination, "id" | "createdAt" | "updatedAt">;
export type UpdateDestinationInput = Partial<CreateDestinationInput>;
