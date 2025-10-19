/*
 * CJLF LICENSE (c) 2025
 */

import { useState, useEffect, useRef } from "react";
import { Lock, CheckCircle2, MapPin, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Lesson {
    id: string;
    title: string;
    description: string;
    isLocked: boolean;
    isCompleted: boolean;
    beadsEarned?: number;
    position: { x: number; y: number };
}

interface RoadmapProps {
    lessons: Lesson[];
    onLessonClick: (lessonId: string) => void;
    currentLessonId?: string;
}

export const AfricanRoadmap = ({
    lessons,
    onLessonClick,
    currentLessonId,
}: RoadmapProps) => {
    const [carPosition, setCarPosition] = useState({ x: 0, y: 0 });
    const [showCar, setShowCar] = useState(false);
    const [isDriving, setIsDriving] = useState(false);
    const [sceneryItems, setSceneryItems] = useState<
        Array<{
            emoji: string;
            x: number;
            y: number;
            size: number;
            animation?: string;
        }>
    >([]);
    const [walkingPeople, setWalkingPeople] = useState<
        Array<{ emoji: string; x: number; y: number; direction: number }>
    >([]);
    const containerRef = useRef<HTMLDivElement>(null);

    // Find current lesson and next unlocked lesson
    const currentLesson =
        lessons.find((l) => l.id === currentLessonId) ||
        lessons.find((l) => !l.isLocked && !l.isCompleted);
    const nextUnlockedLesson = lessons.find(
        (l) => !l.isLocked && !l.isCompleted && l.id !== currentLesson?.id
    );

    useEffect(() => {
        if (currentLesson) {
            setCarPosition(currentLesson.position);
            setShowCar(true);
        }
    }, [currentLesson]);

    // Generate African scenery
    useEffect(() => {
        if (lessons.length === 0) return;

        const scenery: Array<{
            emoji: string;
            x: number;
            y: number;
            size: number;
            animation?: string;
        }> = [];
        const mapHeight = lessons.length * 300 + 600;
        const mapWidth =
            typeof window !== "undefined" ? window.innerWidth : 1200;

        // Add varied scenery on both sides
        const leftScenery = [
            { emoji: "🌴", count: 10, size: [3, 5] },
            { emoji: "🦁", count: 2, size: [2.5, 3.5], animation: "float" },
            { emoji: "🌺", count: 12, size: [1.5, 2.5] },
            { emoji: "🌾", count: 18, size: [1, 2] },
        ];

        const rightScenery = [
            { emoji: "🦒", count: 3, size: [3.5, 4.5], animation: "float" },
            { emoji: "🐘", count: 2, size: [3.5, 4.5], animation: "float" },
            { emoji: "🦓", count: 3, size: [2.5, 3.5], animation: "float" },
            { emoji: "🌴", count: 10, size: [3, 5] },
            { emoji: "🏔️", count: 5, size: [5, 7] },
        ];

        // Distribute left scenery
        leftScenery.forEach(({ emoji, count, size, animation }) => {
            for (let i = 0; i < count; i++) {
                scenery.push({
                    emoji,
                    x: 30 + Math.random() * 120,
                    y: (mapHeight / count) * i + Math.random() * 100,
                    size: size[0] + Math.random() * (size[1] - size[0]),
                    animation,
                });
            }
        });

        // Distribute right scenery
        rightScenery.forEach(({ emoji, count, size, animation }) => {
            for (let i = 0; i < count; i++) {
                scenery.push({
                    emoji,
                    x: mapWidth - 180 + Math.random() * 130,
                    y: (mapHeight / count) * i + Math.random() * 100,
                    size: size[0] + Math.random() * (size[1] - size[0]),
                    animation,
                });
            }
        });

        // Add lakes with boats
        for (let i = 0; i < 3; i++) {
            const lakeY = (mapHeight / 4) * (i + 0.7);
            const side = i % 2 === 0 ? 80 : mapWidth - 230;

            scenery.push({ emoji: "💧", x: side, y: lakeY, size: 7 });
            scenery.push({
                emoji: "⛵",
                x: side + 50,
                y: lakeY + 25,
                size: 2.8,
                animation: "float",
            });
        }

        setSceneryItems(scenery);

        // Add walking people on the road
        const people: Array<{
            emoji: string;
            x: number;
            y: number;
            direction: number;
        }> = [];
        const pedestrians = ["🚶", "🚶‍♀️", "👨‍🌾", "👩‍🌾", "🧑", "👶"];

        for (let i = 0; i < 8; i++) {
            const lesson = lessons[Math.floor(Math.random() * lessons.length)];
            const offset = (Math.random() - 0.5) * 60; // Walk near the road edge

            people.push({
                emoji: pedestrians[
                    Math.floor(Math.random() * pedestrians.length)
                ],
                x: lesson.position.x + offset,
                y: lesson.position.y + (Math.random() - 0.5) * 100,
                direction: Math.random() > 0.5 ? 1 : -1,
            });
        }

        setWalkingPeople(people);

        // Animate people walking
        const walkInterval = setInterval(() => {
            setWalkingPeople((prev) =>
                prev.map((person) => ({
                    ...person,
                    y: person.y + person.direction * 2,
                }))
            );
        }, 100);

        return () => clearInterval(walkInterval);
    }, [lessons]);

    // Drive truck to next lesson
    const driveToNextLesson = () => {
        if (!nextUnlockedLesson || isDriving) return;

        setIsDriving(true);

        // Animate truck movement
        const startX = carPosition.x;
        const startY = carPosition.y;
        const endX = nextUnlockedLesson.position.x;
        const endY = nextUnlockedLesson.position.y;

        const duration = 2000; // 2 seconds
        const startTime = Date.now();

        const animate = () => {
            const now = Date.now();
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease in-out function
            const easeProgress =
                progress < 0.5
                    ? 2 * progress * progress
                    : 1 - Math.pow(-2 * progress + 2, 2) / 2;

            const currentX = startX + (endX - startX) * easeProgress;
            const currentY = startY + (endY - startY) * easeProgress;

            setCarPosition({ x: currentX, y: currentY });

            // Scroll to keep truck in view
            if (containerRef.current) {
                const container = containerRef.current;
                const targetScrollY = currentY - container.clientHeight / 2;
                container.scrollTop = targetScrollY;
            }

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                setIsDriving(false);
                // Click the next lesson automatically
                setTimeout(() => {
                    onLessonClick(nextUnlockedLesson.id);
                }, 500);
            }
        };

        requestAnimationFrame(animate);
    };

    const getBeadColor = (index: number) => {
        const colors = [
            "hsl(var(--bead-red))",
            "hsl(var(--bead-yellow))",
            "hsl(var(--bead-blue))",
            "hsl(var(--bead-green))",
        ];
        return colors[index % colors.length];
    };

    // Generate realistic straight road with slight curves
    const generatePath = () => {
        if (lessons.length === 0) return "";

        const centerX =
            typeof window !== "undefined" ? window.innerWidth / 2 : 600;
        let path = `M ${centerX} 100`;

        lessons.forEach((lesson, i) => {
            // Create a more straight road with gentle curves
            const targetY = lesson.position.y;
            const prevY = i === 0 ? 100 : lessons[i - 1].position.y;
            const midY = (prevY + targetY) / 2;

            // Small horizontal variation for realism
            const xVariation = Math.sin(i * 0.5) * 30;

            path += ` Q ${centerX + xVariation} ${midY}, ${lesson.position.x} ${targetY}`;
        });

        return path;
    };

    return (
        <div
            ref={containerRef}
            className="relative w-full py-12 px-4 overflow-x-hidden overflow-y-auto bg-gradient-to-b from-[hsl(var(--sky-blue))]/8 to-[hsl(var(--savanna-gold))]/8"
            style={{
                minHeight: `${lessons.length * 300 + 600}px`,
                maxHeight: "90vh",
            }}
        >
            {/* Sky background */}
            <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--sky-blue))]/12 via-transparent to-[hsl(var(--earth-brown))]/8 -z-20"></div>

            {/* Scenery */}
            {sceneryItems.map((item, index) => (
                <div
                    key={`scenery-${index}`}
                    className="absolute pointer-events-none select-none"
                    style={{
                        left: `${item.x}px`,
                        top: `${item.y}px`,
                        fontSize: `${item.size}rem`,
                        animation:
                            item.animation === "float"
                                ? "float 3s ease-in-out infinite"
                                : "none",
                        animationDelay: `${index * 0.2}s`,
                        zIndex: item.emoji === "🏔️" ? 1 : 5,
                        opacity: item.emoji === "🏔️" ? 0.35 : 1,
                    }}
                >
                    {item.emoji}
                </div>
            ))}

            {/* Walking people */}
            {walkingPeople.map((person, index) => (
                <div
                    key={`person-${index}`}
                    className="absolute pointer-events-none select-none transition-all duration-100"
                    style={{
                        left: `${person.x}px`,
                        top: `${person.y}px`,
                        fontSize: "2rem",
                        transform:
                            person.direction > 0 ? "scaleX(1)" : "scaleX(-1)",
                        zIndex: 15,
                    }}
                >
                    {person.emoji}
                </div>
            ))}

            {/* The Road - Straight and realistic */}
            <svg
                className="absolute inset-0 w-full h-full z-10"
                style={{ minHeight: `${lessons.length * 300 + 600}px` }}
            >
                <defs>
                    <pattern
                        id="asphalt"
                        patternUnits="userSpaceOnUse"
                        width="40"
                        height="40"
                    >
                        <rect
                            width="40"
                            height="40"
                            fill="hsl(var(--earth-brown))"
                            opacity="0.5"
                        />
                        <circle
                            cx="10"
                            cy="10"
                            r="2"
                            fill="hsl(var(--earth-brown))"
                            opacity="0.7"
                        />
                        <circle
                            cx="30"
                            cy="30"
                            r="2"
                            fill="hsl(var(--earth-brown))"
                            opacity="0.7"
                        />
                        <circle
                            cx="20"
                            cy="25"
                            r="1.5"
                            fill="hsl(var(--earth-brown))"
                            opacity="0.6"
                        />
                    </pattern>

                    <linearGradient
                        id="road-gradient"
                        x1="0%"
                        y1="0%"
                        x2="0%"
                        y2="100%"
                    >
                        <stop
                            offset="0%"
                            stopColor="hsl(var(--earth-brown))"
                            stopOpacity="0.6"
                        />
                        <stop
                            offset="50%"
                            stopColor="hsl(var(--earth-brown))"
                            stopOpacity="0.5"
                        />
                        <stop
                            offset="100%"
                            stopColor="hsl(var(--earth-brown))"
                            stopOpacity="0.6"
                        />
                    </linearGradient>
                </defs>

                {/* Road shadow */}
                <path
                    d={generatePath()}
                    stroke="hsl(var(--earth-brown))"
                    strokeWidth="105"
                    fill="none"
                    opacity="0.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                {/* Main road - wider and straighter */}
                <path
                    d={generatePath()}
                    stroke="url(#asphalt)"
                    strokeWidth="100"
                    fill="none"
                    opacity="0.85"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                {/* Road edges */}
                <path
                    d={generatePath()}
                    stroke="hsl(var(--earth-brown))"
                    strokeWidth="104"
                    fill="none"
                    opacity="0.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                {/* Yellow center line */}
                <path
                    d={generatePath()}
                    stroke="hsl(var(--savanna-gold))"
                    strokeWidth="4"
                    strokeDasharray="25,20"
                    fill="none"
                    opacity="0.7"
                    strokeLinecap="round"
                />
            </svg>

            {/* Truck at current position */}
            {showCar && (
                <div
                    className="absolute z-30 transition-all ease-linear"
                    style={{
                        left: `${carPosition.x - 40}px`,
                        top: `${carPosition.y - 75}px`,
                        transitionDuration: isDriving ? "100ms" : "1000ms",
                    }}
                >
                    <div className="relative">
                        <div
                            className="text-7xl"
                            style={{ transform: isDriving ? "none" : "none" }}
                        >
                            🚚
                        </div>
                        {isDriving && (
                            <>
                                <div className="absolute -bottom-6 -left-8 text-4xl opacity-70 animate-[dustCloud_0.6s_ease-out_infinite]">
                                    💨
                                </div>
                                <div className="absolute -bottom-6 -left-16 text-3xl opacity-50 animate-[dustCloud_0.6s_ease-out_infinite_0.2s]">
                                    💨
                                </div>
                                <div className="absolute -bottom-6 -left-24 text-2xl opacity-30 animate-[dustCloud_0.6s_ease-out_infinite_0.4s]">
                                    💨
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Drive to next lesson button */}
            {nextUnlockedLesson && !isDriving && (
                <div className="fixed bottom-32 left-1/2 -translate-x-1/2 z-50">
                    <Button
                        onClick={driveToNextLesson}
                        size="lg"
                        className="bg-gradient-to-r from-[hsl(var(--sunset-orange))] to-[hsl(var(--savanna-gold))] text-white font-bold text-lg px-8 py-6 shadow-2xl hover:scale-110 transition-all animate-bounce"
                    >
                        <span className="text-2xl mr-3">🚚</span>
                        Drive to Next Lesson
                        <ArrowRight className="ml-3 w-6 h-6" />
                    </Button>
                </div>
            )}

            {/* Lessons as Huts */}
            <div className="relative z-20">
                {lessons.map((lesson, index) => {
                    const isCurrentLesson = lesson.id === currentLessonId;

                    return (
                        <div
                            key={lesson.id}
                            className="absolute transform -translate-x-1/2 -translate-y-1/2"
                            style={{
                                left: `${lesson.position.x}px`,
                                top: `${lesson.position.y}px`,
                            }}
                        >
                            {/* Challenge bump indicator */}
                            {index % 3 === 2 && !lesson.isLocked && (
                                <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 text-5xl animate-bounce z-50">
                                    ⚡
                                </div>
                            )}

                            <Card
                                className={`
                                    relative w-80 cursor-pointer transition-all duration-300
                                    ${lesson.isLocked ? "opacity-60 cursor-not-allowed" : "hover:scale-110 hover:shadow-2xl hover:z-50"}
                                    ${isCurrentLesson ? "ring-4 ring-[hsl(var(--savanna-gold))] scale-110 shadow-2xl" : ""}
                                    ${lesson.isCompleted ? "border-4 border-[hsl(var(--bead-green))]" : "border-4 border-[hsl(var(--earth-brown))]"}
                                `}
                                onClick={() =>
                                    !lesson.isLocked && onLessonClick(lesson.id)
                                }
                                style={{
                                    background: lesson.isCompleted
                                        ? "linear-gradient(135deg, hsl(var(--bead-green) / 0.15), hsl(var(--card)))"
                                        : "linear-gradient(135deg, hsl(var(--earth-brown) / 0.08), hsl(var(--card)))",
                                }}
                            >
                                {/* Hut roof */}
                                <div className="absolute -top-14 left-1/2 -translate-x-1/2 text-8xl drop-shadow-2xl">
                                    {lesson.isLocked
                                        ? "🔒"
                                        : lesson.isCompleted
                                          ? "✨"
                                          : "🛖"}
                                </div>

                                <CardContent className="pt-16 pb-6 px-6">
                                    {/* Lesson number */}
                                    <div className="absolute top-3 right-3 w-11 h-11 rounded-full bg-gradient-to-br from-[hsl(var(--sunset-orange))] to-[hsl(var(--sunset-pink))] text-white flex items-center justify-center font-bold text-lg shadow-lg">
                                        {index + 1}
                                    </div>

                                    {/* Status icon */}
                                    <div className="absolute top-3 left-3">
                                        {lesson.isCompleted ? (
                                            <CheckCircle2 className="w-8 h-8 text-[hsl(var(--bead-green))]" />
                                        ) : lesson.isLocked ? (
                                            <Lock className="w-8 h-8 text-muted-foreground" />
                                        ) : (
                                            <MapPin className="w-8 h-8 text-[hsl(var(--sunset-orange))] animate-bounce" />
                                        )}
                                    </div>

                                    <h3 className="text-xl font-bold mb-3 text-center mt-2">
                                        {lesson.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground text-center mb-4 leading-relaxed">
                                        {lesson.description}
                                    </p>

                                    {/* Beads earned */}
                                    {lesson.isCompleted &&
                                        lesson.beadsEarned && (
                                            <div className="flex justify-center items-center gap-1.5 mt-4">
                                                {Array.from({
                                                    length: lesson.beadsEarned,
                                                }).map((_, i) => (
                                                    <div
                                                        key={i}
                                                        className="w-8 h-8 rounded-full animate-[beadShine_2s_ease-in-out_infinite] shadow-lg"
                                                        style={{
                                                            background:
                                                                getBeadColor(i),
                                                            animationDelay: `${i * 0.2}s`,
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                        )}

                                    {lesson.isLocked && (
                                        <p className="text-xs text-center text-muted-foreground mt-3 font-semibold">
                                            Complete previous hut to unlock 🛖
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="fixed bottom-6 right-6 bg-card/95 backdrop-blur-sm border-4 border-[hsl(var(--sunset-orange))] rounded-xl p-5 shadow-2xl z-40 max-w-xs">
                <h4 className="font-bold mb-3 text-xl bg-gradient-to-r from-[hsl(var(--sunset-orange))] to-[hsl(var(--savanna-gold))] bg-clip-text text-transparent">
                    Journey Map
                </h4>
                <div className="space-y-2.5 text-sm font-semibold">
                    <div className="flex items-center gap-3">
                        <span className="text-3xl">🛖</span>
                        <span>Available Lesson</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-3xl">🔒</span>
                        <span>Locked Lesson</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-3xl">✨</span>
                        <span>Completed!</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-3xl">🚚</span>
                        <span>Your Truck</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-3xl">⚡</span>
                        <span>Challenge Bump</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">🚶👨‍🌾👩‍🌾</span>
                        <span>Travelers</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
