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
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FooterComponent from "@/components/Footer";
import { getTopicTags } from "@/lib/leetcodeApi";
import {
    Code2,
    Database,
    GitBranch,
    Layers,
    ListTree,
    Hash,
    Boxes,
    Binary,
    Search,
    Zap,
    ArrowRight,
} from "lucide-react";

const topicIcons: { [key: string]: any } = {
    array: Layers,
    string: Code2,
    "hash-table": Hash,
    "linked-list": ListTree,
    database: Database,
    tree: GitBranch,
    "binary-tree": Binary,
    graph: GitBranch,
    "dynamic-programming": Zap,
    stack: Boxes,
    "binary-search": Search,
    math: Code2,
    sorting: ListTree,
    greedy: Zap,
    backtracking: GitBranch,
    "depth-first-search": Search,
    "breadth-first-search": Search,
    "two-pointers": Code2,
};

const Landing = () => {
    const [topics, setTopics] = useState<
        Array<{ name: string; slug: string; count: number }>
    >([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [animatedTopics, setAnimatedTopics] = useState<
        Array<{
            topic: { name: string; slug: string; count: number };
            fromX: string;
            fromY: string;
            fromRotate: string;
            delay: number;
            color: string;
        }>
    >([]);
    const navigate = useNavigate();

    const colors = [
        "hsl(var(--sunset-orange))",
        "hsl(var(--sunset-pink))",
        "hsl(var(--savanna-gold))",
        "hsl(var(--sky-blue))",
        "hsl(var(--bead-red))",
        "hsl(var(--bead-green))",
        "hsl(var(--bead-blue))",
    ];

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Load topics directly from LeetCode API
                const topicsData = await getTopicTags();

                // Filter to get only topics with 20+ problems and take top 20
                const filteredTopics = topicsData
                    .filter((topic) => topic.count >= 20)
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 20);

                setTopics(filteredTopics);

                // Create random animation properties for each topic
                const animated = filteredTopics.map((topic, index) => {
                    const fromX =
                        Math.random() > 0.5
                            ? `${Math.random() * 100}vw`
                            : `-${Math.random() * 50}vw`;
                    const fromY =
                        Math.random() > 0.5
                            ? `${Math.random() * 100}vh`
                            : `-${Math.random() * 100}vh`;
                    const fromRotate = `${Math.random() * 360 - 180}deg`;
                    const delay = index * 0.05; // Stagger the animations
                    const color = colors[index % colors.length];

                    return { topic, fromX, fromY, fromRotate, delay, color };
                });

                setAnimatedTopics(animated);
            } catch (err) {
                setError("Failed to load topics. Please try again later.");
                console.error("Error loading topics:", err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const handleTopicClick = (topic: string) => {
        navigate(`/questions?topic=${encodeURIComponent(topic)}`);
    };

    const handleViewAllClick = () => {
        navigate("/questions");
    };

    const getTopicIcon = (slug: string) => {
        const Icon = topicIcons[slug] || Code2;
        return Icon;
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-background via-background to-[hsl(var(--earth-brown))]/5">
            <Header />

            <main className="container py-16 px-4">
                <div className="space-y-16">
                    {/* Hero Section - Simple & Calm */}
                    <div className="text-center space-y-6 py-20 relative">
                        {/* Subtle background orbs */}
                        <div className="absolute inset-0 -z-10 overflow-hidden">
                            <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[hsl(var(--sunset-orange))]/5 blur-3xl"></div>
                            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-[hsl(var(--savanna-gold))]/5 blur-3xl"></div>
                        </div>

                        {/* Peaceful sun icon */}
                        <div className="text-8xl mb-6 opacity-80">☀️</div>

                        <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4">
                            Welcome to <span className="bg-gradient-to-r from-[hsl(var(--sunset-orange))] to-[hsl(var(--savanna-gold))] bg-clip-text text-transparent">SUN</span>
                        </h1>

                        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                            Your journey to mastering code starts here.
                            <br />
                            Simple. Focused. Beautiful.
                        </p>

                        <div className="flex items-center justify-center gap-8 pt-8 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-[hsl(var(--sunset-orange))]"></div>
                                <span>{topics.reduce((sum, t) => sum + t.count, 0)} Problems</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-[hsl(var(--savanna-gold))]"></div>
                                <span>{topics.length} Topics</span>
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="rounded-lg border border-red-500 bg-red-50 dark:bg-red-950 p-4">
                            <p className="text-red-800 dark:text-red-200">
                                {error}
                            </p>
                        </div>
                    )}

                    {/* Topics Grid - Calm & Simple */}
                    <div className="space-y-8">
                        <div className="text-center space-y-2">
                            <h2 className="text-3xl font-bold text-foreground">
                                Explore Topics
                            </h2>
                            <p className="text-muted-foreground">
                                Choose a path and begin your learning journey
                            </p>
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-6xl mx-auto">
                                {[...Array(12)].map((_, i) => (
                                    <Card key={i} className="animate-pulse h-32">
                                        <CardHeader>
                                            <div className="h-6 bg-muted rounded w-3/4"></div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="h-4 bg-muted rounded w-1/2"></div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-6xl mx-auto">
                                {animatedTopics.map(({ topic, delay, color }) => {
                                    const Icon = getTopicIcon(topic.slug);
                                    return (
                                        <Card
                                            key={topic.slug}
                                            className="cursor-pointer hover:shadow-lg transition-all duration-300 border group relative backdrop-blur-sm bg-card/50 hover:bg-card"
                                            style={{
                                                animation: `fadeIn 0.6s ease-out ${delay}s both`,
                                            }}
                                            onClick={() => handleTopicClick(topic.slug)}
                                        >
                                            {/* Subtle accent line */}
                                            <div
                                                className="absolute top-0 left-0 right-0 h-1 rounded-t-lg"
                                                style={{ backgroundColor: color }}
                                            ></div>

                                            <CardHeader className="pb-3">
                                                <div className="flex items-center justify-between">
                                                    <Icon
                                                        className="h-8 w-8 transition-transform group-hover:scale-110"
                                                        style={{ color, opacity: 0.8 }}
                                                    />
                                                    <span className="text-sm font-medium text-muted-foreground">
                                                        {topic.count}
                                                    </span>
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                <h3 className="font-semibold text-lg mb-1">
                                                    {topic.name}
                                                </h3>
                                                <p className="text-sm text-muted-foreground">
                                                    {topic.count === 1 ? "1 problem" : `${topic.count} problems`}
                                                </p>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        )}

                        <div className="text-center pt-4">
                            <button
                                onClick={handleViewAllClick}
                                className="inline-flex items-center gap-2 text-foreground hover:text-[hsl(var(--sunset-orange))] transition-colors font-medium"
                            >
                                View All Problems
                                <ArrowRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    {/* Feature Section - Minimal & Sweet */}
                    <div className="max-w-4xl mx-auto space-y-6 pt-12">
                        <div className="text-center space-y-2 mb-8">
                            <h2 className="text-3xl font-bold text-foreground">
                                What You'll Find
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card
                                className="text-center cursor-pointer hover:shadow-lg transition-all duration-300 border group relative backdrop-blur-sm bg-card/50 hover:bg-card"
                                onClick={() => navigate("/questions")}
                            >
                                <div className="absolute top-0 left-0 right-0 h-1 bg-[hsl(var(--sunset-orange))] rounded-t-lg"></div>
                                <CardHeader className="pt-8 pb-3">
                                    <Code2 className="h-12 w-12 mx-auto text-[hsl(var(--sunset-orange))]/80 group-hover:scale-110 transition-transform" />
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <h3 className="font-semibold text-lg">Real Problems</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        Practice with LeetCode's extensive problem library
                                    </p>
                                </CardContent>
                            </Card>

                            <Card
                                className="text-center cursor-pointer hover:shadow-lg transition-all duration-300 border group relative backdrop-blur-sm bg-card/50 hover:bg-card"
                                onClick={() => navigate("/curriculum")}
                            >
                                <div className="absolute top-0 left-0 right-0 h-1 bg-[hsl(var(--savanna-gold))] rounded-t-lg"></div>
                                <CardHeader className="pt-8 pb-3">
                                    <Zap className="h-12 w-12 mx-auto text-[hsl(var(--savanna-gold))]/80 group-hover:scale-110 transition-transform" />
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <h3 className="font-semibold text-lg">Guided Journey</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        Follow a roadmap and collect beads of wisdom
                                    </p>
                                </CardContent>
                            </Card>

                            <Card
                                className="text-center cursor-pointer hover:shadow-lg transition-all duration-300 border group relative backdrop-blur-sm bg-card/50 hover:bg-card"
                                onClick={() => navigate("/profile")}
                            >
                                <div className="absolute top-0 left-0 right-0 h-1 bg-[hsl(var(--sunset-pink))] rounded-t-lg"></div>
                                <CardHeader className="pt-8 pb-3">
                                    <GitBranch className="h-12 w-12 mx-auto text-[hsl(var(--sunset-pink))]/80 group-hover:scale-110 transition-transform" />
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <h3 className="font-semibold text-lg">Track Progress</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        Watch your growth and climb the leaderboard
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>

            <FooterComponent />
        </div>
    );
};

export default Landing;
