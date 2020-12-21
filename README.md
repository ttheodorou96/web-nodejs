# nodejs-app

Home/register/login/dashboard pages for an academic project. 

User can register if new or login if already has an account. 

After the login user can upload HAR files. 

So what's this HAR? HAR (HTTP Archive) is a file format used by several HTTP session tools to export the captured data. The format is basically a JSON object with a particular field distribution. In any case, please note that not all the fields are mandatory, and many times some information won't be saved to the file.

Also beware, HAR files contain sensitive data!

->content of the pages you downloaded while recording
->your cookies, which will allow anyone with the HAR file to impersonate your account
->all the information that you submitted while recording: personal details, passwords, credit card numbers...


Project done with Nodejs and
Connected with a database in mySql 

# packages to install 

$npm install

#dependencies

$npm i bcryptjs 
    connect-flash 
    dotenv
    ejs
    express
    express-ejs-layouts
    express-session
    jsonwebtoken
    mysql
    nodemon
    passport
    passport-local
    cookie-parser

# How to run

Run as Admin xampp 

Start Apache and MySQL

$npm start

visit localhost on port 5000

# Server running on PORT 5000

http://localhost:5000/

# mySql manage Database

table: users

https://localhost/phpmyadmin/sql.php?server=1&db=nodejs-login&table=users&pos=0
