import { useState, useEffect } from "react";
import UserList from "./components/UserList";
import UserForm from "./components/UserForm";
import ErrorBoundary from "./components/ErrorBoundary";
import logger from "./utils/logger";

function App() {
  const [refreshUserList, setRefreshUserList] = useState(0);

  useEffect(() => {
    // Log application startup
    logger.info("Application started", {
      version: "1.0.0",
      environment: import.meta.env.MODE
    });

    // Log any uncaught errors
    const originalOnError = window.onerror;
    window.onerror = function (message, source, lineno, colno, error) {
      logger.error("Uncaught error", { message, source, lineno, colno, error });

      if (originalOnError) {
        return originalOnError(message, source, lineno, colno, error);
      }

      return false;
    };

    return () => {
      window.onerror = originalOnError;
    };
  }, []);

  const handleUserAdded = (newUser) => {
    logger.info("App component - New user added, refreshing list", {
      userId: newUser.id
    });

    // Trigger UserList refresh
    setRefreshUserList((prev) => prev + 1);
  };

  return (
    <div className="App">
      <header>
        <h1>User Management System</h1>
      </header>

      <main>
        <ErrorBoundary>
          <UserForm onUserAdded={handleUserAdded} />
        </ErrorBoundary>
        <hr />
        <ErrorBoundary>
          <UserList key={refreshUserList} />
        </ErrorBoundary>
      </main>

      <footer>
        <p>© 2023 User Management System</p>
      </footer>
    </div>
  );
}

export default App;
