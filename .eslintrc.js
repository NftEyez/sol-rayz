module.exports = {
  extends: "@nighttrax/eslint-config-tsx",
  rules: {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn", // <--- THIS IS THE NEW RULE
    "no-new": 0,
  },
};
