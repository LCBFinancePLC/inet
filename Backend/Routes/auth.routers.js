const express = require('express');
const router = express.Router();
const AuthController = require('../Controller/auth.controller'); // Assuming the controller is in the 'controllers' folder

// POST route for login
router.post('/login', AuthController.login);
// router.get('/login', AuthController.login);

module.exports = router;