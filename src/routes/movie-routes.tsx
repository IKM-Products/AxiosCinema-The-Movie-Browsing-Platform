// src/routes/movie-routes.tsx

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Calendar, Star } from "lucide-react";

import { tmdbClient } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original";

export default function MovieDetailsRoute() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMovie() {
      try {
        const { data } = await tmdbClient.get(`/movie/${id}`);
        setMovie(data);
      } catch (error) {
        console.error("Failed to fetch movie:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchMovie();
  }, [id]);

  function handleCancel() {
    navigate(-1);
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20 text-muted-foreground">
        Loading movie details...
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <p className="text-muted-foreground">Movie not found.</p>

        <Button variant="outline" onClick={handleCancel}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Button variant="outline" onClick={handleCancel} className="gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      <div className="relative h-100 overflow-hidden rounded-xl">
        {movie.backdrop_path ? (
          <img
            src={`${IMAGE_BASE_URL}${movie.backdrop_path}`}
            alt={movie.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
            No backdrop available
          </div>
        )}

        <div className="absolute inset-0 bg-black/60" />

        <div className="absolute bottom-8 left-8 right-8">
          <h1 className="text-4xl font-bold text-white">{movie.title}</h1>

          {movie.tagline && (
            <p className="mt-2 text-white/80">{movie.tagline}</p>
          )}
        </div>
      </div>

      <Card>
        <CardContent className="space-y-6 p-6">
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              {Number(movie.vote_average || 0).toFixed(1)}
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {movie.release_date || "Unknown release date"}
            </div>
          </div>

          <div>
            <h2 className="mb-2 text-xl font-semibold">Overview</h2>

            <p className="text-muted-foreground">
              {movie.overview || "No overview available."}
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-xl font-semibold">Genres</h2>

            <div className="flex flex-wrap gap-2">
              {movie.genres?.length > 0 ? (
                movie.genres.map((genre: any) => (
                  <span
                    key={genre.id}
                    className="rounded-full bg-primary px-3 py-1 text-sm text-primary-foreground"
                  >
                    {genre.name}
                  </span>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No genres available.
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}