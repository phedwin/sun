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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import FooterComponent from "@/components/Footer";
import { AfricanRoadmap } from "@/components/AfricanRoadmap";
import { LessonQuiz } from "@/components/LessonQuiz";
import { CelebrationAnimation } from "@/components/CelebrationAnimation";
import { BookOpen, ChevronRight, Code, Trophy, Lock } from "lucide-react";

interface Topic {
    id: string;
    title: string;
    description: string;
    file: string;
    questions: string[];
}

interface Category {
    id: string;
    title: string;
    description: string;
    topics: Topic[];
}

interface Language {
    id: string;
    name: string;
    icon: string;
    status: "available" | "coming_soon";
    categories: Category[];
}

interface CurriculumData {
    title: string;
    description: string;
    languages: Language[];
}

const Curriculum = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [curriculum, setCurriculum] = useState<CurriculumData | null>(null);
    const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(
        null
    );
    const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
    const [topicContent, setTopicContent] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<"grid" | "roadmap">("grid");
    const [completedTopics, setCompletedTopics] = useState<Set<string>>(
        new Set()
    );
    const [showQuiz, setShowQuiz] = useState(false);
    const [showCelebration, setShowCelebration] = useState(false);
    const [hasReadLesson, setHasReadLesson] = useState(false);

    // Load curriculum index
    useEffect(() => {
        fetch("/curriculum/index.json")
            .then((res) => res.json())
            .then((data) => {
                setCurriculum(data);
                // Auto-select Python by default
                const python = data.languages.find(
                    (lang: Language) => lang.id === "python"
                );
                if (python) {
                    setSelectedLanguage(python);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error loading curriculum:", err);
                setLoading(false);
            });
    }, []);

    // Load topic from URL
    useEffect(() => {
        const topicFile = searchParams.get("topic");
        if (topicFile && selectedLanguage) {
            // Find the topic
            let foundTopic: Topic | null = null;
            for (const category of selectedLanguage.categories) {
                const topic = category.topics.find((t) => t.file === topicFile);
                if (topic) {
                    foundTopic = topic;
                    break;
                }
            }

            if (foundTopic) {
                setSelectedTopic(foundTopic);
                // Load the HTML content
                fetch(`/curriculum/${foundTopic.file}`)
                    .then((res) => res.text())
                    .then((html) => setTopicContent(html))
                    .catch((err) => console.error("Error loading topic:", err));
            }
        } else {
            setSelectedTopic(null);
            setTopicContent("");
        }
    }, [searchParams, selectedLanguage]);

    const handleTopicClick = (topic: Topic) => {
        navigate(`/curriculum?topic=${topic.file}`);
        setHasReadLesson(false);
        setShowQuiz(false);
    };

    const handleStartQuiz = () => {
        setShowQuiz(true);
    };

    const handleQuizComplete = (passed: boolean, score: number) => {
        if (passed && selectedTopic) {
            setCompletedTopics((prev) => new Set([...prev, selectedTopic.id]));
            setShowCelebration(true);
            // Store in localStorage for persistence
            const completed = Array.from(completedTopics);
            completed.push(selectedTopic.id);
            localStorage.setItem("completedTopics", JSON.stringify(completed));
        }
    };

    // Load completed topics from localStorage
    useEffect(() => {
        const stored = localStorage.getItem("completedTopics");
        if (stored) {
            setCompletedTopics(new Set(JSON.parse(stored)));
        }
    }, []);

    // Mock quiz questions - in a real app, these would come from the topic data
    const getQuizQuestions = () => [
        {
            question: "What is the main concept covered in this lesson?",
            options: [
                "Understanding the fundamentals",
                "Advanced techniques only",
                "Unrelated content",
                "Historical background",
            ],
            correctAnswer: 0,
            explanation:
                "This lesson focuses on building a strong foundation in the fundamentals.",
        },
        {
            question: "Why is this topic important?",
            options: [
                "It's not important",
                "It builds essential skills for programming",
                "Only for academic purposes",
                "Just for fun",
            ],
            correctAnswer: 1,
            explanation:
                "Mastering this topic helps you develop critical programming skills.",
        },
        {
            question: "What should you practice after this lesson?",
            options: [
                "Nothing, move on immediately",
                "Related coding problems",
                "Completely different topics",
                "Only theory, no practice",
            ],
            correctAnswer: 1,
            explanation:
                "Practicing related problems helps reinforce what you've learned.",
        },
    ];

    const handlePracticeClick = (question: string) => {
        navigate(`/code?question=${question}`);
    };

    const handleLanguageSelect = (language: Language) => {
        if (language.status === "coming_soon") {
            return;
        }
        setSelectedLanguage(language);
        setSelectedTopic(null);
    };

    // Convert topics to roadmap lessons
    const getRoadmapLessons = () => {
        if (!selectedLanguage) return [];

        const allTopics: Topic[] = [];
        selectedLanguage.categories.forEach((category) => {
            allTopics.push(...category.topics);
        });

        return allTopics.map((topic, index) => {
            // Create a meandering path
            const baseY = 200 + index * 250;
            const baseX = index % 2 === 0 ? 300 : window.innerWidth - 300;

            // Add some variation for more natural flow
            const xVariation = Math.sin(index * 0.5) * 100;
            const yVariation = Math.cos(index * 0.3) * 50;

            return {
                id: topic.id,
                title: topic.title,
                description: topic.description,
                isLocked:
                    index > 0 && !completedTopics.has(allTopics[index - 1]?.id),
                isCompleted: completedTopics.has(topic.id),
                beadsEarned: completedTopics.has(topic.id)
                    ? Math.min(topic.questions?.length || 3, 5)
                    : 0,
                position: {
                    x: baseX + xVariation,
                    y: baseY + yVariation,
                },
            };
        });
    };

    const handleRoadmapLessonClick = (lessonId: string) => {
        const allTopics: Topic[] = [];
        selectedLanguage?.categories.forEach((category) => {
            allTopics.push(...category.topics);
        });

        const topic = allTopics.find((t) => t.id === lessonId);
        if (topic) {
            handleTopicClick(topic);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <div className="container py-8">
                    <p>Loading curriculum...</p>
                </div>
            </div>
        );
    }

    if (!curriculum) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <div className="container py-8">
                    <p>Failed to load curriculum.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="container py-8">
                <CelebrationAnimation
                    show={showCelebration}
                    onComplete={() => setShowCelebration(false)}
                />

                {selectedTopic ? (
                    // Topic view
                    <div className="max-w-4xl mx-auto space-y-8">
                        <Button
                            variant="ghost"
                            onClick={() => navigate("/curriculum")}
                            className="mb-4"
                        >
                            ← Back to Curriculum
                        </Button>

                        {!showQuiz ? (
                            <>
                                <div className="prose prose-lg dark:prose-invert max-w-none">
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: topicContent,
                                        }}
                                        className="curriculum-content"
                                    />
                                </div>

                                {/* Complete lesson and take quiz */}
                                <div className="flex justify-center py-8">
                                    <Button
                                        size="lg"
                                        onClick={handleStartQuiz}
                                        className="text-xl px-12 py-6 bg-gradient-to-r from-[hsl(var(--sunset-orange))] to-[hsl(var(--savanna-gold))] text-white font-bold"
                                    >
                                        <Trophy className="w-6 h-6 mr-3" />
                                        Complete Lesson & Take Quiz
                                    </Button>
                                </div>

                                {selectedTopic.questions.length > 0 && (
                                    <div className="mt-8 p-6 bg-gradient-to-r from-[hsl(var(--sunset-orange))]/5 to-[hsl(var(--savanna-gold))]/5 rounded-lg border-4 border-[hsl(var(--earth-brown))]">
                                        <h3 className="text-2xl font-bold mb-4 flex items-center gap-2 bg-gradient-to-r from-[hsl(var(--sunset-orange))] to-[hsl(var(--savanna-gold))] bg-clip-text text-transparent">
                                            <Trophy className="h-6 w-6 text-[hsl(var(--savanna-gold))]" />
                                            Practice Problems
                                        </h3>
                                        <p className="text-muted-foreground mb-4 text-lg font-semibold">
                                            Test your knowledge with these
                                            related coding problems:
                                        </p>
                                        <div className="flex flex-wrap gap-3">
                                            {selectedTopic.questions.map(
                                                (question) => (
                                                    <Button
                                                        key={question}
                                                        variant="outline"
                                                        size="lg"
                                                        onClick={() =>
                                                            handlePracticeClick(
                                                                question
                                                            )
                                                        }
                                                        className="border-2 border-[hsl(var(--sunset-orange))] hover:bg-[hsl(var(--sunset-orange))]/10"
                                                    >
                                                        <Code className="h-5 w-5 mr-2" />
                                                        {question
                                                            .split("-")
                                                            .map(
                                                                (w) =>
                                                                    w
                                                                        .charAt(
                                                                            0
                                                                        )
                                                                        .toUpperCase() +
                                                                    w.slice(1)
                                                            )
                                                            .join(" ")}
                                                    </Button>
                                                )
                                            )}
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <LessonQuiz
                                questions={getQuizQuestions()}
                                onComplete={handleQuizComplete}
                            />
                        )}
                    </div>
                ) : (
                    // Curriculum overview
                    <div className="space-y-8">
                        <div className="text-center space-y-4">
                            <h1 className="text-5xl font-bold bg-gradient-to-r from-[hsl(var(--sunset-orange))] via-[hsl(var(--sunset-pink))] to-[hsl(var(--savanna-gold))] bg-clip-text text-transparent">
                                {curriculum.title}
                            </h1>
                            <p className="text-2xl text-muted-foreground max-w-3xl mx-auto font-semibold">
                                {curriculum.description}
                            </p>
                        </div>

                        {/* Language Selection */}
                        <div className="flex justify-center gap-4 flex-wrap">
                            {curriculum.languages.map((language) => (
                                <Button
                                    key={language.id}
                                    variant={
                                        selectedLanguage?.id === language.id
                                            ? "default"
                                            : "outline"
                                    }
                                    size="lg"
                                    onClick={() =>
                                        handleLanguageSelect(language)
                                    }
                                    disabled={language.status === "coming_soon"}
                                    className="relative"
                                >
                                    <span className="text-2xl mr-2">
                                        {language.icon}
                                    </span>
                                    {language.name}
                                    {language.status === "coming_soon" && (
                                        <Lock className="h-4 w-4 ml-2" />
                                    )}
                                    {language.status === "coming_soon" && (
                                        <Badge
                                            className="absolute -top-2 -right-2 text-xs"
                                            variant="secondary"
                                        >
                                            Coming Soon
                                        </Badge>
                                    )}
                                </Button>
                            ))}
                        </div>

                        {selectedLanguage &&
                        selectedLanguage.categories.length > 0 ? (
                            <AfricanRoadmap
                                lessons={getRoadmapLessons()}
                                onLessonClick={handleRoadmapLessonClick}
                                currentLessonId={selectedTopic?.id}
                            />
                        ) : selectedLanguage ? (
                            <div className="text-center py-12">
                                <Lock className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                                <h3 className="text-2xl font-bold mb-2">
                                    Coming Soon!
                                </h3>
                                <p className="text-muted-foreground">
                                    {selectedLanguage.name} curriculum is under
                                    development.
                                </p>
                            </div>
                        ) : null}
                    </div>
                )}
            </main>

            <FooterComponent />
        </div>
    );
};

export default Curriculum;
