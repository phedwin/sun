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

export const PYTHON_TRACKS = [
    {
        id: "beginner",
        title: "Python Fundamentals",
        description: "Start your Python journey with the basics",
        difficulty: "Beginner",
        estimatedTime: "4-6 weeks",
        progress: 75,
        modules: [
            {
                id: 1,
                title: "Variables and Data Types",
                completed: true,
                locked: false,
            },
            {
                id: 2,
                title: "Control Flow (if/else)",
                completed: true,
                locked: false,
            },
            {
                id: 3,
                title: "Loops (for/while)",
                completed: true,
                locked: false,
            },
            {
                id: 4,
                title: "Functions and Parameters",
                completed: false,
                locked: false,
            },
            {
                id: 5,
                title: "Lists and Dictionaries",
                completed: false,
                locked: false,
            },
            {
                id: 6,
                title: "File I/O and Error Handling",
                completed: false,
                locked: true,
            },
        ],
    },
    {
        id: "intermediate",
        title: "Object-Oriented Programming",
        description: "Master classes, objects, and OOP principles",
        difficulty: "Intermediate",
        estimatedTime: "6-8 weeks",
        progress: 30,
        modules: [
            {
                id: 1,
                title: "Classes and Objects",
                completed: true,
                locked: false,
            },
            {
                id: 2,
                title: "Inheritance and Polymorphism",
                completed: false,
                locked: false,
            },
            {
                id: 3,
                title: "Abstract Classes and Interfaces",
                completed: false,
                locked: true,
            },
            { id: 4, title: "Design Patterns", completed: false, locked: true },
            {
                id: 5,
                title: "Exception Handling",
                completed: false,
                locked: true,
            },
            {
                id: 6,
                title: "Testing with unittest",
                completed: false,
                locked: true,
            },
        ],
    },
    {
        id: "advanced",
        title: "Data Structures & Algorithms",
        description: "Advanced topics for competitive programming",
        difficulty: "Advanced",
        estimatedTime: "8-12 weeks",
        progress: 0,
        modules: [
            {
                id: 1,
                title: "Time & Space Complexity",
                completed: false,
                locked: true,
            },
            {
                id: 2,
                title: "Arrays and Strings",
                completed: false,
                locked: true,
            },
            {
                id: 3,
                title: "Linked Lists and Trees",
                completed: false,
                locked: true,
            },
            {
                id: 4,
                title: "Graphs and Dynamic Programming",
                completed: false,
                locked: true,
            },
            {
                id: 5,
                title: "Advanced Algorithms",
                completed: false,
                locked: true,
            },
            {
                id: 6,
                title: "System Design Basics",
                completed: false,
                locked: true,
            },
        ],
    },
];
