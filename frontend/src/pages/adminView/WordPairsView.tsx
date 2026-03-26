import { useEffect, useState } from "react";

import { deleteWordPair, getLanguages, getTags, getWordPairs } from "../../api";
import { type Language, type Tag, type WordPair } from "../../types";
import { WordPairForm } from "../../components/WordPairForm";
import { VStack, Heading, Table, Button, Stack } from "@chakra-ui/react";

export const WordPairsView = () => {
  const [wordPairs, setWordPairs] = useState<WordPair[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [editingPair, setEditingPair] = useState<WordPair | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const wordPairData = await getWordPairs();
      const languagesData = await getLanguages();
      const tagsData = await getTags();

      setWordPairs(wordPairData);
      setLanguages(languagesData);
      setTags(tagsData);
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
      current.map((wp) =>
        wp.id === updatedWordPair.id ? updatedWordPair : wp,
      ),
    );
    setEditingPair(null);
  };

  return (
    <VStack>
      <Heading size={"3xl"}>Admin Page</Heading>
      {languages.length > 0 && (
        <WordPairForm
          editingPair={editingPair}
          languages={languages}
          tags={tags}
          onWordPairCreated={handleWordPairCreated}
          onWordPairUpdated={handleWordPairUpdated}
        />
      )}
      <Stack maxH={"calc(100vh - 300px)"} overflowY={"auto"}>
        <Heading>Word pairs</Heading>
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>Word 1</Table.ColumnHeader>
              <Table.ColumnHeader>Language 1</Table.ColumnHeader>
              <Table.ColumnHeader>Word 2</Table.ColumnHeader>
              <Table.ColumnHeader>Language 2</Table.ColumnHeader>
              <Table.ColumnHeader>Tags</Table.ColumnHeader>
              <Table.ColumnHeader>Actions</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {wordPairs.map((wordPair) => (
              <Table.Row key={wordPair.id}>
                <Table.Cell>{wordPair.word1}</Table.Cell>
                <Table.Cell>{wordPair.language1}</Table.Cell>
                <Table.Cell>{wordPair.word2}</Table.Cell>
                <Table.Cell>{wordPair.language2}</Table.Cell>
                <Table.Cell>
                  {wordPair.tags.map((tag) => (
                    <span key={tag.id}>{tag.name} </span>
                  ))}
                </Table.Cell>
                <Table.Cell>
                  <Button
                    variant={"outline"}
                    colorPalette={"yellow"}
                    onClick={() => setEditingPair(wordPair)}
                  >
                    EDIT
                  </Button>
                  <Button
                    variant={"outline"}
                    colorPalette={"red"}
                    onClick={() => handleDelete(wordPair.id)}
                  >
                    DELETE
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Stack>
    </VStack>
  );
};
