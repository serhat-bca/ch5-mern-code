const express = require("express");
const app = express();
const cors = require("cors");
// Movie model
const Movie = require("./models/movie");

// middleware for parsing body into js object
app.use(cors());
app.use(express.json());
app.use(express.static("dist"));

const requestLogger = (req, res, next) => {
  console.log(`Request Method: ${req.method}`);
  console.log(`Request URL: ${req.url}`);
  console.log("Request body:", req.body);
  console.log("------------");
  next();
};

// utilize requestLogger middleware
app.use(requestLogger);

const port = 3001;

app.post("/api/movies", async (req, res) => {
  const { title, watchlist } = req.body;
  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  } else {
    const movie = new Movie({ title, watchlist: watchlist || false });
    const savedMovie = await movie.save();
    res.json(savedMovie);
  }
});

app.get("/api/movies", async (req, res) => {
  const movies = await Movie.find({});
  console.log(movies);
  res.json(movies);
});

app.get("/api/movies/:id", async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie) {
    res.status(404).json({ error: "Movie not found" });
  } else {
    res.json(movie);
  }
});

app.delete("/api/movies/:id", (req, res) => {
  const movie = movies.find((m) => m.id === Number(req.params.id));
  if (!movie) {
    res.status(404).json({ error: "Movie not found!" });
  } else {
    movies = movies.filter((m) => m.id != req.params.id);
    res.json({ message: "Movie deleted successfully" });
  }
});

app.get("/", (req, res) => {
  res.send("Whats up");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
