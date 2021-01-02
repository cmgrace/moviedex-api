require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const MOVIEDEX = require("./moviedex.json");
const cors = require("cors");
const helmet = require("helmet");

const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(helmet());
app.use(function validateBearerToken(req, res, next) {
  console.log("validate bearer token middleware");
  const authToken = req.get("Authorization");
  const apiToken = process.env.API_TOKEN;
  if (!authToken || authToken.split(" ")[1] !== apiToken)
    return res.status(401).json({ error: "Unauthorized request" });
  next();
});

//-------------- define function to get a list of movies -------------
function handleGetMovies(req, res) {
  let response = MOVIEDEX;

  if (req.query.genre) {
    response = response.filter((movie) =>
      movie.genre.toLowerCase().includes(req.query.genre.toLowerCase())
    );
  }
  if (req.query.county) {
    response = response.filter((movie) =>
      movie.county.toLowerCase().includes(req.query.county.toLowerCase())
    );
  }
  if (req.query.avg_vote) {
    response = response.filter(
      (movie) => Number(movie.avg_vote) >= Number(req.query.avg_vote)
    );
  }

  res.json(response);
}
app.get("/movie", handleGetMovies);

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
