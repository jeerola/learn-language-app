import { useState, useEffect } from "react";

import { type WordPair } from "../types";
import { getWordPairs } from "../api";

export const UserPage = () => {
  const [wordPairs, setWordPairs] = useState<WordPair[]>([]);
  const [score, setScore] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [currentWordPair, setCurrentWordPair] = useState(0);

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
  };

  useEffect(() => {
    const fetchData = async () => {
      const wordPairData = await getWordPairs();

      setWordPairs(wordPairData);
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1>User Page</h1>

      {wordPairs.length > 0 && <p>{wordPairs[currentWordPair]?.word1}</p>}
      <input
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSubmit()
        }}
      />
      <button onClick={() => handleSubmit()}>SUBMIT</button>
    </div>
  );
};
