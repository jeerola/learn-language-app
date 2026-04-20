import { useState, useEffect } from "react";
import { createTag, deleteTag, getTags } from "@/api";
import { type Tag } from "@/types";
import { VStack, Table, Input, Group, Button } from "@chakra-ui/react";

export const TagsView = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [tagName, setTagName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const tagData = await getTags();
      setTags(tagData);
    };
    fetchData();
  }, []);

  const handleTagCreate = async () => {
    if (tagName.trim() === "") {
      alert("Tag name can not be empty!");
      return;
    } else {
      const newTag = await createTag(tagName);
      setTags((current) => [...current, newTag]);
      setTagName("");
    }
  };

  const handleDelete = async (id: number) => {
    await deleteTag(id);
    setTags((current) => current.filter((wp) => wp.id !== id));
  };

  return (
    <VStack>
      <Group attached>
        <Input
          placeholder="Animals"
          type="text"
          value={tagName}
          onChange={(e) => setTagName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleTagCreate();
          }}
        />

        <Button
          onClick={() => handleTagCreate()}
          variant={"solid"}
          colorPalette={"green"}
        >
          Add group
        </Button>
      </Group>

      <Table.Root borderRadius="md" overflow="hidden">
        <Table.Header>
          <Table.Row bg={"whiteAlpha.100"}>
            <Table.ColumnHeader>Tag ID</Table.ColumnHeader>
            <Table.ColumnHeader>Tag Name</Table.ColumnHeader>
            <Table.ColumnHeader>Actions</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {tags.map((tag) => (
            <Table.Row bg={"whiteAlpha.100"} key={tag.id}>
              <Table.Cell>{tag.id}</Table.Cell>
              <Table.Cell>{tag.name}</Table.Cell>
              <Table.Cell>
                <Button
                  variant={"solid"}
                  colorPalette={"red"}
                  onClick={() => handleDelete(tag.id)}
                >
                  DELETE
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </VStack>
  );
};
