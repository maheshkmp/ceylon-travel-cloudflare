import type { Metadata } from "next";
import Link from "next/link";
import type { Route } from "next";

export const metadata: Metadata = {
  title: "Authentication",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <header className="h-14 border-b border-border flex items-center px-6">
        <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <div 
            className="w-6 h-6 rounded-md flex items-center justify-center"
            style={{ background: "var(--color-brand)" }}
          >
            <span className="text-white text-xs font-bold">T</span>
          </div>
          CeylonTravels
        </Link>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm animate-fade-in">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="h-12 flex items-center justify-center px-6">
        <p className="text-xs text-muted-foreground">
          By continuing, you agree to our{" "}
          <Link href={"/terms" as Route} className="underline underline-offset-2 hover:text-foreground transition-colors">
            Terms
          </Link>{" "}
          and{" "}
          <Link href={"/privacy" as Route} className="underline underline-offset-2 hover:text-foreground transition-colors">
            Privacy Policy
          </Link>
        </p>
      </footer>
    </div>
  );
}
