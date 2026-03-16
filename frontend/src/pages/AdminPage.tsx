import { useEffect, useState } from "react";

import { deleteWordPair, getLanguages, getWordPairs } from "../api";
import { type Language, type WordPair } from "../types";
import { WordPairForm } from "../components/WordPairForm";

export const AdminPage = () => {
  const [wordPairs, setWordPairs] = useState<WordPair[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [editingPair, setEditingPair] = useState<WordPair | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const wordPairData = await getWordPairs();
      const languagesData = await getLanguages();

      setWordPairs(wordPairData);
      setLanguages(languagesData);
    };
    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    await deleteWordPair(id);
    setWordPairs((current) => current.filter((wp) => wp.id !== id));
  };

  const handleWordPairCreated = (newPair: WordPair) => {
    setWordPairs((current) => [...current, newPair]);
  };

  const handleWordPairUpdated = (updatedWordPair: WordPair) => {
    setWordPairs((current) =>
      current.map((wp) => (wp.id === updatedWordPair.id ? updatedWordPair : wp)),
    );
    setEditingPair(null);
  }

  return (
    <div>
      <h1>Admin Page</h1>
      {languages.length > 0 && (
        <WordPairForm
          editingPair={editingPair}
          languages={languages}
          defaultLanguageId={languages[0].id}
          onWordPairCreated={handleWordPairCreated}
          onWordPairUpdated={handleWordPairUpdated}
        />
      )}

      <ul>
        {wordPairs.map((wordPair) => (
          <li key={wordPair.id}>
            {wordPair.word1} - {wordPair.word2}
            <button onClick={() => setEditingPair(wordPair)}>EDIT</button>
            <button onClick={() => handleDelete(wordPair.id)}>DELETE</button>
          </li>
        ))}
      </ul>
    </div>
  );
};
