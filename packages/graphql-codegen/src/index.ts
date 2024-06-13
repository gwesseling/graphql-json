import os from "os";
import fs from "fs";
import path from "path";
import childProcess from "child_process";

// Package binary lookup table.
const BINARY_PACKAGES = {
    "linux-arm": {packageName: "@graphql-json/linux-arm", binPath: "/bin/graphql-codegen"},
    "linux-x64": {packageName: "@graphql-json/linux-x64", binPath: "/bin/graphql-codegen"},
    "linux-arm64": {packageName: "@graphql-json/linux-arm64", binPath: "/bin/graphql-codegen"},
    "linux-386": {packageName: "@graphql-json/linux-386", binPath: "/bin/graphql-codegen"},
    "win32-386": {packageName: "@graphql-json/win32-386", binPath: "/graphql-codegen.exe"},
    "win32-x64": {packageName: "@graphql-json/win32-x64", binPath: "/graphql-codegen.exe"},
    "win32-arm64": {packageName: "@graphql-json/win32-arm64", binPath: "/graphql-codegen.exe"},
    "darwin-arm64": {packageName: "@graphql-json/darwin-arm64", binPath: "/bin/graphql-codegen"},
    "darwin-x64": {packageName: "@graphql-json/darwin-x64", binPath: "/bin/graphql-codegen"},
};

const ARCH = os.arch();
const PLATFORM = os.platform();

/**
 * Get binary path
 */
function getPath() {
    try {
        // Find binary package matching platform and arch using lookup table.
        const {packageName, binPath} = BINARY_PACKAGES[`${PLATFORM}-${ARCH}`];

        // Look if binary is install as fallback.
        const fallback = path.join(__dirname, "..", `graphql-codegen${PLATFORM === "win32" ? ".exe" : ""}`);
        if (fs.existsSync(fallback)) {
            return fallback;
        }

        // Couldn't find the package from lookup table.
        if (!packageName) throw new Error("no valid package installed");

        // Resolve binary package.
        return require.resolve(packageName + binPath);
    } catch (err) {
        // TODO: we could check if there is an other package binary is installed.
        return;
    }
}

/**
 * Generate Graphql schema
 */
function codegen(args: Array<string>) {
    return new Promise((resolve, reject) => {
        const path = getPath();

        if (!path) {
            return reject(new Error("Unsupported operating system or architecture"));
        }

        childProcess.execFile(path, args, {}, (err, stdout) => {
            if (err) return reject(err);

            return resolve(stdout);
        });
    });
}

export {codegen};
