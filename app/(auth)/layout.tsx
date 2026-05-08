import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <Link className="flex w-fit items-center gap-3" href="/">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="size-4" aria-hidden="true" />
          </span>
          <span className="font-semibold">Intelekt Marketplace</span>
        </Link>
        <div className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-[minmax(0,0.9fr)_420px]">
          <section className="hidden max-w-2xl lg:block">
            <p className="text-sm font-medium text-primary">AI-native marketplace</p>
            <h1 className="mt-4 text-5xl font-semibold leading-none tracking-normal">
              Get matched with the right AI builders, products, and services.
            </h1>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">
              Create a workspace, choose your role, and start from the marketplace
              surface that fits your goal.
            </p>
          </section>
          {children}
        </div>
      </div>
    </main>
  );
}
