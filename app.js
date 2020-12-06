const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
const mysql = require("mysql");
const flash = require('connect-flash');
const session = require('express-session');
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

dotenv.config({ path: './config.env'});

const app = express();

//connet Db
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

const publicDir = path.join(__dirname, './public');
app.use(express.static(publicDir));

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

//get data from any forms
app.use(express.urlencoded({ extended: false}));

//parse json body as sent by client
app.use(express.json());
app.use(cookieParser());

// Express session
app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    })
  );

// Connect flash
app.use(flash());

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