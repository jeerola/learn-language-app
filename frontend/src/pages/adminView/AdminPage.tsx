import { useState } from "react";
import { AdminLandingView } from "./AdminLandingView"
import { TagsView } from "./TagsView";
import { WordPairsView } from "./WordPairsView";

import { VStack, Button, HStack, Box } from "@chakra-ui/react";


export const AdminPage = () => {
  const [currentView, setCurrentView] = useState("home");

  return (
    <HStack>
      <Box left={0} top={0} position={"fixed"} bg={"blue"} w={"20%"} h={"40%"} p={"4"}>
        <VStack>
          <Button w={"100%"} onClick={() => setCurrentView("home")}>
            Home
          </Button>
          <Button w={"100%"} onClick={() => setCurrentView("words")}>
            Words
          </Button>
          <Button w={"100%"} onClick={() => setCurrentView("tags")}>
            Tags
          </Button>
        </VStack>
      </Box>
      <Box marginLeft={"20%"} bg={"green"} w={"80%"} p={"4"}>
        {currentView === "home" && <AdminLandingView />}
        {currentView === "words" && <WordPairsView />}
        {currentView === "tags" && <TagsView />}
      </Box>
    </HStack>
  );
};
