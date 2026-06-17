// src/routes/profile.tsx

import { Link } from "react-router";
import { BadgeCheck, Calendar, Heart, Mail, Shield, User } from "lucide-react";

import { auth } from "@/lib/firebase";
import { useFavorites } from "./layout";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function ProfileRoute() {
  const user = auth.currentUser;
  const { favorites } = useFavorites();

  const initial =
    user?.displayName?.charAt(0).toUpperCase() ||
    user?.email?.charAt(0).toUpperCase() ||
    "U";

  const memberSince = user?.metadata.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      })
    : "Unknown";

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <Card className="border-border bg-card text-card-foreground shadow-xl">
        <CardContent className="p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <div className="flex h-36 w-36 items-center justify-center overflow-hidden rounded-full border-4 border-border bg-primary text-5xl font-bold text-primary-foreground shadow-2xl">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || "Profile"}
                  className="h-full w-full object-cover"
                />
              ) : (
                initial
              )}
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-3xl font-bold">
                  {user?.displayName || "Movie Lover"}
                </h1>

                {user?.emailVerified && (
                  <Badge className="gap-1">
                    <BadgeCheck className="h-3 w-3" />
                    Verified
                  </Badge>
                )}
              </div>

              <p className="mt-2 text-muted-foreground">
                {user?.email || "No email available"}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <Badge>AxiosCinema User</Badge>
              </div>
            </div>

            <Button asChild>
              <Link to="/profile/edit">Edit Profile</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border bg-card">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-xl bg-primary/10 p-3">
              <Heart className="h-8 w-8 text-primary" />
            </div>

            <div>
              <p className="text-sm text-muted-foreground">My Queue</p>

              <h3 className="text-3xl font-bold">{favorites.length}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-xl bg-primary/10 p-3">
              <Calendar className="h-8 w-8 text-primary" />
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Member Since</p>

              <h3 className="text-lg font-bold">{memberSince}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-xl bg-primary/10 p-3">
              <Shield className="h-8 w-8 text-primary" />
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Account Status</p>

              <h3 className="font-bold text-green-500">Active</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-border p-4">
            <div className="mb-2 flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">Full Name</span>
            </div>

            <p className="font-medium">{user?.displayName || "Not set"}</p>
          </div>

          <div className="rounded-xl border border-border p-4">
            <div className="mb-2 flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">
                Email Address
              </span>
            </div>

            <p className="font-medium">{user?.email || "Not available"}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}