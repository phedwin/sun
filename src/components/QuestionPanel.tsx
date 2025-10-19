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

import { useState } from "react";
import { Eye, EyeOff, BookOpen, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { LeetCodeProblemDetail } from "@/lib/leetcodeApi";

interface QuestionPanelProps {
    problem?: LeetCodeProblemDetail | null;
}

export const QuestionPanel = ({ problem }: QuestionPanelProps) => {
    const [showHint, setShowHint] = useState(false);

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

    if (!problem) {
        return (
            <div className="h-full flex items-center justify-center p-8">
                <div className="text-center space-y-4">
                    <BookOpen className="h-16 w-16 mx-auto text-muted-foreground opacity-50" />
                    <p className="text-lg font-semibold text-muted-foreground">
                        No problem selected
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Choose a problem from the questions page!
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Problem Title and Meta */}
            <div>
                <div className="flex items-start gap-3 mb-3">
                    <h1 className="text-3xl font-bold flex-1">
                        {problem.questionFrontendId}. {problem.questionTitle}
                    </h1>
                    <Badge
                        className={`${getDifficultyColor(problem.difficulty)} px-4 py-1 text-base`}
                    >
                        {problem.difficulty}
                    </Badge>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                        <ThumbsUp className="h-4 w-4" />
                        {problem.likes?.toLocaleString() || 0} likes
                    </span>
                    {problem.topicTags && problem.topicTags.length > 0 && (
                        <Badge variant="outline">
                            {problem.topicTags[0].name}
                        </Badge>
                    )}
                </div>
            </div>

            {/* Problem Description */}
            <div
                className="prose prose-sm dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: problem.question }}
            />

            {/* Example Test Cases (if available) */}
            {problem.exampleTestcases && (
                <Card className="border-2 border-[hsl(var(--earth-brown))]">
                    <CardHeader>
                        <CardTitle>Example Test Cases</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <pre className="text-sm bg-muted p-4 rounded overflow-x-auto">
                            {problem.exampleTestcases}
                        </pre>
                    </CardContent>
                </Card>
            )}

            {/* Hints (collapsible) */}
            {problem.hints && problem.hints.length > 0 && (
                <Collapsible open={showHint} onOpenChange={setShowHint}>
                    <CollapsibleTrigger asChild>
                        <Button
                            variant="outline"
                            className="w-full border-2 border-[hsl(var(--sunset-orange))] hover:bg-[hsl(var(--sunset-orange))]/10"
                        >
                            <span className="flex items-center gap-2">
                                💡 Show Hints ({problem.hints.length})
                                {showHint ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </span>
                        </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-4 space-y-3">
                        {problem.hints.map((hint, i) => (
                            <Card
                                key={i}
                                className="border-2 border-[hsl(var(--savanna-gold))]"
                            >
                                <CardContent className="p-4">
                                    <div className="flex gap-3">
                                        <span className="font-bold text-[hsl(var(--savanna-gold))] flex-shrink-0">
                                            Hint {i + 1}:
                                        </span>
                                        <p className="text-sm">{hint}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </CollapsibleContent>
                </Collapsible>
            )}

            {/* Topic Tags */}
            {problem.topicTags && problem.topicTags.length > 0 && (
                <div>
                    <h3 className="font-bold mb-2">Topics:</h3>
                    <div className="flex flex-wrap gap-2">
                        {problem.topicTags.map((tag) => (
                            <Badge
                                key={tag.slug}
                                variant="outline"
                                className="border-[hsl(var(--sunset-orange))]"
                            >
                                {tag.name}
                            </Badge>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
