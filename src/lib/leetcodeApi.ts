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

const API_BASE_URL = "https://alfa-leetcode-api.onrender.com";

const CACHE_DURATION = 60 * 60 * 1000;

interface CachedData<T> {
    data: T;
    timestamp: number;
}

function getCachedData<T>(key: string): T | null {
    try {
        const cached = localStorage.getItem(key);
        if (!cached) return null;

        const { data, timestamp }: CachedData<T> = JSON.parse(cached);
        const now = Date.now();

        // Check if cache is still valid
        if (now - timestamp < CACHE_DURATION) {
            return data;
        }

        // Cache expired
        localStorage.removeItem(key);
        return null;
    } catch (error) {
        console.error("Error reading cache:", error);
        return null;
    }
}

function setCachedData<T>(key: string, data: T): void {
    try {
        const cached: CachedData<T> = {
            data,
            timestamp: Date.now(),
        };
        localStorage.setItem(key, JSON.stringify(cached));
    } catch (error) {
        console.error("Error setting cache:", error);
    }
}

export interface LeetCodeProblem {
    questionFrontendId: string;
    title: string;
    titleSlug: string;
    difficulty: "Easy" | "Medium" | "Hard";
    acRate: number;
    isPaidOnly: boolean;
    topicTags: Array<{
        name: string;
        slug: string;
    }>;
}

export interface LeetCodeProblemsResponse {
    totalQuestions: number;
    count: number;
    problemsetQuestionList: LeetCodeProblem[];
}

export interface LeetCodeProblemDetail {
    questionId: string;
    questionFrontendId: string;
    questionTitle: string;
    titleSlug: string;
    difficulty: "Easy" | "Medium" | "Hard";
    isPaidOnly: boolean;
    question: string;
    exampleTestcases: string;
    topicTags: Array<{
        name: string;
        slug: string;
    }>;
    hints: string[];
    likes: number;
    dislikes: number;
}

/**
 * Fetch a paginated list of LeetCode problems
 * @param limit - Number of problems to fetch (default: 50)
 * @param skip - Number of problems to skip (default: 0)
 * @returns Promise with problems list
 */
export async function fetchProblems(
    limit: number = 50,
    skip: number = 0
): Promise<LeetCodeProblemsResponse> {
    try {
        const response = await fetch(
            `${API_BASE_URL}/problems?limit=${limit}&skip=${skip}`
        );

        if (!response.ok) {
            throw new Error(`Failed to fetch problems: ${response.statusText}`);
        }

        const data: LeetCodeProblemsResponse = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching problems:", error);
        throw error;
    }
}

/**
 * Fetch detailed information about a specific problem
 * @param titleSlug - The slug identifier for the problem (e.g., "two-sum")
 * @returns Promise with problem details
 */
export async function fetchProblemDetail(
    titleSlug: string
): Promise<LeetCodeProblemDetail> {
    try {
        const response = await fetch(
            `${API_BASE_URL}/select?titleSlug=${titleSlug}`
        );

        if (!response.ok) {
            throw new Error(
                `Failed to fetch problem detail: ${response.statusText}`
            );
        }

        const data: LeetCodeProblemDetail = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching problem detail:", error);
        throw error;
    }
}

/**
 * Fetch problems with optional filtering by difficulty and topic
 * @param limit - Number of problems to fetch
 * @param skip - Number of problems to skip
 * @param difficulty - Filter by difficulty (Easy, Medium, Hard)
 * @param topic - Filter by topic tag
 */
export async function fetchFilteredProblems(
    limit: number = 500,
    skip: number = 0,
    difficulty?: "Easy" | "Medium" | "Hard",
    topic?: string
): Promise<LeetCodeProblem[]> {
    const cacheKey = `leetcode_problems_${limit}_${skip}`;

    // Try to get from cache first
    const cachedProblems = getCachedData<LeetCodeProblem[]>(cacheKey);
    if (cachedProblems) {
        console.log("Using cached problems data");
        let problems = cachedProblems;

        // Apply filters
        if (difficulty) {
            problems = problems.filter((p) => p.difficulty === difficulty);
        }

        if (topic) {
            const normalizedTopic = topic.toLowerCase().replace(/\s+/g, "-");
            problems = problems.filter((p) =>
                p.topicTags.some(
                    (tag) =>
                        tag.slug === normalizedTopic ||
                        tag.name.toLowerCase() === topic.toLowerCase() ||
                        tag.slug.toLowerCase().includes(normalizedTopic) ||
                        normalizedTopic.includes(tag.slug.toLowerCase())
                )
            );
        }

        return problems;
    }

    try {
        // Fetch a large set with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

        const response = await fetch(
            `${API_BASE_URL}/problems?limit=${limit}&skip=${skip}`,
            { signal: controller.signal }
        );

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(
                `API Error: ${response.status} ${response.statusText}`
            );
        }

        const data: LeetCodeProblemsResponse = await response.json();

        if (!data || !data.problemsetQuestionList) {
            throw new Error("Invalid response from LeetCode API");
        }

        let problems = data.problemsetQuestionList;

        // Cache the raw data
        setCachedData(cacheKey, problems);

        // Filter by difficulty if provided
        if (difficulty) {
            problems = problems.filter((p) => p.difficulty === difficulty);
        }

        // Filter by topic if provided
        if (topic) {
            const normalizedTopic = topic.toLowerCase().replace(/\s+/g, "-");
            problems = problems.filter((p) =>
                p.topicTags.some(
                    (tag) =>
                        tag.slug === normalizedTopic ||
                        tag.name.toLowerCase() === topic.toLowerCase() ||
                        tag.slug.toLowerCase().includes(normalizedTopic) ||
                        normalizedTopic.includes(tag.slug.toLowerCase())
                )
            );
        }

        return problems;
    } catch (error) {
        console.error("Error fetching filtered problems:", error);
        if (error instanceof Error) {
            if (error.name === "AbortError") {
                throw new Error(
                    "Request timeout - LeetCode API is taking too long to respond"
                );
            }
            throw error;
        }
        throw new Error("Unknown error occurred while fetching problems");
    }
}

/**
 * Get all unique topic tags from problems
 */
export async function getTopicTags(): Promise<
    Array<{ name: string; slug: string; count: number }>
> {
    const cacheKey = "leetcode_topic_tags";

    // Try to get from cache first
    const cachedTags =
        getCachedData<Array<{ name: string; slug: string; count: number }>>(
            cacheKey
        );
    if (cachedTags) {
        console.log("Using cached topic tags");
        return cachedTags;
    }

    try {
        // Fetch with timeout to prevent hanging
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

        const response = await fetch(
            `${API_BASE_URL}/problems?limit=200&skip=0`,
            { signal: controller.signal }
        );

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.statusText}`);
        }

        const data: LeetCodeProblemsResponse = await response.json();
        const tagMap = new Map<
            string,
            { name: string; slug: string; count: number }
        >();

        data.problemsetQuestionList.forEach((problem) => {
            problem.topicTags.forEach((tag) => {
                if (tagMap.has(tag.slug)) {
                    const existing = tagMap.get(tag.slug)!;
                    existing.count++;
                } else {
                    tagMap.set(tag.slug, {
                        name: tag.name,
                        slug: tag.slug,
                        count: 1,
                    });
                }
            });
        });

        const tags = Array.from(tagMap.values()).sort(
            (a, b) => b.count - a.count
        );

        // Cache the result
        setCachedData(cacheKey, tags);

        return tags;
    } catch (error) {
        console.error("Error fetching topic tags:", error);
        // Return fallback topics if API fails
        return [
            { name: "Array", slug: "array", count: 50 },
            { name: "String", slug: "string", count: 45 },
            { name: "Hash Table", slug: "hash-table", count: 40 },
            {
                name: "Dynamic Programming",
                slug: "dynamic-programming",
                count: 35,
            },
            { name: "Math", slug: "math", count: 30 },
            { name: "Sorting", slug: "sorting", count: 28 },
            { name: "Greedy", slug: "greedy", count: 25 },
            { name: "Binary Search", slug: "binary-search", count: 22 },
            { name: "Tree", slug: "tree", count: 20 },
            { name: "Graph", slug: "graph", count: 18 },
            { name: "Stack", slug: "stack", count: 16 },
            { name: "Linked List", slug: "linked-list", count: 15 },
            { name: "Database", slug: "database", count: 12 },
            { name: "Binary Tree", slug: "binary-tree", count: 10 },
            {
                name: "Depth-First Search",
                slug: "depth-first-search",
                count: 10,
            },
            {
                name: "Breadth-First Search",
                slug: "breadth-first-search",
                count: 10,
            },
        ];
    }
}
