// src/routes/edit-profile.tsx

import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { FirebaseError } from "firebase/app";
import { updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { ArrowLeft, Image, Save, User } from "lucide-react";

import { auth, db } from "@/lib/firebase";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function EditProfileRoute() {
  const navigate = useNavigate();
  const user = auth.currentUser;

  const [fullName, setFullName] = useState(user?.displayName || "");
  const [photoURL, setPhotoURL] = useState(user?.photoURL || "");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!user) {
      setErrorMessage("No logged-in user found.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      await updateProfile(user, {
        displayName: fullName,
        photoURL: photoURL,
      });

      await updateDoc(doc(db, "users", user.uid), {
        fullName,
        photoURL,
      });

      await user.reload();

      navigate("/profile");
    } catch (error) {
      if (error instanceof FirebaseError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Failed to update profile.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Card className="border-border bg-card text-card-foreground shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Edit Profile
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {errorMessage && (
              <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {errorMessage}
              </div>
            )}

            <div className="flex justify-center">
              <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border border-border bg-primary text-3xl font-bold text-primary-foreground">
                {photoURL ? (
                  <img
                    src={photoURL}
                    alt="Profile preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  fullName.charAt(0).toUpperCase() || "U"
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>

              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  id="fullName"
                  type="text"
                  required
                  disabled={isLoading}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="photoURL">Profile Picture URL</Label>

              <div className="relative">
                <Image className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  id="photoURL"
                  type="url"
                  disabled={isLoading}
                  value={photoURL}
                  onChange={(e) => setPhotoURL(e.target.value)}
                  placeholder="https://example.com/profile.jpg"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={isLoading} className="gap-2">
                <Save className="h-4 w-4" />
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="gap-2"
                disabled={isLoading}
                onClick={() => navigate("/profile")}
              >
                <ArrowLeft className="h-4 w-4" />
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}