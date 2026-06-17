// src/routes/forgot-password.tsx

import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { FirebaseError } from "firebase/app";
import { sendPasswordResetEmail } from "firebase/auth";
import { ArrowLeft, Mail } from "lucide-react";

import { auth } from "@/lib/firebase";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function ForgotPasswordRoute() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset link sent, Please check your inbox.");
      setTimeout(() => {
        navigate("/auth/login");
      }, 1500);
    } catch (error) {
      if (error instanceof FirebaseError) {
        if (error.code === "auth/invalid-email") {
          setErrorMessage("Please enter a valid email address.");
        } else if (error.code === "auth/user-not-found") {
          setErrorMessage("No account found with this email.");
        } else {
          setErrorMessage("Failed to send reset email. Please try again.");
        }
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="grid w-full max-w-4xl overflow-hidden border-border bg-card text-card-foreground shadow-2xl md:grid-cols-2">
      <div className="relative hidden min-h-130 overflow-hidden bg-muted md:block">
        <img
          src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1025&auto=format&fit=crop"
          alt="Cinema background"
          className="absolute inset-0 h-full w-full object-cover opacity-70"
        />

        <div className="absolute inset-0 bg-linear-to-t from-background via-background/30 to-background/40" />

        <div className="absolute bottom-8 left-8 right-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Account Recovery
          </p>

          <h2 className="mt-2 text-2xl font-bold text-foreground">
            Recover Your Entry
          </h2>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Recover your account password and continue exploring trending titles, blockbusters, and your saved queue.
          </p>
        </div>
      </div>

      <CardContent className="flex min-h-130 flex-col justify-center p-8 md:p-10">
        <CardHeader className="px-0 pb-6 pt-0">
          <CardTitle className="text-2xl font-bold">
            Forgot Password?
          </CardTitle>

          <CardDescription>
            Enter your email below and we will send you a recovery link.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {errorMessage && (
            <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="rounded-md border border-primary/40 bg-primary/10 px-3 py-2 text-sm text-primary">
              {successMessage}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>

            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                id="email"
                type="email"
                required
                disabled={isLoading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="pl-10"
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Sending Reset Link..." : "Send Reset Link"}
          </Button>
        </form>

        <div className="mt-6 border-t border-border pt-5 text-center text-sm text-muted-foreground">
          Remember your password?{" "}
          <Button asChild variant="link" className="h-auto p-0">
            <Link to="/auth/login">Sign in</Link>
          </Button>
        </div>

        <Button asChild variant="ghost" className="mt-4 w-full gap-2">
          <Link to="/auth/login">
            <ArrowLeft className="h-4 w-4" />
            Back to Login
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}