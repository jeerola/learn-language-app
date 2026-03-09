import { useState } from "react";
import "./App.css";

import { getLanguages, getWordPairs } from "./api";
import type { Language, WordPair } from "./types";

function App() {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [wordPairs, setWordPairs] = useState<WordPair[]>([]);

  return (
    <div>
      <button
        onClick={async () => {
          const data = await getLanguages();
          setLanguages(data);
          console.log(data);
        }}
      >
        Fetch Languages
      </button>
      <ul>
        {languages.map((language) => (
          <li key={language.id}>{language.name}</li>
        ))}
      </ul>

      <button
        onClick={async () => {
          const data = await getWordPairs();
          setWordPairs(data);
          console.log(data);
        }}
      >
        Fetch Word Pairs
      </button>
      <ul>
        {wordPairs.map((wordPair) => (
          <li key={wordPair.id}>
            {wordPair.word1} - {wordPair.word2}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
