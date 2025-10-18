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

import { useState, useEffect } from "react";
import { Eye, EyeOff, RefreshCw, BookOpen, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { fetchProblemDetail, LeetCodeProblem, LeetCodeProblemDetail } from "@/lib/leetcodeApi";

const SAMPLE_QUESTIONS = [
    {
        id: 1,
        title: "Two Sum",
        difficulty: "easy",
        description:
            "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
        examples: [
            {
                input: "nums = [2,7,11,15], target = 9",
                output: "[0,1]",
                explanation:
                    "Because nums[0] + nums[1] == 9, we return [0, 1].",
            },
        ],
        constraints: [
            "2 ≤ nums.length ≤ 10⁴",
            "-10⁹ ≤ nums[i] ≤ 10⁹",
            "-10⁹ ≤ target ≤ 10⁹",
        ],
        hint: "Try using a hash map to store the numbers you've seen and their indices.",
        category: "Array",
        acceptanceRate: "49.1%",
        submissions: "8.2M",
    },
    {
        id: 2,
        title: "Valid Parentheses",
        difficulty: "easy",
        description:
            "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
        examples: [
            {
                input: 's = "()"',
                output: "true",
            },
            {
                input: 's = "()[]{}"',
                output: "true",
            },
            {
                input: 's = "(]"',
                output: "false",
            },
        ],
        constraints: [
            "1 ≤ s.length ≤ 10⁴",
            "s consists of parentheses only '()[]{}'.",
        ],
        hint: "Use a stack data structure to keep track of opening brackets.",
        category: "Stack",
        acceptanceRate: "40.8%",
        submissions: "3.1M",
    },
];

export const QuestionPanel = () => {
    const [currentQuestion, setCurrentQuestion] = useState(SAMPLE_QUESTIONS[0]);
    const [showHint, setShowHint] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case "easy":
                return "difficulty-easy";
            case "medium":
                return "difficulty-medium";
            case "hard":
                return "difficulty-hard";
            default:
                return "difficulty-easy";
        }
    };

    const loadNewQuestion = async () => {
        setIsLoading(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const randomQuestion =
            SAMPLE_QUESTIONS[
                Math.floor(Math.random() * SAMPLE_QUESTIONS.length)
            ];
        setCurrentQuestion(randomQuestion);
        setShowHint(false);
        setIsLoading(false);
    };

    useEffect(() => {
        // Check if there's a selected question from the dashboard
        const selectedQuestion = localStorage.getItem("selectedQuestion");
        if (selectedQuestion) {
            const question: LeetCodeProblem = JSON.parse(selectedQuestion);
            // Fetch the full question details from the API
            const loadQuestionDetails = async () => {
                try {
                    setIsLoading(true);
                    const details: LeetCodeProblemDetail = await fetchProblemDetail(question.titleSlug);

                    // Parse the HTML question content to extract text
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(details.question, 'text/html');
                    const questionText = doc.body.textContent || details.question;

                    // Parse example test cases
                    const examples = parseExamples(details.exampleTestcases, details.question);

                    // Convert to QuestionPanel format
                    const convertedQuestion = {
                        id: parseInt(details.questionFrontendId),
                        title: details.questionTitle,
                        difficulty: details.difficulty.toLowerCase(),
                        description: questionText,
                        examples: examples,
                        constraints: extractConstraints(details.question),
                        hint: details.hints[0] || "Think about the optimal approach for this problem.",
                        category: details.topicTags[0]?.name || 'General',
                        acceptanceRate: `${question.acRate.toFixed(1)}%`,
                        submissions: `${(details.likes / 1000).toFixed(1)}K`,
                    };
                    setCurrentQuestion(convertedQuestion);
                    setIsLoading(false);
                    localStorage.removeItem("selectedQuestion"); // Clear after loading
                } catch (error) {
                    console.error('Error loading question details:', error);
                    // Fallback to basic question info
                    const fallbackQuestion = {
                        id: parseInt(question.questionFrontendId),
                        title: question.title,
                        difficulty: question.difficulty.toLowerCase(),
                        description: `Solve the ${question.title} problem. Topic tags: ${question.topicTags.map(tag => tag.name).join(', ')}`,
                        examples: [
                            {
                                input: "Check the problem description",
                                output: "Expected output",
                            },
                        ],
                        constraints: ["Please refer to the original problem for constraints"],
                        hint: "Think about the optimal approach for this problem type",
                        category: question.topicTags[0]?.name || 'General',
                        acceptanceRate: `${question.acRate.toFixed(1)}%`,
                        submissions: "N/A",
                    };
                    setCurrentQuestion(fallbackQuestion);
                    setIsLoading(false);
                    localStorage.removeItem("selectedQuestion");
                }
            };

            loadQuestionDetails();
        } else {
            loadNewQuestion();
        }
    }, []);

    // Helper function to parse examples from test cases and HTML
    const parseExamples = (exampleTestcases: string, questionHtml: string): Array<{input: string, output: string, explanation?: string}> => {
        const examples: Array<{input: string, output: string, explanation?: string}> = [];

        // Parse HTML to extract examples
        const parser = new DOMParser();
        const doc = parser.parseFromString(questionHtml, 'text/html');
        const exampleElements = doc.querySelectorAll('.example, strong.example');

        if (exampleElements.length > 0) {
            exampleElements.forEach((elem) => {
                const parent = elem.parentElement;
                if (parent) {
                    const preElements = parent.querySelectorAll('pre');
                    if (preElements.length > 0) {
                        const text = preElements[0].textContent || '';
                        const lines = text.split('\n');
                        const inputLine = lines.find(l => l.includes('Input:'));
                        const outputLine = lines.find(l => l.includes('Output:'));
                        const explanationLine = lines.find(l => l.includes('Explanation:'));

                        examples.push({
                            input: inputLine || 'See problem description',
                            output: outputLine || 'See problem description',
                            explanation: explanationLine,
                        });
                    }
                }
            });
        }

        if (examples.length === 0) {
            // Fallback: try to parse test cases
            const testLines = exampleTestcases.split('\n');
            for (let i = 0; i < testLines.length - 1; i += 2) {
                examples.push({
                    input: testLines[i] || 'Example input',
                    output: testLines[i + 1] || 'Example output',
                });
            }
        }

        return examples.length > 0 ? examples : [{input: 'See problem description', output: 'See problem description'}];
    };

    // Helper function to extract constraints from HTML
    const extractConstraints = (questionHtml: string): string[] => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(questionHtml, 'text/html');
        const constraintsHeader = Array.from(doc.querySelectorAll('p, strong')).find(
            elem => elem.textContent?.includes('Constraints')
        );

        if (constraintsHeader && constraintsHeader.parentElement) {
            const ul = constraintsHeader.parentElement.querySelector('ul');
            if (ul) {
                const items = Array.from(ul.querySelectorAll('li')).map(li => li.textContent || '');
                return items.filter(item => item.length > 0);
            }
        }

        return ['Please refer to the original problem for constraints'];
    };

    return (
        <div className="h-full flex flex-col bg-surface">
            {/* Question Header */}
            <div className="p-4 border-b border-border">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <BookOpen className="h-5 w-5 text-primary" />
                        <h2 className="font-semibold text-text-primary">
                            Problem
                        </h2>
                    </div>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={loadNewQuestion}
                        disabled={isLoading}
                        className="text-text-secondary hover:text-text-primary"
                    >
                        <RefreshCw
                            className={`h-4 w-4${isLoading ? " animate-spin" : ""}`}
                        />
                    </Button>
                </div>

                <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-text-primary">
                        {currentQuestion.title}
                    </h3>
                    <Badge
                        className={getDifficultyColor(
                            currentQuestion.difficulty
                        )}
                    >
                        {currentQuestion.difficulty.charAt(0).toUpperCase() +
                            currentQuestion.difficulty.slice(1)}
                    </Badge>
                </div>

                <div className="flex items-center gap-4 text-sm text-text-secondary">
                    <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{currentQuestion.acceptanceRate}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{currentQuestion.submissions}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                        {currentQuestion.category}
                    </Badge>
                </div>
            </div>

            {/* Question Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="animate-fade-in prose prose-sm dark:prose-invert max-w-none">
                    <div className="text-text-primary leading-relaxed whitespace-pre-wrap">
                        {currentQuestion.description}
                    </div>
                </div>

                {/* Examples */}
                <Card className="glass-card animate-slide-up">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm text-text-secondary">
                            Examples
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {currentQuestion.examples.map((example, index) => (
                            <div
                                key={index}
                                className="bg-surface-elevated p-3 rounded-md"
                            >
                                <div className="space-y-1 text-sm font-mono">
                                    <div>
                                        <span className="text-text-secondary">
                                            Input:
                                        </span>{" "}
                                        <span className="text-text-primary">
                                            {example.input}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-text-secondary">
                                            Output:
                                        </span>{" "}
                                        <span className="text-primary">
                                            {example.output}
                                        </span>
                                    </div>
                                    {example.explanation && (
                                        <div className="text-text-muted pt-1">
                                            {example.explanation}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Constraints */}
                <Card className="glass-card animate-slide-up">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm text-text-secondary">
                            Constraints
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-1 text-sm text-text-primary">
                            {currentQuestion.constraints.map(
                                (constraint, index) => (
                                    <li key={index} className="font-mono">
                                        • {constraint}
                                    </li>
                                )
                            )}
                        </ul>
                    </CardContent>
                </Card>

                {/* Hint */}
                <Collapsible open={showHint} onOpenChange={setShowHint}>
                    <CollapsibleTrigger asChild>
                        <Button
                            variant="outline"
                            className="w-full justify-between glass-card hover:bg-surface-elevated"
                        >
                            <span>💡 Show Hint</span>
                            {showHint ? (
                                <EyeOff className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                        </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-2">
                        <Card className="glass-card bg-primary/5 border-primary/20 animate-slide-up">
                            <CardContent className="pt-4">
                                <p className="text-sm text-text-primary">
                                    {currentQuestion.hint}
                                </p>
                            </CardContent>
                        </Card>
                    </CollapsibleContent>
                </Collapsible>
            </div>
        </div>
    );
};
