import childProcess from "child_process";
import os from "os";
import fs from "fs";
import path from "path";

// Package binary lookup table.
const BINARY_PACKAGES = {
    "linux-arm": {name: "@graphql-json/linux-arm", subpath: "/bin/graphql-codegen"},
    "linux-x64": {name: "@graphql-json/linux-x64", subpath: "/bin/graphql-codegen"},
    "linux-arm64": {name: "@graphql-json/linux-arm64", subpath: "/bin/graphql-codegen"},
    "linux-386": {name: "@graphql-json/linux-386", subpath: "/bin/graphql-codegen"},
    "win32-386": {name: "@graphql-json/win32-386", subpath: "/graphql-codegen.exe"},
    "win32-x64": {name: "@graphql-json/win32-x64", subpath: "/graphql-codegen.exe"},
    "win32-arm64": {name: "@graphql-json/win32-arm64", subpath: "/graphql-codegen.exe"},
    "darwin-arm64": {name: "@graphql-json/darwin-arm64", subpath: "/bin/graphql-codegen"},
    "darwin-x64": {name: "@graphql-json/darwin-x64", subpath: "/bin/graphql-codegen"},
};

const ARCH = os.arch();
const PLATFORM = os.platform();

/**
 * Get binary path
 */
function getPath() {
    try {
        // Find binary package matching platform and arch using lookup table.
        const {name, subpath} = BINARY_PACKAGES[`${PLATFORM}-${ARCH}`];

        // Look if binary is install as fallback.
        const fallback = path.join(__dirname, "..", subpath);
        if (fs.existsSync(fallback)) {
            return fallback;
        }

        // Couldn't find the package from lookup table.
        if (!name) return;

        // Resolve binary package.
        return require.resolve(name + subpath);
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
