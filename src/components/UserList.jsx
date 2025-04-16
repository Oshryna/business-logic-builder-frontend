import { useState, useEffect } from "react";
import axios from "axios";
import logger from "../utils/logger";

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUsers() {
      logger.info("UserList component - Fetching users");

      try {
        const response = await axios.get("http://localhost:3001/api/users", {
          headers: {
            "x-correlation-id": logger.correlationId
          }
        });

        logger.debug("UserList component - Users received", {
          count: response.data.length
        });

        setUsers(response.data);
        setLoading(false);
      } catch (err) {
        logger.error("UserList component - Failed to fetch users", err);
        setError("Failed to load users. Please try again later.");
        setLoading(false);
      }
    }

    fetchUsers();

    // Log component unmount
    return () => {
      logger.debug("UserList component - Unmounting");
    };
  }, []);

  const handleRetry = () => {
    logger.info("UserList component - User clicked retry button");
    setLoading(true);
    setError(null);
    fetchUsers();
  };

  if (loading) {
    return <div>Loading users...</div>;
  }

  if (error) {
    return (
      <div>
        <p>{error}</p>
        <button onClick={handleRetry}>Retry</button>
      </div>
    );
  }

  return (
    <div>
      <h2>User List</h2>
      {users.length === 0 ? (
        <p>No users found</p>
      ) : (
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              {user.name} ({user.email})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default UserList;
