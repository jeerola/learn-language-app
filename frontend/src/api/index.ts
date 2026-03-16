import type { Language, WordPair } from "../types";

export async function getLanguages() {
  const response = await fetch("/api/languages");
  const data = (await response.json()) as Language[];

  return data;
}

export async function getWordPairs() {
  const response = await fetch("/api/words");
  const data = (await response.json()) as WordPair[];

  return data;
}

export async function deleteWordPair(id: number) {
  await fetch(`/api/words/${id}`, {
    method: "DELETE",
  });
}

export async function createWordPair(
  word1: string,
  word2: string,
  language1_id: number,
  language2_id: number,
) {
  const response = await fetch(`/api/words/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      word1,
      word2,
      language1_id,
      language2_id,
    }),
  });

  const data = (await response.json()) as WordPair;

  return data;
}

export async function updateWordPair(id: number, word1: string, word2: string) {
  const response = await fetch(`/api/words/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      word1,
      word2
    }),
  });

  const data = (await response.json()) as WordPair;

  return data;
}