/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const fs = require("fs");

const rootDir = path.dirname(__dirname);
const npmDir = path.join(rootDir, "npm-binaries");
const graphqlJsonDir = path.join(rootDir, "packages", "graphql-codegen");

try {
    // Npm binaries package json
    const packageJson = fs.readFileSync(path.join(npmDir, "package.json"), "utf8");
    const version = JSON.parse(packageJson).version;

    // Graphql package
    const graphqlCodegenJson = fs.readFileSync(path.join(graphqlJsonDir, "package.json"), "utf8");
    const graphqlCodegenJsonData = JSON.parse(graphqlCodegenJson);
    const optionalDependencies = graphqlCodegenJsonData.optionalDependencies;

    let hasChanged = false;
    for (const [packageKey, packageVersion] of Object.entries(optionalDependencies)) {
        if (packageVersion === version) continue;

        optionalDependencies[packageKey] = version;
        hasChanged = true;
    }

    if (!hasChanged) return;

    graphqlCodegenJsonData.optionalDependencies = optionalDependencies;
    fs.writeFileSync(path.join(graphqlJsonDir, "package.json"), JSON.stringify(graphqlCodegenJsonData));
} catch (err) {
    console.error(err);
}
