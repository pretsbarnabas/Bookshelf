const { pathsToModuleNameMapper } = require("ts-jest");
const { compilerOptions } = require("./tsconfig.json");

/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        // Ensure `ts-jest` uses your `tsconfig.json` paths
        tsconfig: "tsconfig.json",
      },
    ],
  },
  testMatch: ["**/*.test.ts", "**/*.spec.ts"],
  moduleFileExtensions: ["ts", "js", "json", "node"],
  reporters: [
    "default",
    [
      "jest-ctrf-json-reporter",
      {
        outputFile: "backend.testreport.json",
        outputDir: "./src/test/report",
      },
    ],
    [
      "jest-html-reporters",
      {
        publicPath: "./src/test/report",
        filename: "index.html",
      },
    ],
  ],
};