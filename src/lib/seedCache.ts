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

import { LeetCodeProblem } from "./leetcodeApi";

const sampleProblems: LeetCodeProblem[] = [
    {
        questionFrontendId: "1",
        title: "Two Sum",
        titleSlug: "two-sum",
        difficulty: "Easy",
        acRate: 49.1,
        isPaidOnly: false,
        topicTags: [
            { name: "Array", slug: "array" },
            { name: "Hash Table", slug: "hash-table" },
        ],
    },
    {
        questionFrontendId: "2",
        title: "Add Two Numbers",
        titleSlug: "add-two-numbers",
        difficulty: "Medium",
        acRate: 40.3,
        isPaidOnly: false,
        topicTags: [
            { name: "Linked List", slug: "linked-list" },
            { name: "Math", slug: "math" },
            { name: "Recursion", slug: "recursion" },
        ],
    },
    {
        questionFrontendId: "3",
        title: "Longest Substring Without Repeating Characters",
        titleSlug: "longest-substring-without-repeating-characters",
        difficulty: "Medium",
        acRate: 34.2,
        isPaidOnly: false,
        topicTags: [
            { name: "Hash Table", slug: "hash-table" },
            { name: "String", slug: "string" },
            { name: "Sliding Window", slug: "sliding-window" },
        ],
    },
    {
        questionFrontendId: "4",
        title: "Median of Two Sorted Arrays",
        titleSlug: "median-of-two-sorted-arrays",
        difficulty: "Hard",
        acRate: 37.8,
        isPaidOnly: false,
        topicTags: [
            { name: "Array", slug: "array" },
            { name: "Binary Search", slug: "binary-search" },
            { name: "Divide and Conquer", slug: "divide-and-conquer" },
        ],
    },
    {
        questionFrontendId: "5",
        title: "Longest Palindromic Substring",
        titleSlug: "longest-palindromic-substring",
        difficulty: "Medium",
        acRate: 33.1,
        isPaidOnly: false,
        topicTags: [
            { name: "String", slug: "string" },
            { name: "Dynamic Programming", slug: "dynamic-programming" },
        ],
    },
];

function generateMockProblems(count: number): LeetCodeProblem[] {
    const problems: LeetCodeProblem[] = [];
    for (let i = 0; i < count; i++) {
        const template = sampleProblems[i % sampleProblems.length];
        problems.push({
            ...template,
            questionFrontendId: String(i + 1),
            title: `${template.title} (${i + 1})`,
            titleSlug: `${template.titleSlug}-${i + 1}`,
        });
    }
    return problems;
}

export function seedCacheWithMockData() {
    const mockProblems = generateMockProblems(500);

    const cacheData = {
        data: mockProblems,
        timestamp: Date.now(),
    };

    localStorage.setItem("leetcode_problems_500_0", JSON.stringify(cacheData));

    const topics = [
        { name: "Array", slug: "array", count: 150 },
        { name: "String", slug: "string", count: 120 },
        { name: "Hash Table", slug: "hash-table", count: 110 },
        { name: "Dynamic Programming", slug: "dynamic-programming", count: 95 },
        { name: "Math", slug: "math", count: 85 },
        { name: "Sorting", slug: "sorting", count: 75 },
        { name: "Greedy", slug: "greedy", count: 70 },
        { name: "Binary Search", slug: "binary-search", count: 65 },
        { name: "Tree", slug: "tree", count: 60 },
        { name: "Linked List", slug: "linked-list", count: 55 },
        { name: "Recursion", slug: "recursion", count: 50 },
        { name: "Sliding Window", slug: "sliding-window", count: 45 },
        { name: "Divide and Conquer", slug: "divide-and-conquer", count: 40 },
    ];

    const topicsCacheData = {
        data: topics,
        timestamp: Date.now(),
    };

    localStorage.setItem(
        "leetcode_topic_tags",
        JSON.stringify(topicsCacheData)
    );

    console.log("✅ Cache seeded with mock data!");
    console.log(`   - ${mockProblems.length} problems cached`);
    console.log(`   - ${topics.length} topics cached`);
    console.log("   - Cache will expire in 1 hour");
}
