"use client";

import Link from "next/link";
import { useActionState } from "react";

import { SubmitButton } from "@/app/(auth)/_components/submit-button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { initialAuthActionState } from "@/lib/auth/types";
import { forgotPasswordAction } from "@/lib/auth/actions";

export function ForgotPasswordForm() {
  const [state, formAction] = useActionState(forgotPasswordAction, initialAuthActionState);

  return (
    <Card className="w-full rounded-lg">
      <CardHeader>
        <CardTitle>Reset password</CardTitle>
        <CardDescription>Send a reset link to your email.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          {state.message ? (
            <Alert variant={state.status === "error" ? "destructive" : "default"}>
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          ) : null}
          <label className="grid gap-2 text-sm font-medium">
            Email
            <Input autoComplete="email" name="email" placeholder="you@example.com" type="email" />
          </label>
          <p className="text-sm text-muted-foreground">
            Remembered it?{" "}
            <Link className="text-primary transition hover:text-primary/80" href="/sign-in">
              Sign in
            </Link>
          </p>
          <SubmitButton>Send reset link</SubmitButton>
        </form>
      </CardContent>
    </Card>
  );
}
