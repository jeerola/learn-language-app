import { useState } from "react";
import "./App.css";

import { Button, Group, Box } from "@chakra-ui/react";
import { ColorModeButton } from "./components/ui/color-mode";

import { AdminPage } from "./pages/adminView/AdminPage";
import { UserPage } from "./pages/userView/UserPage";

function App() {
  const [currentView, setCurrentView] = useState("admin");

  return (
    <div>
      <Box position={"fixed"} w={"100%"} h={"48px"}>
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
      </Box>
      <Box paddingTop={"48px"}>
        {currentView === "admin" && <AdminPage />}
        {currentView === "user" && <UserPage />}
      </Box>
    </div>
  );
}

export default App;
