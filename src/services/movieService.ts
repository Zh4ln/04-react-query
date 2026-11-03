import axios from "axios";
import type { MoviesResponse } from "../types/movie";

export async function fetchMovies(
  query: string,
  page: number,
): Promise<MoviesResponse> {
  const token: string | undefined = import.meta.env.VITE_TMDB_TOKEN;

  if (!token) {
    throw new Error("TMDB token is missing. Add VITE_TMDB_TOKEN to .env.local");
  }

  const response = await axios.get<MoviesResponse>(
    "https://api.themoviedb.org/3/search/movie",
    {
      params: {
        query,
        include_adult: false,
        language: "en-US",
        page,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
}
