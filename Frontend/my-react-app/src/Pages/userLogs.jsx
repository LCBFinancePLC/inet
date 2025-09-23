import { useState, useEffect } from 'react';

const UserLogsPage = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserLogs();
  }, []);

  const fetchUserLogs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/user-logs');
      if (!response.ok) {
        throw new Error('Failed to fetch user logs');
      }
      const data = await response.json();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError('Error fetching user logs. Please try again later.');
      console.error('Error fetching user logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    Object.values(user).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  if (loading) {
    return <div className="text-center text-lg mt-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-lg mt-8 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 font-sans">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">User Logs</h1>
      <input
        type="text"
        placeholder="Search users..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="w-full p-2 mb-6 text-lg border border-gray-300 rounded"
      />
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left font-semibold text-gray-700 border-b-2 border-gray-200">Username</th>
              <th className="p-3 text-left font-semibold text-gray-700 border-b-2 border-gray-200">Name</th>
              <th className="p-3 text-left font-semibold text-gray-700 border-b-2 border-gray-200">Role</th>
              <th className="p-3 text-left font-semibold text-gray-700 border-b-2 border-gray-200">Department</th>
              <th className="p-3 text-left font-semibold text-gray-700 border-b-2 border-gray-200">Date and Time</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="p-3 border-b border-gray-200">{user.username}</td>
                <td className="p-3 border-b border-gray-200">{user.name}</td>
                <td className="p-3 border-b border-gray-200">{user.role}</td>
                <td className="p-3 border-b border-gray-200">{user.department}</td>
                <td className="p-3 border-b border-gray-200">{new Date(user.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filteredUsers.length === 0 && (
        <p className="text-center mt-6 text-gray-600">No users found matching your search.</p>
      )}
    </div>
  );
};

export default UserLogsPage;