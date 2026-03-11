import { useEffect, useState } from "react";

import { deleteWordPair, getWordPairs } from "../api";
import type { WordPair } from "../types";

export const AdminPage = () => {
  const [wordPairs, setWordPairs] = useState<WordPair[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getWordPairs();
      setWordPairs(data);
    };
    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    await deleteWordPair(id);
    setWordPairs(current => current.filter(wp => wp.id !== id));
  }
  return (
    <div>
      <h1>Admin Page</h1>

      <ul>
        {wordPairs.map((wordPair) => (
          <li key={wordPair.id}>
            {wordPair.word1} - {wordPair.word2} <button onClick={() => handleDelete(wordPair.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};
