// src/routes/discover.tsx

import type { JSX } from "react";
import { useLoaderData } from "react-router";
import { ChevronRight, Heart, Info, Play, Star, TrendingUp } from "lucide-react";

import { movieService, type Movie } from "@/lib/api";
import { useFavorites } from "./layout";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type BadgeProps = JSX.IntrinsicElements["span"] & {
  variant?: "secondary" | "outline";
};

function Badge({ className = "", variant, ...props }: BadgeProps) {
  const variantClass =
    variant === "outline"
      ? "border border-border bg-transparent text-muted-foreground"
      : variant === "secondary"
      ? "bg-secondary text-secondary-foreground"
      : "";

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold ${variantClass} ${className}`}
      {...props}
    />
  );
}

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

export async function discoverLoader() {
  const [trending, popular] = await Promise.all([
    movieService.getTrending(),
    movieService.getPopular(1),
  ]);

  return { trending, popular };
}

function MovieCard({
  movie,
  onSelect,
  isFav,
  onToggleFav,
}: {
  movie: Movie;
  onSelect: () => void;
  isFav: boolean;
  onToggleFav: () => void;
}) {
  return (
    <Card className="group overflow-hidden border-border bg-card text-card-foreground transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div
        onClick={onSelect}
        className="relative aspect-2/3 cursor-pointer overflow-hidden bg-muted"
      >
        {movie.poster_path ? (
          <img
            src={`${IMAGE_BASE_URL}/w500${movie.poster_path}`}
            alt={movie.title}
            className="h-full w-full object-cover brightness-90 transition-all duration-300 group-hover:scale-105 group-hover:brightness-100"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center p-4 text-center text-sm font-semibold text-muted-foreground">
            {movie.title}
          </div>
        )}

        <Badge className="absolute left-2 top-2 gap-1 bg-black/70 text-yellow-400 backdrop-blur hover:bg-black/70">
          <Star className="h-3 w-3 fill-current" />
          {movie.vote_average?.toFixed(1)}
        </Badge>

        <Button
          type="button"
          size="icon"
          variant="secondary"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFav();
          }}
          className="absolute right-2 top-2 h-8 w-8 bg-black/70 text-white backdrop-blur hover:bg-black/90"
        >
          <Heart
            className={`h-4 w-4 ${
              isFav ? "fill-red-600 text-red-600" : "text-white"
            }`}
          />
        </Button>

        <div className="absolute inset-0 flex items-end bg-linear-to-t from-black/90 via-black/20 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <Button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
            className="w-full gap-2"
          >
            <Play className="h-4 w-4 fill-current" />
            More Info
          </Button>
        </div>
      </div>

      <CardContent className="space-y-2 p-4">
        <h3
          onClick={onSelect}
          className="line-clamp-1 cursor-pointer text-sm font-semibold hover:text-primary"
        >
          {movie.title}
        </h3>

        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-muted-foreground">
            {movie.release_date?.substring(0, 4) || "—"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DiscoverRoute() {
  const { trending, popular } = useLoaderData<typeof discoverLoader>();
  const { setSelectedMovie, toggleFavorite, favorites } = useFavorites();

  const featuredMovie: Movie | null = trending[0] || null;

  return (
    <div className="flex flex-col gap-12 pb-12">
      {featuredMovie && (
        <Card className="relative min-h-120 overflow-hidden border-border bg-card">
          {featuredMovie.backdrop_path && (
            <img
              src={`${IMAGE_BASE_URL}/original${featuredMovie.backdrop_path}`}
              alt={featuredMovie.title}
              className="absolute inset-0 h-full w-full object-cover opacity-40"
            />
          )}

          <div className="absolute inset-0 bg-linear-to-t from-background via-background/70 to-transparent" />
          <div className="absolute inset-0 bg-linear-to-r from-background via-background/60 to-transparent" />

          <CardContent className="relative z-10 flex min-h-120 max-w-2xl flex-col justify-end p-8 md:p-12">
            <div className="mb-4 flex flex-wrap gap-2">
              <Badge className="bg-primary text-primary-foreground">
                🔥 Trending
              </Badge>

              <Badge variant="secondary" className="gap-1">
                <Star className="h-3 w-3 fill-current" />
                {featuredMovie.vote_average?.toFixed(1)} Rating
              </Badge>
            </div>

            <h1 className="mb-4 text-4xl font-black leading-tight tracking-tight text-foreground md:text-6xl">
              {featuredMovie.title}
            </h1>

            <p className="mb-7 line-clamp-3 text-sm leading-7 text-muted-foreground md:text-base">
              {featuredMovie.overview}
            </p>

            <div className="flex flex-wrap gap-3">
              <Button
                variant="secondary"
                className="gap-2"
                onClick={() => setSelectedMovie(featuredMovie)}
              >
                <Info className="h-4 w-4" />
                More Details
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <section>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <span className="h-5 w-1 rounded-full bg-primary" />
            <TrendingUp className="h-5 w-5 text-primary" />
            Trending Now
          </h2>

          <Button variant="ghost" size="sm" className="gap-1">
            See All
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="custom-scrollbar flex gap-4 overflow-x-auto pb-3">
          {trending.slice(0, 10).map((movie) => {
            const isFav = favorites.some((f) => f.id === movie.id);

            return (
              <div key={movie.id} className="w-36 shrink-0">
                <MovieCard
                  movie={movie}
                  onSelect={() => setSelectedMovie(movie)}
                  isFav={isFav}
                  onToggleFav={() => toggleFavorite(movie)}
                />
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <span className="h-5 w-1 rounded-full bg-primary" />
            Popular Cinema
          </h2>

          <Button variant="ghost" size="sm" className="gap-1">
            See All
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {popular.slice(0, 10).map((movie) => {
            const isFav = favorites.some((f) => f.id === movie.id);

            return (
              <MovieCard
                key={movie.id}
                movie={movie}
                onSelect={() => setSelectedMovie(movie)}
                isFav={isFav}
                onToggleFav={() => toggleFavorite(movie)}
              />
            );
          })}
        </div>
      </section>
    </div>
  );
}