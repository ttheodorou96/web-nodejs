const LocalStrategy = require('passport-local').Strategy;
// Load user model
const mysql = require('mysql');
const bcrypt = require('bcryptjs');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

module.exports = function(passport) {
    passport.use(new LocalStrategy(
        { usernameField: 'email' },
        (email, password, done) =>  {
        try {
            db.query('SELECT * FROM users WHERE email = ?', [email], async (error,results) =>{
                const user = results[0];
                if( !user ){
                    return done(null, false, {message: "Not Registered User."});
                } 
                if (!(await bcrypt.compare(password, results[0].password))){
                    return done(null, false, {message: "Invalid Password."});
                }
                return done(null, user);  
            });
        } catch (error) {
            console.log(error);
        }
        }
    ));

    //serialize user
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    //deserialize user
    passport.deserializeUser(function(id, done) {
        db.query('SELECT * FROM users WHERE id = ?', [id], function(err,rows){
            done(err, rows[0]);
        });
    });        
};
