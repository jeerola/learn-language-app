import { useState } from "react";
import "./App.css";

import { AdminPage } from "./pages/AdminPage";
import { UserPage } from "./pages/UserPage";

function App() {
  const [currentView, setCurrentView] = useState("admin");

  return (
    <div>
      <button onClick={() => setCurrentView("admin")}>Admin View</button>

      <button onClick={() => setCurrentView("user")}>User View</button>
      {currentView === "admin" && <AdminPage />}
      {currentView === "user" && <UserPage />}
    </div>
  );
}

export default App;
