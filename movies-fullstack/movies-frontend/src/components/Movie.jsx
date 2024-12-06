/* eslint-disable react/prop-types */
const Movie = ({ movie, updateMovie }) => (
  <li>
    {movie.title} {movie?.year && `(${movie.year})`}
    <button onClick={() => updateMovie(movie)}>
      {movie.watchlist ? "Remove" : "Add"}
    </button>
  </li>
);

export default Movie;
