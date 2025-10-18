/*
 * CJLF LICENSE (c) 2025
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

// TODO Mock API data - replace with real API call
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

///////////// CHAOS & CHAOS & CHAOS & CHAOS & CHAOOOOOOOOOOOOOOOOOOOOOOOOOOOOOS ////////////////////

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

// export async function mockQuestions(): Promise<Question[]> {
//     /* Fetch 100 questions in parallel */

//     const fetchPromises = Array.from({ length: 100 }, (_, idx) => {
//         const i = idx + 1;
//         return fetch(`https://leetcode-api-pied.vercel.app/problem/${i}`)
//             .then(async (res) => {
//                 if (!res.ok) {
//                     console.warn(
//                         `Fetch failed for problem ${i}: ${res.status} ${res.statusText}`
//                     );
//                     return null;
//                 }
//                 const data = await res.json();

//                 let acRate = 0;
//                 let submissions = 0;
//                 try {
//                     const stats = JSON.parse(data.stats);
//                     if (
//                         typeof stats.acRate === "string" &&
//                         stats.acRate.includes("%")
//                     ) {
//                         acRate = parseFloat(stats.acRate.replace("%", ""));
//                     } else if (typeof stats.acRate === "number") {
//                         acRate = stats.acRate;
//                     } else {
//                         acRate = 0;
//                     }
//                     submissions = stats.totalSubmissionRaw;
//                 } catch (_) {
//                     acRate = 0;
//                     submissions = 0;
//                 }

//                 // description may contain HTML; if you want to sanitize, do it here
//                 // For now, we leave it as-is. To strip HTML, use a library or a simple regex.

//                 return {
//                     id: data.questionId,
//                     title: data.title,
//                     difficulty: data.difficulty as "Easy" | "Medium" | "Hard",
//                     description: data.content, // contains HTML (leave as-is)
//                     category: data.categoryTitle || "General",
//                     acceptanceRate: acRate,
//                     submissions: submissions,
//                     timeLimit: "2 hours",
//                 } as Question;
//             })
//             .catch((err) => {
//                 console.error(`Failed to fetch problem ${i}`, err);
//                 return null;
//             });
//         // Uncomment the next line to debug fetched questions
//     });

//     const questions = (await Promise.all(fetchPromises)).filter(
//         (q): q is Question => q !== null
//     );
//     console.log(questions);

//     return questions;
// }
