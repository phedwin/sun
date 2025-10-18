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
  limit: number = 500,
  skip: number = 0,
  difficulty?: 'Easy' | 'Medium' | 'Hard',
  topic?: string
): Promise<LeetCodeProblem[]> {
  try {
    // Fetch a larger set to ensure we have enough after filtering
    const response = await fetchProblems(limit, skip);
    let problems = response.problemsetQuestionList;

    // Filter by difficulty if provided
    if (difficulty) {
      problems = problems.filter(p => p.difficulty === difficulty);
    }

    // Filter by topic if provided
    if (topic) {
      problems = problems.filter(p =>
        p.topicTags.some(tag =>
          tag.slug === topic.toLowerCase().replace(/\s+/g, '-') ||
          tag.name.toLowerCase() === topic.toLowerCase()
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
    const response = await fetchProblems(500, 0);
    const tagMap = new Map<string, {name: string, slug: string, count: number}>();

    response.problemsetQuestionList.forEach(problem => {
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
    throw error;
  }
}