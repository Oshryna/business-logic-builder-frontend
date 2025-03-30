import { useState, useEffect } from "react";
import axios from "axios";
import logger from "../utils/logger";

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        logger.info("Fetching users from API");
        const response = await axios.get("http://localhost:3001/api/users");
        setUsers(response.data);
        logger.info("Users fetched successfully", {
          count: response.data.length
        });
      } catch (err) {
        logger.error("Failed to fetch users", err);
        setError("Failed to load users. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>User List</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} ({user.email})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;
