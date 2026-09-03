"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Settings,
  ScrollText, LogOut,
  MessageCircle,
  Newspaper,
  Map,
  Route,
  X,
} from "lucide-react";
import { useTheme } from "next-themes";
import { cn, initials } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { useSession } from "@/lib/auth-client";
import { useUIStore } from "@/store/auth.store";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Profile", href: "/settings", icon: Settings },
] as const;

const adminItems = [
  { label: "Inquiries", href: "/admin/inquiries", icon: MessageCircle },
  { label: "Itineraries", href: "/admin/itineraries", icon: Route },
  { label: "Destinations", href: "/admin/destinations", icon: Map },
  { label: "Blog", href: "/admin/posts", icon: Newspaper },
  { label: "Audit Logs", href: "/admin/audit-logs", icon: ScrollText },
  { label: "Site Settings", href: "/admin/site-settings", icon: Settings },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { mobileSidebarOpen, setMobileSidebarOpen } = useUIStore();

  const user = session?.user;
  const role = user?.role as string | undefined;
  const roles = (role || "").split(",").map((r) => r.trim());
  const isAdmin = roles.includes("admin");

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  const handleLinkClick = () => {
    setMobileSidebarOpen(false);
  };

  return (
    <>
      {/* Mobile Sidebar Overlay/Backdrop */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 flex w-56 flex-col h-full border-r border-sidebar-border bg-sidebar transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 lg:shrink-0",
        mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Logo */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-sidebar-border">
          <Link href="/" className="flex items-center gap-2" onClick={handleLinkClick}>
            <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center shrink-0">
              <span className="text-primary-foreground text-xs font-bold">T</span>
            </div>
            <span className="text-sm font-semibold text-sidebar-foreground">Ceylon Travels</span>
          </Link>
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="lg:hidden p-1 rounded-md text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
          <div className="mb-4">
            <p className="px-2 py-1 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              Navigation
            </p>
            {navItems.map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                href={href as any}
                onClick={handleLinkClick}
                className={cn(
                  "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors",
                  isActive(href)
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </Link>
            ))}
          </div>

          {isAdmin && (
            <div>
              <p className="px-2 py-1 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                Admin
              </p>
              {adminItems.map(({ label, href, icon: Icon }) => (
                <Link
                  key={href}
                  href={href as any}
                  onClick={handleLinkClick}
                  className={cn(
                    "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors",
                    isActive(href)
                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
                  )}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {label}
                </Link>
              ))}
            </div>
          )}
        </nav>

        {/* Bottom */}
        <div className="p-2 border-t border-sidebar-border space-y-1">
          <button
            onClick={() => {
              handleLinkClick();
              logout();
            }}
            className="w-full flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-sidebar-foreground/60 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>

          {/* User */}
          <div className="flex items-center gap-2.5 px-2.5 py-2 mt-1">
            <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shrink-0">
              <span className="text-[11px] font-semibold text-primary-foreground">
                {user ? initials(user.name) : "?"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-sidebar-foreground truncate">{user?.name}</p>
              <p className="text-[11px] text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

