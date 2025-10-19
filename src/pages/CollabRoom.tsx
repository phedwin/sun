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

import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useSocket } from "@/contexts/SocketContext";
import {
    Users,
    MessageSquare,
    Copy,
    Check,
    Code2,
    LogOut,
    Send,
    Video,
    Mic,
    FileCode,
    Settings,
    Maximize2,
    X,
} from "lucide-react";
import { CodeEditor } from "@/components/CodeEditor";
import { fetchProblemDetail, LeetCodeProblemDetail } from "@/lib/leetcodeApi";

export default function CollabRoom() {
    const { roomCode: urlRoomCode } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const usernameParam = searchParams.get("username");

    const {
        currentRoom,
        currentUser,
        messages,
        sendMessage,
        updateCode,
        leaveRoom,
        joinRoom,
    } = useSocket();

    const [chatMessage, setChatMessage] = useState("");
    const [code, setCode] = useState("");
    const [language, setLanguage] = useState<
        "javascript" | "python" | "java" | "cpp"
    >("javascript");
    const [copiedCode, setCopiedCode] = useState(false);
    const [problem, setProblem] = useState<LeetCodeProblemDetail | null>(null);
    const [loadingProblem, setLoadingProblem] = useState(false);
    const [selectedProblem, setSelectedProblem] = useState<string | null>(null);
    const [showFeatures, setShowFeatures] = useState(true);
    const [activeFeature, setActiveFeature] = useState<
        "code" | "chat" | "video" | null
    >(null);
    const chatEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll chat to bottom
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Join room on mount if room code exists
    useEffect(() => {
        if (urlRoomCode && usernameParam && !currentRoom) {
            joinRoom(urlRoomCode, usernameParam);
        }
    }, [urlRoomCode, usernameParam]);

    // Sync code from room
    useEffect(() => {
        if (currentRoom) {
            setCode(currentRoom.code);
            setLanguage(currentRoom.language as any);
            setShowFeatures(false); // Hide features once joined
        }
    }, [currentRoom]);

    // Load problem when selected
    useEffect(() => {
        if (selectedProblem) {
            const loadProblem = async () => {
                try {
                    setLoadingProblem(true);
                    const problemData =
                        await fetchProblemDetail(selectedProblem);
                    setProblem(problemData);
                } catch (err) {
                    console.error("Error loading problem:", err);
                } finally {
                    setLoadingProblem(false);
                }
            };
            loadProblem();
        }
    }, [selectedProblem]);

    const handleSendMessage = () => {
        if (!chatMessage.trim()) return;
        sendMessage(chatMessage);
        setChatMessage("");
    };

    const handleCodeChange = (newCode: string) => {
        setCode(newCode);
        updateCode(newCode);
    };

    const handleLeaveRoom = () => {
        leaveRoom();
        navigate("/server-hub");
    };

    const copyRoomCode = () => {
        if (currentRoom) {
            navigator.clipboard.writeText(currentRoom.id);
            setCopiedCode(true);
            setTimeout(() => setCopiedCode(false), 2000);
        }
    };

    const activateFeature = (feature: "code" | "chat" | "video") => {
        setActiveFeature(feature);
        setShowFeatures(false);
    };

    // Show loading or not in room state
    if (!currentRoom) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <main className="container py-12 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[hsl(var(--sky-blue))] mx-auto mb-4" />
                        <p className="text-muted-foreground">
                            Joining server...
                        </p>
                    </div>
                </main>
            </div>
        );
    }

    // Show feature cards initially
    if (showFeatures) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <main className="container py-8">
                    {/* Room Header */}
                    <div className="mb-8 text-center space-y-4">
                        <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[hsl(var(--sky-blue))]/20 to-[hsl(var(--bead-blue))]/20 rounded-full border border-[hsl(var(--sky-blue))]/30">
                            <Users className="h-5 w-5 text-[hsl(var(--sky-blue))]" />
                            <h1 className="text-xl font-semibold">
                                {currentRoom.name}
                            </h1>
                            <Separator orientation="vertical" className="h-5" />
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">
                                    Code:
                                </span>
                                <Badge
                                    variant="outline"
                                    className="font-mono text-base px-3"
                                >
                                    {currentRoom.id}
                                </Badge>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={copyRoomCode}
                                    className="h-7 w-7 p-0"
                                >
                                    {copiedCode ? (
                                        <Check className="h-4 w-4 text-green-500" />
                                    ) : (
                                        <Copy className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                        </div>
                        <p className="text-muted-foreground">
                            Welcome {currentUser?.username}! Choose a feature to
                            get started.
                        </p>
                    </div>

                    {/* Feature Cards Grid */}
                    <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-8">
                        {/* Collaborative Coding Card */}
                        <Card
                            className="group cursor-pointer border-2 hover:border-[hsl(var(--sunset-orange))] hover:shadow-lg transition-all duration-300 hover:scale-105"
                            onClick={() => activateFeature("code")}
                        >
                            <CardContent className="pt-6 text-center space-y-4">
                                <div className="inline-flex p-6 rounded-full bg-[hsl(var(--sunset-orange))]/10 group-hover:bg-[hsl(var(--sunset-orange))]/20 transition-colors">
                                    <Code2 className="h-12 w-12 text-[hsl(var(--sunset-orange))]" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-xl mb-2">
                                        Collaborative Coding
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        Work on the same code simultaneously.
                                        See everyone's changes in real-time.
                                    </p>
                                </div>
                                <Button className="w-full bg-[hsl(var(--sunset-orange))] hover:bg-[hsl(var(--sunset-orange))]/90">
                                    <Code2 className="h-4 w-4 mr-2" />
                                    Start Coding
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Instant Chat Card */}
                        <Card
                            className="group cursor-pointer border-2 hover:border-[hsl(var(--sky-blue))] hover:shadow-lg transition-all duration-300 hover:scale-105"
                            onClick={() => activateFeature("chat")}
                        >
                            <CardContent className="pt-6 text-center space-y-4">
                                <div className="inline-flex p-6 rounded-full bg-[hsl(var(--sky-blue))]/10 group-hover:bg-[hsl(var(--sky-blue))]/20 transition-colors">
                                    <MessageSquare className="h-12 w-12 text-[hsl(var(--sky-blue))]" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-xl mb-2">
                                        Instant Chat
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        Discuss solutions, ask questions, and
                                        share knowledge instantly.
                                    </p>
                                </div>
                                <Button className="w-full bg-[hsl(var(--sky-blue))] hover:bg-[hsl(var(--sky-blue))]/90">
                                    <MessageSquare className="h-4 w-4 mr-2" />
                                    Open Chat
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Voice & Video Card */}
                        <Card
                            className="group cursor-pointer border-2 hover:border-[hsl(var(--bead-green))] hover:shadow-lg transition-all duration-300 hover:scale-105"
                            onClick={() => activateFeature("video")}
                        >
                            <CardContent className="pt-6 text-center space-y-4">
                                <div className="inline-flex p-6 rounded-full bg-[hsl(var(--bead-green))]/10 group-hover:bg-[hsl(var(--bead-green))]/20 transition-colors">
                                    <Video className="h-12 w-12 text-[hsl(var(--bead-green))]" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-xl mb-2">
                                        Voice & Video
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        Turn on your camera or mic for pair
                                        programming sessions.
                                    </p>
                                </div>
                                <Button className="w-full bg-[hsl(var(--bead-green))] hover:bg-[hsl(var(--bead-green))]/90">
                                    <Video className="h-4 w-4 mr-2" />
                                    Join Call
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Active Users */}
                    <Card className="max-w-2xl mx-auto">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold flex items-center gap-2">
                                    <Users className="h-4 w-4" />
                                    Active Members ({currentRoom.users.length})
                                </h3>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleLeaveRoom}
                                >
                                    <LogOut className="h-4 w-4 mr-2" />
                                    Leave Server
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {currentRoom.users.map((user) => (
                                    <Badge
                                        key={user.id}
                                        variant="secondary"
                                        className="px-3 py-1.5"
                                        style={{
                                            borderLeft: `3px solid ${user.color}`,
                                        }}
                                    >
                                        {user.username}
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </main>
            </div>
        );
    }

    // Main room interface (after selecting a feature)
    return (
        <div className="h-screen flex flex-col bg-background">
            <Header />

            {/* Room Toolbar */}
            <div className="border-b border-border px-4 py-2 flex items-center justify-between bg-muted/50">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-[hsl(var(--sky-blue))]" />
                        <span className="font-semibold">
                            {currentRoom.name}
                        </span>
                    </div>
                    <Separator orientation="vertical" className="h-5" />
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono">
                            {currentRoom.id}
                        </Badge>
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={copyRoomCode}
                            className="h-7 w-7 p-0"
                        >
                            {copiedCode ? (
                                <Check className="h-3 w-3 text-green-500" />
                            ) : (
                                <Copy className="h-3 w-3" />
                            )}
                        </Button>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            variant={
                                activeFeature === "code" ? "default" : "ghost"
                            }
                            onClick={() => setActiveFeature("code")}
                        >
                            <Code2 className="h-4 w-4" />
                        </Button>
                        <Button
                            size="sm"
                            variant={
                                activeFeature === "chat" ? "default" : "ghost"
                            }
                            onClick={() => setActiveFeature("chat")}
                        >
                            <MessageSquare className="h-4 w-4" />
                        </Button>
                        <Button
                            size="sm"
                            variant={
                                activeFeature === "video" ? "default" : "ghost"
                            }
                            onClick={() => setActiveFeature("video")}
                        >
                            <Video className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setShowFeatures(true)}
                    >
                        <Maximize2 className="h-4 w-4" />
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={handleLeaveRoom}
                    >
                        <LogOut className="h-4 w-4 mr-2" />
                        Leave
                    </Button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Sidebar - Users */}
                <div className="w-64 border-r border-border bg-muted/30 flex flex-col">
                    <div className="p-4 border-b border-border">
                        <h3 className="font-semibold flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Members ({currentRoom.users.length})
                        </h3>
                    </div>
                    <ScrollArea className="flex-1 p-4">
                        <div className="space-y-2">
                            {currentRoom.users.map((user) => (
                                <div
                                    key={user.id}
                                    className="flex items-center gap-2 p-2 rounded hover:bg-muted"
                                >
                                    <div
                                        className="w-2 h-2 rounded-full"
                                        style={{ backgroundColor: user.color }}
                                    />
                                    <span className="text-sm">
                                        {user.username}
                                    </span>
                                    {user.id === currentUser?.id && (
                                        <Badge
                                            variant="secondary"
                                            className="text-xs ml-auto"
                                        >
                                            You
                                        </Badge>
                                    )}
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col">
                    {activeFeature === "code" && (
                        <div className="flex-1 flex gap-4 p-4">
                            {/* Problem Panel (if problem selected) */}
                            {problem && (
                                <div className="w-1/3 border-r border-border pr-4">
                                    <ScrollArea className="h-full">
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <h2 className="text-xl font-semibold">
                                                    {problem.title}
                                                </h2>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => {
                                                        setProblem(null);
                                                        setSelectedProblem(
                                                            null
                                                        );
                                                    }}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <div className="flex gap-2">
                                                <Badge
                                                    variant={
                                                        problem.difficulty ===
                                                        "Easy"
                                                            ? "default"
                                                            : problem.difficulty ===
                                                                "Medium"
                                                              ? "secondary"
                                                              : "destructive"
                                                    }
                                                >
                                                    {problem.difficulty}
                                                </Badge>
                                                {problem.topicTags
                                                    ?.slice(0, 2)
                                                    .map((tag) => (
                                                        <Badge
                                                            key={tag.name}
                                                            variant="outline"
                                                        >
                                                            {tag.name}
                                                        </Badge>
                                                    ))}
                                            </div>
                                            <div
                                                className="prose prose-sm dark:prose-invert max-w-none"
                                                dangerouslySetInnerHTML={{
                                                    __html:
                                                        problem.content || "",
                                                }}
                                            />
                                        </div>
                                    </ScrollArea>
                                </div>
                            )}

                            {/* Code Editor */}
                            <div className="flex-1 flex flex-col">
                                {!problem && (
                                    <div className="mb-4 p-4 bg-muted rounded-lg">
                                        <div className="flex items-center gap-4">
                                            <FileCode className="h-5 w-5 text-muted-foreground" />
                                            <div className="flex-1">
                                                <p className="text-sm font-medium mb-1">
                                                    Load a problem to solve
                                                    together
                                                </p>
                                                <Input
                                                    placeholder="Enter problem slug (e.g., two-sum)"
                                                    className="max-w-md"
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter") {
                                                            const input =
                                                                e.currentTarget as HTMLInputElement;
                                                            setSelectedProblem(
                                                                input.value
                                                            );
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div className="flex-1">
                                    <CodeEditor
                                        value={code}
                                        onChange={handleCodeChange}
                                        language={language}
                                        readOnly={false}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeFeature === "chat" && (
                        <div className="flex-1 flex flex-col p-4">
                            <ScrollArea className="flex-1 pr-4 mb-4">
                                <div className="space-y-4">
                                    {messages.map((msg) => (
                                        <div
                                            key={msg.id}
                                            className="flex gap-3"
                                        >
                                            <div
                                                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold"
                                                style={{
                                                    backgroundColor: msg.color,
                                                }}
                                            >
                                                {msg.username[0].toUpperCase()}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-semibold text-sm">
                                                        {msg.username}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {new Date(
                                                            msg.timestamp
                                                        ).toLocaleTimeString()}
                                                    </span>
                                                </div>
                                                <p className="text-sm">
                                                    {msg.message}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={chatEndRef} />
                                </div>
                            </ScrollArea>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Type a message..."
                                    value={chatMessage}
                                    onChange={(e) =>
                                        setChatMessage(e.target.value)
                                    }
                                    onKeyDown={(e) =>
                                        e.key === "Enter" && handleSendMessage()
                                    }
                                />
                                <Button onClick={handleSendMessage}>
                                    <Send className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}

                    {activeFeature === "video" && (
                        <div className="flex-1 flex items-center justify-center p-4">
                            <Card className="max-w-md w-full">
                                <CardContent className="pt-6 text-center space-y-4">
                                    <div className="inline-flex p-6 rounded-full bg-[hsl(var(--bead-green))]/10">
                                        <Video className="h-12 w-12 text-[hsl(var(--bead-green))]" />
                                    </div>
                                    <h3 className="font-semibold text-xl">
                                        Voice & Video Coming Soon
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        We're working on adding voice and video
                                        call features. Stay tuned!
                                    </p>
                                    <div className="flex gap-2 justify-center">
                                        <Button variant="outline" disabled>
                                            <Mic className="h-4 w-4 mr-2" />
                                            Voice Call
                                        </Button>
                                        <Button variant="outline" disabled>
                                            <Video className="h-4 w-4 mr-2" />
                                            Video Call
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
