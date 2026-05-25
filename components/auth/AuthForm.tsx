"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";
import { Logo } from "@/components/layout/Logo";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";
import { useToast } from "@/components/common/Toast";
import { createClient } from "@/lib/supabase/client";
import { getAuthErrorMessage } from "@/lib/supabase/auth-errors";

const schema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface AuthFormProps {
  mode: "login" | "signup";
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    if (searchParams.get("error") === "oauth") {
      toast.add("Google sign-in failed. Please try again.", "error");
    }
  }, [searchParams, toast]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      if (mode === "signup") {
        const { data: authData, error } = await supabase.auth.signUp({
          email: data.email.trim(),
          password: data.password,
          options: {
            data: { full_name: data.name ?? "" },
          },
        });
        if (error) throw error;

        if (authData.session) {
          toast.add("Account created! Welcome to FlowDay.", "success");
          router.push("/dashboard");
          router.refresh();
          return;
        }

        toast.add(
          "Account created! Check your email for a confirmation link, then sign in.",
          "success"
        );
        router.push("/login");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: data.email.trim(),
          password: data.password,
        });
        if (error) throw error;
        toast.add("Welcome back!", "success");
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      toast.add(getAuthErrorMessage(err), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Logo className="justify-center" />
        </div>
        <div className="bg-card rounded-3xl shadow-lg border border-border p-8">
          <h1 className="text-2xl font-bold text-text-heading text-center">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="text-center text-text-muted text-sm mt-2">
            {mode === "login"
              ? "Sign in with Google or your email and password."
              : "Sign up with Google or create an account with email."}
          </p>

          <div className="mt-8 space-y-4">
            <GoogleAuthButton />

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-card text-text-muted">or continue with email</span>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {mode === "signup" && (
                <Input
                  label="Full name"
                  id="name"
                  placeholder="Jane Doe"
                  error={errors.name?.message}
                  {...register("name")}
                />
              )}
              <Input
                label="Email"
                id="email"
                type="email"
                placeholder="you@example.com"
                error={errors.email?.message}
                autoComplete="email"
                {...register("email")}
              />
              <Input
                label="Password"
                id="password"
                type="password"
                placeholder="••••••••"
                error={errors.password?.message}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                {...register("password")}
              />
              {mode === "login" && (
                <div className="text-right">
                  <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
              )}
              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? "Please wait..." : mode === "login" ? "Sign in" : "Create account"}
              </Button>
            </form>
          </div>

          <p className="text-center text-sm text-text-muted mt-6">
            {mode === "login" ? (
              <>
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="text-primary font-medium hover:underline">
                  Sign up
                </Link>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <Link href="/login" className="text-primary font-medium hover:underline">
                  Sign in
                </Link>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
