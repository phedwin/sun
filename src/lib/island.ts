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

export const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
        case "Easy":
            return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
        case "Medium":
            return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
        case "Hard":
            return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
        default:
            return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    }
};

export const getDifficultyColorx = (difficulty: string) => {
    switch (difficulty) {
        case "Beginner":
            return "bg-green-500/10 text-green-500 border-green-500/20";
        case "Intermediate":
            return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
        case "Advanced":
            return "bg-red-500/10 text-red-500 border-red-500/20";
        default:
            return "bg-muted text-muted-foreground";
    }
};
