/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const fs = require("fs");

const os = process.argv[2];
const arch = process.argv[3];

let packageOS = os;
let packageArch = arch;

if (os === "windows") packageOS = "win32";
if (arch === "amd64") packageArch = "x64";
if (arch === 386) packageArch = "ia32";

const rootDir = path.dirname(__dirname);
const npmDir = path.join(rootDir, "npm-binaries");
const packageDir = path.join(npmDir, `${os}-${arch}`);

try {
    const packageJson = fs.readFileSync(path.join(npmDir, "package.json"), "utf8");
    const json = JSON.parse(packageJson);

    json.name = json.name.replace("$OS", packageOS).replace("$ARCH", packageArch);
    json.description = json.description.replace("$OS", os).replace("$ARCH", arch);
    json.os = [packageOS];
    json.cpu = [packageArch];
    json.private = false;

    const readme = fs.readFileSync(path.join(npmDir, "README.md"), "utf8").replace("$OS", os).replace("$ARCH", arch);

    fs.writeFileSync(path.join(packageDir, "package.json"), JSON.stringify(json));
    fs.writeFileSync(path.join(packageDir, "README.md"), readme);
} catch (err) {
    console.error(err);
}
