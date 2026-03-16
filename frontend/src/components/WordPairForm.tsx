import { useState } from "react";
import type { Language, WordPair } from "../types";
import { createWordPair } from "../api";

interface Props {
  languages: Language[];
  defaultLanguageId: number;
  onWordPairCreated: (wordPair: WordPair) => void;
}

export function WordPairForm({ languages, defaultLanguageId, onWordPairCreated }: Props) {
  const [word1, setWord1] = useState("");
  const [word2, setWord2] = useState("");
  const [languageId1, setLanguageId1] = useState(defaultLanguageId);
  const [languageId2, setLanguageId2] = useState(defaultLanguageId);

  const handleSubmit = async () => {
    const newWordPair = await createWordPair(
      word1,
      word2,
      languageId1,
      languageId2,
    );
    onWordPairCreated(newWordPair);
  };

  return (
    <div>
      <form action="">
        <input
          type="text"
          value={word1}
          onChange={(e) => setWord1(e.target.value)}
        />
        <input
          type="text"
          value={word2}
          onChange={(e) => setWord2(e.target.value)}
        />
        <fieldset>
          <select
            value={languageId1}
            onChange={(e) => setLanguageId1(parseInt(e.target.value))}
          >
            {languages.map((language) => (
              <option key={language.id} value={language.id}>
                {language.name}
              </option>
            ))}
          </select>
          <select
            value={languageId2}
            onChange={(e) => setLanguageId2(parseInt(e.target.value))}
          >
            {languages.map((language) => (
              <option key={language.id} value={language.id}>
                {language.name}
              </option>
            ))}
          </select>
        </fieldset>
      </form>
      <button onClick={() => handleSubmit()}>Add word pair</button>
    </div>
  );
}
