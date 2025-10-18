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

export interface Question {
    id: string;
    title: string;
    difficulty: "Easy" | "Medium" | "Hard";
    description: string;
    category: string;
    acceptanceRate: number;
    submissions: number;
    timeLimit?: string;
}


export const mockQuestions: Question[] = Array.from({ length: 30 }, (_, i) => ({
    id: `q-${i + 1}`,
    title: `${["Two Sum", "Reverse Linked List", "Valid Parentheses", "Merge Intervals", "Binary Search"][i % 4]}${i > 3 ? ` ${Math.floor(i / 4) + 1}` : ""}`,
    difficulty: ["Easy", "Medium", "Hard"][i % 3] as "Easy" | "Medium" | "Hard",
    description: `Solve this ${["Easy", "Medium", "Hard"][i % 3].toLowerCase()} level coding challenge that tests your programming skills.`,
    category: ["Array", "String", "Hash Table"][i % 3],
    acceptanceRate: Math.floor(Math.random() * 40) + 30,
    submissions: Math.floor(Math.random() * 10000) + 1000,
    timeLimit: "2 hours",
}));







