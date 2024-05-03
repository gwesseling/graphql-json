/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const fs = require("fs");

const OS = process.argv[2];
const ARCH = process.argv[3];
const LINUX = ["linux", "darwin"];

let packageOS = OS;
let packageArch = ARCH;

if (OS === "windows") packageOS = "win32";
if (ARCH === "amd64") packageArch = "x64";
if (ARCH === 386) packageArch = "ia32";

const rootDir = path.dirname(__dirname);
const npmDir = path.join(rootDir, "npm-binaries");
const packageDir = path.join(npmDir, `${OS}-${ARCH}`);

try {
    if (LINUX.includes(OS)) {
        fs.mkdirSync(path.join(packageDir, "bin"));
        fs.renameSync(path.join(packageDir, "graphql-codegen"), path.join(packageDir, "bin", "graphql-codegen"));
    }

    const packageJson = fs.readFileSync(path.join(npmDir, "package.json"), "utf8");
    const json = JSON.parse(packageJson);

    json.name = json.name.replace("$OS", packageOS).replace("$ARCH", packageArch);
    json.description = json.description.replace("$OS", OS).replace("$ARCH", ARCH);
    json.os = [packageOS];
    json.cpu = [packageArch];
    json.private = false;

    const readme = fs.readFileSync(path.join(npmDir, "README.md"), "utf8").replace("$OS", OS).replace("$ARCH", ARCH);

    fs.writeFileSync(path.join(packageDir, "package.json"), JSON.stringify(json));
    fs.writeFileSync(path.join(packageDir, "README.md"), readme);
} catch (err) {
    console.error(err);
}
