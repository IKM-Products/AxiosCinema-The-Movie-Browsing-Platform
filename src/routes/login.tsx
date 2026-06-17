// src/routes/login.tsx

import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { Eye, EyeOff, Film } from "lucide-react";

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

import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "sonner";
import { auth } from "@/lib/firebase";

export default function LoginRoute() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      toast.success("Welcome back!");

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err) {
      if (err instanceof FirebaseError) {
        switch (err.code) {
          case "auth/user-not-found":
            setError("No account found with this email.");
            break;

          case "auth/wrong-password":
            setError("Incorrect password.");
            break;

          case "auth/invalid-email":
            setError("Invalid email address.");
            break;

          case "auth/invalid-credential":
            setError("Invalid email or password.");
            break;

          default:
            setError(err.message);
        }
      } else {
        setError("Failed to sign in.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="grid w-full max-w-4xl overflow-hidden border-border bg-card text-card-foreground shadow-2xl md:grid-cols-2">
      <div className="relative hidden min-h-162.5 overflow-hidden bg-muted md:block">
        <img
          src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1025&auto=format&fit=crop"
          alt="Cinema background"
          className="absolute inset-0 h-full w-full object-cover opacity-70"
        />

        <div className="absolute inset-0 bg-linear-to-t from-background via-background/30 to-background/40" />

        <div className="absolute bottom-8 left-8 right-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Now Playing
          </p>

          <h2 className="mt-2 text-2xl font-bold text-foreground">
            Explore Global Cinema.
          </h2>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Sign in to explore daily trending titles, blockbusters and save favorites to your queue.
          </p>
        </div>
      </div>

      <CardContent className="flex min-h-162.5 flex-col justify-center p-8 md:p-10">
        <div className="mb-6 flex items-center gap-3 md:hidden">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Film className="h-5 w-5" />
          </div>

          <span className="text-xl font-extrabold tracking-tight">
            Axios<span className="text-primary">Cinema</span>
          </span>
        </div>

        <CardHeader className="px-0 pb-6 pt-0">
          <CardTitle className="text-2xl font-bold">
            Welcome Back
          </CardTitle>

          <CardDescription>
            Sign in to your account
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>

            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>

              <Button
                asChild
                variant="link"
                className="h-auto p-0 text-xs"
              >
                <Link to="/auth/forgot-password">
                  Forgot password?
                </Link>
              </Button>
            </div>

            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pr-10"
              />

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {error && (
            <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </Button>
        </form>

        <div className="mt-6 border-t border-border pt-5 text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Button
            asChild
            variant="link"
            className="h-auto p-0"
          >
            <Link to="/auth/signup">
              Create Account
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}