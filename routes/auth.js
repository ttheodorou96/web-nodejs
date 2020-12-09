const express = require("express");
const authController = require('../controllers/auth');

const router = express.Router();
//register handle
router.post('/register', authController.register); 

//login handle
router.post('/login', authController.login); 

module.exports = router;