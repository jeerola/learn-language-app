import { useState } from "react";
import "./App.css";

import { Button, Group, Box } from "@chakra-ui/react";

import { AdminPage } from "./pages/adminView/AdminPage";
import { UserPage } from "./pages/userView/UserPage";
import { LoginModal } from "./components/LoginModal";

import {type User} from "@/types";

function App() {
  const [currentView, setCurrentView] = useState("user");
  const [user, setUser] = useState<User | null>(null);

  return (
    <div>
      <Box position={"fixed"} w={"100%"} h={"48px"}>
        <Group>
          <Button
            variant={"solid"}
            colorPalette={"green"}
            onClick={() => setCurrentView("admin")}
            disabled={user?.role !== "admin"}
          >
            Admin View
          </Button>

          <Button
            variant={"solid"}
            colorPalette={"red"}
            onClick={() => setCurrentView("user")}
          >
            User View
          </Button>
          <LoginModal setUser={setUser} user={user} />
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
