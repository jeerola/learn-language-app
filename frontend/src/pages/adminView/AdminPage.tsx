import { useState } from "react";
import { AdminLandingView } from "./AdminLandingView"
import { TagsView } from "./TagsView";
import { WordPairsView } from "./WordPairsView";

import { VStack, Button, HStack, Box } from "@chakra-ui/react";


export const AdminPage = () => {
  const [currentView, setCurrentView] = useState("home");

  return (
    <HStack>
      <Box left={0} top={"48px"} position={"fixed"} w={"120px"} p={"4"}>
        <VStack>
          <Button
            variant={"outline"}
            colorPalette={"blue"}
            w={"100%"}
            onClick={() => setCurrentView("home")}
          >
            Home
          </Button>
          <Button
            variant={"outline"}
            colorPalette={"blue"}
            w={"100%"}
            onClick={() => setCurrentView("words")}
          >
            Words
          </Button>
          <Button
            variant={"outline"}
            colorPalette={"blue"}
            w={"100%"}
            onClick={() => setCurrentView("tags")}
          >
            Tags
          </Button>
        </VStack>
      </Box>
      <Box marginLeft={"120px"} w={"calc(100% - 120px)"} p={"4"}>
        {currentView === "home" && <AdminLandingView />}
        {currentView === "words" && <WordPairsView />}
        {currentView === "tags" && <TagsView />}
      </Box>
    </HStack>
  );
};
