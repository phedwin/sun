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


export interface CodeTemplate {
    javascript: string;
    python: string;
    java: string;
    cpp: string;
}

/**
 * Generate code templates for a given question
 * This creates function skeletons based on the question title and common patterns
 */
export function generateCodeTemplates(
    questionTitle: string,
    questionSlug: string
): CodeTemplate {
    // Use slug for function name (more accurate than parsing title)
    const functionName = slugToFunctionName(questionSlug);

    // Detect question type and parameters from title
    const params = detectParameters(questionTitle);

    return {
        javascript: generateJavaScript(functionName, params, questionTitle),
        python: generatePython(functionName, params, questionTitle),
        java: generateJava(functionName, params, questionTitle),
        cpp: generateCpp(functionName, params, questionTitle),
    };
}

function slugToFunctionName(slug: string): string {
    // Convert slug to camelCase
    // e.g., "two-sum" -> "twoSum", "container-with-most-water" -> "containerWithMostWater"
    return slug
        .split("-")
        .map((word, index) => {
            if (index === 0) return word;
            return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join("");
}

function titleToFunctionName(title: string): string {
    // Remove special characters and convert to camelCase
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .split(" ")
        .map((word, index) => {
            if (index === 0) return word;
            return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join("");
}

function detectParameters(title: string): { type: string; name: string }[] {
    const lower = title.toLowerCase();

    // Common patterns
    if (lower.includes("two sum") || lower.includes("pair")) {
        return [
            { type: "number[]", name: "nums" },
            { type: "number", name: "target" },
        ];
    }

    if (lower.includes("array") || lower.includes("list")) {
        return [{ type: "number[]", name: "nums" }];
    }

    if (lower.includes("string") || lower.includes("word")) {
        return [{ type: "string", name: "s" }];
    }

    if (lower.includes("tree")) {
        return [{ type: "TreeNode", name: "root" }];
    }

    if (lower.includes("linked list")) {
        return [{ type: "ListNode", name: "head" }];
    }

    if (lower.includes("matrix") || lower.includes("grid")) {
        return [{ type: "number[][]", name: "matrix" }];
    }

    // Default
    return [{ type: "any", name: "input" }];
}

function generateJavaScript(
    functionName: string,
    params: { type: string; name: string }[],
    questionTitle: string
): string {
    const paramList = params.map((p) => p.name).join(", ");
    const paramTypes = params
        .map((p) => `${p.name}: ${mapTypeToJS(p.type)}`)
        .join(", ");

    return `/**
 * @param {${params.map((p) => `${mapTypeToJS(p.type)} ${p.name}`).join(", ")}}
 * @return {${mapReturnTypeToJS(questionTitle)}}
 */
function ${functionName}(${paramList}) {
    // Write your solution here

}

console.log(${functionName}(/* your test input */));`;
}

function generatePython(
    functionName: string,
    params: { type: string; name: string }[],
    questionTitle: string
): string {
    const paramList = params
        .map((p) => `${p.name}: ${mapTypeToPython(p.type)}`)
        .join(", ");
    const returnType = mapReturnTypeToPython(questionTitle);

    return `def ${functionName}(${paramList}) -> ${returnType}:
    """
    Solve ${questionTitle}

    Args:
        ${params.map((p) => `${p.name}: ${mapTypeToPython(p.type)}`).join("\n        ")}

    Returns:
        ${returnType}
    """
    # Write your solution here
    pass


if __name__ == "__main__":
    # print(${functionName}(your_test_input))
    pass`;
}

function generateJava(
    functionName: string,
    params: { type: string; name: string }[],
    questionTitle: string
): string {
    const paramList = params
        .map((p) => `${mapTypeToJava(p.type)} ${p.name}`)
        .join(", ");
    const returnType = mapReturnTypeToJava(questionTitle);

    return `class Solution {
    /**
     * ${questionTitle}
     *
     * @param ${params.map((p) => `${p.name} ${mapTypeToJava(p.type)}`).join(", ")}
     * @return ${returnType}
     */
    public ${returnType} ${functionName}(${paramList}) {
        // Write your solution here

    }

    public static void main(String[] args) {
        Solution solution = new Solution();
        // Test cases
        // System.out.println(solution.${functionName}(your_test_input));
    }
}`;
}

function generateCpp(
    functionName: string,
    params: { type: string; name: string }[],
    questionTitle: string
): string {
    const paramList = params
        .map((p) => `${mapTypeToCpp(p.type)} ${p.name}`)
        .join(", ");
    const returnType = mapReturnTypeToCpp(questionTitle);

    return `#include <vector>
using namespace std;

class Solution {
public:
    /**
     * ${questionTitle}
     */
    ${returnType} ${functionName}(${paramList}) {
        // Write your solution here

    }
};

int main() {
    Solution solution;
    // Test cases
    // cout << solution.${functionName}(your_test_input) << endl;
    return 0;
}`;
}

function mapTypeToJS(type: string): string {
    const typeMap: { [key: string]: string } = {
        "number[]": "number[]",
        number: "number",
        string: "string",
        TreeNode: "TreeNode",
        ListNode: "ListNode",
        "number[][]": "number[][]",
        any: "any",
    };
    return typeMap[type] || "any";
}

function mapTypeToPython(type: string): string {
    const typeMap: { [key: string]: string } = {
        "number[]": "List[int]",
        number: "int",
        string: "str",
        TreeNode: "TreeNode",
        ListNode: "ListNode",
        "number[][]": "List[List[int]]",
        any: "Any",
    };
    return typeMap[type] || "Any";
}

function mapTypeToJava(type: string): string {
    const typeMap: { [key: string]: string } = {
        "number[]": "int[]",
        number: "int",
        string: "String",
        TreeNode: "TreeNode",
        ListNode: "ListNode",
        "number[][]": "int[][]",
        any: "Object",
    };
    return typeMap[type] || "Object";
}

function mapTypeToCpp(type: string): string {
    const typeMap: { [key: string]: string } = {
        "number[]": "vector<int>",
        number: "int",
        string: "string",
        TreeNode: "TreeNode*",
        ListNode: "ListNode*",
        "number[][]": "vector<vector<int>>",
        any: "auto",
    };
    return typeMap[type] || "auto";
}

function mapReturnTypeToJS(title: string): string {
    const lower = title.toLowerCase();
    if (
        lower.includes("sum") &&
        !lower.includes("maximum") &&
        !lower.includes("minimum")
    )
        return "number[]";
    if (lower.includes("valid") || lower.includes("is ")) return "boolean";
    if (
        lower.includes("count") ||
        lower.includes("number") ||
        lower.includes("length")
    )
        return "number";
    if (lower.includes("string")) return "string";
    if (lower.includes("array") || lower.includes("list")) return "number[]";
    return "any";
}

function mapReturnTypeToPython(title: string): string {
    const lower = title.toLowerCase();
    if (
        lower.includes("sum") &&
        !lower.includes("maximum") &&
        !lower.includes("minimum")
    )
        return "List[int]";
    if (lower.includes("valid") || lower.includes("is ")) return "bool";
    if (
        lower.includes("count") ||
        lower.includes("number") ||
        lower.includes("length")
    )
        return "int";
    if (lower.includes("string")) return "str";
    if (lower.includes("array") || lower.includes("list")) return "List[int]";
    return "Any";
}

function mapReturnTypeToJava(title: string): string {
    const lower = title.toLowerCase();
    if (
        lower.includes("sum") &&
        !lower.includes("maximum") &&
        !lower.includes("minimum")
    )
        return "int[]";
    if (lower.includes("valid") || lower.includes("is ")) return "boolean";
    if (
        lower.includes("count") ||
        lower.includes("number") ||
        lower.includes("length")
    )
        return "int";
    if (lower.includes("string")) return "String";
    if (lower.includes("array") || lower.includes("list")) return "int[]";
    return "Object";
}

function mapReturnTypeToCpp(title: string): string {
    const lower = title.toLowerCase();
    if (
        lower.includes("sum") &&
        !lower.includes("maximum") &&
        !lower.includes("minimum")
    )
        return "vector<int>";
    if (lower.includes("valid") || lower.includes("is ")) return "bool";
    if (
        lower.includes("count") ||
        lower.includes("number") ||
        lower.includes("length")
    )
        return "int";
    if (lower.includes("string")) return "string";
    if (lower.includes("array") || lower.includes("list")) return "vector<int>";
    return "auto";
}
