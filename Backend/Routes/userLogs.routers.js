const express = require('express');
const router = express.Router();

const {
    createUserLogs,
    getUsersLogs,
    getUserLogsById,
   
} = require("../Controller/userLogs.controller.js");



// Create a new category
router.post('/users', createUserLogs);

// Get all categories
router.get('/users', getUsersLogs);

// Get a category by ID
router.get('/users/:id', getUserLogsById);



module.exports = router;