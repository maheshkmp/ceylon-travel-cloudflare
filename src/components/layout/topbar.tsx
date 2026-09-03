"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import type { Route } from "next";
import { ChevronRight, LogOut, User as UserIcon, Menu } from "lucide-react";
import { cn, initials } from "@/lib/utils";
import { useUser } from "@/hooks/use-users";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useUIStore } from "@/store/auth.store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function UserBreadcrumbLabel({ id, fallback }: { id: string; fallback: string }) {
  const { data: user } = useUser(id);
  return <>{user ? (user.name || user.email) : fallback}</>;
}

function useBreadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return segments.map((seg, i) => {
    const isUserCrumb = i > 0 && segments[i - 1] === "users";
    return {
      label: isUserCrumb ? (
        <UserBreadcrumbLabel id={seg} fallback={seg} />
      ) : (
        seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, " ")
      ),
      href: "/" + segments.slice(0, i + 1).join("/"),
      isLast: i === segments.length - 1,
    };
  });
}

export function Topbar() {
  const crumbs = useBreadcrumbs();
  const { user, logout } = useAuth();
  const { mobileSidebarOpen, setMobileSidebarOpen } = useUIStore();
  const router = useRouter();

  return (
    <header className="h-14 shrink-0 flex items-center border-b border-border bg-background px-4 lg:px-6 gap-2">
      <button
        onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        className="lg:hidden p-1.5 rounded-md hover:bg-muted text-muted-foreground mr-1"
        aria-label="Toggle Menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {crumbs.map((crumb, i) => (
        <span key={crumb.href} className="flex items-center gap-2">
          {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0" />}
          {crumb.isLast ? (
            <span className="text-sm font-medium text-foreground">{crumb.label}</span>
          ) : (
            <Link
              href={crumb.href as Route}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {crumb.label}
            </Link>
          )}
        </span>
      ))}

      <div className="ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="outline-none rounded-full hover:opacity-80 transition-opacity">
              <Avatar className="h-7 w-7">
                <AvatarFallback>{user ? initials(user.name) : "?"}</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={6} className="bg-popover border border-border w-48">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium text-foreground truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => router.push("/settings" as any)}>
              <UserIcon className="w-3.5 h-3.5" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => logout()}>
              <LogOut className="w-3.5 h-3.5" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

