// src/routes/signup.tsx

import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { FirebaseError } from "firebase/app";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { Film, Lock, Mail, User } from "lucide-react";

import { auth, db } from "@/lib/firebase";

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

export default function SignupRoute() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setErrorMessage("");
    setIsLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      const user = userCredential.user;

      await updateProfile(user, {
        displayName: name,
      });

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        fullName: name,
        email: user.email || email,
        photoURL: user.photoURL || "",
        createdAt: serverTimestamp(),
      });

      toast.success("Account created successfully!");
      setTimeout(() => {
        navigate("/auth/login");
      }, 1000);
    } catch (error) {
      if (error instanceof FirebaseError) {
        if (error.code === "auth/email-already-in-use") {
          setErrorMessage("This email is already registered.");
        } else if (error.code === "auth/invalid-email") {
          setErrorMessage("Please enter a valid email address.");
        } else if (error.code === "auth/weak-password") {
          setErrorMessage("Password must be at least 6 characters.");
        } else if (error.code === "auth/operation-not-allowed") {
          setErrorMessage("Email/password signup is not enabled in Firebase.");
        } else if (error.code === "permission-denied") {
          setErrorMessage("Firestore permission denied. Check your rules.");
        } else {
          setErrorMessage("Failed to create account. Please try again.");
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
      <div className="relative hidden min-h-140 overflow-hidden bg-muted md:block">
        <img
          src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1025&auto=format&fit=crop"
          alt="Cinema background"
          className="absolute inset-0 h-full w-full object-cover opacity-70"
        />

        <div className="absolute inset-0 bg-linear-to-t from-background via-background/30 to-background/40" />

        <div className="absolute bottom-8 left-8 right-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Get Started
          </p>

          <h2 className="mt-2 text-2xl font-bold text-foreground">
            Unlock the Vault.
          </h2>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Create an account to explore world-class titles, track trends and instantly build your personal watch queue.
          </p>
        </div>
      </div>

      <CardContent className="flex min-h-140 flex-col justify-center p-8 md:p-10">
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
            Create Account
          </CardTitle>

          <CardDescription>
            Join us to start curating your favorite movies.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {errorMessage && (
            <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {errorMessage}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>

            <div className="relative">
              <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                id="name"
                type="text"
                required
                disabled={isLoading}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Smith"
                className="pl-10"
              />
            </div>
          </div>

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

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>

            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                id="password"
                type="password"
                required
                disabled={isLoading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pl-10"
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating Account..." : "Create Account"}
          </Button>
        </form>

        <div className="mt-6 border-t border-border pt-5 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Button asChild variant="link" className="h-auto p-0">
            <Link to="/auth/login">Sign in</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}