// src/main.tsx

import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Link,
  isRouteErrorResponse,
  useRouteError,
} from "react-router-dom";

import Layout from "./routes/layout";
import AuthLayout from "./routes/auth-layout";

import DiscoverRoute, { discoverLoader } from "./routes/discover";
import SearchRoute, { searchLoader } from "./routes/search";
import FavoritesRoute from "./routes/favorites";
import CategoriesRoute from "./routes/categories";
import MovieDetailsRoute from "./routes/movie-routes";
import ProfileRoute from "./routes/profile";
import EditProfileRoute from "./routes/edit-profile";

import LoginRoute from "./routes/login";
import SignupRoute from "./routes/signup";
import ForgotPasswordRoute from "./routes/forgot-password";

import ProtectedRoute from "@/components/ProtectedRoute";
import { Toaster } from "@/components/ui/sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import "./index.css";

function ErrorPage() {
  const error = useRouteError();

  let title = "Application Error";
  let message = "Something went wrong while loading this page.";

  if (isRouteErrorResponse(error)) {
    title = `${error.status} ${error.statusText}`;
    message = error.data?.message || "The requested page could not be loaded.";
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
      <Card className="w-full max-w-md border-border bg-card shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-destructive">
            {title}
          </CardTitle>

          <CardDescription>{message}</CardDescription>
        </CardHeader>

        <CardContent className="flex justify-center">
          <Button asChild>
            <Link to="/">Go Back Home</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <DiscoverRoute />,
        loader: discoverLoader,
      },
      {
        path: "search",
        element: <SearchRoute />,
        loader: searchLoader,
      },
      {
        path: "favorites",
        element: <FavoritesRoute />,
      },
      {
        path: "categories",
        element: <CategoriesRoute />,
      },
      {
        path: "movie/:id",
        element: <MovieDetailsRoute />,
      },
      {
        path: "profile",
        element: <ProfileRoute />,
      },
      {
        path: "profile/edit",
        element: <EditProfileRoute />,
      },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "login",
        element: <LoginRoute />,
      },
      {
        path: "signup",
        element: <SignupRoute />,
      },
      {
        path: "forgot-password",
        element: <ForgotPasswordRoute />,
      },
    ],
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
    <Toaster richColors position="top-right" />
  </StrictMode>,
);