const express = require("express");
const app = express();
const cors = require("cors");
// middleware for parsing body into js object
app.use(cors());
app.use(express.json());
app.use(express.static("dist"));
// require dotenv
require("dotenv").config();
// require mongoose
const mongoose = require("mongoose");

const DB_URI = process.env.MONGODB_URI;
// mongoose setup and connection
mongoose.set("strictQuery", false);
mongoose
  .connect(DB_URI)
  .then(() => console.log("DB Connection Established"))
  .catch((e) => {
    console.log("Error connecting the DB: ", e.message);
  });

// create movie schema
const movieSchema = new mongoose.Schema({
  title: String,
  watchlist: Boolean,
});

// configure toJSON method
movieSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
  },
});

// create mongoose model
const Movie = mongoose.model("Movie", movieSchema);

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

app.post("/api/movies", (req, res) => {
  const { title, watchlist } = req.body;
  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  } else {
    const movie = {
      id: `${Date.now()}${Math.floor(Math.random() * 10000)}`,
      title,
      watchlist: watchlist || false,
    };
    movies.push(movie);
    return res.status(201).json(movie);
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
