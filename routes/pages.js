const express = require("express");
const mysql = require('mysql');
const { ensureAuthenticated } = require("../controllers/authlog");

const router = express.Router();

//Show Home Page
router.get('/', (req, res) => {
    res.render('home');
});

//Show Register Page
router.get("/register", (req, res) =>{
    res.render("register");
});

//Show Login Page
router.get("/login",  (req, res) =>{
    res.render("login");
});

//logout handle
router.get('/logout',  (req,res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/login');
});

//Show Dashboard only after a user is logged in
router.get('/dashboard', ensureAuthenticated ,(req,res) => {
    res.render('dashboard', {
        user: req.user
      })
});

module.exports = router;