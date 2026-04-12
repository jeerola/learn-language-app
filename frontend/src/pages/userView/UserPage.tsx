import { useState, useEffect } from "react";
import {
  Card,
  Heading,
  Input,
  Group,
  Button,
  VStack,
  Text,
  Dialog,
  Portal,
} from "@chakra-ui/react";
import { type WordPair, type Tag } from "../../types";
import { getWordPairs } from "../../api";
import { UserLanding } from "./UserLanding";

export const UserPage = () => {
  const [wordPairs, setWordPairs] = useState<WordPair[]>([]);
  const [score, setScore] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [currentWordPair, setCurrentWordPair] = useState(0);
  const [previousAnswerCorrect, setPreviousAnswerCorrect] = useState<
    boolean | null
  >(null);
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const [view, setView] = useState<"landing" | "practice">("landing");
  const [wrongAnswers, setWrongAnswers] = useState<WordPair[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const handleTagSelect = (tag: Tag | null) => {
    setSelectedTag(tag);
    setView("practice");
  };

  const handleRestart = () => {
    setScore(0);
    setUserInput("");
    setCurrentWordPair(0);
    setPreviousAnswerCorrect(null);
    setWrongAnswers([]);
    setIsOpen(false);
  };

  const handleBack = () => {
    setUserInput("");
    setScore(0);
    setCurrentWordPair(0);
    setSelectedTag(null);
    setWrongAnswers([]);
    setIsOpen(false);
    setPreviousAnswerCorrect(null);
    setView("landing");
  };

  const handleSubmit = () => {
    const isCorrect =
      userInput.toLowerCase() ===
      wordPairs[currentWordPair].word2.toLowerCase();

    const finalScore = isCorrect ? score + 1 : score;

    if (isCorrect) {
      setScore(finalScore);
    } else {
      setWrongAnswers([...wrongAnswers, wordPairs[currentWordPair]]);
    }

    if (currentWordPair < wordPairs.length - 1) {
      setCurrentWordPair((current) => current + 1);
    } else {
      setIsOpen(true);
    }
    setUserInput("");
    setPreviousAnswerCorrect(isCorrect);
  };

  useEffect(() => {
    const fetchData = async () => {
      const wordPairData = await getWordPairs();
      wordPairData.sort(() => Math.random() - 0.5); // randomize word pairs order

      if (selectedTag === null) {
        setWordPairs(wordPairData);
      } else {
        const filteredWords = [];
        for (const wordPair of wordPairData) {
          for (const tag of wordPair.tags) {
            if (tag.id === selectedTag.id) {
              filteredWords.push(wordPair);
            }
          }
        }
        setWordPairs(filteredWords);
      }
    };
    fetchData();
  }, [selectedTag]);

  return (
    <>
      {view === "landing" && <UserLanding onTagSelect={handleTagSelect} wordPairs={wordPairs} />}
      {view === "practice" && (
        <VStack mx={"auto"} gap={"4"}>
          <Heading size={"3xl"}>Practice!</Heading>
          <Card.Root w={"sm"} maxW={"sm"} mx={"auto"}>
            <Card.Header textAlign="center">
              Word: {currentWordPair + 1} / {wordPairs.length}
              <br />
              Correct: {score} / {wordPairs.length}
            </Card.Header>
            <Card.Body textAlign="center">
              {wordPairs.length > 0 && (
                <p>{wordPairs[currentWordPair]?.word1}</p>
              )}
            </Card.Body>
          </Card.Root>

          <Group w={"sm"}>
            <Input
              variant={"outline"}
              type="text"
              value={userInput}
              disabled={isOpen}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit();
              }}
            />
            <Button
              variant={"outline"}
              colorPalette={"yellow"}
              disabled={isOpen}
              onClick={() => handleSubmit()}
            >
              Submit
            </Button>
          </Group>
          {previousAnswerCorrect === null ? null : (
            <Text color={previousAnswerCorrect ? "green" : "red"}>
              {previousAnswerCorrect ? "✅ Correct!" : " ❌ Wrong!"}
            </Text>
          )}
          <Button
            variant={"outline"}
            colorPalette={"yellow"}
            onClick={() => handleBack()}
          >
            Back
          </Button>
        </VStack>
      )}
      <Dialog.Root
        open={isOpen}
        onOpenChange={(details) => setIsOpen(details.open)}
        closeOnInteractOutside={false}
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>Game over!</Dialog.Header>
              <Dialog.Body>
                <VStack align={"start"}>
                  <Text fontWeight={"bold"} fontSize={"xl"}>
                    Score: {score} / {wordPairs.length} (
                    {Math.round((score * 100) / wordPairs.length)}%)
                  </Text>
                  {wrongAnswers.length > 0 && (
                    <>
                      <Text fontWeight={"bold"}>Wrong answers:</Text>
                      {wrongAnswers.map((wordpair) => (
                        <Text key={wordpair.id}>
                          {wordpair.word1} → {wordpair.word2}
                        </Text>
                      ))}
                    </>
                  )}
                </VStack>
              </Dialog.Body>
              <Dialog.Footer>
                <Button
                  variant="outline"
                  colorPalette={"green"}
                  onClick={() => handleRestart()}
                >
                  Play again
                </Button>
                <Button
                  variant="outline"
                  colorPalette={"purple"}
                  onClick={() => handleBack()}
                >
                  {" "}
                  Menu{" "}
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
};
