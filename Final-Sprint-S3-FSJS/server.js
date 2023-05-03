if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const uuid = require("uuid");
const logins = require("./services/p.logins.dal"); // use POSTGRESQL dal
const movies = require("./services/m.moviesdb");
const validate = require('./autoUnitTesting/validate')
const { parse } = require("querystring");
const { parseArgs } = require("util");

const app = express();
global.DEBUG = true;
app.set("view engine", "ejs");
app.use(express.static("public"));

// Logging events
const logEvents = require("./logEvents");
const EventEmitter = require("events");
const { error } = require("console");
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.addListener("route", (event, level, msg) => {
  const d = new Date();
  console.log(d.toLocaleString() + " * " + level.toUpperCase() + " * " + msg);
  logEvents(event, level.toUpperCase(), msg);
});

const PORT = process.env.PORT || 3000;
global.DEBUG = true;
passport.use(
  new localStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      let user = await logins.getLoginByEmail(email);
      if (user == null) {
        return done(null, false, { message: "No user with that email." });
      }
      try {
        if (await bcrypt.compare(password, user.password)) {
          return done(null, user);
        } else {
          return done(null, false, {
            message: "Incorrect password was entered.",
          });
        }
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// something is happening here where its grabbing the user but just displaying as an object instead of the user, why?

passport.deserializeUser(async (id, done) => {
  let user = await logins.getLoginById(id);
  if (DEBUG) console.dir(`passport.deserializeUser: ${user.username}`); // fixed 
  done(null, user);
});

app.set("view-engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));

// Passport checkAuthenticated() middleware.
// For every route we check the person is logged in. If not we send them
// to the login page
app.get("/", checkAuthenticated, (req, res) => {
  myEmitter.emit(
    "route",
    req.user.uuid,
    "information",
    "visited the home page."
  );
  res.render("index.ejs", { name: req.user.username, errorMessage:""});
});

app.get("/search", checkAuthenticated, async (req, res) => {
  const searchType = req.query["search-type"];
  var searchInput = req.query["search-input"];
  let results;
  myEmitter.emit(
    "route",
    req.user.uuid,
    "information",
    `Searched for: ${searchInput} in ${searchType}`,
  );
  const validSearch = validate.validateSearch(searchInput)
  console.log(validSearch)
  if (validSearch === true){
     switch (searchType) {
    case "title":
      const title = searchInput.charAt(0).toUpperCase() + searchInput.slice(1);     
      results = await movies.getMoviesByTitle({ $regex: title, $options: "i" });
      break;
    case "genre":
      const genre = searchInput.charAt(0).toUpperCase() + searchInput.slice(1);
      results = await movies.getMoviesByGenre({ $regex: genre, $options: "i" });
      break;
      case "year":
        results = await movies.getMoviesByYear(parseInt(searchInput));
        break;
      default:
        results = [];
    }
     res.render("searchResults.ejs", { movies: results })
  }else{
    res.render("index.ejs", {name: req.user.username, errorMessage: "invalid search: Please try again (only certain symbols can be used)" })

  }

  // Emitter before the management of the search to show the original input from the user 

  // starting with * or + breaks the code (* trys to show all of null so it breaks)
  // if(searchInput.charAt(0) === "*" || searchInput.charAt(0) === "+"){
  //   console.log("*** Pleases do not start with: "+ searchInput.charAt(0) + " it has been replaced with a space ***")
  //   searchInput = searchInput.replace(/[*+]/,''); 
  // };
  
 ;
  })
  
 

// Passport checkNotAuthenticated() middleware.
// This middleware is only for the login and register. If someone stumbles
// upon these routes they only need access if they are NOT authenticated.
app.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("login.ejs");
});
app.post(
  "/login",
  checkNotAuthenticated,
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);
app.get("/register", checkNotAuthenticated, (req, res) => {
  
  res.render("register.ejs",{ errorMessage: ""});
});
app.post("/register", checkNotAuthenticated, async (req, res) => {
  const validUser = validate.validateUser(req.body.name)
  const validPassword = validate.validatePassword(req.body.password)
  const validEmail = validate.validateEmail(req.body.email)
  const existingUser = await logins.getUserByName(req.body.name);
  console.log(existingUser)
  if (existingUser || !validUser) {
    res.render("register", { errorMessage: "That username is not available, make sure its 3 or more characters" });
  }
  else if (validPassword === false){
    res.render("register", { errorMessage: "Invalid password, your password myst be 8 characters or more and contain at least 1 letter and 1 number" });
  }else if (validEmail === false) {
    res.render("register", { errorMessage: "Invalid email" }); 
  }
  else{
  try { 
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    let result = await logins.addLogin(
      req.body.name,
      req.body.email,
      hashedPassword,
      uuid.v4()
    );
    res.redirect("/login");
  } catch (error) {
    console.log(error);
    res.redirect("/register");
  }}

});

app.delete("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });  
});


function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}
function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  return next();
}
app.get("/movies", async (req, res) => {
  var queryStr = require("url").parse(req.url, true).query;
  if (queryStr.id) {
    var results = await movies.getMoviesById(queryStr.id);
  } else {
    var results = await movies.getMovies();
  }
  if (results == null) {
    console.log("not found");
  } else {
    res.status(200).json(results);
  }
});

app.get("/movies/id/:id", async (req, res) => {
  let result = await movies.getMoviesById(parseInt(req.params.id));
  //console.log(req.params.id)
  console.log(result);
  if (result == null) {
    console.log("not found");
  } else {
    console.log(result);
    res.status(200).json(result);
  }
});

app.get("/movies/title/:title", async (req, res) => {
  const title = req.params.title;
  const results = await movies.getMoviesByTitle(title);
  res.send(results);
});

app.get("/movies/genre/:genre", async (req, res) => {
  const genre = req.params.genre;
  const results = await movies.getMoviesByGenre(genre);
  res.send(results);
});

app.get("/movies/year/:year", async (req, res) => {
  const year = req.params.year;
  const results = await movies.getMoviesByYear(parseInt(year));
  res.send(results);
});

app.listen(PORT, (err) => {
  if (err) console.log(err);
  console.log(`Passport app running on port ${PORT}.`);
});

