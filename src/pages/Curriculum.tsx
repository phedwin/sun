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

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import FooterComponent from "@/components/Footer";
import {
    Video,
    FileText,
    CheckCircle2,
    Circle,
    Lock,
    Play,
    X,
    BookOpen
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface Resource {
    label: string;
    url?: string;
    videoId?: string;
}

interface Lecture {
    id: string;
    title: string;
    date: string;
    videoId?: string;
    slides?: string;
    recording?: string;
}

interface Lab {
    id: string;
    title: string;
    dueDate: string;
    file?: string;
    solutions?: string;
}

interface Assignment {
    id: string;
    title: string;
    dueDate: string;
    file?: string;
    solutions?: string;
}

interface Note {
    id: string;
    title: string;
    file: string; // path to HTML lesson file
}

interface Week {
    weekNumber: number;
    lectures: Lecture[];
    labs: Lab[];
    assignments: Assignment[];
    notes: Note[];
}

interface CourseData {
    courseCode: string;
    courseName: string;
    term: string;
    description: string;
    instructor: string;
    schedule: Week[];
}

interface Language {
    id: string;
    name: string;
    icon: string;
    status: "available" | "locked";
}

const Curriculum = () => {
    const navigate = useNavigate();
    const [selectedLanguage, setSelectedLanguage] = useState<string>("python");
    const [courseData, setCourseData] = useState<CourseData | null>(null);
    const [loading, setLoading] = useState(true);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [showStartDateModal, setShowStartDateModal] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);
    const [completedLectures, setCompletedLectures] = useState<Set<string>>(new Set());
    const [completedLabs, setCompletedLabs] = useState<Set<string>>(new Set());
    const [completedAssignments, setCompletedAssignments] = useState<Set<string>>(new Set());

    const languages: Language[] = [
        { id: "python", name: "Python", icon: "🐍", status: "available" },
        { id: "javascript", name: "JavaScript", icon: "⚡", status: "locked" },
        { id: "java", name: "Java", icon: "☕", status: "locked" },
        { id: "cpp", name: "C++", icon: "⚙️", status: "locked" },
        { id: "rust", name: "Rust", icon: "🦀", status: "locked" },
    ];

    // Complete Programming Course (based on CS61A structure)
    const mockPythonCourse: CourseData = {
        courseCode: "CS101",
        courseName: "Introduction to Programming",
        term: "Self-Paced",
        description: "Master programming fundamentals with Python and SQL",
        instructor: "Teaching Staff",
        schedule: [
            // Week 1
            {
                weekNumber: 1,
                lectures: [
                    { id: "lec-1-1", title: "Welcome", date: "Wed", videoId: "Z1Yd7upQsXY", slides: "/slides/lec1.pdf", recording: "/rec/lec1.mp4" },
                    { id: "lec-1-2", title: "Functions", date: "Fri", videoId: "rfscVS0vtbw", slides: "/slides/lec2.pdf" }
                ],
                labs: [
                    { id: "lab-1", title: "Getting Started", dueDate: "Wed", file: "/labs/lab00.pdf", solutions: "/labs/lab00-sol.pdf" }
                ],
                assignments: [
                    { id: "hw-1", title: "Functions, Control", dueDate: "Mon", file: "/hw/hw01.pdf", solutions: "/hw/hw01-sol.pdf" }
                ],
                notes: [
                    { id: "note-1-1", title: "Introduction to Python", file: "/curriculum/python_for_everyone/lessons/intro.html" },
                    { id: "note-1-2", title: "Installing Python", file: "/curriculum/python_for_everyone/lessons/install.html" },
                    { id: "note-1-3", title: "Functions", file: "/curriculum/python_for_everyone/lessons/functions.html" }
                ]
            },
            // Week 2
            {
                weekNumber: 2,
                lectures: [
                    { id: "lec-2-1", title: "Control", date: "Wed", videoId: "PqFKRqpHrjw", slides: "/slides/lec3.pdf" },
                    { id: "lec-2-2", title: "Higher-Order Functions", date: "Fri", videoId: "NSbOtYzIQI0", slides: "/slides/lec4.pdf" }
                ],
                labs: [
                    { id: "lab-2", title: "Functions Lab", dueDate: "Wed", file: "/labs/lab01.pdf" }
                ],
                assignments: [
                    { id: "hw-2", title: "Higher-Order Functions", dueDate: "Thu", file: "/hw/hw02.pdf" }
                ],
                notes: [
                    { id: "note-2-1", title: "Control Flow & Logic", file: "/curriculum/python_for_everyone/lessons/logic.html" },
                    { id: "note-2-2", title: "Loops", file: "/curriculum/python_for_everyone/lessons/loops.html" }
                ]
            },
            // Week 3
            {
                weekNumber: 3,
                lectures: [
                    { id: "lec-3-1", title: "Environments", date: "Mon", videoId: "tw7ror9x32s", slides: "/slides/lec5.pdf" },
                    { id: "lec-3-2", title: "Functional Abstraction", date: "Wed", videoId: "XCcpzWs-CI4", slides: "/slides/lec6.pdf" }
                ],
                labs: [
                    { id: "lab-3", title: "Higher-Order Functions, Lambda", dueDate: "Wed", file: "/labs/lab02.pdf" }
                ],
                assignments: [
                    { id: "hw-3", title: "Recursion, Tree Recursion", dueDate: "Thu", file: "/hw/hw03.pdf" }
                ],
                notes: [
                    { id: "note-3-1", title: "Strings", file: "/curriculum/python_for_everyone/lessons/strings.html" },
                    { id: "note-3-2", title: "Files", file: "/curriculum/python_for_everyone/lessons/files.html" }
                ]
            },
            // Week 4
            {
                weekNumber: 4,
                lectures: [
                    { id: "lec-4-1", title: "Recursion", date: "Fri", videoId: "8yjkWGRlUmY", slides: "/slides/lec7.pdf" }
                ],
                labs: [
                    { id: "lab-4", title: "Recursion, Python Lists", dueDate: "Wed", file: "/labs/lab03.pdf" }
                ],
                assignments: [],
                notes: [
                    { id: "note-4-1", title: "Lists", file: "/curriculum/python_for_everyone/lessons/lists.html" }
                ]
            },
            // Week 5
            {
                weekNumber: 5,
                lectures: [
                    { id: "lec-5-1", title: "Containers", date: "Wed", videoId: "4mX0uPQFLDU", slides: "/slides/lec12.pdf" },
                    { id: "lec-5-2", title: "Data Abstraction", date: "Fri", videoId: "NIWwJbo-9_8", slides: "/slides/lec13.pdf" }
                ],
                labs: [
                    { id: "lab-5", title: "Tree Recursion", dueDate: "Wed", file: "/labs/lab04.pdf" }
                ],
                assignments: [
                    { id: "hw-5", title: "Sequences, Data Abstraction, Trees", dueDate: "Thu", file: "/hw/hw04.pdf" }
                ],
                notes: [
                    { id: "note-5-1", title: "Dictionaries", file: "/curriculum/python_for_everyone/lessons/dictionary.html" },
                    { id: "note-5-2", title: "Tuples", file: "/curriculum/python_for_everyone/lessons/tuples.html" }
                ]
            },
            // Week 6
            {
                weekNumber: 6,
                lectures: [
                    { id: "lec-6-1", title: "Mutability", date: "Wed", videoId: "tw7ror9x32s", slides: "/slides/lec15.pdf" },
                    { id: "lec-6-2", title: "Iterators", date: "Fri", videoId: "XCcpzWs-CI4", slides: "/slides/lec16.pdf" }
                ],
                labs: [
                    { id: "lab-6", title: "Tree Recursion, Data Abstraction", dueDate: "Wed", file: "/labs/lab04.pdf" }
                ],
                assignments: [],
                notes: [
                    { id: "note-6-1", title: "Memory & Variables", file: "/curriculum/python_for_everyone/lessons/memory.html" }
                ]
            },
            // Week 7
            {
                weekNumber: 7,
                lectures: [
                    { id: "lec-7-1", title: "Generators", date: "Mon", videoId: "4mX0uPQFLDU", slides: "/slides/lec17.pdf" },
                    { id: "lec-7-2", title: "Objects", date: "Wed", videoId: "NIWwJbo-9_8", slides: "/slides/lec18.pdf" }
                ],
                labs: [
                    { id: "lab-7", title: "Iterators, Mutability", dueDate: "Wed", file: "/labs/lab05.pdf" }
                ],
                assignments: [
                    { id: "hw-7", title: "Generators", dueDate: "Thu", file: "/hw/hw05.pdf" }
                ],
                notes: [
                    { id: "note-7-1", title: "Object-Oriented Programming", file: "/curriculum/python_for_everyone/lessons/Objects.html" }
                ]
            },
            // Week 8
            {
                weekNumber: 8,
                lectures: [
                    { id: "lec-8-1", title: "Inheritance", date: "Mon", videoId: "8yjkWGRlUmY", slides: "/slides/lec20.pdf" },
                    { id: "lec-8-2", title: "Representation", date: "Wed", videoId: "Ej_02ICOIgs", slides: "/slides/lec21.pdf" },
                    { id: "lec-8-3", title: "Composition", date: "Fri", videoId: "tw7ror9x32s", slides: "/slides/lec22.pdf" }
                ],
                labs: [
                    { id: "lab-8", title: "Object-Oriented Programming", dueDate: "Wed", file: "/labs/lab06.pdf" }
                ],
                assignments: [
                    { id: "hw-8", title: "Object-Oriented Programming, Linked Lists, Mutable Trees", dueDate: "Thu", file: "/hw/hw06.pdf" }
                ],
                notes: [
                    { id: "note-8-1", title: "Regular Expressions", file: "/curriculum/python_for_everyone/lessons/regex.html" }
                ]
            },
            // Week 9
            {
                weekNumber: 9,
                lectures: [
                    { id: "lec-9-1", title: "Efficiency", date: "Mon", videoId: "XCcpzWs-CI4", slides: "/slides/lec23.pdf" },
                    { id: "lec-9-2", title: "Data Examples", date: "Fri", videoId: "4mX0uPQFLDU", slides: "/slides/lec25.pdf" }
                ],
                labs: [
                    { id: "lab-9", title: "Linked Lists, Inheritance", dueDate: "Wed", file: "/labs/lab07.pdf" }
                ],
                assignments: [
                    { id: "hw-9", title: "Programs as Data, Macros", dueDate: "Thu", file: "/hw/hw09.pdf" }
                ],
                notes: [
                    { id: "note-9-1", title: "Network Programming", file: "/curriculum/python_for_everyone/lessons/network.html" }
                ]
            },
            // Week 10
            {
                weekNumber: 10,
                lectures: [
                    { id: "lec-10-1", title: "Scheme", date: "Mon", videoId: "NIWwJbo-9_8", slides: "/slides/lec29.pdf" },
                    { id: "lec-10-2", title: "Scheme Lists", date: "Wed", videoId: "Z1Yd7upQsXY", slides: "/slides/lec30.pdf" }
                ],
                labs: [
                    { id: "lab-10", title: "Scheme", dueDate: "Wed", file: "/labs/lab08.pdf" }
                ],
                assignments: [
                    { id: "hw-10", title: "Scheme", dueDate: "Thu", file: "/hw/hw07.pdf" }
                ],
                notes: [
                    { id: "note-10-1", title: "Web Services", file: "/curriculum/python_for_everyone/lessons/servces.html" }
                ]
            },
            // Week 11
            {
                weekNumber: 11,
                lectures: [
                    { id: "lec-11-1", title: "Interpreters", date: "Mon", videoId: "rfscVS0vtbw", slides: "/slides/lec32.pdf" },
                    { id: "lec-11-2", title: "Programs as Data", date: "Wed", videoId: "PqFKRqpHrjw", slides: "/slides/lec33.pdf" }
                ],
                labs: [
                    { id: "lab-11", title: "Interpreters", dueDate: "Wed", file: "/labs/lab09.pdf" }
                ],
                assignments: [
                    { id: "hw-11", title: "Scheme Lists", dueDate: "Thu", file: "/hw/hw08.pdf" }
                ],
                notes: []
            },
            // Week 12
            {
                weekNumber: 12,
                lectures: [
                    { id: "lec-12-1", title: "Calculator", date: "Fri", videoId: "NSbOtYzIQI0", slides: "/slides/lec31.pdf" }
                ],
                labs: [],
                assignments: [],
                notes: []
            },
            // Week 13
            {
                weekNumber: 13,
                lectures: [
                    { id: "lec-13-1", title: "Tables", date: "Wed", videoId: "tw7ror9x32s", slides: "/slides/lec36.pdf" },
                    { id: "lec-13-2", title: "Aggregation", date: "Fri", videoId: "XCcpzWs-CI4", slides: "/slides/lec37.pdf" }
                ],
                labs: [
                    { id: "lab-13", title: "Programs as Data, Macros", dueDate: "Wed", file: "/labs/lab10.pdf" }
                ],
                assignments: [
                    { id: "hw-13", title: "SQL", dueDate: "Thu", file: "/hw/hw10.pdf" }
                ],
                notes: [
                    { id: "note-13-1", title: "Databases", file: "/curriculum/python_for_everyone/lessons/database.html" }
                ]
            },
            // Week 14
            {
                weekNumber: 14,
                lectures: [
                    { id: "lec-14-1", title: "Databases", date: "Mon", videoId: "4mX0uPQFLDU", slides: "/slides/lec38.pdf" }
                ],
                labs: [],
                assignments: [],
                notes: [
                    { id: "note-14-1", title: "Data Visualization", file: "/curriculum/python_for_everyone/lessons/dataviz.html" }
                ]
            },
            // Week 15
            {
                weekNumber: 15,
                lectures: [
                    { id: "lec-15-1", title: "Designing Functions", date: "Mon", videoId: "NIWwJbo-9_8", slides: "/slides/lec39.pdf" },
                    { id: "lec-15-2", title: "Language Models", date: "Wed", videoId: "Z1Yd7upQsXY", slides: "/slides/lec40.pdf" },
                    { id: "lec-15-3", title: "Conclusion", date: "Fri", videoId: "rfscVS0vtbw", slides: "/slides/lec41.pdf" }
                ],
                labs: [
                    { id: "lab-15", title: "SQL", dueDate: "Wed", file: "/labs/lab11.pdf" }
                ],
                assignments: [
                    { id: "hw-15", title: "Finale", dueDate: "Sun", file: "/hw/hw11.pdf" }
                ],
                notes: []
            }
        ]
    };

    useEffect(() => {
        setCourseData(mockPythonCourse);
        setLoading(false);

        // Load progress from localStorage
        const storedStartDate = localStorage.getItem("courseStartDate");
        const storedLectures = localStorage.getItem("completedLectures");
        const storedLabs = localStorage.getItem("completedLabs");
        const storedAssignments = localStorage.getItem("completedAssignments");

        if (storedStartDate) {
            setStartDate(new Date(storedStartDate));
        } else {
            setShowStartDateModal(true);
        }

        if (storedLectures) setCompletedLectures(new Set(JSON.parse(storedLectures)));
        if (storedLabs) setCompletedLabs(new Set(JSON.parse(storedLabs)));
        if (storedAssignments) setCompletedAssignments(new Set(JSON.parse(storedAssignments)));
    }, []);

    const handleSetStartDate = (date: Date) => {
        setStartDate(date);
        localStorage.setItem("courseStartDate", date.toISOString());
        setShowStartDateModal(false);
    };

    const calculateDate = (weekNumber: number, dayOfWeek: string): string => {
        if (!startDate) return "";
        const date = new Date(startDate);
        date.setDate(date.getDate() + (weekNumber - 1) * 7);

        // Adjust based on day of week
        const dayMap: {[key: string]: number} = { "Mon": 0, "Wed": 2, "Fri": 4, "Tue": 1, "Thu": 3 };
        if (dayMap[dayOfWeek] !== undefined) {
            date.setDate(date.getDate() + dayMap[dayOfWeek]);
        }

        return date.toLocaleDateString("en-US", { month: "numeric", day: "numeric" });
    };

    const toggleCompleted = (id: string, type: 'lecture' | 'lab' | 'assignment') => {
        const setters = {
            lecture: { set: setCompletedLectures, current: completedLectures },
            lab: { set: setCompletedLabs, current: completedLabs },
            assignment: { set: setCompletedAssignments, current: completedAssignments }
        };

        const { set, current } = setters[type];
        const newSet = new Set(current);
        newSet.has(id) ? newSet.delete(id) : newSet.add(id);
        set(newSet);
        localStorage.setItem(`completed${type.charAt(0).toUpperCase() + type.slice(1)}s`, JSON.stringify(Array.from(newSet)));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <div className="container py-8">
                    <p className="text-muted-foreground">Loading course...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="container py-8 max-w-7xl">
                {/* Header */}
                <div className="mb-6 space-y-4">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">Curriculum</h1>
                        <p className="text-muted-foreground">
                            Master programming fundamentals through structured courses
                        </p>
                    </div>

                    {/* Language Selector */}
                    <div className="flex gap-3">
                        {languages.map((lang) => (
                            <button
                                key={lang.id}
                                onClick={() => lang.status === "available" && setSelectedLanguage(lang.id)}
                                disabled={lang.status === "locked"}
                                className={`
                                    px-4 py-2 rounded-lg font-semibold transition-all
                                    ${selectedLanguage === lang.id
                                        ? "bg-primary text-primary-foreground shadow-lg"
                                        : lang.status === "locked"
                                            ? "bg-muted/50 text-muted-foreground cursor-not-allowed"
                                            : "bg-muted hover:bg-muted/80"
                                    }
                                    flex items-center gap-2
                                `}
                            >
                                <span className="text-xl">{lang.icon}</span>
                                {lang.name}
                                {lang.status === "locked" && <Lock className="h-4 w-4" />}
                            </button>
                        ))}
                    </div>

                    {/* Course Info */}
                    {courseData && (
                        <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20">
                            <div>
                                <div className="flex items-center gap-3">
                                    <h2 className="text-2xl font-bold">{courseData.courseCode}</h2>
                                    <Badge variant="secondary">{courseData.term}</Badge>
                                </div>
                                <p className="text-muted-foreground">{courseData.courseName}</p>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowStartDateModal(true)}
                            >
                                {startDate ? `Started: ${startDate.toLocaleDateString()}` : "Set Start Date"}
                            </Button>
                        </div>
                    )}
                </div>

                {/* Calendar Table */}
                <div className="border rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gradient-to-r from-muted to-muted/50 border-b">
                                <th className="text-left p-4 font-bold text-sm w-20">Week</th>
                                <th className="text-left p-4 font-bold text-sm w-24">Date</th>
                                <th className="text-left p-4 font-bold text-sm">Lecture</th>
                                <th className="text-left p-4 font-bold text-sm">Notes</th>
                                <th className="text-left p-4 font-bold text-sm">Lab & Discussion</th>
                                <th className="text-left p-4 font-bold text-sm">Homework & Project</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courseData?.schedule.map((week) => {
                                const maxRows = Math.max(
                                    week.lectures.length,
                                    week.notes.length,
                                    week.labs.length,
                                    week.assignments.length
                                );

                                return Array.from({ length: maxRows }).map((_, rowIndex) => {
                                    const lecture = week.lectures[rowIndex];
                                    const note = week.notes[rowIndex];
                                    const lab = week.labs[rowIndex];
                                    const assignment = week.assignments[rowIndex];

                                    return (
                                        <tr
                                            key={`${week.weekNumber}-${rowIndex}`}
                                            className="border-b hover:bg-muted/30 transition-colors"
                                        >
                                            {/* Week Number */}
                                            {rowIndex === 0 && (
                                                <td
                                                    rowSpan={maxRows}
                                                    className="p-4 font-bold text-lg border-r bg-muted/20"
                                                >
                                                    {week.weekNumber}
                                                </td>
                                            )}

                                            {/* Date */}
                                            <td className="p-4 border-r">
                                                {lecture && (
                                                    <div className="text-sm">
                                                        <div className="font-medium">{lecture.date}</div>
                                                        {startDate && (
                                                            <div className="text-xs text-muted-foreground">
                                                                {calculateDate(week.weekNumber, lecture.date)}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </td>

                                            {/* Lecture */}
                                            <td className="p-4 border-r">
                                                {lecture && (
                                                    <div className="space-y-2">
                                                        <div className="flex items-start gap-2">
                                                            <button
                                                                onClick={() => toggleCompleted(lecture.id, 'lecture')}
                                                                className="mt-0.5 shrink-0"
                                                            >
                                                                {completedLectures.has(lecture.id) ? (
                                                                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                                                                ) : (
                                                                    <Circle className="h-5 w-5 text-muted-foreground" />
                                                                )}
                                                            </button>
                                                            <div className="flex-1">
                                                                <div className="font-medium text-sm">{lecture.title}</div>
                                                                <div className="flex gap-1 mt-1">
                                                                    {lecture.videoId && (
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            className="h-7 text-xs px-2"
                                                                            onClick={() => setSelectedVideo(lecture.videoId!)}
                                                                        >
                                                                            <Video className="h-3 w-3 mr-1" />
                                                                            Video
                                                                        </Button>
                                                                    )}
                                                                    {lecture.recording && (
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            className="h-7 text-xs px-2"
                                                                        >
                                                                            Recording
                                                                        </Button>
                                                                    )}
                                                                    {lecture.slides && (
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            className="h-7 text-xs px-2"
                                                                        >
                                                                            <FileText className="h-3 w-3 mr-1" />
                                                                            Slides
                                                                        </Button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </td>

                                            {/* Notes */}
                                            <td className="p-4 border-r">
                                                {note && (
                                                    <div className="flex items-start gap-2">
                                                        <div className="flex-1">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-auto text-xs px-2 py-1 w-full justify-start"
                                                                onClick={() => setSelectedNote(note)}
                                                            >
                                                                <BookOpen className="h-3 w-3 mr-1 shrink-0" />
                                                                <span className="text-left">{note.title}</span>
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}
                                            </td>

                                            {/* Lab */}
                                            <td className="p-4 border-r">
                                                {lab && (
                                                    <div className="flex items-start gap-2">
                                                        <button
                                                            onClick={() => toggleCompleted(lab.id, 'lab')}
                                                            className="mt-0.5 shrink-0"
                                                        >
                                                            {completedLabs.has(lab.id) ? (
                                                                <CheckCircle2 className="h-5 w-5 text-green-600" />
                                                            ) : (
                                                                <Circle className="h-5 w-5 text-muted-foreground" />
                                                            )}
                                                        </button>
                                                        <div>
                                                            <div className="font-medium text-sm">{lab.title}</div>
                                                            <Badge variant="secondary" className="text-xs mt-1">
                                                                Due {lab.dueDate}
                                                            </Badge>
                                                            {lab.solutions && (
                                                                <div className="text-xs text-muted-foreground mt-1">
                                                                    Solutions
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </td>

                                            {/* Assignment */}
                                            <td className="p-4">
                                                {assignment && (
                                                    <div className="flex items-start gap-2">
                                                        <button
                                                            onClick={() => toggleCompleted(assignment.id, 'assignment')}
                                                            className="mt-0.5 shrink-0"
                                                        >
                                                            {completedAssignments.has(assignment.id) ? (
                                                                <CheckCircle2 className="h-5 w-5 text-green-600" />
                                                            ) : (
                                                                <Circle className="h-5 w-5 text-muted-foreground" />
                                                            )}
                                                        </button>
                                                        <div>
                                                            <div className="font-medium text-sm">{assignment.title}</div>
                                                            <Badge variant="secondary" className="text-xs mt-1">
                                                                Due {assignment.dueDate}
                                                            </Badge>
                                                            {assignment.solutions && (
                                                                <div className="text-xs text-muted-foreground mt-1">
                                                                    Solutions
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                });
                            })}
                        </tbody>
                    </table>
                </div>
            </main>

            {/* Start Date Modal */}
            <Dialog open={showStartDateModal} onOpenChange={setShowStartDateModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Set Your Start Date</DialogTitle>
                        <DialogDescription>
                            Choose when you want to begin this course. Deadlines will be calculated from this date.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <input
                            type="date"
                            className="w-full p-3 rounded-lg border bg-background"
                            defaultValue={new Date().toISOString().split('T')[0]}
                            onChange={(e) => {
                                if (e.target.value) {
                                    handleSetStartDate(new Date(e.target.value));
                                }
                            }}
                        />
                        <Button
                            onClick={() => handleSetStartDate(new Date())}
                            className="w-full"
                        >
                            Start Today
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Video Player Modal */}
            <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
                <DialogContent className="max-w-5xl p-0">
                    <button
                        onClick={() => setSelectedVideo(null)}
                        className="absolute top-4 right-4 z-50 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
                    >
                        <X className="h-4 w-4" />
                    </button>
                    {selectedVideo && (
                        <div className="aspect-video w-full">
                            <iframe
                                width="100%"
                                height="100%"
                                src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="rounded-lg"
                            />
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Lesson Notes Modal */}
            <Dialog open={!!selectedNote} onOpenChange={() => setSelectedNote(null)}>
                <DialogContent className="max-w-6xl max-h-[90vh] p-0 overflow-hidden">
                    <DialogHeader className="p-6 pb-4 border-b">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <BookOpen className="h-5 w-5 text-primary" />
                                <DialogTitle>{selectedNote?.title}</DialogTitle>
                            </div>
                            <button
                                onClick={() => setSelectedNote(null)}
                                className="h-8 w-8 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    </DialogHeader>
                    {selectedNote && (
                        <div className="w-full h-[calc(90vh-100px)] overflow-auto">
                            <iframe
                                src={selectedNote.file}
                                title={selectedNote.title}
                                className="w-full h-full border-0"
                                style={{ minHeight: '600px' }}
                            />
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <FooterComponent />
        </div>
    );
};

export default Curriculum;
