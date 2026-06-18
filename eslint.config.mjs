// Next.js 16 ships native ESLint flat config — compose it directly
// (no FlatCompat, which breaks on ESLint 9 with a circular-JSON error).
import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

const eslintConfig = [
  ...coreWebVitals,
  ...typescript,
  {
    ignores: ["_legacy/**", ".next/**", "node_modules/**"],
  },
];

export default eslintConfig;
