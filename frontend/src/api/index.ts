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
