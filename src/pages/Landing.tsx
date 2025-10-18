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

// Icon mapping for different topics
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
    const [topics, setTopics] = useState<Array<{name: string, slug: string, count: number}>>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadTopics = async () => {
            try {
                setLoading(true);
                const topicData = await getTopicTags();
                setTopics(topicData);
            } catch (err) {
                setError('Failed to load topics. Please try again later.');
                console.error('Error loading topics:', err);
            } finally {
                setLoading(false);
            }
        };

        loadTopics();
    }, []);

    const handleTopicClick = (topic: string) => {
        navigate(`/questions?topic=${encodeURIComponent(topic)}`);
    };

    const handleViewAllClick = () => {
        navigate('/questions');
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
                    <div className="text-center space-y-4 py-12">
                        <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                            Master Coding Interviews
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Practice coding problems by topic. Choose from algorithms, data structures, databases, and more.
                        </p>
                        <div className="flex items-center justify-center gap-4 pt-4">
                            <Badge variant="outline" className="text-sm">
                                {topics.reduce((sum, t) => sum + t.count, 0)} Problems
                            </Badge>
                            <Badge variant="outline" className="text-sm">
                                {topics.length} Topics
                            </Badge>
                        </div>
                    </div>

                    {error && (
                        <div className="rounded-lg border border-red-500 bg-red-50 dark:bg-red-950 p-4">
                            <p className="text-red-800 dark:text-red-200">{error}</p>
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
                                <h2 className="text-2xl font-semibold">Browse by Topic</h2>
                                <button
                                    onClick={handleViewAllClick}
                                    className="flex items-center gap-2 text-primary hover:underline"
                                >
                                    View All Problems
                                    <ArrowRight className="h-4 w-4" />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {topics.map((topic) => {
                                    const Icon = getTopicIcon(topic.slug);
                                    return (
                                        <Card
                                            key={topic.slug}
                                            className="cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-200 border-2 hover:border-primary group"
                                            onClick={() => handleTopicClick(topic.slug)}
                                        >
                                            <CardHeader className="pb-3">
                                                <div className="flex items-center justify-between">
                                                    <Icon className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
                                                    <Badge variant="secondary">
                                                        {topic.count}
                                                    </Badge>
                                                </div>
                                                <CardTitle className="text-lg mt-3 group-hover:text-primary transition-colors">
                                                    {topic.name}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-sm text-muted-foreground">
                                                    {topic.count} {topic.count === 1 ? 'problem' : 'problems'} available
                                                </p>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        </>
                    )}

                    {/* Feature Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
                        <Card className="text-center">
                            <CardHeader>
                                <Code2 className="h-12 w-12 mx-auto text-primary" />
                                <CardTitle className="mt-4">Real LeetCode Problems</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    Practice with actual problems from LeetCode's extensive library
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="text-center">
                            <CardHeader>
                                <Zap className="h-12 w-12 mx-auto text-primary" />
                                <CardTitle className="mt-4">Topic-Based Learning</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    Master one concept at a time with focused practice
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="text-center">
                            <CardHeader>
                                <GitBranch className="h-12 w-12 mx-auto text-primary" />
                                <CardTitle className="mt-4">Track Your Progress</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    Filter by difficulty and monitor your improvement
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
