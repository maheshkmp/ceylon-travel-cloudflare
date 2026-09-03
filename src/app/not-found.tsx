import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="text-center space-y-6 max-w-md">
        {/* Big 404 */}
        <div className="space-y-2">
          <p className="text-8xl font-bold text-muted-foreground/20 select-none tracking-tight">
            404
          </p>
          <h1 className="text-xl font-semibold text-foreground">Page not found</h1>
          <p className="text-sm text-muted-foreground">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center gap-3">
          <Link href="/dashboard" className={buttonVariants()}>Go to Dashboard</Link>
          <Link href="/" className={buttonVariants({ variant: "outline" })}>Home</Link>
        </div>
      </div>
    </div>
  );
}
