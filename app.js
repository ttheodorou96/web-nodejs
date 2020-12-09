const express = require("express");
const session = require('express-session');
const bodyParser = require('body-parser');
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
const mysql = require("mysql");
const passport = require('passport');
const flash = require('connect-flash');
const dotenv = require("dotenv");
//const cookieParser = require("cookie-parser");

dotenv.config({ path: './config.env'});

// Passport Config
require('./config/passport')(passport);

const app = express();

//connet Db
const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE
});
//set public directory for styling ejs files
const publicDir = path.join(__dirname, './public');
app.use(express.static(publicDir));

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

//parse json body as sent by client and get data from any form
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
//express session
app.use(session({
    secret: 'mistikouli',
    resave: false,
    saveUninitialized: true
}))
//passport middleware
app.use(passport.initialize());
app.use(passport.session());
//Connect flash
app.use(flash());
//global variables
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
  });

db.connect( (error) =>{
    if(error){
        console.log(error)
    }else{
        console.log("mySql connected...")
    }
})

//Define Routes
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));

app.listen(5000, () => {
    console.log("Server running on Port 5000...");
})