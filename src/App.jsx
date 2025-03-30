import { useState } from "react";
import UserList from "./components/UserList";
import logger from "./utils/logger";

function App() {
  // Log application start
  useState(() => {
    logger.info("Application started");
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Business Logic Builder</h1>
      </header>
      <main>
        <UserList />
      </main>
    </div>
  );
}

export default App;
