"use client";

import Link from "next/link";
import { useActionState } from "react";

import { signInAction } from "@/lib/auth/actions";
import { initialAuthActionState } from "@/lib/auth/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/app/(auth)/_components/submit-button";

export function SignInForm({ nextPath }: { nextPath: string }) {
  const [state, formAction] = useActionState(signInAction, initialAuthActionState);

  return (
    <Card className="w-full rounded-lg">
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>Access your Intelekt workspace.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <input name="next" type="hidden" value={nextPath} />
          {state.message ? (
            <Alert variant={state.status === "error" ? "destructive" : "default"}>
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          ) : null}
          <label className="grid gap-2 text-sm font-medium">
            Email
            <Input autoComplete="email" name="email" placeholder="you@example.com" type="email" />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Password
            <Input autoComplete="current-password" name="password" type="password" />
          </label>
          <div className="flex items-center justify-between text-sm">
            <Link className="text-muted-foreground transition hover:text-foreground" href="/sign-up">
              Create account
            </Link>
            <Link className="text-primary transition hover:text-primary/80" href="/forgot-password">
              Forgot password?
            </Link>
          </div>
          <SubmitButton>Sign in</SubmitButton>
        </form>
      </CardContent>
    </Card>
  );
}
