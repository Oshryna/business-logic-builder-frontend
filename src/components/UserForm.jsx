import { useState } from "react";
import axios from "axios";
import logger from "../utils/logger";

function UserForm({ onUserAdded }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    logger.info("UserForm component - Form submitted", { name, email });

    // Validate input
    if (!name.trim() || !email.trim()) {
      const missingFields = [];
      if (!name.trim()) missingFields.push("name");
      if (!email.trim()) missingFields.push("email");

      logger.warn("UserForm component - Validation failed", { missingFields });
      setError("Please fill in all fields");
      return;
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      logger.warn("UserForm component - Invalid email format", { email });
      setError("Please enter a valid email address");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      logger.debug("UserForm component - Sending user data to server", {
        name,
        email
      });

      const response = await axios.post(
        "http://localhost:3001/api/users",
        {
          name,
          email
        },
        {
          headers: {
            "x-correlation-id": logger.correlationId
          }
        }
      );

      logger.info("UserForm component - User created successfully", {
        userId: response.data.id
      });

      // Reset form
      setName("");
      setEmail("");

      // Notify parent component
      if (onUserAdded) {
        onUserAdded(response.data);
      }
    } catch (err) {
      logger.error("UserForm component - Failed to create user", err);
      setError("Failed to create user. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h2>Add New User</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={submitting}
          />
        </div>

        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={submitting}
          />
        </div>

        <button type="submit" disabled={submitting}>
          {submitting ? "Adding..." : "Add User"}
        </button>
      </form>
    </div>
  );
}

export default UserForm;
