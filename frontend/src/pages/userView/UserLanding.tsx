import { useState, useEffect } from "react";
import { SimpleGrid, Card, Heading, Button, VStack } from "@chakra-ui/react";
import { getTags } from "../../api";
import { type Tag, type WordPair } from "@/types";

interface Props {
  onTagSelect: (tag: Tag | null, direction: "normal" | "reversed") => void;
  wordPairs: WordPair[];
}

export const UserLanding = ({ onTagSelect, wordPairs }: Props) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [direction, setDirection] = useState<"normal" | "reversed">("normal");
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
      <Button
        colorPalette={"yellow"}
        onClick={() =>
          setDirection(direction === "normal" ? "reversed" : "normal")
        }
      >
        {direction === "normal" ? "Finnish → English" : "English → Finnish"}
      </Button>

      <Heading> Tags </Heading>
      <SimpleGrid columns={3} gap={4}>
        <Card.Root
          cursor={"pointer"}
          bg={"#ffb7c3"}
          color={"#1a1a1a"}
          onClick={() => onTagSelect(null, direction)}
        >
          <Card.Body textAlign={"center"}> All words</Card.Body>
        </Card.Root>
        {tagsWithWords.map((tag) => (
          <Card.Root
            bg={"#ffb7c3"}
            color={"#1a1a1a"}
            key={tag.id}
            cursor={"pointer"}
            onClick={() => onTagSelect(tag, direction)}
          >
            <Card.Body textAlign={"center"}>{tag.name}</Card.Body>
          </Card.Root>
        ))}
      </SimpleGrid>
    </VStack>
  );
};
