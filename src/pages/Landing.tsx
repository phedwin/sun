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

            <main className="container px-4">
                {/* Hero Section - Clean & Minimalist */}
                <div className="relative min-h-[70vh] flex items-center justify-center py-20">
                    {/* Floating Icons - Subtle & Beautiful */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        {/* Top Left - Python */}
                        <div
                            className="absolute top-20 left-[10%] opacity-60"
                            style={{
                                animation: "float 6s ease-in-out infinite",
                            }}
                        >
                            <div className="text-6xl">🐍</div>
                        </div>

                        {/* Top Right - Code */}
                        <div
                            className="absolute top-32 right-[15%] opacity-60"
                            style={{
                                animation: "float 7s ease-in-out infinite 1s",
                            }}
                        >
                            <div className="text-5xl">💻</div>
                        </div>

                        {/* Middle Left - Brain */}
                        <div
                            className="absolute top-1/2 left-[8%] opacity-60"
                            style={{
                                animation: "float 8s ease-in-out infinite 2s",
                            }}
                        >
                            <div className="text-5xl">🧠</div>
                        </div>

                        {/* Middle Right - Rocket */}
                        <div
                            className="absolute top-1/2 right-[10%] opacity-60"
                            style={{
                                animation:
                                    "float 6.5s ease-in-out infinite 1.5s",
                            }}
                        >
                            <div className="text-6xl">🚀</div>
                        </div>

                        {/* Bottom Left - Book */}
                        <div
                            className="absolute bottom-32 left-[12%] opacity-60"
                            style={{
                                animation:
                                    "float 7.5s ease-in-out infinite 0.5s",
                            }}
                        >
                            <div className="text-5xl">📚</div>
                        </div>

                        {/* Bottom Right - Trophy */}
                        <div
                            className="absolute bottom-24 right-[12%] opacity-60"
                            style={{
                                animation: "float 6s ease-in-out infinite 2.5s",
                            }}
                        >
                            <div className="text-5xl">🏆</div>
                        </div>

                        {/* Subtle gradient orbs */}
                        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-[hsl(var(--sunset-orange))]/5 blur-3xl"></div>
                        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-[hsl(var(--savanna-gold))]/5 blur-3xl"></div>
                    </div>

                    {/* Center Content */}
                    <div className="relative z-10 text-center space-y-8 max-w-4xl mx-auto">
                        {/* Sun Icon */}
                        <div className="text-7xl mb-4">☀️</div>

                        {/* Main Heading */}
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
                            Welcome to{" "}
                            <span className="bg-gradient-to-r from-[hsl(var(--sunset-orange))] to-[hsl(var(--savanna-gold))] bg-clip-text text-transparent">
                                SUN
                            </span>
                        </h1>

                        {/* Subheading */}
                        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                            Your journey to mastering code starts here.
                            <br />
                            Simple. Focused. Beautiful.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
                            <button
                                onClick={() => navigate("/questions")}
                                className="px-8 py-3 bg-gradient-to-r from-[hsl(var(--sunset-orange))] to-[hsl(var(--savanna-gold))] text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105"
                            >
                                Explore Problems
                            </button>
                            <button
                                onClick={() => navigate("/server-hub")}
                                className="px-8 py-3 bg-gradient-to-r from-[hsl(var(--sky-blue))] to-[hsl(var(--bead-blue))] text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center gap-2"
                            >
                                💬 Join Community
                            </button>
                            <button
                                onClick={() => navigate("/curriculum")}
                                className="px-8 py-3 bg-background border-2 border-[hsl(var(--sunset-orange))] text-foreground font-semibold rounded-lg hover:bg-[hsl(var(--sunset-orange))]/5 transition-all duration-300"
                            >
                                Start Learning
                            </button>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center justify-center gap-12 pt-8 text-sm">
                            <div className="text-center">
                                <div className="text-3xl font-bold bg-gradient-to-r from-[hsl(var(--sunset-orange))] to-[hsl(var(--savanna-gold))] bg-clip-text text-transparent">
                                    {topics.reduce(
                                        (sum, t) => sum + t.count,
                                        0
                                    )}
                                </div>
                                <div className="text-muted-foreground mt-1">
                                    Problems
                                </div>
                            </div>
                            <div className="w-px h-12 bg-border"></div>
                            <div className="text-center">
                                <div className="text-3xl font-bold bg-gradient-to-r from-[hsl(var(--sunset-orange))] to-[hsl(var(--savanna-gold))] bg-clip-text text-transparent">
                                    {topics.length}
                                </div>
                                <div className="text-muted-foreground mt-1">
                                    Topics
                                </div>
                            </div>
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

                {/* Topics Section - Clean Grid */}
                <div className="py-20">
                    <div className="text-center space-y-3 mb-12">
                        <h2 className="text-4xl font-bold text-foreground">
                            Explore Topics
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            Choose a path and begin your learning journey
                        </p>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
                            {[...Array(15)].map((_, i) => (
                                <div
                                    key={i}
                                    className="h-28 bg-muted/30 rounded-xl animate-pulse"
                                ></div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
                            {animatedTopics.map(({ topic, delay, color }) => {
                                const Icon = getTopicIcon(topic.slug);
                                return (
                                    <div
                                        key={topic.slug}
                                        className="cursor-pointer group"
                                        style={{
                                            animation: `fadeIn 0.5s ease-out ${delay}s both`,
                                        }}
                                        onClick={() =>
                                            handleTopicClick(topic.slug)
                                        }
                                    >
                                        <div className="relative bg-card border border-border rounded-xl p-4 hover:border-[hsl(var(--sunset-orange))]/50 hover:shadow-md transition-all duration-300 h-full flex flex-col items-center justify-center text-center space-y-2">
                                            {/* Icon */}
                                            <Icon
                                                className="h-8 w-8 transition-transform group-hover:scale-110"
                                                style={{ color, opacity: 0.9 }}
                                            />

                                            {/* Topic Name */}
                                            <h3 className="font-semibold text-sm leading-tight">
                                                {topic.name}
                                            </h3>

                                            {/* Count */}
                                            <span className="text-xs text-muted-foreground font-medium">
                                                {topic.count}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    <div className="text-center pt-10">
                        <button
                            onClick={handleViewAllClick}
                            className="inline-flex items-center gap-2 px-6 py-2 border-2 border-border rounded-lg hover:border-[hsl(var(--sunset-orange))] hover:text-[hsl(var(--sunset-orange))] transition-all font-medium"
                        >
                            View All Problems
                            <ArrowRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* Feature Section - Simple & Clean */}
                <div className="py-20 border-t border-border/30">
                    <div className="max-w-5xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div
                                className="text-center space-y-3 p-6 rounded-xl hover:bg-muted/20 transition-all cursor-pointer group"
                                onClick={() => navigate("/questions")}
                            >
                                <div className="inline-block p-4 rounded-full bg-[hsl(var(--sunset-orange))]/10 group-hover:bg-[hsl(var(--sunset-orange))]/20 transition-all">
                                    <Code2 className="h-10 w-10 text-[hsl(var(--sunset-orange))] group-hover:scale-110 transition-transform" />
                                </div>
                                <h3 className="font-bold text-xl">
                                    Real Problems
                                </h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Practice with LeetCode's extensive library
                                </p>
                            </div>

                            <div
                                className="text-center space-y-3 p-6 rounded-xl hover:bg-muted/20 transition-all cursor-pointer group"
                                onClick={() => navigate("/curriculum")}
                            >
                                <div className="inline-block p-4 rounded-full bg-[hsl(var(--savanna-gold))]/10 group-hover:bg-[hsl(var(--savanna-gold))]/20 transition-all">
                                    <Zap className="h-10 w-10 text-[hsl(var(--savanna-gold))] group-hover:scale-110 transition-transform" />
                                </div>
                                <h3 className="font-bold text-xl">
                                    Guided Journey
                                </h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Follow a roadmap and collect beads
                                </p>
                            </div>

                            <div
                                className="text-center space-y-3 p-6 rounded-xl hover:bg-muted/20 transition-all cursor-pointer group"
                                onClick={() => navigate("/profile")}
                            >
                                <div className="inline-block p-4 rounded-full bg-[hsl(var(--sunset-pink))]/10 group-hover:bg-[hsl(var(--sunset-pink))]/20 transition-all">
                                    <GitBranch className="h-10 w-10 text-[hsl(var(--sunset-pink))] group-hover:scale-110 transition-transform" />
                                </div>
                                <h3 className="font-bold text-xl">
                                    Track Progress
                                </h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Watch your growth and climb the board
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <FooterComponent />
        </div>
    );
};

export default Landing;
