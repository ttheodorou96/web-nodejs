var mysqlModel = require('mysql-model');

var UserSchema = mysqlModel.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE
});
 
var User = UserSchema.extend({
    tableName: "users",
});
 
user = new User();
    
 module.exports = User;