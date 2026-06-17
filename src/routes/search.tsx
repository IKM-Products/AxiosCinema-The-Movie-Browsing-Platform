// src/routes/search.tsx

import { useLoaderData, type LoaderFunctionArgs } from "react-router";
import { SearchCode } from "lucide-react";

import { MovieCard } from "@/components/MovieCard";
import { Card, CardContent } from "@/components/ui/card";

import { movieService, type Movie } from "@/lib/api";
import { useFavorites } from "./layout";

export async function searchLoader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const searchTerm = url.searchParams.get("q") || "";

  const results = searchTerm
    ? await movieService.searchMovies(searchTerm)
    : [];

  return { results, searchTerm };
}

export default function SearchRoute() {
  const { results, searchTerm } = useLoaderData<typeof searchLoader>();
  const { favorites, toggleFavorite } = useFavorites();

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Search Results for{" "}
          <span className="text-primary">
            &quot;{searchTerm || "Nothing"}&quot;
          </span>
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Results come directly from a live movie library.
        </p>
      </div>

      {results.length === 0 ? (
        <Card className="border-dashed bg-card/50">
          <CardContent className="flex flex-col items-center justify-center px-6 py-20 text-center">
            <SearchCode className="mb-4 h-12 w-12 text-muted-foreground/50" />

            <h2 className="text-lg font-semibold text-foreground">
              No movies found
            </h2>

            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Try searching with another movie title.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {results.map((movie: Movie) => (
            <MovieCard
              key={movie.id}
              id={movie.id}
              title={movie.title}
              posterPath={movie.poster_path}
              releaseDate={movie.release_date}
              rating={movie.vote_average}
              isFavorite={favorites.some((fav) => fav.id === movie.id)}
              onToggleFavorite={() => toggleFavorite(movie)}
            />
          ))}
        </div>
      )}
    </section>
  );
}