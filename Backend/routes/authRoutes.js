const express = require('express');
const { loginUser, registerUser } = require('../controller/authController');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
// router.post('/admin', adminLogin);

module.exports = router;