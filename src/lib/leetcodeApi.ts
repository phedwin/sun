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

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours - longer cache to avoid rate limits

// Retry with exponential backoff
async function fetchWithRetry(url: string, retries = 3, backoff = 1000): Promise<Response> {
    for (let i = 0; i < retries; i++) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000);

            const response = await fetch(url, { signal: controller.signal });
            clearTimeout(timeoutId);

            // If rate limited (429), wait and retry
            if (response.status === 429) {
                if (i < retries - 1) {
                    const waitTime = backoff * Math.pow(2, i);
                    console.log(`Rate limited. Waiting ${waitTime}ms before retry ${i + 1}/${retries}...`);
                    await new Promise(resolve => setTimeout(resolve, waitTime));
                    continue;
                }
            }

            return response;
        } catch (error) {
            if (i === retries - 1) throw error;
            const waitTime = backoff * Math.pow(2, i);
            await new Promise(resolve => setTimeout(resolve, waitTime));
        }
    }
    throw new Error('Max retries reached');
}

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
import { CACHE_VERSION } from "./CONSTATS";

export async function fetchFilteredProblems(
    limit: number = 500,
    skip: number = 0,
    difficulty?: "Easy" | "Medium" | "Hard",
    topic?: string
): Promise<LeetCodeProblem[]> {
    const cacheKey = `leetcode_problems_${CACHE_VERSION}_${limit}_${skip}`;

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

        // Deduplicate by questionFrontendId (remove duplicate problems)
        const uniqueProblems = new Map<string, LeetCodeProblem>();
        problems.forEach(problem => {
            uniqueProblems.set(problem.questionFrontendId, problem);
        });
        problems = Array.from(uniqueProblems.values());

        return problems;
    }

    try {
        // Fetch with retry logic for rate limits
        const response = await fetchWithRetry(
            `${API_BASE_URL}/problems?limit=${limit}&skip=${skip}`
        );

        if (!response.ok) {
            // If still failing after retries, throw descriptive error
            if (response.status === 429) {
                throw new Error(
                    "LeetCode API rate limit exceeded. Using cached data if available. Please try again in a few minutes."
                );
            }
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

        // Deduplicate by questionFrontendId (remove duplicate problems)
        const uniqueProblems = new Map<string, LeetCodeProblem>();
        problems.forEach(problem => {
            uniqueProblems.set(problem.questionFrontendId, problem);
        });
        problems = Array.from(uniqueProblems.values());

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
    const cacheKey = `leetcode_topic_tags_${CACHE_VERSION}`;

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
        // Fetch with retry logic
        const response = await fetchWithRetry(
            `${API_BASE_URL}/problems?limit=200&skip=0`
        );

        if (!response.ok) {
            if (response.status === 429) {
                console.warn("Rate limited when fetching topics, using fallback");
                throw new Error("Rate limit exceeded");
            }
            throw new Error(`Failed to fetch: ${response.statusText}`);
        }

        const data: LeetCodeProblemsResponse = await response.json();

        // Deduplicate problems first by questionFrontendId
        const uniqueProblems = new Map<string, LeetCodeProblem>();
        data.problemsetQuestionList.forEach(problem => {
            uniqueProblems.set(problem.questionFrontendId, problem);
        });
        const deduplicatedProblems = Array.from(uniqueProblems.values());

        const tagMap = new Map<
            string,
            { name: string; slug: string; count: number }
        >();

        deduplicatedProblems.forEach((problem) => {
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
        // Import and return fallback topics if API fails
        const { FALLBACK_TOPICS } = await import('./fallbackData');
        console.log("Using fallback topic data");
        return FALLBACK_TOPICS;
    }
}
