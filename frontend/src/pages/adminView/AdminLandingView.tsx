import { getLanguages, getTags, getWordPairs } from "@/api";
import type { Language, WordPair, Tag } from "@/types";
import { useState, useEffect } from "react";
import { Stat, HStack } from "@chakra-ui/react"

export const AdminLandingView = () => {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [wordPairs, setWordPairs] = useState<WordPair[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
        const fetchData = async () => {
          const languageData = await getLanguages();
          const wordPairData = await getWordPairs();
          const tagData = await getTags();
          setLanguages(languageData);
          setWordPairs(wordPairData);
          setTags(tagData);
        };

        fetchData();
      }, []);

      return (
        <HStack>
          <Stat.Root border={"1px solid"} borderRadius={"md"} p={"4"}>
            <Stat.Label>Word pairs</Stat.Label>
            <Stat.ValueText>{wordPairs.length}</Stat.ValueText>
          </Stat.Root>

          <Stat.Root border={"1px solid"} borderRadius={"md"} p={"4"}>
            <Stat.Label>Tags</Stat.Label>
            <Stat.ValueText>{tags.length}</Stat.ValueText>
          </Stat.Root>

          <Stat.Root border={"1px solid"} borderRadius={"md"} p={"4"}>
            <Stat.Label>Languages</Stat.Label>
            <Stat.ValueText>{languages.length}</Stat.ValueText>
          </Stat.Root>
        </HStack>
      );
};
