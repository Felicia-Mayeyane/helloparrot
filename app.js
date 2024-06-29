const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts'); 
const connectDB = require('./config/db');
const engine = require('ejs-mate'); 

// Load config
dotenv.config({ path: './config/config.env' });

// Passport config
require('./config/passport')(passport);

// Connect to database
connectDB();

const app = express();

// Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); 

// Use expressLayouts middleware
app.use(expressLayouts);

// Sessions
app.use(
    session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URI,
        }),
    })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const recordRouter = require('./routes/record');
const noteRouter = require('./routes/note');
const dashboardRouter = require('./routes/dashboard');

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/record', recordRouter);
app.use('/note', noteRouter);
app.use('/dashboard', dashboardRouter); 

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

const PORT = process.env.PORT || 8000;

app.listen(
    PORT,
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

module.exports = app;
