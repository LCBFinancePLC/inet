import React, { useState, useEffect } from 'react';
import axios from 'axios';


const RegistrationPage = () => {
  const [empName, setEmpName] = useState('');
  const [empRole, setEmpRole] = useState('');
  const [empUserName, setEmpUserName] = useState('');
  const [empPassword, setEmpPassword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [userRoles] = useState(['Admin', 'Manager']);

  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');

  const [userLogs, setUserLogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`http://10.10.1.80:5000/api/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories', error);
    }
  };

  const handleEmployeeSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const response = await axios.post(`http://10.10.1.80:5000/api/users`, {
        name: empName,
        department: selectedCategory,
        role: empRole,
        username: empUserName,
        password: empPassword,
      });

      if (response.status === 201) {
        setSuccessMessage('Employee registered successfully!');
        resetEmployeeForm();
      } else {
        setErrorMessage('Failed to register employee.');
      }
    } catch (error) {
      setErrorMessage(`Error: ${error.response?.data || error.message}`);
    }
  };

  const resetEmployeeForm = () => {
    setEmpName('');
    setEmpRole('');
    setEmpUserName('');
    setEmpPassword('');
    setSelectedCategory('');
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    if (!categoryName || !categoryDescription) {
      setErrorMessage('Both fields are required');
      return;
    }

    try {
      const response = await axios.post(`http://10.10.1.80:5000/api/categories`, {
        name: categoryName,
        description: categoryDescription,
      });

      if (response.status === 201 || response.status === 200) {
        setSuccessMessage('Category added successfully!');
        setCategoryName('');
        setCategoryDescription('');
        fetchCategories();
      } else {
        setErrorMessage('Failed to add category. Please try again.');
      }
    } catch (error) {
      setErrorMessage('Error adding category. Please try again.');
    }
  };

  const fetchUserLogs = async () => {
    try {
      const response = await axios.get(`http://10.10.1.80:5000/api/users`);
      if (response.status === 200) {
        setUserLogs(response.data);
      }
    } catch (error) {
      console.error('Error fetching user logs', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`http://10.10.1.80:5000/api/users`);
      if (response.status === 200) {
        setUsers(response.data);
        setIsUserDialogOpen(true);
      }
    } catch (error) {
      console.error('Error fetching users', error);
      setErrorMessage('Failed to fetch users. Please try again.');
    }
  };

  const handleEditUser = (user) => {
    setEditingUser({ ...user });
  };

  const handleUpdateUser = async () => {
    try {
      const response = await axios.put(`http://10.10.1.80:5000/api/users/${editingUser._id}`, editingUser);
      if (response.status === 200) {
        setSuccessMessage('User updated successfully!');
        setEditingUser(null);
        fetchUsers();
      }
    } catch (error) {
      setErrorMessage('Failed to update user. Please try again.');
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const response = await axios.delete(`http://10.10.1.80:5000/api/users/${userId}`);
      if (response.status === 200) {
        setSuccessMessage('User deleted successfully!');
        fetchUsers();
      }
    } catch (error) {
      setErrorMessage('Failed to delete user. Please try again.');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6">
            
            
            {/* User Management Section */}
            <div className="mt-8">
            
              <button onClick={fetchUsers} className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                View Users
              </button>
            </div>

            {/* Messages */}
            {successMessage && (
              <div className="mt-6 p-4 bg-green-100 text-green-700 rounded">
                {successMessage}
              </div>
            )}
            {errorMessage && (
              <div className="mt-6 p-4 bg-red-100 text-red-700 rounded">
                {errorMessage}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* User Management Dialog */}
      {isUserDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-4xl w-full max-h-[80vh] overflow-auto">
            <h2 className="text-2xl font-bold mb-4">User Management</h2>
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border p-2">Name</th>
                  <th className="border p-2">Department</th>
                  <th className="border p-2">Role</th>
                  <th className="border p-2">Username</th>
                  <th className="border p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td className="border p-2">
                      {editingUser && editingUser._id === user._id ? (
                        <input
                          value={editingUser.name}
                          onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                          className="border p-1 w-full"
                        />
                      ) : (
                        user.name
                      )}
                    </td>
                    <td className="border p-2">
                      {editingUser && editingUser._id === user._id ? (
                        <select
                          value={editingUser.department}
                          onChange={(e) => setEditingUser({ ...editingUser, department: e.target.value })}
                          className="border p-1 w-full"
                        >
                          {categories.map((category) => (
                            <option key={category._id} value={category.categoryName}>
                              {category.categoryName}
                            </option>
                          ))}
                        </select>
                      ) : (
                        user.department
                      )}
                    </td>
                    <td className="border p-2">
                      {editingUser && editingUser._id === user._id ? (
                        <select
                          value={editingUser.role}
                          onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                          className="border p-1 w-full"
                        >
                          {userRoles.map((role) => (
                            <option key={role} value={role}>
                              {role}
                            </option>
                          ))}
                        </select>
                      ) : (
                        user.role
                      )}
                    </td>
                    <td className="border p-2">
                      {editingUser && editingUser._id === user._id ? (
                        <input
                          value={editingUser.username}
                          onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                          className="border p-1 w-full"
                        />
                      ) : (
                        user.username
                      )}
                    </td>
                    <td className="border p-2">
                      {editingUser && editingUser._id === user._id ? (
                        <button onClick={handleUpdateUser} className="bg-green-500 text-white px-2 py-1 rounded mr-2">
                          Save
                        </button>
                      ) : (
                        <button onClick={() => handleEditUser(user)} className="bg-blue-500 text-white px-2 py-1 rounded mr-2">
                          Edit
                        </button>
                      )}
                      <button onClick={() => handleDeleteUser(user._id)} className="bg-red-500 text-white px-2 py-1 rounded">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              onClick={() => setIsUserDialogOpen(false)}
              className="mt-4 bg-gray-500 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

     
    </div>
  );
};

export default RegistrationPage;