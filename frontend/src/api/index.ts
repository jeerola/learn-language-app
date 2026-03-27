import type { Language, WordPair, Tag } from "../types";

/**
 * Fetches all languages
 *
 * @returns {Language[]} Array of all available languages.
 */
export async function getLanguages() {
  const response = await fetch("/api/languages");
  const data = (await response.json()) as Language[];

  return data;
}

/**
 * Fetches all word pairs
 *
 * @returns {WordPair[]} Array of all available word pairs.
 */
export async function getWordPairs() {
  const response = await fetch("/api/words");
  const data = (await response.json()) as WordPair[];

  return data;
}

/**
 * Deletes a word pair.
 *
 * @param id - Identification number of a deleted word pair
 * @returns {void}
 */
export async function deleteWordPair(id: number) {
  await fetch(`/api/words/${id}`, {
    method: "DELETE",
  });
}

/**
 * Creates a word pair from user input
 *
 * @param word1 - First word of a word pair
 * @param word2 - Second word of a word pair
 * @param language1_id - First languages identification number of a word pair
 * @param language2_id - Second languages identification number of a word pair
 * @returns {WordPair} - Created word pair object
 */
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

/**
 * Updates existing word pair
 *
 * @param id - Identification number of a word pair that is updated
 * @param word1 - First word of a word pair
 * @param word2 - Second word of a word pair
 * @returns {WordPair} - Updated word pair object
 */
export async function updateWordPair(id: number, word1: string, word2: string) {
  const response = await fetch(`/api/words/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      word1,
      word2,
    }),
  });

  const data = (await response.json()) as WordPair;

  return data;
}

/**
 * Fetches all tags created
 *
 * @returns {Tag[]} - Array with all tags found
 */
export async function getTags() {
  const response = await fetch("/api/tags");
  const data = (await response.json()) as Tag[];

  return data;
}

/**
 * Creates a new tag in database.
 *
 * @param tagName - Name of a new tag created
 * @returns {Promise<Tag>} Created tag object
 */
export async function createTag(name: string) {
  const response = await fetch(`/api/tags/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
    }),
  });

  const data = (await response.json()) as Tag;

  return data;
}

/**
 * Deletes a tag
 *
 * @param id - Identification number of a deleted tag
 * @returns {void}
 */
export async function deleteTag(id: number) {
  await fetch(`/api/tags/${id}`, {
    method: "DELETE",
  });
}

/**
 * Assigns a tag to a word pair.
 *
 * @param wordPairId - Identification number of a word pair
 * @param tagId - Identification number of a tag
 */
export async function assignTagToWordPair(wordPairId: number, tagId: number) {
  await fetch(`/api/words/${wordPairId}/tags`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tagId }),
  });
}

/**
 * Updates a tag in a word pair.
 *
 * @param wordPairId - Identification number of a word pair
 * @param tagId - Identification number of a tag
 */
export async function updateTag(wordPairId: number, tagId: number) {
  await fetch(`/api/words/${wordPairId}/tags`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      tagId,
    }),
  });
}

/**
 * Sends a login request with user provided name and password.
 *
 * @param username - Username to login with
 * @param password - Password to login with
 * @param return - User identification number, username and role in JSON format.
 */
export async function logIn(username: string, password: string) {
  const response = await fetch(`/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    throw new Error("Invalid credentials");
  }
}

/**
 * Sends a simple log out request to api
 */
export async function logOut() {
  await fetch(`/api/auth/logout`, {
    method: "POST"
  });
}
