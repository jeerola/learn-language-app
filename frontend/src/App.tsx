import { useState } from "react";
import "./App.css";

import { Button, Group } from "@chakra-ui/react";
import { ColorModeButton } from "./components/ui/color-mode";

import { AdminPage } from "./pages/adminView/AdminPage";
import { UserPage } from "./pages/userView/UserPage";

function App() {
  const [currentView, setCurrentView] = useState("admin");

  return (
    <div>
      <Group>
        <Button
          variant={"outline"}
          colorPalette={"green"}
          onClick={() => setCurrentView("admin")}
        >
          Admin View
        </Button>

        <Button
          variant={"outline"}
          colorPalette={"red"}
          onClick={() => setCurrentView("user")}
        >
          User View
        </Button>
        <ColorModeButton />
      </Group>

      {currentView === "admin" && <AdminPage />}
      {currentView === "user" && <UserPage />}
    </div>
  );
}

export default App;
