import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
  globalCss: {
    body: {
      bg: "#0f5257",
      color: "white",
    },
  },
  theme: {
    tokens: {
      colors: {
        berryBlush: { value: "#932f6d" },
        cherryBlossom: { value: "#ffb7c3" },
        cornflowerBlue: { value: "#788bff" },
        sageGreen: { value: "#679436" },
        darkTeal: { value: "#0f5257" },
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);
