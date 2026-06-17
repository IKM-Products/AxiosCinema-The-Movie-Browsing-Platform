// src/routes/auth-layout.tsx

import { Outlet } from "react-router";

import { Card, CardContent } from "@/components/ui/card";

export default function AuthLayout() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-8 text-foreground antialiased">
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />

      <Card className="relative z-10 w-full max-w-4xl border-border bg-card/95 text-card-foreground shadow-2xl backdrop-blur">
        <CardContent className="p-0">
          <Outlet />
        </CardContent>
      </Card>
    </main>
  );
}