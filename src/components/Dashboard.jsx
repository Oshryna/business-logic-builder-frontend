import { useState } from "react";
import useLogger from "../hooks/useLogger";

function Dashboard({ username }) {
  const logger = useLogger("Dashboard", { username });
  const [clicked, setClicked] = useState(0);

  const handleButtonClick = () => {
    logger.info("Dashboard button clicked", { clickCount: clicked + 1 });
    setClicked((prev) => prev + 1);
  };

  return (
    <div>
      <h2>Welcome, {username}!</h2>
      <p>Button clicked {clicked} times</p>
      <button onClick={handleButtonClick}>Click me</button>
    </div>
  );
}

export default Dashboard;
