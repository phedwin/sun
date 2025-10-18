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

import { useEffect, useState } from "react";

interface FallingItem {
    id: number;
    emoji: string;
    left: number;
    delay: number;
    duration: number;
}

interface CelebrationAnimationProps {
    show: boolean;
    onComplete?: () => void;
}

export const CelebrationAnimation = ({
    show,
    onComplete,
}: CelebrationAnimationProps) => {
    const [items, setItems] = useState<FallingItem[]>([]);

    const celebrationEmojis = [
        "🎉",
        "✨",
        "🌟",
        "💫",
        "⭐",
        "🎊",
        "🔥",
        "💎",
        "🏆",
        "👑",
    ];

    useEffect(() => {
        if (show) {
            // Create 30 random falling items
            const newItems: FallingItem[] = Array.from(
                { length: 30 },
                (_, i) => ({
                    id: i,
                    emoji: celebrationEmojis[
                        Math.floor(Math.random() * celebrationEmojis.length)
                    ],
                    left: Math.random() * 100,
                    delay: Math.random() * 0.5,
                    duration: 2 + Math.random() * 2,
                })
            );

            setItems(newItems);

            // Clear after animation
            const timeout = setTimeout(() => {
                setItems([]);
                onComplete?.();
            }, 4000);

            return () => clearTimeout(timeout);
        }
    }, [show]);

    if (!show || items.length === 0) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {items.map((item) => (
                <div
                    key={item.id}
                    className="absolute text-4xl"
                    style={{
                        left: `${item.left}%`,
                        top: "-10%",
                        animation: `fallFromSky ${item.duration}s ease-in forwards`,
                        animationDelay: `${item.delay}s`,
                    }}
                >
                    {item.emoji}
                </div>
            ))}

            {/* Central burst effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="text-8xl animate-[float_1s_ease-out]">🎉</div>
            </div>

            {/* Success message */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                <div className="bg-gradient-to-r from-[hsl(var(--sunset-orange))] via-[hsl(var(--sunset-pink))] to-[hsl(var(--savanna-gold))] bg-clip-text text-transparent text-6xl font-bold animate-[float_1s_ease-out]">
                    Amazing!
                </div>
                <div className="mt-4 text-2xl font-semibold text-foreground animate-[slideUp_0.5s_ease-out_0.3s_both]">
                    You earned beads! 🔴🟡🔵🟢
                </div>
            </div>
        </div>
    );
};

export const BeadCollectionAnimation = ({ beads }: { beads: number }) => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (beads > 0) {
            setShow(true);
            const timeout = setTimeout(() => setShow(false), 3000);
            return () => clearTimeout(timeout);
        }
    }, [beads]);

    if (!show) return null;

    const beadColors = [
        "hsl(var(--bead-red))",
        "hsl(var(--bead-yellow))",
        "hsl(var(--bead-blue))",
        "hsl(var(--bead-green))",
    ];

    return (
        <div className="fixed bottom-8 right-8 z-50 pointer-events-none">
            <div className="bg-card border-4 border-[hsl(var(--savanna-gold))] rounded-2xl p-6 shadow-2xl animate-[slideUp_0.5s_ease-out]">
                <div className="text-2xl font-bold text-center mb-3 bg-gradient-to-r from-[hsl(var(--sunset-orange))] to-[hsl(var(--savanna-gold))] bg-clip-text text-transparent">
                    Beads Collected!
                </div>
                <div className="flex gap-2 justify-center">
                    {Array.from({ length: beads }).map((_, i) => (
                        <div
                            key={i}
                            className="w-10 h-10 rounded-full animate-[beadShine_1.5s_ease-in-out_infinite]"
                            style={{
                                background: beadColors[i % beadColors.length],
                                animationDelay: `${i * 0.1}s`,
                                boxShadow: `0 0 20px ${beadColors[i % beadColors.length]}`,
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
