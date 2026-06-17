// src/root.tsx

import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import { Card, CardContent } from "@/components/ui/card";

import "./index.css";

export function HydrateFallback() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
      <Card className="w-full max-w-sm border-border bg-card shadow-xl">
        <CardContent className="flex flex-col items-center gap-4 p-8">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />

          <div className="text-center">
            <h2 className="text-lg font-semibold text-foreground">
              AxiosCinema
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Initializing movie experience...
            </p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

export default function Root() {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />

        <title>AxiosCinema</title>

        <Meta />
        <Links />
      </head>

      <body className="min-h-screen bg-background font-sans text-foreground antialiased selection:bg-primary selection:text-primary-foreground">
        <Outlet />

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}