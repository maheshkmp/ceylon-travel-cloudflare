#!/usr/bin/env bun
/**
 * SaaS Boilerplate Resource Generator
 * Usage: bun generate resource <name>
 * Example: bun generate resource post
 *          bun generate resource invoice
 */

import { existsSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";

// ─── CLI Entry ────────────────────────────────────────────────────────────

const [, , command, ...args] = process.argv;

if (command === "resource") {
  const name = args[0];
  if (!name) {
    console.error("❌ Please provide a resource name: bun generate resource <name>");
    process.exit(1);
  }
  generateResource(name.toLowerCase());
} else {
  console.log(`
SaaS Boilerplate Generator

Commands:
  bun generate resource <name>    Scaffold a full CRUD resource

Example:
  bun generate resource invoice
  bun generate resource blog-post
`);
}

// ─── Name helpers ─────────────────────────────────────────────────────────

function toPascal(s: string): string {
  return s
    .replace(/-([a-z])/g, (_, c: string) => c.toUpperCase())
    .replace(/^[a-z]/, (c) => c.toUpperCase());
}

function toCamel(s: string): string {
  const p = toPascal(s);
  return p.charAt(0).toLowerCase() + p.slice(1);
}

function toPlural(s: string): string {
  if (s.endsWith("y")) return s.slice(0, -1) + "ies";
  if (s.endsWith("s") || s.endsWith("x") || s.endsWith("z")) return s + "es";
  return s + "s";
}

function toSnake(s: string): string {
  return s.replace(/-/g, "_").replace(/([A-Z])/g, "_$1").toLowerCase().replace(/^_/, "");
}

// ─── Generator ────────────────────────────────────────────────────────────

function generateResource(name: string) {
  const pascal = toPascal(name);
  const camel = toCamel(name);
  const plural = toPlural(name);
  const pluralPascal = toPascal(plural);
  const snake = toSnake(name);
  const snakePlural = toPlural(snake);
  const kebab = name;
  const kebabPlural = toPlural(kebab);

  console.log(`\n🔨 Generating resource: ${pascal}\n`);

  const root = join(import.meta.dir, "..");

  writeAll([
    // 1. Validator (Zod schema)
    {
      path: join(root, "packages/validators/src", `${kebabPlural}.ts`),
      content: validatorTemplate({ pascal, camel, plural, pluralPascal, snake }),
    },
    // 2. DB schema
    {
      path: join(root, "packages/db/src/schema", `${snakePlural}.ts`),
      content: dbSchemaTemplate({ pascal, camel, snake, snakePlural }),
    },
    // 3. API service
    {
      path: join(root, "apps/api/src/services", `${kebabPlural}.service.ts`),
      content: serviceTemplate({ pascal, camel, plural, pluralPascal, snake, snakePlural, kebab, kebabPlural }),
    },
    // 4. API route
    {
      path: join(root, "apps/api/src/routes", `${kebabPlural}.ts`),
      content: routeTemplate({ pascal, camel, plural, pluralPascal, kebab, kebabPlural }),
    },
    // 5. Frontend hook
    {
      path: join(root, "apps/web/src/hooks", `use-${kebabPlural}.ts`),
      content: hookTemplate({ pascal, camel, plural, pluralPascal, kebab, kebabPlural }),
    },
    // 6. Frontend page
    {
      path: join(root, `apps/web/src/app/(dashboard)/${kebabPlural}/page.tsx`),
      content: pageTemplate({ pascal, camel, plural, pluralPascal, kebab, kebabPlural }),
    },
  ]);

  // Print mount instructions
  console.log(`\n✅ Resource ${pascal} generated!\n`);
  console.log("Next steps:");
  console.log(`  1. Add to packages/db/src/schema/index.ts:`);
  console.log(`       export * from "./${snakePlural}";`);
  console.log(`  2. Mount route in apps/api/src/index.ts:`);
  console.log(`       import { ${camel}Router } from "@/routes/${kebabPlural}";`);
  console.log(`       app.route("/api/v1/${kebabPlural}", ${camel}Router);`);
  console.log(`  3. Add nav item in apps/web/src/components/layout/sidebar.tsx`);
  console.log(`  4. Run: bun db:push`);
  console.log(`  5. Export validator from packages/validators/src/index.ts\n`);
}

function writeAll(files: { path: string; content: string }[]) {
  for (const file of files) {
    const dir = file.path.split("/").slice(0, -1).join("/");
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    if (existsSync(file.path)) {
      console.log(`  ⚠️  Skipped (exists): ${file.path.split("/packages/")[1] ?? file.path.split("/apps/")[1] ?? file.path}`);
      continue;
    }
    writeFileSync(file.path, file.content, "utf-8");
    const short = file.path.includes("/packages/")
      ? "packages/" + file.path.split("/packages/")[1]
      : "apps/" + file.path.split("/apps/")[1];
    console.log(`  ✅ Created: ${short}`);
  }
}

// ─── Templates ────────────────────────────────────────────────────────────

function validatorTemplate(n: { pascal: string; camel: string; plural: string; pluralPascal: string; snake: string }) {
  return `import { z } from "zod";
import { listQuerySchema } from "./query";

// ─── ${n.pascal} Schema ────────────────────────────────────────────────────

export const ${n.camel}Schema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type ${n.pascal}Schema = z.infer<typeof ${n.camel}Schema>;

// ─── Create ───────────────────────────────────────────────────────────────

export const create${n.pascal}Schema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  description: z.string().max(1000).optional(),
});

export type Create${n.pascal}Input = z.infer<typeof create${n.pascal}Schema>;

// ─── Update ───────────────────────────────────────────────────────────────

export const update${n.pascal}Schema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().max(1000).nullable().optional(),
});

export type Update${n.pascal}Input = z.infer<typeof update${n.pascal}Schema>;

// ─── List ─────────────────────────────────────────────────────────────────

export const list${n.pluralPascal}Schema = listQuerySchema.extend({
  // Add resource-specific filters here
});

export type List${n.pluralPascal}Input = z.infer<typeof list${n.pluralPascal}Schema>;
`;
}

function dbSchemaTemplate(n: { pascal: string; camel: string; snake: string; snakePlural: string }) {
  return `import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const ${n.snakePlural} = pgTable(
  "${n.snakePlural}",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    createdAtIdx: index("${n.snakePlural}_created_at_idx").on(table.createdAt),
    nameIdx: index("${n.snakePlural}_name_idx").on(table.name),
  })
);

export type ${n.pascal} = typeof ${n.snakePlural}.\$inferSelect;
export type New${n.pascal} = typeof ${n.snakePlural}.\$inferInsert;

// Add relations here as needed
// export const ${n.snakePlural}Relations = relations(${n.snakePlural}, ({ one, many }) => ({}));
`;
}

function serviceTemplate(n: {
  pascal: string; camel: string; plural: string; pluralPascal: string;
  snake: string; snakePlural: string; kebab: string; kebabPlural: string;
}) {
  return `import { eq, ilike, and, count, desc, asc, type SQL } from "drizzle-orm";
import { getDb } from "@repo/db/client";
import { ${n.snakePlural} } from "@repo/db/schema/${n.snakePlural}";
import type { Create${n.pascal}Input, Update${n.pascal}Input, List${n.pluralPascal}Input } from "@repo/validators/${n.kebabPlural}";
import { buildPaginationMeta } from "@/lib/response";
import { cacheGet, cacheSet, cacheDel, cacheDelPattern } from "@/lib/redis";
import { AppError } from "./auth.service";

const CACHE_KEY = (id: string) => \`${n.snake}:\${id}\`;
const LIST_CACHE_KEY = (params: string) => \`${n.snakePlural}:list:\${params}\`;

export const ${n.camel}sService = {
  async getById(id: string) {
    const cached = await cacheGet(CACHE_KEY(id));
    if (cached) return cached;

    const db = getDb();
    const [item] = await db
      .select()
      .from(${n.snakePlural})
      .where(eq(${n.snakePlural}.id, id))
      .limit(1);

    if (!item) throw new AppError("NOT_FOUND", "${n.pascal} not found", 404);

    await cacheSet(CACHE_KEY(id), item, 300);
    return item;
  },

  async list(input: List${n.pluralPascal}Input) {
    const { page, pageSize, sortBy, sortOrder, search } = input;
    const cacheKey = LIST_CACHE_KEY(JSON.stringify(input));
    const cached = await cacheGet(cacheKey);
    if (cached) return cached;

    const db = getDb();
    const conditions: SQL[] = [];
    if (search) conditions.push(ilike(${n.snakePlural}.name, \`%\${search}%\`));
    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const orderCol = sortBy === "name" ? ${n.snakePlural}.name : ${n.snakePlural}.createdAt;
    const order = sortOrder === "asc" ? asc(orderCol) : desc(orderCol);

    const [totalResult, rows] = await Promise.all([
      db.select({ count: count() }).from(${n.snakePlural}).where(where),
      db.select().from(${n.snakePlural}).where(where).orderBy(order)
        .limit(pageSize).offset((page - 1) * pageSize),
    ]);

    const total = Number(totalResult[0]?.count ?? 0);
    const result = { data: rows, pagination: buildPaginationMeta(total, page, pageSize) };
    await cacheSet(cacheKey, result, 60);
    return result;
  },

  async create(input: Create${n.pascal}Input) {
    const db = getDb();
    const [item] = await db.insert(${n.snakePlural}).values(input).returning();
    if (!item) throw new AppError("CREATE_FAILED", "Failed to create ${n.pascal}", 500);
    await cacheDelPattern(\`${n.snakePlural}:list:*\`);
    return item;
  },

  async update(id: string, input: Update${n.pascal}Input) {
    const db = getDb();
    const [updated] = await db
      .update(${n.snakePlural})
      .set({ ...input, updatedAt: new Date() })
      .where(eq(${n.snakePlural}.id, id))
      .returning();

    if (!updated) throw new AppError("NOT_FOUND", "${n.pascal} not found", 404);
    await Promise.all([cacheSet(CACHE_KEY(id), updated, 300), cacheDelPattern(\`${n.snakePlural}:list:*\`)]);
    return updated;
  },

  async delete(id: string): Promise<void> {
    const db = getDb();
    const [deleted] = await db
      .delete(${n.snakePlural})
      .where(eq(${n.snakePlural}.id, id))
      .returning({ id: ${n.snakePlural}.id });

    if (!deleted) throw new AppError("NOT_FOUND", "${n.pascal} not found", 404);
    await Promise.all([cacheDel(CACHE_KEY(id)), cacheDelPattern(\`${n.snakePlural}:list:*\`)]);
  },
};
`;
}

function routeTemplate(n: { pascal: string; camel: string; plural: string; pluralPascal: string; kebab: string; kebabPlural: string }) {
  return `import { Hono } from "hono";
import {
  create${n.pascal}Schema,
  update${n.pascal}Schema,
  list${n.pluralPascal}Schema,
} from "@repo/validators/${n.kebabPlural}";
import { idParamSchema } from "@repo/validators/query";
import { validate } from "@/middleware/validate";
import { requireAuth } from "@/middleware/auth";
import { ${n.camel}sService } from "@/services/${n.kebabPlural}.service";
import { ok, created, noContent } from "@/lib/response";

export const ${n.camel}Router = new Hono();

${n.camel}Router.use("*", requireAuth());

// GET /api/v1/${n.kebabPlural}
${n.camel}Router.get("/", validate("query", list${n.pluralPascal}Schema), async (c) => {
  const query = c.req.valid("query");
  const result = await ${n.camel}sService.list(query);
  return c.json({
    data: result.data,
    error: null,
    meta: {
      pagination: result.pagination,
      requestId: c.get("requestId"),
      timestamp: new Date().toISOString(),
    },
  });
});

// POST /api/v1/${n.kebabPlural}
${n.camel}Router.post("/", validate("json", create${n.pascal}Schema), async (c) => {
  const input = c.req.valid("json");
  const item = await ${n.camel}sService.create(input);
  return created(c, item);
});

// GET /api/v1/${n.kebabPlural}/:id
${n.camel}Router.get("/:id", validate("param", idParamSchema), async (c) => {
  const { id } = c.req.valid("param");
  const item = await ${n.camel}sService.getById(id);
  return ok(c, item);
});

// PUT /api/v1/${n.kebabPlural}/:id
${n.camel}Router.put(
  "/:id",
  validate("param", idParamSchema),
  validate("json", update${n.pascal}Schema),
  async (c) => {
    const { id } = c.req.valid("param");
    const input = c.req.valid("json");
    const item = await ${n.camel}sService.update(id, input);
    return ok(c, item);
  }
);

// DELETE /api/v1/${n.kebabPlural}/:id
${n.camel}Router.delete("/:id", validate("param", idParamSchema), async (c) => {
  const { id } = c.req.valid("param");
  await ${n.camel}sService.delete(id);
  return noContent(c);
});
`;
}

function hookTemplate(n: { pascal: string; camel: string; plural: string; pluralPascal: string; kebab: string; kebabPlural: string }) {
  return `"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { ApiResponse, PaginationMeta } from "@repo/types";
import type { Create${n.pascal}Input, Update${n.pascal}Input, List${n.pluralPascal}Input } from "@repo/validators/${n.kebabPlural}";
import { useToast } from "@/hooks/use-toast";

const BASE = "/api/v1/${n.kebabPlural}";

export function use${n.pluralPascal}(params?: Partial<List${n.pluralPascal}Input>) {
  return useQuery({
    queryKey: ["${n.kebabPlural}", params],
    queryFn: async () => {
      const res = await api.get(BASE, { params: params as any }) as ApiResponse<any[]>;
      return { data: res.data ?? [], pagination: res.meta?.pagination as PaginationMeta };
    },
  });
}

export function use${n.pascal}(id: string) {
  return useQuery({
    queryKey: ["${n.kebabPlural}", id],
    queryFn: async () => {
      const res = await api.get(\`\${BASE}/\${id}\`) as ApiResponse<any>;
      return res.data!;
    },
    enabled: !!id,
  });
}

export function useCreate${n.pascal}() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (data: Create${n.pascal}Input) => api.post(BASE, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["${n.kebabPlural}"] }); toast({ title: "${n.pascal} created" }); },
    onError: (err: Error) => toast({ title: "Failed to create ${n.pascal}", description: err.message, variant: "destructive" }),
  });
}

export function useUpdate${n.pascal}() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Update${n.pascal}Input }) => api.put(\`\${BASE}/\${id}\`, data),
    onSuccess: (_, { id }) => { qc.invalidateQueries({ queryKey: ["${n.kebabPlural}", id] }); qc.invalidateQueries({ queryKey: ["${n.kebabPlural}"] }); toast({ title: "${n.pascal} updated" }); },
    onError: (err: Error) => toast({ title: "Failed to update ${n.pascal}", description: err.message, variant: "destructive" }),
  });
}

export function useDelete${n.pascal}() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (id: string) => api.delete(\`\${BASE}/\${id}\`),
    onSuccess: (_, id) => { qc.removeQueries({ queryKey: ["${n.kebabPlural}", id] }); qc.invalidateQueries({ queryKey: ["${n.kebabPlural}"] }); toast({ title: "${n.pascal} deleted" }); },
    onError: (err: Error) => toast({ title: "Failed to delete ${n.pascal}", description: err.message, variant: "destructive" }),
  });
}
`;
}

function pageTemplate(n: { pascal: string; camel: string; plural: string; pluralPascal: string; kebab: string; kebabPlural: string }) {
  return `"use client";

import { useState } from "react";
import { use${n.pluralPascal}, useDelete${n.pascal} } from "@/hooks/use-${n.kebabPlural}";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable, type Column } from "@/components/shared/data-table";
import { SearchInput } from "@/components/shared/search-input";
import { DeleteDialog } from "@/components/shared/delete-dialog";
import { Button } from "@/components/ui/button";
import { formatRelative } from "@/lib/utils";
import { MoreHorizontal, Trash2, Pencil } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

// Replace with your actual type from @repo/validators/${n.kebabPlural}
type ${n.pascal}Item = {
  id: string;
  name: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
};

export default function ${n.pluralPascal}Page() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [deleteTarget, setDeleteTarget] = useState<${n.pascal}Item | null>(null);

  const { data, isLoading } = use${n.pluralPascal}({ page, pageSize: 20, search, sortBy, sortOrder });
  const deleteItem = useDelete${n.pascal}();

  const columns: Column<${n.pascal}Item>[] = [
    {
      key: "name",
      header: "Name",
      sortable: true,
      cell: (item) => (
        <div>
          <p className="font-medium text-sm text-foreground">{item.name}</p>
          {item.description && (
            <p className="text-xs text-muted-foreground truncate max-w-xs">{item.description}</p>
          )}
        </div>
      ),
    },
    {
      key: "createdAt",
      header: "Created",
      sortable: true,
      width: "140px",
      cell: (item) => (
        <span className="text-sm text-muted-foreground">{formatRelative(item.createdAt)}</span>
      ),
    },
    {
      key: "actions",
      header: "",
      width: "48px",
      cell: (item) => (
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => e.stopPropagation()}>
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="z-50 min-w-[140px] rounded-md border border-border bg-background shadow-md p-1 text-sm animate-fade-in"
              align="end" sideOffset={4}
            >
              <DropdownMenu.Item className="flex items-center gap-2 px-2.5 py-1.5 rounded cursor-pointer hover:bg-accent outline-none" onSelect={() => {}}>
                <Pencil className="w-3.5 h-3.5 text-muted-foreground" /> Edit
              </DropdownMenu.Item>
              <DropdownMenu.Separator className="h-px bg-border my-1" />
              <DropdownMenu.Item
                className="flex items-center gap-2 px-2.5 py-1.5 rounded cursor-pointer text-destructive hover:bg-destructive/10 outline-none"
                onSelect={() => setDeleteTarget(item)}
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="${n.pluralPascal}" description="Manage all ${n.kebabPlural}">
        <Button size="sm">New ${n.pascal.toLowerCase()}</Button>
      </PageHeader>

      <div className="flex items-center gap-2 mb-4">
        <SearchInput
          value={search}
          onChange={(v) => { setSearch(v); setPage(1); }}
          placeholder="Search ${n.kebabPlural}…"
          className="w-64"
        />
        <div className="ml-auto text-xs text-muted-foreground">
          {data?.pagination && \`\${data.pagination.total} ${n.kebabPlural}\`}
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        pagination={data?.pagination}
        isLoading={isLoading}
        onPageChange={setPage}
        onSortChange={(by, order) => { setSortBy(by); setSortOrder(order); setPage(1); }}
        sortBy={sortBy}
        sortOrder={sortOrder}
        rowKey={(item) => item.id}
        emptyMessage={search ? \`No ${n.kebabPlural} matching "\${search}"\` : "No ${n.kebabPlural} yet"}
      />

      <DeleteDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={\`Delete \${deleteTarget?.name}?\`}
        description="This action cannot be undone."
        onConfirm={() => {
          if (deleteTarget) {
            deleteItem.mutate(deleteTarget.id, { onSettled: () => setDeleteTarget(null) });
          }
        }}
        isLoading={deleteItem.isPending}
      />
    </div>
  );
}
`;
}
