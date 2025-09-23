import  { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../Components/headerAdmin';
import Footer from '../Components/footer';
import PDFManagement from '../Components/managePdf';

const RegistrationPage = () => {
  const [empName, setEmpName] = useState('');
  const [empRole, setEmpRole] = useState('');
  const [empUserName, setEmpUserName] = useState('');
  const [empPassword, setEmpPassword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [userRoles] = useState(['Admin', 'Manager']);
  const [usernameError, setUsernameError] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');

  const [userLogs, setUserLogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  
  const [isPdfManagementOpen, setIsPdfManagementOpen] = useState(false);

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const isValidUsername = (username) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@lcbfinance\.(net|lk)$/;
    return emailRegex.test(username);
  };


  const handleEmployeeSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');
    setUsernameError('');

    if (!isValidUsername(empUserName)) {
      setUsernameError('Username must be in the format user@lcbfinance.net or user@lcbfinance.lk');
      return;
    }


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
        setEmpName('');
        setEmpRole('');
        setEmpUserName('');
        setEmpPassword('');
        setSelectedCategory('');
      } else {
        setErrorMessage('Failed to register employee.');
      }
    } catch (error) {
      if (error.response) {
        // Handle different error cases based on status codes
        switch (error.response.status) {
          case 409: // Conflict - Duplicate username
            setErrorMessage('This username is already registered. Please use a different email address.');
            setUsernameError('Username already exists');
            break;
          case 400: // Bad request
            setErrorMessage('Invalid or Duplicate Inputs. Please check Username.');
            break;
          case 500: // Server error
            setErrorMessage('Server error occurred. Please try again later.');
            break;
          default:
            setErrorMessage(`Registration failed: ${error.response.data.message || 'Please try again.'}`);
        }
      } else if (error.request) {
        // Network error
        setErrorMessage('Unable to connect to the server. Please check your internet connection.');
      } else {
        // Other errors
        setErrorMessage('An unexpected error occurred. Please try again.');
      }
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
      } else {
        setErrorMessage('Failed to add category. Please try again.');
      }
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setErrorMessage('Error adding category. Please try again.');
    }
  };


  
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://10.10.1.80:5000/api/users');
      if (response.status === 200) {
        setUsers(response.data);
        setIsUserDialogOpen(true);
      } else {
        console.error('Unexpected response status:', response.status);
        setErrorMessage('Failed to fetch users. Please try again.');
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
        setSuccessMessage('User deactivated successfully!');
        // Refresh the user list after deactivation
        fetchUsers();
      }
    } catch (error) {
      setErrorMessage('Failed to deactivate user. Please try again.');
    }
  };
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`http://10.10.1.80:5000/api/categories`);
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories', error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
    <Header />
    <main className="flex-grow container mx-auto px-4 py-8"> {/* Add flex-grow here */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-12 text-blue-900 text-center ">Admin Dashboard</h1>
            
            <div className="grid md:grid-cols-2 gap-24">
              {/* Employee Registration Form */}
              <div>
                <h2 className="text-xl font-semibold mb-4 text-blue-800">Employee Registration</h2>
                <form onSubmit={handleEmployeeSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Employee Name</label>
                    <input
                      type="text"
                      value={empName}
                      onChange={(e) => setEmpName(e.target.value)}
                      placeholder="Enter employee name"
                      className="mt-1 block w-full px-3 py-2 border border-blue-300 rounded-md shadow-sm focus:ring-blue-300 focus:border-blue-500 bg-blue-100 text-blue-800 placeholder-blue-400"
                     required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Department</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-blue-300 rounded-md shadow-sm focus:ring-blue-300 focus:border-blue-500 bg-blue-100 text-blue-800 placeholder-blue-400"
                      
                      required
                    >
                      <option value="">Select a department</option>
                      {categories.map((category) => (
                        <option key={category._id} value={category.categoryName}>
                          {category.categoryName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Role</label>
                    <select
                      value={empRole}
                      onChange={(e) => setEmpRole(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-blue-300 rounded-md shadow-sm focus:ring-blue-300 focus:border-blue-500 bg-blue-100 text-blue-800 placeholder-blue-400"
                     required
                    >
                      <option value="">Select a role</option>
                      {userRoles.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
  <label className="block text-sm font-medium text-gray-700">Username</label>
  <input
    type="email"
    value={empUserName}
    onChange={(e) => setEmpUserName(e.target.value)}
    placeholder="Enter username (e.g., user@lcbfinance.net / .lk)"
    className={`mt-1 block w-full px-3 py-2 border ${
      usernameError ? 'border-red-500' : 'border-blue-300'
    } rounded-md shadow-sm focus:ring-blue-300 focus:border-blue-500 bg-blue-100 text-blue-800 placeholder-blue-400`}
    required
  />
  {usernameError && (
    <p className="mt-1 text-sm text-red-600">{usernameError}</p>
  )}
</div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                      type="password"
                      value={empPassword}
                      onChange={(e) => setEmpPassword(e.target.value)}
                      placeholder="Enter password"
                      className="mt-1 block w-full px-3 py-2 border border-blue-300 rounded-md shadow-sm focus:ring-blue-300 focus:border-blue-500 bg-blue-100 text-blue-800 placeholder-blue-400"
                     required
                    />
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Register Employee
                    </button>
                  </div>
                </form>
              </div>

              {/* Category Management Form */}
              <div>
                <h2 className="text-xl font-semibold mb-4 text-blue-800">Add Department</h2>
                <form onSubmit={handleCategorySubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Department Name</label>
                    <input
                      type="text"
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                      placeholder="Enter category name"
                      className="mt-1 block w-full px-3 py-2 border border-blue-300 rounded-md shadow-sm focus:ring-blue-300 focus:border-blue-500 bg-blue-100 text-blue-800 placeholder-blue-400"
                     required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      value={categoryDescription}
                      onChange={(e) => setCategoryDescription(e.target.value)}
                      placeholder="Enter category description"
                      className="mt-1 block w-full px-3 py-2 border border-blue-300 rounded-md shadow-sm focus:ring-blue-300 focus:border-blue-500 bg-blue-100 text-blue-800 placeholder-blue-400"
                     rows="4"
                      required
                    />
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 "
                    >
                      Add Department
                    </button>
                  </div>
                </form>

                {/* User Handle Section */}
                <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4 text-blue-800">Manage Users and PDFs</h2>
                <div className="flex space-x-4">

                <button 
                    onClick={fetchUsers} 
                    className="mb-4 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Manage Users
                  </button>


                  <button 
                    onClick={() => setIsPdfManagementOpen(true)} 
                    className="mb-4 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    Manage PDFs
                  </button>


  {/* Buttons are placed inside this container */}
</div>
                  
                  
                
                </div>
              </div>
            </div>
  {/* User Management Section */}
  <div className="mt-8">
           
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

{/* User Management Dialog */}
{isUserDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-7xl w-full max-h-[80vh] overflow-auto">
            <h2 className="text-2xl font-bold mb-4">User Management</h2>
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border p-2">Name</th>
                  <th className="border p-2">Department</th>
                  <th className="border p-2">Role</th>
                  <th className="border p-2">Username</th>
                  <th className="border p-2">Password</th>
                  <th className="border p-2">Added Date</th>
                  <th className="border p-2">Actions</th>
                  
                </tr>
              </thead>
              <tbody>
  {users
    .filter((user) => user.status === true) // Filter users with status === true
    .map((user) => (
      <tr key={user._id}>

        <td className="border p-2">
          {editingUser && editingUser._id === user._id ? (
            <input
              value={editingUser.name}
              onChange={(e) =>
                setEditingUser({ ...editingUser, name: e.target.value })
              }
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
              onChange={(e) =>
                setEditingUser({
                  ...editingUser,
                  department: e.target.value,
                })
              }
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
              onChange={(e) =>
                setEditingUser({ ...editingUser, role: e.target.value })
              }
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
              onChange={(e) =>
                setEditingUser({ ...editingUser, username: e.target.value })
              }
              className="border p-1 w-full"
            />
          ) : (
            user.username
          )}
        </td>


        <td className="border p-2">
          {editingUser && editingUser._id === user._id ? (
            <input
              value={editingUser.password}
              onChange={(e) =>
                setEditingUser({ ...editingUser, password: e.target.value })
              }
              className="border p-1 w-full"
            />
          ) : (
            user.password
          )}
        </td>


        <td className="border p-2">
  {new Date(user.createdOn).toLocaleDateString()} {/* Display date only */}
</td>




        <td className="border p-2">
          {editingUser && editingUser._id === user._id ? (
            <button
              onClick={handleUpdateUser}
              className="bg-green-500 text-white px-2 py-1 rounded mr-2"
            >
              Save
            </button>
          ) : (
            <button
              onClick={() => handleEditUser(user)}
              className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
            >
              Edit
            </button>
          )}
          <button
            onClick={() => handleDeleteUser(user._id)}
            className="bg-red-500 text-white px-2 py-1 rounded"
          >
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




                <PDFManagement 
              isOpen={isPdfManagementOpen}
              onClose={() => setIsPdfManagementOpen(false)}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RegistrationPage;




