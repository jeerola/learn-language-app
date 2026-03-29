import { useState, useEffect } from "react";
import {
  Card,
  Heading,
  Input,
  Group,
  Button,
  VStack,
  Text,
} from "@chakra-ui/react";

import { type WordPair } from "../../types";
import { getWordPairs } from "../../api";

export const UserPage = () => {
  const [wordPairs, setWordPairs] = useState<WordPair[]>([]);
  const [score, setScore] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [currentWordPair, setCurrentWordPair] = useState(0);
  const [previousAnswerCorrect, setPreviousAnswerCorrect] = useState<
    boolean | null
  >(null);

  const handleSubmit = () => {
    const isCorrect =
      userInput.toLowerCase() ===
      wordPairs[currentWordPair].word2.toLowerCase();

    const finalScore = isCorrect ? score + 1 : score;

    if (isCorrect) {
      setScore(finalScore);
    }

    if (currentWordPair < wordPairs.length - 1) {
      setCurrentWordPair((current) => current + 1);
    } else {
      alert(`You scored ${finalScore} out of ${wordPairs.length} points!`);
    }
    setUserInput("");
    setPreviousAnswerCorrect(isCorrect);
  };

  useEffect(() => {
    const fetchData = async () => {
      const wordPairData = await getWordPairs();
      wordPairData.sort(() => Math.random() - 0.5); // randomize word pairs order
      setWordPairs(wordPairData);
    };
    fetchData();
  }, []);

  return (
    <VStack mx={"auto"} gap={"4"}>
      <Heading size={"3xl"}>Practice!</Heading>
      <Card.Root w={"sm"} maxW={"sm"} mx={"auto"}>
        <Card.Header textAlign="center">
          Word: {currentWordPair + 1} / {wordPairs.length}
          <br />
          Correct: {score} / {wordPairs.length}
        </Card.Header>
        <Card.Body textAlign="center">
          {wordPairs.length > 0 && <p>{wordPairs[currentWordPair]?.word1}</p>}
        </Card.Body>
      </Card.Root>

      <Group w={"sm"}>
        <Input
          variant={"outline"}
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmit();
          }}
        />
        <Button
          variant={"outline"}
          colorPalette={"yellow"}
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
    </VStack>
  );
};
