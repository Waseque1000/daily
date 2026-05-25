import { AuthApiError } from "@supabase/supabase-js";

export function getAuthErrorMessage(error: unknown): string {
  if (error instanceof AuthApiError) {
    switch (error.code) {
      case "invalid_credentials":
        return "Email or password is incorrect. If you just signed up, confirm your email first, then try again.";
      case "email_not_confirmed":
        return "Please confirm your email before signing in. Check your inbox for the confirmation link.";
      case "user_not_found":
        return "No account found with this email. Create an account first.";
      case "email_exists":
        return "An account with this email already exists. Try signing in instead.";
      case "weak_password":
        return "Password is too weak. Use at least 6 characters.";
      case "signup_disabled":
        return "Sign ups are disabled for this project. Contact the administrator.";
      case "email_address_invalid":
        return "That email address is not allowed. Try a different email.";
      case "over_request_rate_limit":
        return "Too many attempts. Please wait a moment and try again.";
      default:
        return error.message;
    }
  }

  if (error instanceof Error) return error.message;
  return "Authentication failed. Please try again.";
}
