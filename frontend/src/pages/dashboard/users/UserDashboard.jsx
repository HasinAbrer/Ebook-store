import React, { useEffect, useState } from 'react';
import axios from '../../../utils/axiosInstance'; // ✅ Import custom Axios instance

const UserDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/details'); // 🔁 Endpoint like /api/users
        setUsers(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load users.');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <p className="text-center">Loading users...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="bg-gray-100 py-10">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Available Books</h1>

        {books.length > 0 ? (
          <ul className="space-y-4">
            {users.map((user) => (
              <li
                key={book._id}
                className="bg-gray-50 p-4 rounded-lg border shadow-sm"
              >
                <p className="text-lg font-semibold">{user.email}</p>
                <p className="text-gray-600">Author: {user.username}</p>
                <p className="text-gray-600">Role: {user.role}</p>
                {user.description && (
                  <p className="text-sm text-gray-500 mt-1">{user.description}</p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No books found.</p>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
