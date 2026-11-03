import { useEffect } from "react";
import type { MouseEvent } from "react";
import { createPortal } from "react-dom";
import type { Movie } from "../../types/movie";
import css from "./MovieModal.module.css";

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
}

export default function MovieModal({ movie, onClose }: MovieModalProps) {
  useEffect(() => {
    const oldOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleEscape = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = oldOverflow;
    };
  }, [onClose]);

  const handleBackdropClick = (event: MouseEvent<HTMLDivElement>): void => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const imagePath = movie.backdrop_path || movie.poster_path;

  return createPortal(
    <div
      className={css.backdrop}
      onMouseDown={handleBackdropClick}
      role="presentation"
    >
      <div
        className={css.modal}
        role="dialog"
        aria-modal="true"
        aria-label={movie.title}
      >
        <button
          type="button"
          className={css.closeButton}
          onClick={onClose}
          aria-label="Close modal"
        >
          &times;
        </button>

        {imagePath ? (
          <img
            className={css.image}
            src={`https://image.tmdb.org/t/p/original${imagePath}`}
            alt={movie.title}
          />
        ) : (
          <div className={css.image} style={{ backgroundColor: "#222" }} />
        )}

        <div className={css.content}>
          <h2>{movie.title}</h2>

          <p>{movie.overview || "No overview available."}</p>

          <p>
            <strong>Release Date:</strong> {movie.release_date || "Unknown"}
          </p>

          <p>
            <strong>Rating:</strong> {movie.vote_average.toFixed(1)}/10
          </p>
        </div>
      </div>
    </div>,
    document.body,
  );
}
