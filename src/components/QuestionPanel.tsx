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
import { useSearchParams } from "react-router-dom";
import { Eye, EyeOff, RefreshCw, BookOpen, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { fetchQuestionBySlug } from "@/lib/api";
import { generateCodeTemplates } from "@/lib/codeTemplates";

const SAMPLE_QUESTION = {
    id: 1,
    title: "Two Sum",
    difficulty: "easy",
    description:
        "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    examples: [
        {
            input: "nums = [2,7,11,15], target = 9",
            output: "[0,1]",
            explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
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
};

export const QuestionPanel = () => {
    const [searchParams] = useSearchParams();
    const [currentQuestion, setCurrentQuestion] = useState(SAMPLE_QUESTION);
    const [showHint, setShowHint] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty.toLowerCase()) {
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

    useEffect(() => {
        // Get the question slug from URL parameter
        const questionSlug = searchParams.get("question");

        if (questionSlug) {
            const loadQuestionBySlug = async () => {
                try {
                    setIsLoading(true);
                    setError(null);

                    const response = await fetchQuestionBySlug(questionSlug);
                    const question = response.data;

                    // Parse the HTML question content to extract text
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(
                        question.question || question.description || "",
                        "text/html"
                    );
                    const questionText =
                        doc.body.textContent ||
                        question.description ||
                        "No description available";

                    // Parse examples from HTML
                    const examples = parseExamples(
                        question.exampleTestcases || "",
                        question.question || ""
                    );

                    // Convert to QuestionPanel format
                    const convertedQuestion = {
                        id: parseInt(question.questionId),
                        title: question.title,
                        difficulty: question.difficulty.toLowerCase(),
                        description: questionText,
                        examples: examples,
                        constraints: extractConstraints(
                            question.question || ""
                        ),
                        hint:
                            question.hints && question.hints.length > 0
                                ? question.hints[0]
                                : "Think about the optimal approach for this problem.",
                        category: question.topicTags[0]?.name || "General",
                        acceptanceRate: `${question.acRate.toFixed(1)}%`,
                        submissions: `${(question.likes / 1000).toFixed(1)}K`,
                    };

                    // Generate code templates for this question
                    const codeTemplates = generateCodeTemplates(
                        question.title,
                        questionSlug
                    );
                    localStorage.setItem(
                        "codeTemplates",
                        JSON.stringify(codeTemplates)
                    );

                    setCurrentQuestion(convertedQuestion);
                    setIsLoading(false);
                } catch (error) {
                    console.error("Error loading question:", error);
                    setError("Failed to load question. Please try again.");
                    setIsLoading(false);
                }
            };

            loadQuestionBySlug();
        }
    }, [searchParams]);

    // Helper function to parse examples from test cases and HTML
    const parseExamples = (
        exampleTestcases: string,
        questionHtml: string
    ): Array<{ input: string; output: string; explanation?: string }> => {
        const examples: Array<{
            input: string;
            output: string;
            explanation?: string;
        }> = [];

        // Parse HTML to extract examples
        const parser = new DOMParser();
        const doc = parser.parseFromString(questionHtml, "text/html");
        const exampleElements = doc.querySelectorAll(
            ".example, strong.example"
        );

        if (exampleElements.length > 0) {
            exampleElements.forEach((elem) => {
                const parent = elem.parentElement;
                if (parent) {
                    const preElements = parent.querySelectorAll("pre");
                    if (preElements.length > 0) {
                        const text = preElements[0].textContent || "";
                        const lines = text.split("\n");
                        const inputLine = lines.find((l) =>
                            l.includes("Input:")
                        );
                        const outputLine = lines.find((l) =>
                            l.includes("Output:")
                        );
                        const explanationLine = lines.find((l) =>
                            l.includes("Explanation:")
                        );

                        examples.push({
                            input: inputLine || "See problem description",
                            output: outputLine || "See problem description",
                            explanation: explanationLine,
                        });
                    }
                }
            });
        }

        if (examples.length === 0 && exampleTestcases) {
            // Fallback: try to parse test cases
            const testLines = exampleTestcases.split("\n");
            for (let i = 0; i < testLines.length - 1; i += 2) {
                examples.push({
                    input: testLines[i] || "Example input",
                    output: testLines[i + 1] || "Example output",
                });
            }
        }

        return examples.length > 0
            ? examples
            : [
                  {
                      input: "See problem description",
                      output: "See problem description",
                  },
              ];
    };

    // Helper function to extract constraints from HTML
    const extractConstraints = (questionHtml: string): string[] => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(questionHtml, "text/html");
        const constraintsHeader = Array.from(
            doc.querySelectorAll("p, strong")
        ).find((elem) => elem.textContent?.includes("Constraints"));

        if (constraintsHeader && constraintsHeader.parentElement) {
            const ul = constraintsHeader.parentElement.querySelector("ul");
            if (ul) {
                const items = Array.from(ul.querySelectorAll("li")).map(
                    (li) => li.textContent || ""
                );
                return items.filter((item) => item.length > 0);
            }
        }

        return ["Please refer to the original problem for constraints"];
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
                {error && (
                    <div className="rounded-lg border border-red-500 bg-red-50 dark:bg-red-950 p-4">
                        <p className="text-red-800 dark:text-red-200">
                            {error}
                        </p>
                    </div>
                )}

                {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <>
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
                                {currentQuestion.examples.map(
                                    (example, index) => (
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
                                    )
                                )}
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
                                            <li
                                                key={index}
                                                className="font-mono"
                                            >
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
                    </>
                )}
            </div>
        </div>
    );
};
