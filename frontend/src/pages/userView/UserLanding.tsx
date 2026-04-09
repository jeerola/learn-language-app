import { useState, useEffect } from "react";
import { VStack, Card, Heading } from "@chakra-ui/react";
import { getTags } from "../../api";
import { type Tag } from "@/types";

interface Props {
  onTagSelect: (tag: Tag | null) => void;
}

export const UserLanding = ({ onTagSelect }: Props) => {
  const [tags, setTags] = useState<Tag[]>([]);
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
      {tags.map((tag) => (
        <Card.Root key={tag.id} onClick={() => onTagSelect(tag)}>
          <Card.Body textAlign={"center"}>{tag.name}</Card.Body>
        </Card.Root>
      ))}
    </VStack>
  );
};
