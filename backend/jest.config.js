module.exports = {
  preset: "ts-jest",                // Use TypeScript with Jest
  testEnvironment: "node",          // Use Node environment for tests
  extensionsToTreatAsEsm: [".ts"],  // Treat .js and .ts files as ES modules
  transform: {},                    // Disable other transformations
};