/*
 * CJLF LICENSE (c) 2025
 * Fallback data for when LeetCode API is rate-limited
 */

export const FALLBACK_TOPICS = [
    { name: "Array", slug: "array", count: 1547 },
    { name: "String", slug: "string", count: 823 },
    { name: "Hash Table", slug: "hash-table", count: 691 },
    { name: "Dynamic Programming", slug: "dynamic-programming", count: 647 },
    { name: "Math", slug: "math", count: 614 },
    { name: "Sorting", slug: "sorting", count: 423 },
    { name: "Greedy", slug: "greedy", count: 412 },
    { name: "Depth-First Search", slug: "depth-first-search", count: 398 },
    { name: "Binary Search", slug: "binary-search", count: 385 },
    { name: "Tree", slug: "tree", count: 367 },
    { name: "Breadth-First Search", slug: "breadth-first-search", count: 321 },
    { name: "Database", slug: "database", count: 289 },
    { name: "Binary Tree", slug: "binary-tree", count: 267 },
    { name: "Two Pointers", slug: "two-pointers", count: 245 },
    { name: "Bit Manipulation", slug: "bit-manipulation", count: 234 },
    { name: "Stack", slug: "stack", count: 228 },
    { name: "Graph", slug: "graph", count: 215 },
    { name: "Heap (Priority Queue)", slug: "heap-priority-queue", count: 197 },
    { name: "Simulation", slug: "simulation", count: 189 },
    { name: "Linked List", slug: "linked-list", count: 176 },
];

// Message to show users when rate limited
export const RATE_LIMIT_MESSAGE = `
🌍 **We hit the API speed bump!**

The LeetCode API is taking a quick rest. Don't worry - we've cached tons of problems for you to practice with!

**What you can do:**
- ✅ Continue solving cached problems
- ✅ All your progress is saved locally
- ✅ Try refreshing in a few minutes for new problems

**Pro Tip:** The more you use the app, the more data gets cached, and the less you'll see this message!
`;

export const RATE_LIMIT_TOAST_MESSAGE =
    "API taking a rest 🌴 Using cached data...";
