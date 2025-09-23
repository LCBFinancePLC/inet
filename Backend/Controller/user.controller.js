const User = require('../Model/user.model');
const express = require('express');
const { StatusCodes } = require('http-status-codes');

const router = express.Router();

const createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    const newUser = await user.save();
    res.status(StatusCodes.CREATED).json(newUser);
  } catch (err) {
    if (err.code === 11000) {
      // Duplicate key error (e.g., duplicate username)
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Duplicate username. Please use a different username.' });
    } else {
      console.error(err);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error creating user.' });
    }
  }
};

const getUsers = async (req, res) => {
  try {
    console.log('Fetching users...');
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching users' });
  }
};

const getUserById = async (req, res) => {
 
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
        return res.status(404).send('PDF not found.');
    }
    res.status(200).json(user);
} catch (error) {
    console.error('Error fetching PDF:', error);
    res.status(500).send('Internal server error.');
}
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndUpdate(id, req.body, { 
      new: true, 
      runValidators: true 
    });
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: `No User with id: ${id}` });
    }
    res.status(StatusCodes.OK).json(user);
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error updating user' });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: `No User with id: ${id}` });
    }
    
    // Set the user's status to false instead of deleting
    user.status = false;
    await user.save();
    
    res.status(StatusCodes.OK).json({ message: 'User deactivated successfully', user });
  } catch (err) {
    console.error('Error deactivating user:', err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error deactivating user' });
  }
};




module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};


