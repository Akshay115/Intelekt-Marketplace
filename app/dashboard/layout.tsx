import Link from "next/link";
import { LayoutDashboard, LogOut, Sparkles } from "lucide-react";

import { signOutAction } from "@/lib/auth/actions";
import { getUserDisplayName, requireCurrentUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireCurrentUser();
  const role = user.profile?.marketplace_role ?? "client";

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link className="flex items-center gap-3" href="/dashboard">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Sparkles className="size-4" aria-hidden="true" />
            </span>
            <span className="font-semibold">Intelekt Marketplace</span>
          </Link>
          <div className="flex items-center gap-3">
            <Badge variant="outline">{role.replace("_", " ")}</Badge>
            <form action={signOutAction}>
              <Button size="sm" type="submit" variant="outline">
                <LogOut className="size-4" aria-hidden="true" />
                Sign out
              </Button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[220px_1fr] lg:px-8">
        <aside className="hidden border-r pr-6 lg:block">
          <nav className="grid gap-1 text-sm">
            <Link
              className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-2 font-medium"
              href="/dashboard"
            >
              <LayoutDashboard className="size-4" aria-hidden="true" />
              Dashboard
            </Link>
          </nav>
          <div className="mt-6 text-sm text-muted-foreground">
            Signed in as <span className="text-foreground">{getUserDisplayName(user)}</span>
          </div>
        </aside>
        <section>{children}</section>
      </div>
    </main>
  );
}
