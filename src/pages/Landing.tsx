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
        <div className="min-h-screen bg-background">
            <Header />

            <main className="container py-8">
                <div className="space-y-8">
                    {/* Hero Section */}
                    <div className="text-center space-y-4 py-12 relative overflow-hidden">
                        <div className="absolute inset-0 -z-10">
                            <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-gradient-to-br from-[hsl(var(--sunset-orange))] to-[hsl(var(--sunset-pink))] opacity-20 blur-3xl animate-[float_6s_ease-in-out_infinite]"></div>
                            <div className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-gradient-to-br from-[hsl(var(--savanna-gold))] to-[hsl(var(--sky-blue))] opacity-20 blur-3xl animate-[float_8s_ease-in-out_infinite_2s]"></div>
                        </div>
                        <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-[hsl(var(--sunset-orange))] via-[hsl(var(--sunset-pink))] to-[hsl(var(--savanna-gold))] bg-clip-text text-transparent animate-[float_4s_ease-in-out_infinite]">
                            Code. Code. Code :D
                        </h1>
                        <p className="text-2xl text-muted-foreground max-w-3xl mx-auto font-semibold">
                            Learn to code on a journey through vibrant lessons,
                            collect beads of wisdom, and unlock your potential!
                        </p>
                        <div className="flex items-center justify-center gap-6 pt-4">
                            <Badge
                                variant="outline"
                                className="text-lg px-4 py-2 bg-gradient-to-r from-[hsl(var(--sunset-orange))] to-[hsl(var(--sunset-pink))] text-white border-0"
                            >
                                {topics.reduce((sum, t) => sum + t.count, 0)}{" "}
                                Problems
                            </Badge>
                            <Badge
                                variant="outline"
                                className="text-lg px-4 py-2 bg-gradient-to-r from-[hsl(var(--savanna-gold))] to-[hsl(var(--sky-blue))] text-white border-0"
                            >
                                {topics.length} Topics
                            </Badge>
                        </div>
                    </div>

                    {error && (
                        <div className="rounded-lg border border-red-500 bg-red-50 dark:bg-red-950 p-4">
                            <p className="text-red-800 dark:text-red-200">
                                {error}
                            </p>
                        </div>
                    )}

                    {/* Topics Grid */}
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {[...Array(12)].map((_, i) => (
                                <Card key={i} className="animate-pulse">
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
                        <>
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-semibold">
                                    Browse by Topic
                                </h2>
                                <button
                                    onClick={handleViewAllClick}
                                    className="flex items-center gap-2 text-primary hover:underline"
                                >
                                    View All Problems
                                    <ArrowRight className="h-4 w-4" />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {animatedTopics.map(
                                    ({
                                        topic,
                                        fromX,
                                        fromY,
                                        fromRotate,
                                        delay,
                                        color,
                                    }) => {
                                        const Icon = getTopicIcon(topic.slug);
                                        return (
                                            <Card
                                                key={topic.slug}
                                                className="cursor-pointer hover:shadow-2xl hover:scale-105 transition-all duration-300 border-4 group overflow-hidden relative"
                                                style={{
                                                    animation: `stackIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}s both`,
                                                    // @ts-ignore
                                                    "--from-x": fromX,
                                                    "--from-y": fromY,
                                                    "--from-rotate": fromRotate,
                                                    borderColor: color,
                                                }}
                                                onClick={() =>
                                                    handleTopicClick(topic.slug)
                                                }
                                            >
                                                <div
                                                    className="absolute inset-0 opacity-10 transition-opacity group-hover:opacity-20"
                                                    style={{
                                                        background: `linear-gradient(135deg, ${color} 0%, transparent 100%)`,
                                                    }}
                                                ></div>
                                                <CardHeader className="pb-3 relative z-10">
                                                    <div className="flex items-center justify-between">
                                                        <Icon
                                                            className="h-10 w-10 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300"
                                                            style={{ color }}
                                                        />
                                                        <Badge
                                                            className="text-white border-0 text-base px-3 py-1 font-bold"
                                                            style={{
                                                                background:
                                                                    color,
                                                            }}
                                                        >
                                                            {topic.count}
                                                        </Badge>
                                                    </div>
                                                    <CardTitle className="text-xl mt-4 group-hover:scale-105 transition-transform font-bold">
                                                        {topic.name}
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent className="relative z-10">
                                                    <p className="text-base text-muted-foreground font-semibold">
                                                        {topic.count}{" "}
                                                        {topic.count === 1
                                                            ? "problem"
                                                            : "problems"}{" "}
                                                        waiting for you
                                                    </p>
                                                </CardContent>
                                            </Card>
                                        );
                                    }
                                )}
                            </div>
                        </>
                    )}

                    {/* Feature Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16">
                        <Card
                            className="text-center cursor-pointer hover:shadow-2xl hover:scale-110 transition-all duration-300 border-4 border-[hsl(var(--sunset-orange))] group overflow-hidden relative bg-gradient-to-br from-[hsl(var(--sunset-orange))]/5 to-transparent"
                            onClick={() => navigate("/questions")}
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[hsl(var(--sunset-orange))]/10 rounded-full blur-2xl"></div>
                            <CardHeader className="relative z-10">
                                <Code2 className="h-16 w-16 mx-auto text-[hsl(var(--sunset-orange))] group-hover:scale-125 group-hover:rotate-12 transition-all" />
                                <CardTitle className="mt-6 text-2xl group-hover:text-[hsl(var(--sunset-orange))] transition-colors font-bold">
                                    Real LeetCode Problems
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="relative z-10">
                                <p className="text-muted-foreground text-lg">
                                    Practice with actual problems from
                                    LeetCode's extensive library
                                </p>
                            </CardContent>
                        </Card>

                        <Card
                            className="text-center cursor-pointer hover:shadow-2xl hover:scale-110 transition-all duration-300 border-4 border-[hsl(var(--savanna-gold))] group overflow-hidden relative bg-gradient-to-br from-[hsl(var(--savanna-gold))]/5 to-transparent"
                            onClick={() => navigate("/curriculum")}
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[hsl(var(--savanna-gold))]/10 rounded-full blur-2xl"></div>
                            <CardHeader className="relative z-10">
                                <Zap className="h-16 w-16 mx-auto text-[hsl(var(--savanna-gold))] group-hover:scale-125 group-hover:rotate-12 transition-all" />
                                <CardTitle className="mt-6 text-2xl group-hover:text-[hsl(var(--savanna-gold))] transition-colors font-bold">
                                    Journey Through Lessons
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="relative z-10">
                                <p className="text-muted-foreground text-lg">
                                    Travel the roadmap, unlock huts of
                                    knowledge, and collect beads!
                                </p>
                            </CardContent>
                        </Card>

                        <Card
                            className="text-center cursor-pointer hover:shadow-2xl hover:scale-110 transition-all duration-300 border-4 border-[hsl(var(--sunset-pink))] group overflow-hidden relative bg-gradient-to-br from-[hsl(var(--sunset-pink))]/5 to-transparent"
                            onClick={() => navigate("/profile")}
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[hsl(var(--sunset-pink))]/10 rounded-full blur-2xl"></div>
                            <CardHeader className="relative z-10">
                                <GitBranch className="h-16 w-16 mx-auto text-[hsl(var(--sunset-pink))] group-hover:scale-125 group-hover:rotate-12 transition-all" />
                                <CardTitle className="mt-6 text-2xl group-hover:text-[hsl(var(--sunset-pink))] transition-colors font-bold">
                                    Collect Your Beads
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="relative z-10">
                                <p className="text-muted-foreground text-lg">
                                    Watch your bead collection grow and climb
                                    the leaderboard
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>

            <FooterComponent />
        </div>
    );
};

export default Landing;
