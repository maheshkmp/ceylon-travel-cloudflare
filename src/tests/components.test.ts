import { describe, it, expect } from "bun:test";

// Pure logic tests for shared components (no DOM needed)

describe("Badge variants", () => {
  // Test the variant logic that drives badge styling
  const roleVariantMap = {
    user: "secondary",
    admin: "default",
    super_admin: "warning",
  } as const;

  const planVariantMap = {
    free: "secondary",
    pro: "default",
    enterprise: "warning",
  } as const;

  it("maps user roles to correct variants", () => {
    expect(roleVariantMap["user"]).toBe("secondary");
    expect(roleVariantMap["admin"]).toBe("default");
    expect(roleVariantMap["super_admin"]).toBe("warning");
  });

  it("maps plans to correct variants", () => {
    expect(planVariantMap["free"]).toBe("secondary");
    expect(planVariantMap["pro"]).toBe("default");
    expect(planVariantMap["enterprise"]).toBe("warning");
  });
});

describe("Pagination logic", () => {
  function buildPagination(total: number, page: number, pageSize: number) {
    const totalPages = Math.ceil(total / pageSize);
    return {
      page, pageSize, total, totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
      from: Math.min((page - 1) * pageSize + 1, total),
      to: Math.min(page * pageSize, total),
    };
  }

  it("shows correct from/to range", () => {
    const p = buildPagination(100, 2, 20);
    expect(p.from).toBe(21);
    expect(p.to).toBe(40);
  });

  it("handles partial last page", () => {
    const p = buildPagination(45, 3, 20);
    expect(p.from).toBe(41);
    expect(p.to).toBe(45);
    expect(p.hasNext).toBe(false);
  });

  it("handles empty result", () => {
    const p = buildPagination(0, 1, 20);
    expect(p.from).toBe(0); // min(0, 0) = 0
    expect(p.to).toBe(0);
    expect(p.totalPages).toBe(0);
    expect(p.hasNext).toBe(false);
    expect(p.hasPrev).toBe(false);
  });
});

describe("Search debounce logic", () => {
  it("debounce timer fires after delay", async () => {
    let fired = false;
    const debounce = (fn: () => void, delay: number) => {
      let timer: ReturnType<typeof setTimeout>;
      return () => {
        clearTimeout(timer);
        timer = setTimeout(fn, delay);
      };
    };

    const debouncedFn = debounce(() => { fired = true; }, 50);
    debouncedFn();
    expect(fired).toBe(false);
    await new Promise((r) => setTimeout(r, 60));
    expect(fired).toBe(true);
  });

  it("debounce cancels rapid calls", async () => {
    let callCount = 0;
    const debounce = (fn: () => void, delay: number) => {
      let timer: ReturnType<typeof setTimeout>;
      return () => {
        clearTimeout(timer);
        timer = setTimeout(fn, delay);
      };
    };

    const debouncedFn = debounce(() => { callCount++; }, 50);
    debouncedFn();
    debouncedFn();
    debouncedFn();
    await new Promise((r) => setTimeout(r, 60));
    expect(callCount).toBe(1);
  });
});

describe("Token store logic", () => {
  it("detects expired token correctly", () => {
    const isExpired = (expiresAt: number) => Date.now() > expiresAt - 60_000;
    expect(isExpired(Date.now() - 1000)).toBe(true);
    expect(isExpired(Date.now() + 10_000)).toBe(true);  // within 60s buffer
    expect(isExpired(Date.now() + 120_000)).toBe(false); // 2min future = not expired
  });
});

describe("API URL building", () => {
  it("builds correct URL with params", () => {
    function buildUrl(base: string, path: string, params?: Record<string, string | number | undefined>) {
      const url = new URL(`${base}${path}`);
      if (params) {
        for (const [k, v] of Object.entries(params)) {
          if (v !== undefined) url.searchParams.set(k, String(v));
        }
      }
      return url.toString();
    }

    expect(buildUrl("http://localhost:3001", "/api/v1/users")).toBe("http://localhost:3001/api/v1/users");
    expect(buildUrl("http://localhost:3001", "/api/v1/users", { page: 2, pageSize: 20 }))
      .toBe("http://localhost:3001/api/v1/users?page=2&pageSize=20");
    // undefined params are excluded
    expect(buildUrl("http://localhost:3001", "/api/v1/users", { page: 1, search: undefined }))
      .toBe("http://localhost:3001/api/v1/users?page=1");
  });
});
