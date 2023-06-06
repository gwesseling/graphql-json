/* eslint-disable @typescript-eslint/no-var-requires */
const {build} = require("esbuild");

const BASE_CONFIG = {
    entryPoints: ["src/index.ts"],
    bundle: true,
    platform: "node",
    target: ["esnext", "node10.4"],
    sourcemap: true,
    minify: false,
    treeShaking: true,
    external: ["graphql"],
};

// TODO: move readme on package release to package folder
build({
    ...BASE_CONFIG,
    outfile: "./build/index.cjs.js",
    format: "cjs",
});

build({
    ...BASE_CONFIG,
    outfile: "./build/index.esm.js",
    format: "esm",
});
