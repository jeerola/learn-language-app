-- Drop tables everytime when db:init is ran
DROP TABLE IF EXISTS word_pair_tag;
DROP TABLE IF EXISTS word_pairs;
DROP TABLE IF EXISTS words;
DROP TABLE IF EXISTS tags;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS languages;

-- Table for supported languages.
-- New languages can be added without affecting existing data.
CREATE TABLE IF NOT EXISTS languages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

-- Individual words linked to specific languages.
CREATE TABLE IF NOT EXISTS words (
    id SERIAL PRIMARY KEY,
    word VARCHAR(100) NOT NULL,
    language_id INTEGER REFERENCES languages(id) ON DELETE CASCADE
);

-- Links two words together as a pair (e.g. "cat" in English and "kissa" in Finnish).
CREATE TABLE IF NOT EXISTS word_pairs (
    id SERIAL PRIMARY KEY,
    word_id_1 INTEGER REFERENCES words(id) ON DELETE CASCADE,
    word_id_2 INTEGER REFERENCES words(id) ON DELETE CASCADE
);

-- Categories for grouping word pairs (e.g. animals, foods, colours).
CREATE TABLE IF NOT EXISTS tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

-- App users with authentication and role-based access control.
-- Admin can manage content, user can only watch and practice, but not modify content.
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('admin', 'user')) NOT NULL
);

-- Junction table for linking many-to-many relationships between word pairs and tags.
CREATE TABLE IF NOT EXISTS word_pair_tag (
    word_pair_id INTEGER REFERENCES word_pairs(id) ON DELETE CASCADE,
    tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (word_pair_id, tag_id)
);
