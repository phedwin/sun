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

const PISTON_API_URL = "https://emkc.org/api/v2/piston";

export interface ExecutionResult {
    success: boolean;
    output: string;
    error?: string;
    executionTime?: number;
}

const LANGUAGE_MAP: { [key: string]: { language: string; version: string } } = {
    javascript: { language: "javascript", version: "18.15.0" },
    python: { language: "python", version: "3.10.0" },
    java: { language: "java", version: "15.0.2" },
    cpp: { language: "cpp", version: "10.2.0" },
};

/**
 * Execute code in the specified language
 * @param code - The code to execute
 * @param language - The programming language
 * @param stdin - Optional standard input
 */
export async function executeCode(
    code: string,
    language: string,
    stdin: string = ""
): Promise<ExecutionResult> {
    try {
        const langConfig = LANGUAGE_MAP[language];

        if (!langConfig) {
            return {
                success: false,
                output: "",
                error: `Language ${language} is not supported`,
            };
        }

        const startTime = Date.now();

        const response = await fetch(`${PISTON_API_URL}/execute`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                language: langConfig.language,
                version: langConfig.version,
                files: [
                    {
                        name: getFileName(language),
                        content: code,
                    },
                ],
                stdin: stdin,
                args: [],
                compile_timeout: 10000,
                run_timeout: 3000,
                compile_memory_limit: -1,
                run_memory_limit: -1,
            }),
        });

        const executionTime = Date.now() - startTime;

        if (!response.ok) {
            throw new Error(
                `API Error: ${response.status} ${response.statusText}`
            );
        }

        const data = await response.json();

        // Check if there was a compilation error
        if (data.compile && data.compile.stderr) {
            return {
                success: false,
                output: data.compile.stdout || "",
                error: data.compile.stderr,
                executionTime,
            };
        }

        // Check if there was a runtime error
        if (data.run.stderr) {
            return {
                success: false,
                output: data.run.stdout || "",
                error: data.run.stderr,
                executionTime,
            };
        }

        // Successful execution
        return {
            success: true,
            output: data.run.stdout || "(No output)",
            executionTime,
        };
    } catch (error) {
        console.error("Code execution error:", error);
        return {
            success: false,
            output: "",
            error:
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred",
        };
    }
}

/**
 * Get the appropriate filename for the language
 */
function getFileName(language: string): string {
    const fileNames: { [key: string]: string } = {
        javascript: "main.js",
        python: "main.py",
        java: "Main.java",
        cpp: "main.cpp",
    };
    return fileNames[language] || "main.txt";
}

/**
 * Get runtime versions for supported languages
 */
export async function getRuntimes(): Promise<any[]> {
    try {
        const response = await fetch(`${PISTON_API_URL}/runtimes`);
        if (!response.ok) {
            throw new Error("Failed to fetch runtimes");
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching runtimes:", error);
        return [];
    }
}
