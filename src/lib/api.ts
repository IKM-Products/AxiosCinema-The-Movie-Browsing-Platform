// src/lib/api.ts

import axios from "axios";

declare global {
  interface ImportMetaEnv {
    readonly VITE_TMDB_API_KEY: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export const tmdbClient = axios.create({
  baseURL: TMDB_BASE_URL,
  headers: {
    accept: "application/json",
  },
  params: {
    api_key: API_KEY,
  },
});

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  original_language: string;
}

interface TMDBResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export const movieService = {
  async getPopular(page = 1): Promise<Movie[]> {
    const { data } = await tmdbClient.get<TMDBResponse>("/movie/popular", {
      params: { page },
    });

    return data.results;
  },

  async getTrending(): Promise<Movie[]> {
    const { data } = await tmdbClient.get<TMDBResponse>(
      "/trending/movie/day",
    );

    return data.results;
  },

  async searchMovies(query: string, page = 1): Promise<Movie[]> {
    if (!query.trim()) {
      return [];
    }

    const { data } = await tmdbClient.get<TMDBResponse>("/search/movie", {
      params: {
        query,
        page,
      },
    });

    return data.results;
  },
};