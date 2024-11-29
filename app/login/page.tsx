"use client";

import { Button } from "@/components/ui/button";
import { signIn, signOut, useSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { GuestRegistrationForm } from "@/app/components/guest-registration-form";
import { SignInForm } from "@/app/components/sign-in-form";

interface ExtendedSession {
  error?: string;
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const error = searchParams.get("error");

  useEffect(() => {
    const extendedSession = session as ExtendedSession;
    if (extendedSession?.error) {
      signOut({ redirect: false }).then(() => {
        router.push('/login?error=User+not+found');
      });
    }
  }, [session, router]);

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      const result = await signIn("google", {
        callbackUrl: "/student",
        redirect: true,
      });
      
      if (result?.error) {
        console.error("Login error:", result.error);
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Welcome to Pottery Studio
        </h1>
        <p className="text-sm text-muted-foreground">
          {showEmailForm
            ? isRegistering
              ? "Create an account to continue"
              : "Sign in to your account"
            : "Sign in to manage your pottery pieces"}
        </p>
        {(error === "User not found" || error === "Verification failed") && (
          <p className="text-sm text-red-500">
            {error === "User not found"
              ? "Your account was not found. Please sign in again or create a new account."
              : "There was a problem verifying your account. Please try signing in again."}
          </p>
        )}
      </div>

      {showEmailForm ? (
        <div className="space-y-4">
          {isRegistering ? (
            <>
              <GuestRegistrationForm />
              <Button
                variant="ghost"
                onClick={() => setIsRegistering(false)}
                className="w-full"
              >
                Already have an account? Sign in
              </Button>
            </>
          ) : (
            <>
              <SignInForm />
              <Button
                variant="ghost"
                onClick={() => setIsRegistering(true)}
                className="w-full"
              >
                Don't have an account? Sign up
              </Button>
            </>
          )}
          <Button
            variant="ghost"
            onClick={() => setShowEmailForm(false)}
            className="w-full"
          >
            Back to Sign In Options
          </Button>
        </div>
      ) : (
        <div className="flex flex-col space-y-4">
          <Button
            variant="outline"
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Signing in..." : "Continue with Google"}
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">or</span>
            </div>
          </div>
          <Button
            variant="secondary"
            onClick={() => setShowEmailForm(true)}
            className="w-full"
          >
            Continue with Email
          </Button>
        </div>
      )}
    </div>
  );
} 