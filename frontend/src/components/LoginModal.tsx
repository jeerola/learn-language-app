import { Dialog, Button, Input, Portal, Text } from "@chakra-ui/react";
import { useState } from "react";
import { logIn, logOut } from "@/api";
import { type User } from "../types";

interface Props {
  setUser: (user: User | null) => void;
  user: User | null;
}

export const LoginModal = ({ setUser, user }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleLogIn = async () => {
    try {
      const res = await logIn(username, password);
      setUser(res);
      setIsOpen(false);
      setErrorMessage("");
    } catch (err) {
      console.error("Error: ", err);
      setErrorMessage("Invalid credentials");
      return;
    }
  };

  const handleLogOut = async () => {
    try {
      await logOut();
      setUser(null);
    } catch (err) {
      console.error("Error: ", err);
      setErrorMessage("Logging out failed");
      return;
    }
  };

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(details) => setIsOpen(details.open)}
    >
      {user ? (
        <>
          <Button
            variant={"solid"}
            colorPalette={"orange"}
            onClick={() => handleLogOut()}
          >
            LOG OUT
          </Button>
          <Text>Hello, {user.username}!</Text>
        </>
      ) : (
        <Button
          variant={"solid"}
          colorPalette={"orange"}
          onClick={() => setIsOpen(true)}
        >
          LOG IN
        </Button>
      )}
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content color={"black"} bg={"#ffb7c3"}>
            <Dialog.Header justifyContent={"center"} fontWeight={"bold"}>
              Enter your credentials:
            </Dialog.Header>
            <Dialog.Body>
              <Input
                mb={2}
                bg={"whiteAlpha.300"}
                _placeholder={{ color: "blackAlpha.600" }}
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleLogIn();
                }}
              ></Input>
              <Input
                bg={"whiteAlpha.300"}
                placeholder="Password"
                _placeholder={{ color: "blackAlpha.600" }}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleLogIn();
                }}
              ></Input>
              {errorMessage && <Text color={"red"}>{errorMessage}</Text>}
            </Dialog.Body>
            <Dialog.Footer>
              <Button colorPalette={"green"} onClick={handleLogIn}>
                Login
              </Button>
              <Button colorPalette={"red"} onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger></Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
