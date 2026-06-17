// src/components/MovieCard.tsx

import { useNavigate } from "react-router-dom";
import { Heart, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface MovieCardProps {
  id: number;
  title: string;
  posterPath: string | null;
  releaseDate?: string;
  rating?: number;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
}

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

export function MovieCard({
  id,
  title,
  posterPath,
  releaseDate,
  rating = 0,
  isFavorite,
  onToggleFavorite,
}: MovieCardProps) {
  const navigate = useNavigate();

  const handleMovieClick = () => {
    navigate(`/movie/${id}`);
  };

  return (
    <Card className="group overflow-hidden border-border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <button
        type="button"
        onClick={handleMovieClick}
        className="block w-full cursor-pointer text-left"
      >
        <div className="aspect-2/3 w-full overflow-hidden bg-muted">
          <img
            src={
              posterPath
                ? `${IMAGE_BASE_URL}${posterPath}`
                : "https://placehold.co/500x750?text=No+Image"
            }
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </button>

      <CardContent className="space-y-2 p-4">
        <button
          type="button"
          onClick={handleMovieClick}
          className="w-full cursor-pointer text-left"
        >
          <h3 className="line-clamp-1 text-base font-semibold hover:text-primary">
            {title}
          </h3>
        </button>

        <p className="text-sm text-muted-foreground">
          {releaseDate || "Unknown release date"}
        </p>

        <div className="flex items-center gap-1 text-sm">
          <Star className="h-4 w-4 fill-primary text-primary" />
          <span className="font-medium">
            {Number(rating).toFixed(1)}
          </span>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          type="button"
          variant={isFavorite ? "destructive" : "outline"}
          size="sm"
          className="w-full"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(id);
          }}
        >
          <Heart
            className={`mr-2 h-4 w-4 ${
              isFavorite ? "fill-current" : ""
            }`}
          />
          {isFavorite ? "Remove Favorite" : "Add Favorite"}
        </Button>
      </CardFooter>
    </Card>
  );
}