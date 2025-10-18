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

interface leaderboard {
    rank: number;
    name: string;
    xp: number;
    streak: number;
    score: number;
}

/* TODO real CALL should sort by XP & limit=5 */

const MOCK_LEADERBOARD: Array<leaderboard> = [
    { rank: 1, name: "phedwin", xp: 15420, streak: 28, score: 94 },
    { rank: 2, name: "sarah", xp: 14230, streak: 21, score: 92 },
    { rank: 3, name: "mike", xp: 13100, streak: 19, score: 89 },
    { rank: 4, name: "john", xp: 1250, streak: 7, score: 89 },
    { rank: 5, name: "emma", xp: 12500, streak: 15, score: 87 },
];

export default MOCK_LEADERBOARD;
