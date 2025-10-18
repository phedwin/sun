// LeetCode API Service
const API_BASE_URL = 'https://alfa-leetcode-api.onrender.com';

export interface LeetCodeProblem {
  questionFrontendId: string;
  title: string;
  titleSlug: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
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
  difficulty: 'Easy' | 'Medium' | 'Hard';
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
    console.error('Error fetching problems:', error);
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
      throw new Error(`Failed to fetch problem detail: ${response.statusText}`);
    }

    const data: LeetCodeProblemDetail = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching problem detail:', error);
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
  limit: number = 3000,
  skip: number = 0,
  difficulty?: 'Easy' | 'Medium' | 'Hard',
  topic?: string
): Promise<LeetCodeProblem[]> {
  try {
    // Fetch a large set with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    const response = await fetch(
      `${API_BASE_URL}/problems?limit=${limit}&skip=${skip}`,
      { signal: controller.signal }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Failed to fetch problems: ${response.statusText}`);
    }

    const data: LeetCodeProblemsResponse = await response.json();
    let problems = data.problemsetQuestionList;

    // Filter by difficulty if provided
    if (difficulty) {
      problems = problems.filter(p => p.difficulty === difficulty);
    }

    // Filter by topic if provided
    if (topic) {
      const normalizedTopic = topic.toLowerCase().replace(/\s+/g, '-');
      problems = problems.filter(p =>
        p.topicTags.some(tag =>
          tag.slug === normalizedTopic ||
          tag.name.toLowerCase() === topic.toLowerCase() ||
          tag.slug.toLowerCase().includes(normalizedTopic) ||
          normalizedTopic.includes(tag.slug.toLowerCase())
        )
      );
    }

    return problems;
  } catch (error) {
    console.error('Error fetching filtered problems:', error);
    throw error;
  }
}

/**
 * Get all unique topic tags from problems
 */
export async function getTopicTags(): Promise<Array<{name: string, slug: string, count: number}>> {
  try {
    // Fetch with timeout to prevent hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(
      `${API_BASE_URL}/problems?limit=200&skip=0`,
      { signal: controller.signal }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }

    const data: LeetCodeProblemsResponse = await response.json();
    const tagMap = new Map<string, {name: string, slug: string, count: number}>();

    data.problemsetQuestionList.forEach(problem => {
      problem.topicTags.forEach(tag => {
        if (tagMap.has(tag.slug)) {
          const existing = tagMap.get(tag.slug)!;
          existing.count++;
        } else {
          tagMap.set(tag.slug, { name: tag.name, slug: tag.slug, count: 1 });
        }
      });
    });

    return Array.from(tagMap.values()).sort((a, b) => b.count - a.count);
  } catch (error) {
    console.error('Error fetching topic tags:', error);
    // Return fallback topics if API fails
    return [
      { name: 'Array', slug: 'array', count: 50 },
      { name: 'String', slug: 'string', count: 45 },
      { name: 'Hash Table', slug: 'hash-table', count: 40 },
      { name: 'Dynamic Programming', slug: 'dynamic-programming', count: 35 },
      { name: 'Math', slug: 'math', count: 30 },
      { name: 'Sorting', slug: 'sorting', count: 28 },
      { name: 'Greedy', slug: 'greedy', count: 25 },
      { name: 'Binary Search', slug: 'binary-search', count: 22 },
      { name: 'Tree', slug: 'tree', count: 20 },
      { name: 'Graph', slug: 'graph', count: 18 },
      { name: 'Stack', slug: 'stack', count: 16 },
      { name: 'Linked List', slug: 'linked-list', count: 15 },
      { name: 'Database', slug: 'database', count: 12 },
      { name: 'Binary Tree', slug: 'binary-tree', count: 10 },
      { name: 'Depth-First Search', slug: 'depth-first-search', count: 10 },
      { name: 'Breadth-First Search', slug: 'breadth-first-search', count: 10 },
    ];
  }
}