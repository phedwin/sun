/*
 * CJLF LICENSE (c) 2025
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

import { readFileSync, writeFileSync } from "fs";
import { glob } from "glob";

const LICENCE_TEXT = `CJLF LICENSE (c) ${new Date().getFullYear()}

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
    ".py": "line", // Python
    ".sh": "line", // Shell scripts
    Makefile: "line", // Makefile
    ".mk": "line", // Makefile variants
};

const formatLicense = (style) => {
    if (style === "block") {
        return `*.{js,jsx,ts,tsx,c,go,css,py,sh,mk}", {
        ignore: [
            "**/dist/**",
            "**/node_modules/**",
            "**/tests/fixtures/**",
            "**/__tests__/fixtures/**",
        ],
    });

    // Add Makefile support (files without extensions)
    const makefiles = glob.sync("**/Makefile", {
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

        // Handle Makefile special case (no extension)
        if (!ext && pathname.endsWith("Makefile")) {
            ext = "Makefile";
        }

        if (!ext) continue;

        const style = commentStyles[ext];
        const license = formatLicense(style);

        const original = readFileSync(pathname, "utf8");
        const cleaned = cleanExistingLicense(original);

        writeFileSync(pathname, license + cleaned, "utf8");
    }
};

buffer_xxx().catch(console.error);
