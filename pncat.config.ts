import { defineConfig, mergeCatalogRules } from "pncat";

export default defineConfig({
  catalogRules: mergeCatalogRules([
    {
      match: ["lefthook", "knip"],
      name: "cli",
    },
    {
      match: [/babel/, /typescript/, /lru/],
      name: "build",
    },
  ]),
  install: false,
});
