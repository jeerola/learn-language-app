/**
 * Represents a language.
 *
 * @prop id - Identification number of a language
 * @prop name - Language's name ex. (english)
 * @prop code - Language's identification code ex. (en)
 */
export type Language = {
  id: number;
  name: string;
  code: string;
};

/**
 * Represents a translation pair of words.
 *
 * @prop id - Identification number of a word pair
 * @prop word1 - First word of a pair
 * @prop language1 - First language of a pair
 * @prop word2 - Second word of a pair
 * @prop language2 - Second language of a pair
 */
export type WordPair = {
    id: number;
    word1: string;
    language1: string;
    word2: string;
    language2: string;
};
