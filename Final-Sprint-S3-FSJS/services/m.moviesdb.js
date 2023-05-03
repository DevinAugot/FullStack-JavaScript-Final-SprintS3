const { ObjectId } = require("mongodb");
const dal = require("./mdb");


async function getMovies() {
  try {
    await dal.connect();
    const cursor = dal.db("movie_db").collection("movies").find();
    const results = await cursor.toArray();
    return results;
  } catch(error) {
    console.log(error);
  }
};

async function getMoviesById(id) {
  try {
    await dal.connect();
    const result = dal.db("movie_db").collection("movies").findOne({ "movie_id": id}); 
    return result;
  } catch(error) {
    console.log(error);
  }
};


async function getMoviesByTitle(title) {
  try {
    await dal.connect();
    const cursor = dal.db("movie_db").collection("movies").find({ "movie_title": title}); 
    const result = await cursor.toArray(); 
    return result;
  } catch(error) {
    console.log(error);
  }
};

async function getMoviesByGenre(genre) {
  try {
    await dal.connect();
    const cursor = dal.db("movie_db").collection("movies").find({"movie_genre": genre });
    const result = await cursor.toArray(); 
    return result;
  } catch(error) {
    console.log(error);
  }
};

async function getMoviesByYear(year) {
  try {
    await dal.connect();
    const cursor = dal.db("movie_db").collection("movies").find({"movie_year": year });
    const result = await cursor.toArray(); 
    return result;
  } catch(error) {
    console.log(error);
  }
};




module.exports = {
    getMovies,
    getMoviesById, 
   getMoviesByTitle,
   getMoviesByGenre,
   getMoviesByYear
  }