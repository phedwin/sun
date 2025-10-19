/*
 * CJLF LICENSE (c) 2025
 * Generate code skeletons from problem slug names
 */

// Convert slug to camelCase function name
export function slugToFunctionName(slug: string): string {
    const words = slug.split("-");
    return (
        words[0] +
        words
            .slice(1)
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join("")
    );
}

// Convert slug to PascalCase class name
export function slugToClassName(slug: string): string {
    const words = slug.split("-");
    return words
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join("");
}

// Convert slug to snake_case for Python
export function slugToSnakeCase(slug: string): string {
    return slug.replace(/-/g, "_");
}

export interface CodeSkeletonOptions {
    slug: string;
    language: string;
}

export function generateCodeSkeleton({
    slug,
    language,
}: CodeSkeletonOptions): string {
    const functionName = slugToFunctionName(slug);
    const className = slugToClassName(slug);
    const snakeName = slugToSnakeCase(slug);

    const skeletons: { [key: string]: string } = {
        javascript: `// Entry point - DO NOT MODIFY
// This file calls your solution function

function ${functionName}() {
    // Write your solution here

}

// Test your solution
const result = ${functionName}();
console.log(result);`,

        python: `# Entry point - DO NOT MODIFY
# This file calls your solution function

def ${snakeName}():
    """Write your solution here"""
    pass

# Test your solution
if __name__ == "__main__":
    result = ${snakeName}()
    print(result)`,

        java: `// Entry point - DO NOT MODIFY

public class Solution {
    public static void main(String[] args) {
        Solution solution = new Solution();
        // Test your solution
        var result = solution.${functionName}();
        System.out.println(result);
    }

    public Object ${functionName}() {
        // Write your solution here
        return null;
    }
}`,

        cpp: `#include <iostream>
using namespace std;

// Entry point - DO NOT MODIFY

class Solution {
public:
    // Write your solution here
    void ${functionName}() {

    }
};

int main() {
    Solution solution;
    solution.${functionName}();
    return 0;
}`,
    };

    return skeletons[language] || skeletons.javascript;
}

// For problems that take inputs, generate a more complete skeleton
export interface ProblemParameters {
    name: string;
    type: string;
}

export function generateCodeSkeletonWithParams({
    slug,
    language,
    params = [],
    returnType = "any",
}: {
    slug: string;
    language: string;
    params?: ProblemParameters[];
    returnType?: string;
}): string {
    const functionName = slugToFunctionName(slug);
    const className = slugToClassName(slug);
    const snakeName = slugToSnakeCase(slug);

    // Format parameters
    const jsParams = params.map((p) => p.name).join(", ");
    const pyParams = params.map((p) => p.name).join(", ");
    const javaParams = params.map((p) => `${p.type} ${p.name}`).join(", ");
    const cppParams = params.map((p) => `${p.type} ${p.name}`).join(", ");

    const skeletons: { [key: string]: string } = {
        javascript: `/**
 * Problem: ${slug.split("-").join(" ")}
 * @param {${params.map((p) => `${p.type} ${p.name}`).join(", ")}}
 * @return {${returnType}}
 */
function ${functionName}(${jsParams}) {
    // Write your solution here

}

// Test cases
const testCases = [
    // Add your test cases here
];

// Run tests
testCases.forEach((testCase, index) => {
    const result = ${functionName}(...testCase);
    console.log(\`Test \${index + 1}:\`, result);
});`,

        python: `"""
Problem: ${slug.split("-").join(" ")}
"""

def ${snakeName}(${pyParams}):
    """
    Write your solution here

    Args:
        ${params.map((p) => `${p.name} (${p.type}): Description`).join("\n        ")}

    Returns:
        ${returnType}: Description
    """
    pass

# Test cases
if __name__ == "__main__":
    test_cases = [
        # Add your test cases here
    ]

    for i, test_case in enumerate(test_cases):
        result = ${snakeName}(*test_case)
        print(f"Test {i + 1}: {result}")`,

        java: `/**
 * Problem: ${slug.split("-").join(" ")}
 */
public class Solution {
    public ${returnType} ${functionName}(${javaParams}) {
        // Write your solution here
        return null;
    }

    public static void main(String[] args) {
        Solution solution = new Solution();

        // Test cases
        // Add your test cases here

        System.out.println("Tests completed");
    }
}`,

        cpp: `#include <iostream>
#include <vector>
using namespace std;

/**
 * Problem: ${slug.split("-").join(" ")}
 */
class Solution {
public:
    ${returnType} ${functionName}(${cppParams}) {
        // Write your solution here

    }
};

int main() {
    Solution solution;

    // Test cases
    // Add your test cases here

    cout << "Tests completed" << endl;
    return 0;
}`,
    };

    return skeletons[language] || skeletons.javascript;
}
