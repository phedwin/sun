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
import { Lock, CheckCircle2, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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

    useEffect(() => {
        // Find the current lesson or the first unlocked lesson
        const currentLesson =
            lessons.find((l) => l.id === currentLessonId) ||
            lessons.find((l) => !l.isLocked && !l.isCompleted);

        if (currentLesson) {
            setCarPosition(currentLesson.position);
            setShowCar(true);
        }
    }, [currentLessonId, lessons]);

    const getBeadColor = (index: number) => {
        const colors = [
            "hsl(var(--bead-red))",
            "hsl(var(--bead-yellow))",
            "hsl(var(--bead-blue))",
            "hsl(var(--bead-green))",
        ];
        return colors[index % colors.length];
    };

    return (
        <div className="relative min-h-screen py-12 px-4 overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 -z-10 opacity-30">
                <div className="absolute top-20 left-10 text-8xl">🌴</div>
                <div className="absolute top-40 right-20 text-6xl">🦁</div>
                <div className="absolute bottom-40 left-1/4 text-7xl">🌺</div>
                <div className="absolute top-60 right-1/3 text-5xl">🦒</div>
                <div className="absolute bottom-20 right-10 text-8xl">🌴</div>
            </div>

            {/* The Road - SVG Path */}
            <svg
                className="absolute inset-0 w-full h-full -z-5"
                style={{ minHeight: `${lessons.length * 200}px` }}
            >
                <defs>
                    <pattern
                        id="dirt"
                        patternUnits="userSpaceOnUse"
                        width="20"
                        height="20"
                    >
                        <rect
                            width="20"
                            height="20"
                            fill="hsl(var(--earth-brown))"
                            opacity="0.3"
                        />
                        <circle
                            cx="5"
                            cy="5"
                            r="1"
                            fill="hsl(var(--earth-brown))"
                            opacity="0.5"
                        />
                        <circle
                            cx="15"
                            cy="15"
                            r="1"
                            fill="hsl(var(--earth-brown))"
                            opacity="0.5"
                        />
                    </pattern>
                </defs>
                <path
                    d={`M 100 100 ${lessons
                        .map(
                            (lesson, i) =>
                                `Q ${lesson.position.x - 100} ${lesson.position.y - 50}, ${lesson.position.x} ${lesson.position.y}`
                        )
                        .join(" ")}`}
                    stroke="url(#dirt)"
                    strokeWidth="80"
                    fill="none"
                    opacity="0.6"
                    strokeLinecap="round"
                />
                {/* Road edge lines */}
                <path
                    d={`M 100 100 ${lessons
                        .map(
                            (lesson, i) =>
                                `Q ${lesson.position.x - 100} ${lesson.position.y - 50}, ${lesson.position.x} ${lesson.position.y}`
                        )
                        .join(" ")}`}
                    stroke="hsl(var(--earth-brown))"
                    strokeWidth="85"
                    fill="none"
                    opacity="0.3"
                    strokeLinecap="round"
                />
            </svg>

            {/* Car - only show at current lesson */}
            {showCar && (
                <div
                    className="absolute z-20 transition-all duration-1000 ease-out"
                    style={{
                        left: `${carPosition.x - 40}px`,
                        top: `${carPosition.y - 80}px`,
                    }}
                >
                    <div className="relative animate-[float_2s_ease-in-out_infinite]">
                        <div className="text-6xl">🚗</div>
                        {/* Dust clouds */}
                        <div className="absolute -bottom-2 -left-2 text-2xl opacity-50 animate-[dustCloud_1s_ease-out_infinite]">
                            💨
                        </div>
                    </div>
                </div>
            )}

            {/* Lessons as Huts */}
            <div className="relative z-10">
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
                            <Card
                                className={`
                                    relative w-64 cursor-pointer transition-all duration-300
                                    ${lesson.isLocked ? "opacity-60 cursor-not-allowed" : "hover:scale-110 hover:shadow-2xl"}
                                    ${isCurrentLesson ? "ring-4 ring-[hsl(var(--savanna-gold))] scale-110" : ""}
                                    ${lesson.isCompleted ? "border-4 border-[hsl(var(--bead-green))]" : "border-4 border-[hsl(var(--earth-brown))]"}
                                `}
                                onClick={() =>
                                    !lesson.isLocked && onLessonClick(lesson.id)
                                }
                                style={{
                                    background: lesson.isCompleted
                                        ? "linear-gradient(135deg, hsl(var(--bead-green) / 0.2), hsl(var(--card)))"
                                        : "linear-gradient(135deg, hsl(var(--earth-brown) / 0.1), hsl(var(--card)))",
                                }}
                            >
                                {/* Hut Roof */}
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-6xl">
                                    {lesson.isLocked
                                        ? "🔒"
                                        : lesson.isCompleted
                                          ? "✨"
                                          : "🛖"}
                                </div>

                                <CardContent className="pt-12 pb-6 px-6">
                                    {/* Lesson Number Badge */}
                                    <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-[hsl(var(--sunset-orange))] text-white flex items-center justify-center font-bold text-sm">
                                        {index + 1}
                                    </div>

                                    {/* Status Icon */}
                                    <div className="absolute top-2 left-2">
                                        {lesson.isCompleted ? (
                                            <CheckCircle2 className="w-6 h-6 text-[hsl(var(--bead-green))]" />
                                        ) : lesson.isLocked ? (
                                            <Lock className="w-6 h-6 text-muted-foreground" />
                                        ) : (
                                            <MapPin className="w-6 h-6 text-[hsl(var(--sunset-orange))] animate-bounce" />
                                        )}
                                    </div>

                                    <h3 className="text-xl font-bold mb-2 text-center">
                                        {lesson.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground text-center mb-4">
                                        {lesson.description}
                                    </p>

                                    {/* Beads earned */}
                                    {lesson.isCompleted &&
                                        lesson.beadsEarned && (
                                            <div className="flex justify-center items-center gap-1">
                                                {Array.from({
                                                    length: lesson.beadsEarned,
                                                }).map((_, i) => (
                                                    <div
                                                        key={i}
                                                        className="w-6 h-6 rounded-full animate-[beadShine_2s_ease-in-out_infinite]"
                                                        style={{
                                                            background:
                                                                getBeadColor(i),
                                                            animationDelay: `${i * 0.2}s`,
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                        )}

                                    {/* Locked message */}
                                    {lesson.isLocked && (
                                        <p className="text-xs text-center text-muted-foreground mt-2">
                                            Complete previous lessons to unlock
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="fixed bottom-8 right-8 bg-card border-4 border-[hsl(var(--sunset-orange))] rounded-lg p-4 shadow-xl z-30">
                <h4 className="font-bold mb-2 text-lg">Legend</h4>
                <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">🛖</span>
                        <span>Available Lesson</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">🔒</span>
                        <span>Locked Lesson</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">✨</span>
                        <span>Completed Lesson</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">🚗</span>
                        <span>Your Journey</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                            {[0, 1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className="w-4 h-4 rounded-full"
                                    style={{ background: getBeadColor(i) }}
                                />
                            ))}
                        </div>
                        <span>Beads Earned</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
