const fs = require("fs");
const path = require("path");
const zlib = require("zlib");
const https = require("https");
const os = require("os");

const pkgInfo = require("./package.json");

const BINARY_PACKAGES = {
    "linux-arm": "@graphql-json/linux-arm",
    "linux-x64": "@graphql-json/linux-x64",
    "linux-arm64": "@graphql-json/linux-arm64",
    "linux-386": "@graphql-json/linux-386",
    "win32-386": "@graphql-json/win32-386",
    "win32-x64": "@graphql-json/win32-x64",
    "win32-arm64": "@graphql-json/win32-arm64",
    "darwin-arm64": "@graphql-json/darwin-arm64",
    "darwin-x64": "@graphql-json/darwin-x64",
};

const PLATFORM = os.platform();
const ARCH = os.arch();
const VERSION = pkgInfo.version;

// Determine package name for this platform
const platformSpecificPackageName = BINARY_PACKAGES[`${PLATFORM}-${ARCH}`];

// Compute the path we want to emit the fallback binary to
const fallbackBinaryPath = path.join(__dirname, "bin", "graphql-codegen");

/**
 * Get platform specific binary information
 */
function getPlatformBinaryInfo() {
    if (PLATFORM === "win32") {
        return {
            exe: "graphql-codegen.exe",
            path: "",
        };
    }

    return {
        exe: "graphql-codegen",
        path: "bin/",
    };
}

/**
 * Fetch package from npm
 */
function makeRequest(url) {
    return new Promise((resolve, reject) => {
        https
            .get(url, (response) => {
                if (response.statusCode >= 200 && response.statusCode < 300) {
                    const chunks = [];
                    response.on("data", (chunk) => chunks.push(chunk));
                    response.on("end", () => {
                        resolve(Buffer.concat(chunks));
                    });
                } else if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
                    // Follow redirects
                    makeRequest(response.headers.location).then(resolve, reject);
                } else {
                    reject(
                        new Error(
                            `npm responded with status code ${response.statusCode} when downloading the package!`,
                        ),
                    );
                }
            })
            .on("error", (error) => {
                reject(error);
            });
    });
}

/**
 * Extract file from tarball
 */
function extractFileFromTarball(tarballBuffer, filepath) {
    // Tar archives are organized in 512 byte blocks.
    // Blocks can either be header blocks or data blocks.
    // Header blocks contain file names of the archive in the first 100 bytes, terminated by a null byte.
    // The size of a file is contained in bytes 124-135 of a header block and in octal format.
    // The following blocks will be data blocks containing the file.
    let offset = 0;
    while (offset < tarballBuffer.length) {
        const header = tarballBuffer.subarray(offset, offset + 512);
        offset += 512;

        const fileName = header.toString("utf-8", 0, 100).replace(/\0.*/g, "");
        const fileSize = parseInt(header.toString("utf-8", 124, 136).replace(/\0.*/g, ""), 8);

        if (fileName === filepath) {
            return tarballBuffer.subarray(offset, offset + fileSize);
        }

        // Clamp offset to the uppoer multiple of 512
        offset = (offset + fileSize + 511) & ~511;
    }
}

/**
 * Download binary from npm
 */
async function downloadBinaryFromNpm() {
    // Download the tarball of the right binary distribution package
    const tarballDownloadBuffer = await makeRequest(
        `https://registry.npmjs.org/${platformSpecificPackageName}/-/${platformSpecificPackageName.replace("@graphql-json/", "")}-${VERSION}.tgz`,
    );

    const tarballBuffer = zlib.unzipSync(tarballDownloadBuffer);

    // Extract binary from package and write to disk
    fs.writeFileSync(
        fallbackBinaryPath,
        extractFileFromTarball(tarballBuffer, `package/${binaryInfo.path}${binaryInfo.exe}`),
        {mode: 0o755}, // Make binary file executable
    );
}

/**
 * Check if a binary is installed
 */
function isPlatformSpecificPackageInstalled() {
    try {
        // Resolving will fail if the optionalDependency was not installed
        require.resolve(`@graphql-json/${platformSpecificPackageName}/${binaryInfo.path}${binaryInfo.exe}`);
        return true;
    } catch (e) {
        return false;
    }
}

const binaryInfo = getPlatformBinaryInfo();

if (!platformSpecificPackageName) {
    throw new Error("Platform not supported!");
}

// Skip downloading the binary if it was already installed via optionalDependencies
if (!isPlatformSpecificPackageInstalled()) {
    console.log(`Platform specific package not found. Installing ${platformSpecificPackageName}`);
    downloadBinaryFromNpm();
} else {
    console.log("Platform specific package already installed.");
}