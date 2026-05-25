"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";
import { Logo } from "@/components/layout/Logo";
import { useToast } from "@/components/common/Toast";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Logo className="justify-center" />
        </div>
        <div className="bg-card rounded-3xl shadow-lg border border-border p-8">
          <h1 className="text-2xl font-bold text-text-heading text-center">Reset password</h1>
          <p className="text-center text-text-muted text-sm mt-2">
            Enter your email and we&apos;ll send a reset link.
          </p>
          <form
            className="mt-8 space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const email = (form.elements.namedItem("email") as HTMLInputElement).value;
              setLoading(true);
              try {
                const { error } = await supabase.auth.resetPasswordForEmail(email, {
                  redirectTo: `${window.location.origin}/login`,
                });
                if (error) throw error;
                toast.add("Reset link sent to your email", "success");
              } catch (err) {
                toast.add(err instanceof Error ? err.message : "Failed to send reset email", "error");
              } finally {
                setLoading(false);
              }
            }}
          >
            <Input label="Email" id="email" name="email" type="email" placeholder="you@example.com" />
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? "Sending..." : "Send reset link"}
            </Button>
          </form>
          <p className="text-center text-sm text-text-muted mt-6">
            <Link href="/login" className="text-primary hover:underline">
              Back to sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
