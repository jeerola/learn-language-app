import { useState } from "react";
import type { Language, WordPair, Tag } from "../types";
import {
  assignTagToWordPair,
  createWordPair,
  updateWordPair,
  updateTag,
} from "../api";
import {
  Button,
  HStack,
  Input,
  NativeSelect,
  VStack,
  Text,
} from "@chakra-ui/react";

interface Props {
  editingPair: WordPair | null;
  languages: Language[];
  tags: Tag[];
  onWordPairCreated: (wordPair: WordPair) => void;
  onWordPairUpdated: (wordPair: WordPair) => void;
}

export function WordPairForm({
  languages,
  editingPair,
  tags,
  onWordPairCreated,
  onWordPairUpdated,
}: Props) {
  const [word1, setWord1] = useState(editingPair ? editingPair.word1 : "");
  const [word2, setWord2] = useState(editingPair ? editingPair.word2 : "");
  const [languageId1, setLanguageId1] = useState(languages[0].id);
  const [languageId2, setLanguageId2] = useState(languages[1].id);
  const [tagId, setTagId] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleSubmit = async () => {
    if (word1.trim() === "" || word2.trim() === "") {
      setErrorMessage("Word can not be empty");
      return;
    }

    if (languageId1 === languageId2) {
      setErrorMessage("You cannot have same languages as a pair");
      return;
    }

    if (editingPair != null) {
      await updateTag(editingPair.id, tagId);
      const updatedPair = await updateWordPair(editingPair.id, word1, word2);
      onWordPairUpdated(updatedPair);
    } else {
      const newWordPair = await createWordPair(
        word1,
        word2,
        languageId1,
        languageId2,
      );

      if (tagId > 0) {
        await assignTagToWordPair(newWordPair.id, tagId);
        const tagToFind = tags.find((item) => item.id === tagId);

        onWordPairCreated({
          ...newWordPair,
          tags: tagToFind ? [tagToFind] : [],
        });
      } else {
        onWordPairCreated({
          ...newWordPair,
          tags: [],
        });
      }
    }
    setErrorMessage("");
  };

  return (
    <VStack>
      <form action="">
        <HStack>
          <Input
            placeholder="Word 1"
            type="text"
            value={word1}
            onChange={(e) => setWord1(e.target.value)}
          />

          <NativeSelect.Root>
            <NativeSelect.Field
              value={languageId1}
              onChange={(e) => setLanguageId1(parseInt(e.target.value))}
            >
              {languages.map((language) => (
                <option key={language.id} value={language.id}>
                  {language.name}
                </option>
              ))}
            </NativeSelect.Field>
          </NativeSelect.Root>

          <Input
            placeholder="Word 2"
            type="text"
            value={word2}
            onChange={(e) => setWord2(e.target.value)}
          />

          <NativeSelect.Root>
            <NativeSelect.Field
              value={languageId2}
              onChange={(e) => setLanguageId2(parseInt(e.target.value))}
            >
              {languages.map((language) => (
                <option key={language.id} value={language.id}>
                  {language.name}
                </option>
              ))}
            </NativeSelect.Field>
          </NativeSelect.Root>

          <NativeSelect.Root>
            <NativeSelect.Field
              value={tagId}
              onChange={(e) => setTagId(parseInt(e.target.value))}
            >
              <option value={0}>None</option>
              {tags.map((tag) => (
                <option key={tag.id} value={tag.id}>
                  {tag.name}
                </option>
              ))}
            </NativeSelect.Field>
          </NativeSelect.Root>
        </HStack>
      </form>

      <Button
        variant={"outline"}
        colorPalette={editingPair ? "blue" : "green"}
        onClick={() => handleSubmit()}
      >
        {editingPair ? "Edit word pair" : "Add word pair"}
      </Button>
      {errorMessage && <Text color={"red"}>{errorMessage}</Text>}
    </VStack>
  );
}
