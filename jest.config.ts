module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { useESM: true }],
  },
  coveragePathIgnorePatterns: ["/node_modules/", "/__fixtures__/"],
};
