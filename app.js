require('dotenv').config()
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const postsRouter = require('./routes/posts')

//body pareser 
const bodyParser = require('body-parser')
//mongoDB stuff
const mongoose = require("mongoose");

//crypt the password 
const bcrypt = require('bcryptjs')

//jwt stuff
const jwt = require("jsonwebtoken");

//auth 
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
// mongo 
const User = require('./models/user')

// app set up 
mongoose.set("strictQuery", false);
const mongoDB = process.env.MONGO_DB_URL;
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

var app = express();
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(passport.initialize());
passport.use(
  new LocalStrategy(async(username, password, done) => {
    try {
      const user = await User.findOne({ username: username });
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      };
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        // passwords do not match!
        return done(null, false, { message: "Incorrect password" })
      }
      return done(null, user);
    } catch(err) {
      return done(err);
    };
  })
);


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', verifyToken, usersRouter)
app.use('/posts', verifyToken, postsRouter);

// parse JWT
function parseJwt (token) {
  return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}
// Verify Token
function verifyToken(req, res, next) {
  // Get auth header value
  const bearerHeader = req.headers['authorization'];
  // Check if bearer is undefined
  if(typeof bearerHeader !== 'undefined') {
    // Split at the space
    const bearer = bearerHeader.split(' ');
    // Get token from array
    const bearerToken = bearer[1];
    // Set the token
    jwt.verify(bearerToken, process.env.JWT_SECRET_KEY, (err, authData) => {
      if (err) {
        // Forbidden
        res.sendStatus(403);
      } else {
        // Attach authData to request object
        req.authData = authData;
        // Next middleware
        next();
      }
    });
  } else {
    // Forbidden
    res.sendStatus(403);
  }
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
