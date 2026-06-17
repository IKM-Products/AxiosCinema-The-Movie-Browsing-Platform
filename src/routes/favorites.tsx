// src/routes/favorites.tsx

import { HeartCrack } from "lucide-react";

import { MovieCard } from "@/components/MovieCard";
import { Card, CardContent } from "@/components/ui/card";

import { useFavorites } from "./layout";

export default function FavoritesRoute() {
  const { favorites, toggleFavorite } = useFavorites();

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Your Favorite Movies
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Movies you saved will appear here.
        </p>
      </div>

      {favorites.length === 0 ? (
        <Card className="border-dashed bg-card/50">
          <CardContent className="flex flex-col items-center justify-center px-6 py-20 text-center">
            <HeartCrack className="mb-4 h-12 w-12 text-muted-foreground/50" />

            <h2 className="text-lg font-semibold text-foreground">
              No favorites yet
            </h2>

            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Start exploring movies and click the heart button to add them to
              your favorites.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {favorites.map((movie) => (
            <MovieCard
              key={movie.id}
              id={movie.id}
              title={movie.title}
              posterPath={movie.poster_path}
              releaseDate={movie.release_date}
              rating={movie.vote_average}
              isFavorite={true}
              onToggleFavorite={() => {
                toggleFavorite(movie);
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}