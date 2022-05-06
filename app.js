const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const passport = require('passport');
const session = require('express-session');
const path = require('path');

const connectDB = require('./config/db');

// Load config
dotenv.config({
  path: './config/config.env'
})

// Passport config
require('./config/passport')(passport);

connectDB();

const app = express();

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Handlebars
app.engine('.hbs', exphbs.engine({extname: '.hbs', defaultLayout: 'main'}));
app.set('view engine', '.hbs');

// Sessions
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());


// Static folder
app.use('*/css',express.static('public/css'));
app.use('*/js',express.static('public/js'));
app.use('*/images',express.static('public/images'));

// Routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));

const PORT = process.env.PORT || 8080

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))