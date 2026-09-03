import { describe, it, expect } from "bun:test";
import { cn, formatDate, formatRelative, truncate, initials } from "../lib/utils";

describe("cn (classname merger)", () => {
  it("merges class strings", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("deduplicates Tailwind conflicts", () => {
    // tailwind-merge: last wins for conflicting utilities
    expect(cn("px-2", "px-4")).toBe("px-4");
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
  });

  it("handles conditional classes", () => {
    const active = true;
    const disabled = false;
    expect(cn("base", active && "active", disabled && "disabled")).toBe("base active");
  });

  it("handles undefined and null", () => {
    expect(cn("base", undefined, null as any, false)).toBe("base");
  });
});

describe("truncate", () => {
  it("truncates long strings with ellipsis", () => {
    expect(truncate("Hello World", 5)).toBe("Hello…");
  });

  it("leaves short strings unchanged", () => {
    expect(truncate("Hi", 10)).toBe("Hi");
  });

  it("handles exact length", () => {
    expect(truncate("12345", 5)).toBe("12345");
  });
});

describe("initials", () => {
  it("extracts first two initials", () => {
    expect(initials("Jane Smith")).toBe("JS");
    expect(initials("John Paul Jones")).toBe("JP");
  });

  it("handles single name", () => {
    expect(initials("Madonna")).toBe("M");
  });

  it("uppercases result", () => {
    expect(initials("jane smith")).toBe("JS");
  });
});

describe("formatDate", () => {
  it("returns a non-empty string", () => {
    const result = formatDate("2024-06-15T00:00:00Z");
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  it("formats Date objects", () => {
    const d = new Date("2024-01-01T00:00:00Z");
    const result = formatDate(d);
    expect(result).toContain("2024");
  });
});

describe("formatRelative", () => {
  it("shows 'just now' for current time", () => {
    expect(formatRelative(new Date())).toBe("just now");
  });

  it("shows minutes ago", () => {
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000);
    expect(formatRelative(fiveMinAgo)).toBe("5m ago");
  });

  it("shows hours ago", () => {
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
    expect(formatRelative(twoHoursAgo)).toBe("2h ago");
  });

  it("shows days ago", () => {
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
    expect(formatRelative(threeDaysAgo)).toBe("3d ago");
  });

  it("falls back to date for old dates", () => {
    const longAgo = new Date("2020-01-01T00:00:00Z");
    const result = formatRelative(longAgo);
    expect(result).toContain("2020");
  });
});
