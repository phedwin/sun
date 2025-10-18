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

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Trophy } from "lucide-react";

interface QuizQuestion {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation?: string;
}

interface LessonQuizProps {
    questions: QuizQuestion[];
    onComplete: (passed: boolean, score: number) => void;
    passingScore?: number;
}

export const LessonQuiz = ({
    questions,
    onComplete,
    passingScore = 70,
}: LessonQuizProps) => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [finished, setFinished] = useState(false);

    const currentQ = questions[currentQuestion];
    const isLastQuestion = currentQuestion === questions.length - 1;

    const handleAnswerSelect = (index: number) => {
        if (showExplanation) return; // Don't allow changing after showing explanation
        setSelectedAnswer(index);
    };

    const handleSubmitAnswer = () => {
        if (selectedAnswer === null) return;

        const isCorrect = selectedAnswer === currentQ.correctAnswer;
        if (isCorrect) {
            setCorrectAnswers(correctAnswers + 1);
        }
        setShowExplanation(true);
    };

    const handleNextQuestion = () => {
        if (isLastQuestion) {
            const score =
                ((correctAnswers +
                    (selectedAnswer === currentQ.correctAnswer ? 1 : 0)) /
                    questions.length) *
                100;
            const passed = score >= passingScore;
            setFinished(true);
            onComplete(passed, score);
        } else {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedAnswer(null);
            setShowExplanation(false);
        }
    };

    const getBeadCount = () => {
        const score = (correctAnswers / questions.length) * 100;
        if (score >= 90) return 5;
        if (score >= 80) return 4;
        if (score >= 70) return 3;
        if (score >= 60) return 2;
        return 1;
    };

    if (finished) {
        const score = (correctAnswers / questions.length) * 100;
        const passed = score >= passingScore;

        return (
            <Card className="w-full max-w-2xl mx-auto border-4 border-[hsl(var(--savanna-gold))]">
                <CardHeader className="text-center bg-gradient-to-r from-[hsl(var(--sunset-orange))]/10 to-[hsl(var(--savanna-gold))]/10">
                    <div className="flex justify-center mb-4">
                        {passed ? (
                            <Trophy className="w-20 h-20 text-[hsl(var(--savanna-gold))] animate-[float_2s_ease-in-out_infinite]" />
                        ) : (
                            <div className="text-6xl">📚</div>
                        )}
                    </div>
                    <CardTitle className="text-3xl font-bold bg-gradient-to-r from-[hsl(var(--sunset-orange))] to-[hsl(var(--savanna-gold))] bg-clip-text text-transparent">
                        {passed ? "Congratulations!" : "Keep Learning!"}
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 text-center space-y-6">
                    <div>
                        <div className="text-6xl font-bold mb-2 bg-gradient-to-r from-[hsl(var(--sunset-orange))] to-[hsl(var(--sunset-pink))] bg-clip-text text-transparent">
                            {score.toFixed(0)}%
                        </div>
                        <p className="text-xl text-muted-foreground font-semibold">
                            {correctAnswers} out of {questions.length} correct
                        </p>
                    </div>

                    {passed ? (
                        <>
                            <div className="flex justify-center gap-2">
                                {Array.from({ length: getBeadCount() }).map(
                                    (_, i) => {
                                        const colors = [
                                            "hsl(var(--bead-red))",
                                            "hsl(var(--bead-yellow))",
                                            "hsl(var(--bead-blue))",
                                            "hsl(var(--bead-green))",
                                        ];
                                        return (
                                            <div
                                                key={i}
                                                className="w-12 h-12 rounded-full animate-[beadShine_2s_ease-in-out_infinite]"
                                                style={{
                                                    background:
                                                        colors[
                                                            i % colors.length
                                                        ],
                                                    animationDelay: `${i * 0.2}s`,
                                                    boxShadow: `0 0 20px ${colors[i % colors.length]}`,
                                                }}
                                            />
                                        );
                                    }
                                )}
                            </div>
                            <p className="text-2xl font-bold text-[hsl(var(--savanna-gold))]">
                                You earned {getBeadCount()} beads!
                            </p>
                            <p className="text-lg text-muted-foreground">
                                The next lesson has been unlocked. Your car is
                                ready to continue the journey!
                            </p>
                        </>
                    ) : (
                        <p className="text-lg text-muted-foreground">
                            You need {passingScore}% to pass. Review the
                            material and try again!
                        </p>
                    )}
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-2xl mx-auto border-4 border-[hsl(var(--earth-brown))]">
            <CardHeader className="bg-gradient-to-r from-[hsl(var(--sunset-orange))]/10 to-transparent">
                <div className="flex justify-between items-center mb-2">
                    <Badge className="bg-[hsl(var(--sunset-orange))] text-white text-base px-4 py-1">
                        Question {currentQuestion + 1} of {questions.length}
                    </Badge>
                    <Badge variant="outline" className="text-base px-4 py-1">
                        Score: {correctAnswers}/
                        {currentQuestion + (showExplanation ? 1 : 0)}
                    </Badge>
                </div>
                <CardTitle className="text-2xl font-bold">
                    {currentQ.question}
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
                <div className="space-y-3">
                    {currentQ.options.map((option, index) => {
                        const isSelected = selectedAnswer === index;
                        const isCorrect = index === currentQ.correctAnswer;
                        const showResult = showExplanation;

                        let buttonClass =
                            "w-full text-left p-4 rounded-lg border-2 transition-all duration-200 text-lg font-semibold ";

                        if (showResult) {
                            if (isCorrect) {
                                buttonClass +=
                                    "border-[hsl(var(--bead-green))] bg-[hsl(var(--bead-green))]/10 text-[hsl(var(--bead-green))]";
                            } else if (isSelected && !isCorrect) {
                                buttonClass +=
                                    "border-[hsl(var(--bead-red))] bg-[hsl(var(--bead-red))]/10 text-[hsl(var(--bead-red))]";
                            } else {
                                buttonClass += "border-border opacity-50";
                            }
                        } else {
                            if (isSelected) {
                                buttonClass +=
                                    "border-[hsl(var(--sunset-orange))] bg-[hsl(var(--sunset-orange))]/10 scale-105 shadow-lg";
                            } else {
                                buttonClass +=
                                    "border-border hover:border-[hsl(var(--sunset-orange))] hover:scale-102";
                            }
                        }

                        return (
                            <button
                                key={index}
                                onClick={() => handleAnswerSelect(index)}
                                className={buttonClass}
                                disabled={showExplanation}
                            >
                                <div className="flex items-center justify-between">
                                    <span>{option}</span>
                                    {showResult && isCorrect && (
                                        <CheckCircle2 className="w-6 h-6 text-[hsl(var(--bead-green))]" />
                                    )}
                                    {showResult && isSelected && !isCorrect && (
                                        <XCircle className="w-6 h-6 text-[hsl(var(--bead-red))]" />
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>

                {showExplanation && currentQ.explanation && (
                    <div className="mt-6 p-4 rounded-lg bg-[hsl(var(--sky-blue))]/10 border-2 border-[hsl(var(--sky-blue))]">
                        <h4 className="font-bold text-[hsl(var(--sky-blue))] mb-2 text-lg">
                            Explanation:
                        </h4>
                        <p className="text-muted-foreground text-base">
                            {currentQ.explanation}
                        </p>
                    </div>
                )}

                <div className="flex justify-end gap-3 pt-4">
                    {!showExplanation ? (
                        <Button
                            onClick={handleSubmitAnswer}
                            disabled={selectedAnswer === null}
                            size="lg"
                            className="bg-gradient-to-r from-[hsl(var(--sunset-orange))] to-[hsl(var(--savanna-gold))] text-white font-bold text-lg px-8"
                        >
                            Submit Answer
                        </Button>
                    ) : (
                        <Button
                            onClick={handleNextQuestion}
                            size="lg"
                            className="bg-gradient-to-r from-[hsl(var(--sunset-orange))] to-[hsl(var(--savanna-gold))] text-white font-bold text-lg px-8"
                        >
                            {isLastQuestion ? "Finish Quiz" : "Next Question"}
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};
