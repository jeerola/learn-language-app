import { useState, useEffect } from "react";
import { VStack, Card, Heading } from "@chakra-ui/react";
import { getTags } from "../../api";
import { type Tag, type WordPair } from "@/types";

interface Props {
  onTagSelect: (tag: Tag | null) => void;
  wordPairs: WordPair[];
}

export const UserLanding = ({ onTagSelect, wordPairs }: Props) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const tagsWithWords = tags.filter((tag) => {
    for (const wordPair of wordPairs) {
      for (const t of wordPair.tags) {
        if (t.id === tag.id) return true;
      }
    }
    return false;
  });

  useEffect(() => {
    const fetchData = async () => {
      const tagData = await getTags();
      setTags(tagData);
    };
    fetchData();
  }, []);

  return (
    <VStack>
      <Heading> Tags </Heading>
      <Card.Root onClick={() => onTagSelect(null)}>
        <Card.Body textAlign={"center"}> All words</Card.Body>
      </Card.Root>
      {tagsWithWords.map((tag) => (
        <Card.Root key={tag.id} onClick={() => onTagSelect(tag)}>
          <Card.Body textAlign={"center"}>{tag.name}</Card.Body>
        </Card.Root>
      ))}
    </VStack>
  );
};
