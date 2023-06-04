export default {
    clearMocks: true,
    collectCoverage: true,
    coverageDirectory: "coverage",
    coverageProvider: "v8",
    coveragePathIgnorePatterns: ["mocks", "node_modules"],
    moduleNameMapper: {
        "_TYPES(.*)": "<rootDir>src/types$1",
        "_MOCKS(.*)": "<rootDir>src/mocks$1",
        "_LIBS(.*)": "<rootDir>src/libs$1",
        "_RESOLVERS(.*)": "<rootDir>src/resolvers$1",
    },
};
