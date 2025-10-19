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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Users,
    Plus,
    LogIn,
    Code2,
    MessageSquare,
    Video,
    Mic,
    Hash,
    ChevronRight,
    Sparkles
} from "lucide-react";

interface ActiveServer {
    id: string;
    name: string;
    description: string | null;
    code: string;
    creatorName: string;
    currentProblem: string | null;
    totalMembers: number;
    onlineMembers: number;
    createdAt: string;
}

export default function ServerHub() {
    const navigate = useNavigate();
    const [createServerName, setCreateServerName] = useState("");
    const [createServerDescription, setCreateServerDescription] = useState("");
    const [joinCode, setJoinCode] = useState("");
    const [username, setUsername] = useState("");
    const [activeServers, setActiveServers] = useState<ActiveServer[]>([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);

    // Fetch active servers from database
    useEffect(() => {
        fetchActiveServers();
    }, []);

    const fetchActiveServers = async () => {
        try {
            const response = await fetch("http://localhost:3001/api/rooms");
            if (response.ok) {
                const data = await response.json();
                setActiveServers(data);
            }
        } catch (error) {
            console.error("Failed to fetch servers:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateServer = async () => {
        if (!createServerName.trim() || !username.trim()) return;

        setCreating(true);
        try {
            const response = await fetch("http://localhost:3001/api/rooms/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: createServerName,
                    description: createServerDescription || null,
                    username
                })
            });

            if (response.ok) {
                const data = await response.json();
                // Navigate to collab room with the new room code
                navigate(`/collab/${data.room.code}?username=${encodeURIComponent(username)}`);
            } else {
                console.error("Failed to create server");
            }
        } catch (error) {
            console.error("Error creating server:", error);
        } finally {
            setCreating(false);
        }
    };

    const handleJoinServer = async () => {
        if (!joinCode.trim() || !username.trim()) return;

        navigate(`/collab/${joinCode.toUpperCase()}?username=${encodeURIComponent(username)}`);
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="container py-12">
                {/* Hero Section */}
                <div className="text-center space-y-4 mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[hsl(var(--sky-blue))]/20 to-[hsl(var(--bead-blue))]/20 border border-[hsl(var(--sky-blue))]/30">
                        <Sparkles className="h-4 w-4 text-[hsl(var(--sky-blue))]" />
                        <span className="text-sm font-medium">Collaborate in Real-Time</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold">
                        <span className="bg-gradient-to-r from-[hsl(var(--sky-blue))] to-[hsl(var(--bead-blue))] bg-clip-text text-transparent">
                            Community Servers
                        </span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Create your own coding space or join others. Code together, chat, and learn!
                    </p>
                </div>

                {/* Main Content */}
                <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {/* Create/Join Tabs */}
                    <Card className="border-2">
                        <CardHeader>
                            <CardTitle>Get Started</CardTitle>
                            <CardDescription>
                                Create a new server or join an existing one
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Tabs defaultValue="create" className="w-full">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="create" className="gap-2">
                                        <Plus className="h-4 w-4" />
                                        Create
                                    </TabsTrigger>
                                    <TabsTrigger value="join" className="gap-2">
                                        <LogIn className="h-4 w-4" />
                                        Join
                                    </TabsTrigger>
                                </TabsList>

                                {/* Create Server Tab */}
                                <TabsContent value="create" className="space-y-4 mt-6">
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">
                                            Your Username
                                        </label>
                                        <Input
                                            placeholder="Enter your name..."
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">
                                            Server Name
                                        </label>
                                        <Input
                                            placeholder="e.g. My Coding Squad"
                                            value={createServerName}
                                            onChange={(e) => setCreateServerName(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">
                                            Description (optional)
                                        </label>
                                        <Input
                                            placeholder="What's this server about?"
                                            value={createServerDescription}
                                            onChange={(e) => setCreateServerDescription(e.target.value)}
                                        />
                                    </div>

                                    {/* Feature Highlights */}
                                    <div className="p-4 rounded-lg bg-muted space-y-2">
                                        <p className="text-sm font-medium">Your server includes:</p>
                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                            <div className="flex items-center gap-2">
                                                <Code2 className="h-3 w-3 text-[hsl(var(--sunset-orange))]" />
                                                <span>Shared Code Editor</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MessageSquare className="h-3 w-3 text-[hsl(var(--sky-blue))]" />
                                                <span>Real-time Chat</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Video className="h-3 w-3 text-[hsl(var(--bead-green))]" />
                                                <span>Video Calls</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Users className="h-3 w-3 text-[hsl(var(--bead-blue))]" />
                                                <span>Up to 10 Members</span>
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        className="w-full bg-gradient-to-r from-[hsl(var(--sky-blue))] to-[hsl(var(--bead-blue))] hover:opacity-90"
                                        size="lg"
                                        onClick={handleCreateServer}
                                        disabled={!createServerName.trim() || !username.trim() || creating}
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        {creating ? "Creating..." : "Create Server"}
                                    </Button>
                                </TabsContent>

                                {/* Join Server Tab */}
                                <TabsContent value="join" className="space-y-4 mt-6">
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">
                                            Your Username
                                        </label>
                                        <Input
                                            placeholder="Enter your name..."
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">
                                            Server Code
                                        </label>
                                        <Input
                                            placeholder="ABC123"
                                            value={joinCode}
                                            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                                            maxLength={6}
                                            className="uppercase text-lg tracking-wider font-mono"
                                        />
                                    </div>

                                    <div className="p-4 rounded-lg bg-muted/50 border border-border">
                                        <p className="text-sm text-muted-foreground">
                                            💡 <strong>Tip:</strong> Ask your friend for their server code or
                                            browse active servers below to join!
                                        </p>
                                    </div>

                                    <Button
                                        className="w-full"
                                        size="lg"
                                        onClick={handleJoinServer}
                                        disabled={!joinCode.trim() || !username.trim()}
                                    >
                                        <LogIn className="h-4 w-4 mr-2" />
                                        Join Server
                                    </Button>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>

                    {/* Active Servers List */}
                    <Card className="border-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Hash className="h-5 w-5" />
                                Active Servers
                            </CardTitle>
                            <CardDescription>
                                Join popular coding communities
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {loading ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    Loading servers...
                                </div>
                            ) : activeServers.length > 0 ? (
                                activeServers.map((server) => (
                                    <div
                                        key={server.id}
                                        className="p-4 rounded-lg border border-border hover:border-[hsl(var(--sky-blue))]/50 hover:bg-muted/50 transition-all cursor-pointer group"
                                        onClick={() => setJoinCode(server.code)}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-lg mb-1 group-hover:text-[hsl(var(--sky-blue))] transition-colors">
                                                    {server.name}
                                                </h3>
                                                <p className="text-sm text-muted-foreground mb-3">
                                                    {server.description || `Created by ${server.creatorName}`}
                                                    {server.currentProblem && ` • ${server.currentProblem}`}
                                                </p>
                                                <div className="flex items-center gap-3 text-xs">
                                                    <Badge variant="secondary" className="gap-1">
                                                        <Users className="h-3 w-3" />
                                                        {server.totalMembers}
                                                    </Badge>
                                                    <div className="flex items-center gap-1">
                                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                                        <span className="text-muted-foreground">
                                                            {server.onlineMembers} online
                                                        </span>
                                                    </div>
                                                    <Badge variant="outline" className="font-mono">
                                                        {server.code}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-[hsl(var(--sky-blue))] group-hover:translate-x-1 transition-all" />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                    <p className="mb-2">No active servers yet.</p>
                                    <p className="text-sm">Be the first to create one! 🚀</p>
                                </div>
                            )}

                            {activeServers.length > 0 && (
                                <div className="pt-4 border-t border-border">
                                    <p className="text-sm text-muted-foreground text-center">
                                        {activeServers.length} active {activeServers.length === 1 ? 'server' : 'servers'}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Features Section */}
                <div className="mt-16 grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    <Card className="text-center border-2 hover:border-[hsl(var(--sunset-orange))]/50 transition-colors">
                        <CardContent className="pt-6">
                            <div className="inline-flex p-4 rounded-full bg-[hsl(var(--sunset-orange))]/10 mb-4">
                                <Code2 className="h-8 w-8 text-[hsl(var(--sunset-orange))]" />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">Collaborative Coding</h3>
                            <p className="text-sm text-muted-foreground">
                                Work on the same code simultaneously. See everyone's changes in real-time.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="text-center border-2 hover:border-[hsl(var(--sky-blue))]/50 transition-colors">
                        <CardContent className="pt-6">
                            <div className="inline-flex p-4 rounded-full bg-[hsl(var(--sky-blue))]/10 mb-4">
                                <MessageSquare className="h-8 w-8 text-[hsl(var(--sky-blue))]" />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">Instant Chat</h3>
                            <p className="text-sm text-muted-foreground">
                                Discuss solutions, ask questions, and share knowledge instantly.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="text-center border-2 hover:border-[hsl(var(--bead-green))]/50 transition-colors">
                        <CardContent className="pt-6">
                            <div className="inline-flex p-4 rounded-full bg-[hsl(var(--bead-green))]/10 mb-4">
                                <Video className="h-8 w-8 text-[hsl(var(--bead-green))]" />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">Voice & Video</h3>
                            <p className="text-sm text-muted-foreground">
                                Turn on your camera or mic for pair programming sessions.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
