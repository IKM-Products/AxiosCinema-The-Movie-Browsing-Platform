// src/routes/categories.tsx

import { useEffect, useState } from "react";
import { Film, Loader2, Star } from "lucide-react";

import { MovieCard } from "@/components/MovieCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { tmdbClient, type Movie } from "@/lib/api";
import { useFavorites } from "./layout";

interface Genre {
  id: number;
  name: string;
}

export default function CategoriesRoute() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const { favorites, toggleFavorite } = useFavorites();

  useEffect(() => {
    async function fetchGenres() {
      try {
        const { data } = await tmdbClient.get<{ genres: Genre[] }>(
          "/genre/movie/list",
        );

        setGenres(data.genres);
      } catch (error) {
        console.error("Failed to fetch genres:", error);
        setGenres([]);
      }
    }

    fetchGenres();
  }, []);

  useEffect(() => {
    async function fetchMoviesByGenre() {
      if (!selectedGenre) return;

      try {
        setLoading(true);

        const { data } = await tmdbClient.get<{ results: Movie[] }>(
          "/discover/movie",
          {
            params: {
              with_genres: selectedGenre,
              sort_by: "popularity.desc",
            },
          },
        );

        setMovies(data.results);
      } catch (error) {
        console.error("Failed to fetch movies by genre:", error);
        setMovies([]);
      } finally {
        setLoading(false);
      }
    }

    fetchMoviesByGenre();
  }, [selectedGenre]);

  return (
    <section className="space-y-8">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-foreground">
          <Film className="h-6 w-6 text-primary" />
          Movie Categories
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Browse movies by genre.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        {genres.map((genre) => (
          <Button
            key={genre.id}
            type="button"
            variant={selectedGenre === genre.id ? "default" : "outline"}
            onClick={() => setSelectedGenre(genre.id)}
          >
            {genre.name}
          </Button>
        ))}
      </div>

      {!selectedGenre && (
        <Card className="border-dashed bg-card/50">
          <CardContent className="flex flex-col items-center justify-center px-6 py-20 text-center">
            <Star className="mb-4 h-12 w-12 text-muted-foreground/50" />

            <h2 className="text-lg font-semibold text-foreground">
              Select a category
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Choose any genre above to view related movies.
            </p>
          </CardContent>
        </Card>
      )}

      {loading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading movies...
        </div>
      )}

      {!loading && selectedGenre && movies.length === 0 && (
        <Card className="border-dashed bg-card/50">
          <CardContent className="flex flex-col items-center justify-center px-6 py-20 text-center">
            <Film className="mb-4 h-12 w-12 text-muted-foreground/50" />

            <h2 className="text-lg font-semibold text-foreground">
              No movies found
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Try selecting another category.
            </p>
          </CardContent>
        </Card>
      )}

      {!loading && movies.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {movies.map((movie) => (
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