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

import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Eye, Filter, X } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { PAGINATE } from "@/lib/CONSTATS";
import { getDifficultyColor } from "@/lib/island";
import FooterComponent from "@/components/Footer";
import { fetchFilteredProblems, LeetCodeProblem } from "@/lib/leetcodeApi";

const Questions = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [questions, setQuestions] = useState<LeetCodeProblem[]>([]);
    const [allQuestions, setAllQuestions] = useState<LeetCodeProblem[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalQuestions, setTotalQuestions] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedDifficulty, setSelectedDifficulty] = useState<
        "Easy" | "Medium" | "Hard" | null
    >(null);
    const [currentTopic, setCurrentTopic] = useState<string | null>(null);
    const navigate = useNavigate();

    // Get topic from URL params
    useEffect(() => {
        const topic = searchParams.get("topic");
        setCurrentTopic(topic);
    }, [searchParams]);

    // Fetch questions based on filters
    useEffect(() => {
        const loadQuestions = async () => {
            try {
                setLoading(true);
                setError(null);
                const problems = await fetchFilteredProblems(
                    500,
                    0,
                    selectedDifficulty || undefined,
                    currentTopic || undefined
                );
                setAllQuestions(problems);
                setTotalQuestions(problems.length);
                setTotalPages(Math.ceil(problems.length / PAGINATE));
                // Reset to page 1 when filters change
                setCurrentPage(1);
            } catch (err) {
                const errorMessage =
                    err instanceof Error
                        ? err.message
                        : "Failed to load questions. Please try again later.";

                // Show friendly message for rate limits
                if (errorMessage.includes("rate limit") || errorMessage.includes("429")) {
                    setError("🌴 The API is taking a quick rest! We're using cached problems for you. Try refreshing in a few minutes for new content.");
                } else {
                    setError(errorMessage);
                }
                console.error("Error loading questions:", err);
            } finally {
                setLoading(false);
            }
        };

        loadQuestions();
    }, [selectedDifficulty, currentTopic]);

    // Paginate questions client-side
    useEffect(() => {
        const startIndex = (currentPage - 1) * PAGINATE;
        const endIndex = startIndex + PAGINATE;
        setQuestions(allQuestions.slice(startIndex, endIndex));
    }, [allQuestions, currentPage]);

    // Navigate to code platform with question slug in URL
    const handleQuestionClick = (question: LeetCodeProblem) => {
        // Remove trailing numbers from slug (e.g., "two-sum-1" -> "two-sum")
        const cleanSlug = question.titleSlug.replace(/-\d+$/, '');
        navigate(`/code?question=${cleanSlug}`);
    };

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleDifficultyFilter = (difficulty: "Easy" | "Medium" | "Hard") => {
        if (selectedDifficulty === difficulty) {
            setSelectedDifficulty(null);
        } else {
            setSelectedDifficulty(difficulty);
        }
    };

    const clearTopicFilter = () => {
        setSearchParams({});
        setCurrentTopic(null);
    };

    const getTopicDisplayName = (slug: string | null) => {
        if (!slug) return null;
        return slug
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="container py-8">
                <div className="space-y-6">
                    {/* Header with filters */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold">
                                    {currentTopic
                                        ? getTopicDisplayName(currentTopic)
                                        : "All"}{" "}
                                    Problems
                                </h1>
                                <p className="text-text-secondary mt-2">
                                    {totalQuestions}{" "}
                                    {selectedDifficulty
                                        ? selectedDifficulty.toLowerCase()
                                        : ""}{" "}
                                    problems
                                    {currentTopic &&
                                        ` in ${getTopicDisplayName(currentTopic)}`}
                                </p>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-text-secondary">
                                <span>
                                    Page {currentPage} of {totalPages}
                                </span>
                            </div>
                        </div>

                        {/* Filter Pills */}
                        <div className="flex items-center gap-3 flex-wrap">
                            <div className="flex items-center gap-2">
                                <Filter className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium">
                                    Difficulty:
                                </span>
                            </div>
                            <Button
                                variant={
                                    selectedDifficulty === "Easy"
                                        ? "default"
                                        : "outline"
                                }
                                size="sm"
                                onClick={() => handleDifficultyFilter("Easy")}
                                className="difficulty-easy"
                            >
                                Easy
                            </Button>
                            <Button
                                variant={
                                    selectedDifficulty === "Medium"
                                        ? "default"
                                        : "outline"
                                }
                                size="sm"
                                onClick={() => handleDifficultyFilter("Medium")}
                                className="difficulty-medium"
                            >
                                Medium
                            </Button>
                            <Button
                                variant={
                                    selectedDifficulty === "Hard"
                                        ? "default"
                                        : "outline"
                                }
                                size="sm"
                                onClick={() => handleDifficultyFilter("Hard")}
                                className="difficulty-hard"
                            >
                                Hard
                            </Button>

                            {currentTopic && (
                                <>
                                    <div className="h-4 w-px bg-border"></div>
                                    <Badge
                                        variant="secondary"
                                        className="gap-2"
                                    >
                                        Topic:{" "}
                                        {getTopicDisplayName(currentTopic)}
                                        <X
                                            className="h-3 w-3 cursor-pointer hover:text-destructive"
                                            onClick={clearTopicFilter}
                                        />
                                    </Badge>
                                </>
                            )}

                            {(selectedDifficulty || currentTopic) && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        setSelectedDifficulty(null);
                                        clearTopicFilter();
                                    }}
                                    className="text-muted-foreground"
                                >
                                    Clear All
                                </Button>
                            )}
                        </div>
                    </div>

                    {error && (
                        <div className="rounded-xl border-4 border-[hsl(var(--sunset-orange))] bg-gradient-to-r from-[hsl(var(--sunset-orange))]/10 to-[hsl(var(--savanna-gold))]/10 p-6">
                            <div className="flex items-start gap-4">
                                <div className="text-5xl">🌴</div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-[hsl(var(--sunset-orange))] to-[hsl(var(--savanna-gold))] bg-clip-text text-transparent">
                                        Taking a Quick Rest!
                                    </h3>
                                    <p className="text-base leading-relaxed">
                                        {error}
                                    </p>
                                    <p className="text-sm mt-3 text-muted-foreground font-semibold">
                                        💡 All your progress is safe and cached problems are ready to practice!
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {loading ? (
                        <div className="rounded-lg border border-border bg-card">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-16">
                                            #
                                        </TableHead>
                                        <TableHead>Question</TableHead>
                                        {/* <TableHead className="w-20">
                                            Hint
                                        </TableHead> */}
                                        <TableHead className="w-24">
                                            Difficulty
                                        </TableHead>
                                        <TableHead className="w-32">
                                            Category
                                        </TableHead>
                                        <TableHead className="w-24 text-right">
                                            Acceptance
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                            </Table>
                        </div>
                    ) : (
                        <div className="rounded-lg border border-border bg-card">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-16">
                                            #
                                        </TableHead>
                                        <TableHead>Question</TableHead>
                                        <TableHead className="w-20">
                                            Hint
                                        </TableHead>
                                        <TableHead className="w-24">
                                            Difficulty
                                        </TableHead>
                                        <TableHead className="w-32">
                                            Category
                                        </TableHead>
                                        <TableHead className="w-24 text-right">
                                            Acceptance
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {questions.map((question, index) => (
                                        <TableRow
                                            key={question.questionFrontendId}
                                            className="cursor-pointer hover:bg-muted/50 transition-colors"
                                            onClick={() =>
                                                handleQuestionClick(question)
                                            }
                                        >
                                            <TableCell className="font-mono text-sm text-muted-foreground">
                                                {currentTopic ||
                                                selectedDifficulty
                                                    ? (currentPage - 1) *
                                                          PAGINATE +
                                                      index +
                                                      1
                                                    : question.questionFrontendId}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <h3 className="font-medium hover:text-primary transition-colors">
                                                        {question.title}
                                                    </h3>
                                                </div>
                                                <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                                                    {question.topicTags
                                                        .map((tag) => tag.name)
                                                        .join(", ")}
                                                </p>
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                    }}
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    className={getDifficultyColor(
                                                        question.difficulty
                                                    )}
                                                >
                                                    {question.difficulty}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">
                                                    {question.topicTags[0]
                                                        ?.name || "General"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right font-mono text-sm">
                                                {question.acRate.toFixed(1)}%
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}

                    {/* Pagination */}
                    <div className="flex items-center justify-center gap-2 py-8">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            Previous
                        </Button>

                        <div className="flex items-center gap-1">
                            {Array.from(
                                { length: Math.min(5, totalPages) },
                                (_, i) => {
                                    let pageNum;
                                    if (totalPages <= 5) {
                                        pageNum = i + 1;
                                    } else if (currentPage <= 3) {
                                        pageNum = i + 1;
                                    } else if (currentPage >= totalPages - 2) {
                                        pageNum = totalPages - 4 + i;
                                    } else {
                                        pageNum = currentPage - 2 + i;
                                    }

                                    return (
                                        <Button
                                            key={pageNum}
                                            variant={
                                                currentPage === pageNum
                                                    ? "default"
                                                    : "outline"
                                            }
                                            size="sm"
                                            className="w-8 h-8 p-0"
                                            onClick={() =>
                                                handlePageChange(pageNum)
                                            }
                                        >
                                            {pageNum}
                                        </Button>
                                    );
                                }
                            )}
                        </div>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Next
                            <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                    </div>
                </div>
            </main>

            <FooterComponent />
        </div>
    );
};

export default Questions;
