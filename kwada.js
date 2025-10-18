/*
KWADA LICENSE (c) 2025

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/


import { readFileSync, writeFileSync } from "fs";
import { glob } from "glob";

const LICENSE_TEXT = `KWADA LICENSE (c) ${new Date().getFullYear()}

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.`;

const commentStyles = {
    ".c": "block",
    ".css": "block",
    ".js": "block",
    ".jsx": "block",
    ".ts": "block",
    ".tsx": "block",
    ".go": "line",
    ".py": "line",
    ".sh": "line",
    Makefile: "line",
    ".mk": "line",
};

function formatLicense(style) {
    if (style === "block") {
        return `/*\n${LICENSE_TEXT}\n*/\n\n`;
    } else if (style === "line") {
        const lines = LICENSE_TEXT.split("\n")
            .map((l) => `# ${l}`)
            .join("\n");
        return `${lines}\n\n`;
    }
    throw new Error(`Unknown comment style: ${style}`);
}

function cleanExistingLicense(content) {
    // Remove top license comment if it exists
    return content
        .replace(/^\/\*[\s\S]*?\*\/\s*/m, "")
        .replace(/^(#|\/\/).*\n/gm, "");
}

async function main() {
    const pathnames = await glob("**/*.{js,jsx,ts,tsx,c,go,css,py,sh,mk}", {
        ignore: [
            "**/dist/**",
            "**/node_modules/**",
            "**/tests/fixtures/**",
            "**/__tests__/fixtures/**",
        ],
    });

    const makefiles = await glob("**/Makefile", {
        ignore: [
            "**/dist/**",
            "**/node_modules/**",
            "**/tests/fixtures/**",
            "**/__tests__/fixtures/**",
        ],
    });

    pathnames.push(...makefiles);

    for (const pathname of pathnames) {
        let ext = Object.keys(commentStyles).find((e) => pathname.endsWith(e));
        if (!ext && pathname.endsWith("Makefile")) ext = "Makefile";
        if (!ext) continue;

        const style = commentStyles[ext];
        const license = formatLicense(style);

        const original = readFileSync(pathname, "utf8");
        const cleaned = cleanExistingLicense(original);

        writeFileSync(pathname, license + cleaned, "utf8");
        console.log(`Updated: ${pathname}`);
    }
}

main().catch(console.error);
