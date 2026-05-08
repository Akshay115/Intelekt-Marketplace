"use client";

import Link from "next/link";
import { useActionState } from "react";

import { SubmitButton } from "@/app/(auth)/_components/submit-button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { initialAuthActionState } from "@/lib/auth/types";
import { signUpAction } from "@/lib/auth/actions";

export function SignUpForm() {
  const [state, formAction] = useActionState(signUpAction, initialAuthActionState);

  return (
    <Card className="w-full rounded-lg">
      <CardHeader>
        <CardTitle>Create account</CardTitle>
        <CardDescription>Start onboarding into the marketplace.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          {state.message ? (
            <Alert variant={state.status === "error" ? "destructive" : "default"}>
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          ) : null}
          <label className="grid gap-2 text-sm font-medium">
            Name
            <Input autoComplete="name" name="name" placeholder="Ada Lovelace" />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Email
            <Input autoComplete="email" name="email" placeholder="you@example.com" type="email" />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Password
            <Input autoComplete="new-password" name="password" type="password" />
          </label>
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link className="text-primary transition hover:text-primary/80" href="/sign-in">
              Sign in
            </Link>
          </p>
          <SubmitButton>Create account</SubmitButton>
        </form>
      </CardContent>
    </Card>
  );
}
