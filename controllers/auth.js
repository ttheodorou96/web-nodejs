const mysql = require("mysql");
const bcrypt = require("bcryptjs");
const passport = require('passport');

// Passport Config
require('../config/passport')(passport);

var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");


const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

//register
exports.register = (req, res) => {

    const {name, email, password, passwordConfirm } = req.body;

    let errors = [];

    if (!name || !email || !password || !passwordConfirm) {
        errors.push({ msg: 'Please enter all fields' });
      }
    
    if (password != passwordConfirm) {
        errors.push({ msg: 'Passwords do not match' });
    }
    if(!(strongRegex.test(password))){
        errors.push({ msg: 'Password should have at least 8 characters and include one uppercase, lowercase, number and special character'});
    }
    if (errors.length > 0) {
        res.render('register', {
          errors,
          name,
          email,
          password,
          passwordConfirm
        });
    }else{
    db.query("SELECT COUNT(*) AS cnt FROM users WHERE email = ?" , [email] , async (err , results) =>{
        if(err){
            console.log(err);
        }       
        else{
            if(results[0].cnt > 0){  
            errors.push({ msg: 'Email already exists' });
            res.render('register', {
                errors,
                name,
                email,
                password,
                passwordConfirm
            });
            }else{
                //Hash Password
                let hashedPassword = await bcrypt.hash(password,  8);
                db.query('INSERT INTO users SET ?', {name, email, password: hashedPassword}, (error, results) => {
                    if(error){
                        console.log(error);
                    } else{
                        req.flash(
                            'success_msg',
                            'You are now registered you can login'
                          );
                        //new User 
                        const newUser = {
                            name,
                            email,
                            password: hashedPassword
                        };
                        res.redirect('/login');
                    }
                })  
            }         
        }
    });
    }
}
//login
exports.login = (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/login',
        failureFlash: true
      })(req, res, next);
}

//alternative login with tokens and cookies

/*const jwt = require("jsonwebtoken");
exports.login =(req, res, next) => {
    try {
        const { email, password} = req.body;
        if(!email || !password) {
            req.flash(
                'error',
                'Please enter all fields'
              );
            res.redirect('/login');
        }
        db.query('SELECT * FROM users WHERE email = ?', [email], async (error,results) =>{
            if( !results || !(await bcrypt.compare(password, results[0].password))){
                req.flash(
                    'error',
                    'Email or Password is incorrect'
                  );
                res.redirect('/login');
            } else {
                const id = results[0].id;
                //serialize user 

                const token = jwt.sign({ id }, process.env.JWT_SECRET,{
                    expiresIn: process.env.JWT_EXPIRES_IN
                });

                console.log("The token is : " + token);

                const cookieOptions = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60* 60 * 1000
                    ),
                    httpOnly: true
                }
                //put a cookie in the browser with all the required parameters
                res.cookie('jwt', token, cookieOptions);
                //redirect logged in user to home page
                res.status(200).redirect("/dashboard");
            }
        });
    } catch (error) {
        console.log(error);
    }
} */