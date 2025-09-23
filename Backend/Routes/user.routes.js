const express = require('express');
const router = express.Router();

const {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
} = require("../Controller/user.controller");



// Create a new category
router.post('/users', createUser);

// Get all categories
router.get('/users', getUsers);

// Get a category by ID
router.get('/users/:id', getUserById);

// Update a category by ID
router.put('/users/:id', updateUser);

// Delete a category by ID
router.delete('/users/:id', deleteUser);

module.exports = router;