import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import nextConfig from "eslint-config-next";
import prettierConfig from "eslint-config-prettier";

export default [
  // Global ignores (replaces .eslintignore)
  {
    ignores: [
      "next.config.js",
      "tailwind.config.js",
      "postcss.config.js",
      "scripts/**",
      "out/**",
      ".next/**",
      "build/**",
      "node_modules/**",
      "coverage/**",
    ],
  },

  // Next.js flat config (includes react, react-hooks, @next/next rules)
  ...Object.values(nextConfig),

  // Prettier disables formatting rules
  prettierConfig,

  // TypeScript + project rules
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: {
      "@typescript-eslint": typescriptEslint,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
      },
      ecmaVersion: "latest",
      sourceType: "module",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      // JavaScript/General rules
      "prefer-const": "error",
      "no-var": "error",
      "no-console": "warn",
      "no-unused-vars": "off",
      "no-implicit-coercion": "error",
      "no-return-assign": "error",
      "consistent-return": "warn",

      // TypeScript-specific rules
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/prefer-nullish-coalescing": "warn",
      "@typescript-eslint/prefer-optional-chain": "warn",
      "@typescript-eslint/no-non-null-assertion": "warn",
      "@typescript-eslint/consistent-type-imports": "warn",

      // React rules (already covered by next config, but explicit overrides)
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",
      "react/no-unescaped-entities": "error",
      "react/jsx-no-duplicate-props": "error",
      "react/jsx-no-undef": "error",
    },
  },
];
