const User = require('../Model/user.model'); // Assuming the user model is in the 'models' folder

class AuthController {
  static async login(req, res) {
    const { username, password, role } = req.body;
    
    try {
      // Find the user by username and role
      const user = await User.findOne({ username, role });
      
      // If user not found or password doesn't match
      if (!user || user.password !== password) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

  // Check if user's status is true
  if (!user.status) {
    return res.status(403).json({ message: 'Account is inactive. Please contact an administrator.' });
  }


      // If successful login
      const token = 'dummyToken'; // Replace with actual token generation (e.g., JWT) later
      return res.status(200).json({ message: 'Login successful', token });
      
    } catch (error) {
      console.error('Error during login:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  }
}

module.exports = AuthController;