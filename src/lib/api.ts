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

const API_BASE_URL = "http://localhost:3001/api";

export interface Question {
    id: string;
    questionId: string;
    slug: string;
    title: string;
    difficulty: string;
    acRate: number;
    isPaidOnly: boolean;
    description?: string;
    exampleTestcases?: string;
    hints?: string[];
    topicTags: Array<{ name: string; id: string; slug: string }>;
    likes: number;
    dislikes: number;
    similarQuestions?: string;
    createdAt: string;
    updatedAt: string;
}

export interface QuestionsResponse {
    success: boolean;
    data: Question[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface QuestionDetailResponse {
    success: boolean;
    data: Question & {
        question?: string;
        exampleTestcases?: string;
    };
}

export interface TopicsResponse {
    success: boolean;
    data: Array<{ name: string; id: string; slug: string; count: number }>;
}

export interface StatsResponse {
    success: boolean;
    data: {
        total: number;
        easy: number;
        medium: number;
        hard: number;
        isEmpty: boolean;
    };
}

export async function fetchQuestions(options?: {
    page?: number;
    limit?: number;
    difficulty?: "Easy" | "Medium" | "Hard";
    topic?: string;
    search?: string;
}): Promise<QuestionsResponse> {
    const params = new URLSearchParams();

    if (options?.page) params.append("page", options.page.toString());
    if (options?.limit) params.append("limit", options.limit.toString());
    if (options?.difficulty) params.append("difficulty", options.difficulty);
    if (options?.topic) params.append("topic", options.topic);
    if (options?.search) params.append("search", options.search);

    const response = await fetch(
        `${API_BASE_URL}/questions?${params.toString()}`
    );

    if (!response.ok) {
        throw new Error(`Failed to fetch questions: ${response.statusText}`);
    }

    return response.json();
}

export async function fetchQuestionBySlug(
    slug: string
): Promise<QuestionDetailResponse> {
    const response = await fetch(`${API_BASE_URL}/questions/${slug}`);

    if (!response.ok) {
        throw new Error(`Failed to fetch question: ${response.statusText}`);
    }

    return response.json();
}

export async function fetchTopics(): Promise<TopicsResponse> {
    const response = await fetch(`${API_BASE_URL}/questions/topics`);

    if (!response.ok) {
        throw new Error(`Failed to fetch topics: ${response.statusText}`);
    }

    return response.json();
}

export async function fetchStats(): Promise<StatsResponse> {
    const response = await fetch(`${API_BASE_URL}/questions/stats`);

    if (!response.ok) {
        throw new Error(`Failed to fetch stats: ${response.statusText}`);
    }

    return response.json();
}

export async function syncQuestions(limit: number = 3000): Promise<{
    success: boolean;
    message: string;
    stats: {
        created: number;
        updated: number;
        skipped: number;
        total: number;
    };
}> {
    const response = await fetch(
        `${API_BASE_URL}/questions/sync?limit=${limit}`,
        {
            method: "POST",
        }
    );

    if (!response.ok) {
        throw new Error(`Failed to sync questions: ${response.statusText}`);
    }

    return response.json();
}
