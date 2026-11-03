import { useEffect, useState } from "react";
import type { ComponentType } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import ReactPaginateModule from "react-paginate";
import type { ReactPaginateProps } from "react-paginate";
import { Toaster, toast } from "react-hot-toast";

import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";

import { fetchMovies } from "../../services/movieService";
import type { Movie } from "../../types/movie";

import css from "./App.module.css";

// Vite 8 can expose react-paginate's CommonJS export as { default: Component }.
// Resolve both that form and a regular default component import.
type PaginateComponent = ComponentType<ReactPaginateProps>;
type ModuleWithDefault<T> = { default: T };
const paginateImport = ReactPaginateModule as unknown as
  PaginateComponent | ModuleWithDefault<PaginateComponent>;
const ReactPaginate: PaginateComponent =
  typeof paginateImport === "function"
    ? paginateImport
    : paginateImport.default;

export default function App() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isPending, isError, isFetching } = useQuery({
    queryKey: ["movies", query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: query.length > 0,
    placeholderData: keepPreviousData,
    staleTime: 60_000,
    retry: 1,
  });

  useEffect(() => {
    if (query && !isFetching && data?.results.length === 0) {
      toast.error("No movies found for your request.");
    }
  }, [query, data, isFetching]);

  const handleSearch = (newQuery: string): void => {
    setQuery(newQuery);
    setPage(1);
    setSelectedMovie(null);
  };

  const handlePageChange = ({ selected }: { selected: number }): void => {
    setPage(selected + 1);
    setSelectedMovie(null);
  };

  const movies = data?.results ?? [];
  const totalPages = data?.total_pages ?? 0;

  return (
    <div className={css.app}>
      <SearchBar onSubmit={handleSearch} />

      {query && isPending && <Loader />}
      {query && isError && <ErrorMessage />}

      {query && !isPending && !isError && (
        <>
          {movies.length > 0 && (
            <MovieGrid movies={movies} onSelect={setSelectedMovie} />
          )}

          {totalPages > 1 && (
            <ReactPaginate
              pageCount={totalPages}
              pageRangeDisplayed={5}
              marginPagesDisplayed={1}
              onPageChange={handlePageChange}
              forcePage={page - 1}
              containerClassName={css.pagination}
              activeClassName={css.active}
              nextLabel=">"
              previousLabel="<"
            />
          )}
        </>
      )}

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}

      <Toaster position="top-right" />
    </div>
  );
}
