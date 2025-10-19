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
import { useSearchParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { CodeEditor } from "@/components/CodeEditor";
import { QuestionPanel } from "@/components/QuestionPanel";
import { fetchProblemDetail, LeetCodeProblemDetail } from "@/lib/leetcodeApi";
import { generateCodeSkeleton } from "@/lib/codeSkeletonGenerator";
import { Loader2, AlertCircle } from "lucide-react";

const CodePlatform = () => {
    const [searchParams] = useSearchParams();
    const questionSlug = searchParams.get("question");

    const [problem, setProblem] = useState<LeetCodeProblemDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [initialCode, setInitialCode] = useState<{ [key: string]: string }>({});

    // Fetch problem details when question slug changes
    useEffect(() => {
        const loadProblem = async () => {
            if (!questionSlug) {
                setError("No question specified");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                // Try to get from cache first
                const cacheKey = `problem_${questionSlug}`;
                const cached = localStorage.getItem(cacheKey);

                if (cached) {
                    const problemData = JSON.parse(cached);
                    setProblem(problemData);

                    // Generate code skeletons
                    const skeletons = {
                        javascript: generateCodeSkeleton({
                            slug: questionSlug,
                            language: 'javascript'
                        }),
                        python: generateCodeSkeleton({
                            slug: questionSlug,
                            language: 'python'
                        }),
                        java: generateCodeSkeleton({
                            slug: questionSlug,
                            language: 'java'
                        }),
                        cpp: generateCodeSkeleton({
                            slug: questionSlug,
                            language: 'cpp'
                        })
                    };

                    setInitialCode(skeletons);
                    setLoading(false);
                } else {
                    // Fetch from API
                    const problemData = await fetchProblemDetail(questionSlug);
                    setProblem(problemData);

                    // Cache it
                    localStorage.setItem(cacheKey, JSON.stringify(problemData));

                    // Generate code skeletons
                    const skeletons = {
                        javascript: generateCodeSkeleton({
                            slug: questionSlug,
                            language: 'javascript'
                        }),
                        python: generateCodeSkeleton({
                            slug: questionSlug,
                            language: 'python'
                        }),
                        java: generateCodeSkeleton({
                            slug: questionSlug,
                            language: 'java'
                        }),
                        cpp: generateCodeSkeleton({
                            slug: questionSlug,
                            language: 'cpp'
                        })
                    };

                    setInitialCode(skeletons);
                    setLoading(false);
                }
            } catch (err) {
                console.error("Error loading problem:", err);
                const errorMessage = err instanceof Error ? err.message : "Failed to load problem";

                // Show friendly error for rate limits
                if (errorMessage.includes("rate limit") || errorMessage.includes("429")) {
                    setError("🌴 API taking a rest! Try another problem or refresh in a few minutes.");
                } else {
                    setError(errorMessage);
                }
                setLoading(false);
            }
        };

        loadProblem();
    }, [questionSlug]);

    return (
        <div className="h-screen flex flex-col bg-background">
            <Header />

            {loading ? (
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center space-y-4">
                        <Loader2 className="h-12 w-12 animate-spin mx-auto text-[hsl(var(--sunset-orange))]" />
                        <p className="text-lg font-semibold">Loading problem...</p>
                    </div>
                </div>
            ) : error ? (
                <div className="flex-1 flex items-center justify-center p-8">
                    <div className="max-w-md rounded-xl border-4 border-[hsl(var(--sunset-orange))] bg-gradient-to-r from-[hsl(var(--sunset-orange))]/10 to-[hsl(var(--savanna-gold))]/10 p-8">
                        <div className="flex items-start gap-4">
                            <AlertCircle className="h-12 w-12 text-[hsl(var(--sunset-orange))] flex-shrink-0" />
                            <div>
                                <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-[hsl(var(--sunset-orange))] to-[hsl(var(--savanna-gold))] bg-clip-text text-transparent">
                                    Oops!
                                </h3>
                                <p className="text-base">{error}</p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex overflow-hidden">
                    {/* Left side - Question (scrollable) */}
                    <div className="w-1/2 overflow-y-auto border-r border-border">
                        <QuestionPanel problem={problem} />
                    </div>

                    {/* Right side - Editor (sticky) */}
                    <div className="w-1/2 flex flex-col">
                        <CodeEditor
                            initialCode={initialCode}
                            problemSlug={questionSlug || undefined}
                            problemTitle={problem?.questionTitle}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default CodePlatform;
