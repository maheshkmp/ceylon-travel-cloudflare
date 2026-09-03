"use client";

import { useState } from "react";
import type { PaginationMeta } from "@repo/types";
import { cn } from "@/lib/utils";
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ─── Column Definition ────────────────────────────────────────────────────

export interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  width?: string;
  className?: string;
  cell: (row: T) => React.ReactNode;
}

// ─── Props ────────────────────────────────────────────────────────────────

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  pagination?: PaginationMeta;
  isLoading?: boolean;
  onPageChange?: (page: number) => void;
  onSortChange?: (sortBy: string, sortOrder: "asc" | "desc") => void;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  emptyMessage?: string;
  rowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
}

// ─── Skeleton Row ─────────────────────────────────────────────────────────

function SkeletonRow({ columns }: { columns: Column<any>[] }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center px-4 py-4 gap-4 sm:gap-0 border-b border-border/50">
      {columns.map((col, i) => (
        <div 
          key={col.key} 
          className={cn(
            "px-2 sm:px-6",
            "w-full sm:w-[var(--col-w,100%)]",
            col.width ? "sm:flex-none" : "sm:flex-1",
            col.className
          )}
          style={col.width ? { '--col-w': col.width } as React.CSSProperties : undefined}
        >
          <div className="h-5 rounded bg-muted animate-pulse" style={{ width: `${60 + (i % 3) * 15}%` }} />
        </div>
      ))}
    </div>
  );
}

// ─── Sort Icon ────────────────────────────────────────────────────────────

function SortIcon({ column, sortBy, sortOrder }: { column: string; sortBy?: string; sortOrder?: string }) {
  if (sortBy !== column) return <ChevronsUpDown className="w-3.5 h-3.5 text-muted-foreground/40" />;
  return sortOrder === "asc"
    ? <ChevronUp className="w-3.5 h-3.5 text-foreground" />
    : <ChevronDown className="w-3.5 h-3.5 text-foreground" />;
}

// ─── DataTable ────────────────────────────────────────────────────────────

export function DataTable<T>({
  columns,
  data,
  pagination,
  isLoading,
  onPageChange,
  onSortChange,
  sortBy,
  sortOrder,
  emptyMessage = "No results found.",
  rowKey,
  onRowClick,
}: DataTableProps<T>) {

  function handleSort(key: string) {
    if (!onSortChange) return;
    if (sortBy === key) {
      onSortChange(key, sortOrder === "asc" ? "desc" : "asc");
    } else {
      onSortChange(key, "asc");
    }
  }

  return (
    <div className="flex flex-col gap-0 w-full animate-in fade-in duration-500">
      {/* List Container */}
      <div className="border border-border rounded-xl bg-card overflow-hidden flex flex-col shadow-sm">
        
        {/* Header Row (Desktop Only) */}
        <div className="hidden sm:flex items-center bg-muted/30 border-b border-border">
          {columns.map((col) => (
            <div
              key={col.key}
              className={cn(
                "px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider",
                col.sortable && "cursor-pointer select-none hover:text-foreground hover:bg-muted/50 transition-colors",
                "w-full sm:w-[var(--col-w,100%)]",
                col.width ? "sm:flex-none" : "sm:flex-1",
                col.className
              )}
              style={col.width ? { '--col-w': col.width } as React.CSSProperties : undefined}
              onClick={col.sortable ? () => handleSort(col.key) : undefined}
            >
              <div className="flex items-center gap-1.5">
                {col.header}
                {col.sortable && (
                  <SortIcon column={col.key} sortBy={sortBy} sortOrder={sortOrder} />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Data Rows */}
        <div className="flex flex-col divide-y divide-border/70">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <SkeletonRow key={i} columns={columns} />
            ))
          ) : !Array.isArray(data) || data.length === 0 ? (
            <div className="px-6 py-20 text-center text-muted-foreground text-sm flex flex-col items-center justify-center gap-2">
              <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mb-3">
                <span className="text-2xl opacity-50">!</span>
              </div>
              {!Array.isArray(data) ? "Failed to load data due to an invalid format." : emptyMessage}
            </div>
          ) : (
            data.map((row) => (
              <div
                key={rowKey(row)}
                className={cn(
                  "flex flex-col sm:flex-row sm:items-center px-4 sm:px-0 py-3 sm:py-0 transition-colors hover:bg-muted/30 group",
                  onRowClick && "cursor-pointer"
                )}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
                {columns.map((col) => (
                  <div 
                    key={col.key} 
                    className={cn(
                      "px-2 sm:px-6 py-1.5 sm:py-4 flex flex-col justify-center", 
                      "w-full sm:w-[var(--col-w,100%)]",
                      col.width ? "sm:flex-none" : "sm:flex-1",
                      col.className
                    )}
                    style={col.width ? { '--col-w': col.width } as React.CSSProperties : undefined}
                  >
                    {/* Mobile Label Header */}
                    {col.header && (
                      <div className="sm:hidden text-[10px] uppercase font-semibold text-muted-foreground mb-1 tracking-wider">
                        {col.header}
                      </div>
                    )}
                    {/* Cell Content */}
                    <div className="min-w-0 w-full">
                      {col.cell(row)}
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-5 border-t border-border mt-2">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium text-foreground">{Math.min((pagination.page - 1) * pagination.pageSize + 1, pagination.total)}</span> to <span className="font-medium text-foreground">{Math.min(pagination.page * pagination.pageSize, pagination.total)}</span> of <span className="font-medium text-foreground">{pagination.total}</span> entries
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 shadow-sm px-3"
              disabled={!pagination.hasPrev}
              onClick={() => onPageChange?.(pagination.page - 1)}
            >
              <ChevronLeft className="w-4 h-4 mr-1.5" /> Previous
            </Button>

            <div className="text-sm font-medium text-foreground px-3">
              Page {pagination.page} of {pagination.totalPages}
            </div>

            <Button
              variant="outline"
              size="sm"
              className="h-8 shadow-sm px-3"
              disabled={!pagination.hasNext}
              onClick={() => onPageChange?.(pagination.page + 1)}
            >
              Next <ChevronRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
