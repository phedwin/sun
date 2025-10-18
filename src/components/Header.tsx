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

import "../../seed/mock_leaderboard";

import { useState } from "react";
import {
    Trophy,
    Zap,
    Target,
    Users,
    Gamepad2,
    Copy,
    Check,
    ChevronDown,
    Share,
    LogOut,
    User as UserIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { LoginModal } from "@/components/LoginModal";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import MOCK_LEADERBOARD from "../../seed/mock_leaderboard";
import { DAYS_OF_THE_WEEK } from "@/lib/CONSTATS";

interface streaks {
    date: Date;
    worked: boolean;
}
const generateStreakData = (): streaks[] => {
    const today = new Date();
    const streakDays: streaks[] = [];
    for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const worked = Math.random() > 0.3;
        streakDays.push({ date, worked });
    }
    return streakDays;
};

export const Header = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const [serverCode, setServerCode] = useState("");
    const [copied, setCopied] = useState(false);
    const [streakData] = useState(generateStreakData());
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const { toast } = useToast();

    // Calculate dynamic score based on solved problems and streak
    const calculateScore = () => {
        const solvedProblems = 15;
        const currentStreak = streakData.filter((day) => day.worked).length;
        const baseScore = solvedProblems * 5 + currentStreak * 2;
        return Math.min(Math.round((baseScore / 100) * 100), 100);
    };

    const [dynamicScore] = useState(calculateScore());

    const generateServerCode = () => {
        const code = Math.random().toString(36).substring(2, 8).toUpperCase();
        setServerCode(code);
        return code;
    };

    const copyServerCode = async () => {
        if (serverCode) {
            await navigator.clipboard.writeText(serverCode);
            setCopied(true);
            toast({
                title: "Copied!",
                description: "Server code copied to clipboard",
            });
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleCopyCode = () => {
        generateServerCode();
        copyServerCode();
    };

    const handleShareCode = () => {
        const code = generateServerCode();
        toast({
            title: "Server Started! 🎮",
            description: `Your server code is: ${code}. Share this with friends to join!`,
        });
    };

    const handleJoinCompetition = () => {
        toast({
            title: "Coming Soon! 🏆",
            description: "Competitive programming tournaments!",
        });
    };

    const handleLogout = () => {
        logout();
        toast({
            title: "Logged Out",
            description: "You have been successfully logged out",
        });
    };

    const getUserInitials = () => {
        if (!user?.name) return "U";
        return user.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <header className="h-16 border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
            <div className="h-full px-6 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <Link
                        to="/"
                        className="flex items-center gap-3 hover:scale-105 transition-transform"
                    >
                        <div className="text-4xl animate-[float_3s_ease-in-out_infinite]">
                            ☀️
                        </div>
                        <div className="flex flex-col">
                            <span className="text-2xl font-bold bg-gradient-to-r from-[hsl(var(--sunset-orange))] via-[hsl(var(--sunset-pink))] to-[hsl(var(--savanna-gold))] bg-clip-text text-transparent">
                                SUN
                            </span>
                            <span className="text-xs text-muted-foreground -mt-1">
                                Code Like Africa
                            </span>
                        </div>
                    </Link>

                    <nav className="hidden md:flex items-center gap-4">
                        {/* Navigation links removed for cleaner design */}
                    </nav>
                </div>

                <nav className="flex items-center gap-6">
                    {!isAuthenticated ? (
                        // Unauthenticated state - only show Login button and theme toggle
                        <div className="flex items-center gap-3">
                            <Button
                                variant="default"
                                size="sm"
                                onClick={() => setLoginModalOpen(true)}
                            >
                                Sign In
                            </Button>
                            <ThemeToggle />
                        </div>
                    ) : (
                        // Authenticated state - show all features
                        <>
                            <div className="flex items-center gap-4 text-muted-foreground">
                                <button className="flex items-center gap-2 hover:scale-110 hover:text-foreground transition-all group">
                                    <div className="flex gap-0.5">
                                        <span className="text-base animate-[beadShine_2s_ease-in-out_infinite]">
                                            🔴
                                        </span>
                                        <span className="text-base animate-[beadShine_2s_ease-in-out_infinite_0.2s]">
                                            🟡
                                        </span>
                                        <span className="text-base animate-[beadShine_2s_ease-in-out_infinite_0.4s]">
                                            🔵
                                        </span>
                                        <span className="text-base animate-[beadShine_2s_ease-in-out_infinite_0.6s]">
                                            🟢
                                        </span>
                                    </div>
                                    <span className="text-sm font-bold group-hover:text-[hsl(var(--savanna-gold))]">
                                        1,250 Beads
                                    </span>
                                </button>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <button className="flex items-center gap-2 hover:scale-110 hover:text-foreground transition-all group">
                                            <span className="text-xl">🔥</span>
                                            <span className="text-sm font-bold group-hover:text-[hsl(var(--sunset-orange))]">
                                                7 Day Streak
                                            </span>
                                        </button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-md border-4 border-[hsl(var(--earth-brown))]">
                                        <DialogHeader>
                                            <DialogTitle className="flex items-center gap-3 text-2xl">
                                                <span className="text-3xl">
                                                    🔥
                                                </span>
                                                <span className="bg-gradient-to-r from-[hsl(var(--sunset-orange))] to-[hsl(var(--savanna-gold))] bg-clip-text text-transparent">
                                                    Your Journey Path
                                                </span>
                                            </DialogTitle>
                                            <DialogDescription className="text-base">
                                                Track your coding adventures
                                                across the savanna! 🌍
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-7 gap-1 text-xs font-bold text-muted-foreground">
                                                {DAYS_OF_THE_WEEK.map((day) => (
                                                    <div
                                                        key={day}
                                                        className="text-center p-1"
                                                    >
                                                        {day}
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="grid grid-cols-7 gap-2">
                                                {streakData.map(
                                                    (day, index) => (
                                                        <div
                                                            key={index}
                                                            className={`aspect-square rounded-lg text-sm font-bold flex items-center justify-center transition-all hover:scale-110 ${
                                                                day.worked
                                                                    ? "bg-gradient-to-br from-[hsl(var(--sunset-orange))] to-[hsl(var(--savanna-gold))] text-white shadow-lg"
                                                                    : "bg-muted hover:bg-muted/80 border-2 border-[hsl(var(--earth-brown))]"
                                                            }`}
                                                        >
                                                            {day.worked
                                                                ? "🛖"
                                                                : day.date.getDate()}
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                            <div className="flex items-center gap-4 text-sm font-semibold">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 bg-muted rounded-lg border-2 border-[hsl(var(--earth-brown))]"></div>
                                                    <span>Rest day</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-gradient-to-br from-[hsl(var(--sunset-orange))] to-[hsl(var(--savanna-gold))]">
                                                        🛖
                                                    </div>
                                                    <span>Coded!</span>
                                                </div>
                                            </div>
                                            <div className="mt-4 p-4 bg-gradient-to-r from-[hsl(var(--sunset-orange))]/10 to-[hsl(var(--savanna-gold))]/10 rounded-lg border-2 border-[hsl(var(--earth-brown))]">
                                                <p className="text-center text-lg font-bold">
                                                    Keep building huts on your
                                                    journey! 🛖✨
                                                </p>
                                            </div>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                                <button className="flex items-center gap-2 hover:scale-110 hover:text-foreground transition-all group">
                                    <span className="text-xl">🎯</span>
                                    <span className="text-sm font-bold group-hover:text-[hsl(var(--bead-green))]">
                                        Score: {dynamicScore}%
                                    </span>
                                </button>
                            </div>

                            <div className="h-6 w-px bg-border" />

                            <div className="flex items-center gap-2">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-muted-foreground hover:text-foreground hover:scale-110 transition-all"
                                        >
                                            <span className="text-lg mr-2">
                                                🏆
                                            </span>
                                            Leaderboard
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-md border-4 border-[hsl(var(--savanna-gold))]">
                                        <DialogHeader>
                                            <DialogTitle className="flex items-center gap-3 text-2xl">
                                                <span className="text-3xl">
                                                    🏆
                                                </span>
                                                <span className="bg-gradient-to-r from-[hsl(var(--sunset-orange))] to-[hsl(var(--savanna-gold))] bg-clip-text text-transparent">
                                                    Bead Collectors
                                                </span>
                                            </DialogTitle>
                                            <DialogDescription className="text-base">
                                                Top code warriors this week!
                                                🌍✨
                                            </DialogDescription>
                                        </DialogHeader>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="w-12 font-bold">
                                                        Rank
                                                    </TableHead>
                                                    <TableHead className="font-bold">
                                                        Name
                                                    </TableHead>
                                                    <TableHead className="text-right font-bold">
                                                        Beads
                                                    </TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {MOCK_LEADERBOARD.map(
                                                    (leaderUser) => (
                                                        <TableRow
                                                            key={
                                                                leaderUser.rank
                                                            }
                                                            className={
                                                                leaderUser.name ===
                                                                "You"
                                                                    ? "bg-gradient-to-r from-[hsl(var(--sunset-orange))]/10 to-[hsl(var(--savanna-gold))]/10 border-2 border-[hsl(var(--savanna-gold))]"
                                                                    : "hover:bg-muted/50"
                                                            }
                                                        >
                                                            <TableCell className="font-bold text-lg">
                                                                {leaderUser.rank ===
                                                                1
                                                                    ? "🥇"
                                                                    : leaderUser.rank ===
                                                                        2
                                                                      ? "🥈"
                                                                      : leaderUser.rank ===
                                                                          3
                                                                        ? "🥉"
                                                                        : leaderUser.rank}
                                                            </TableCell>
                                                            <TableCell className="font-semibold">
                                                                {
                                                                    leaderUser.name
                                                                }
                                                            </TableCell>
                                                            <TableCell className="text-right font-bold">
                                                                <span className="flex items-center justify-end gap-1">
                                                                    {leaderUser.xp.toLocaleString()}
                                                                    <span className="text-xs">
                                                                        🔴🟡🔵🟢
                                                                    </span>
                                                                </span>
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                )}
                                            </TableBody>
                                        </Table>
                                        <div className="mt-2 p-3 bg-gradient-to-r from-[hsl(var(--sunset-orange))]/10 to-[hsl(var(--savanna-gold))]/10 rounded-lg border-2 border-[hsl(var(--earth-brown))]">
                                            <p className="text-center text-sm font-bold">
                                                Collect more beads to climb the
                                                ranks! 🚀
                                            </p>
                                        </div>
                                    </DialogContent>
                                </Dialog>

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-muted-foreground hover:text-foreground"
                                    onClick={handleJoinCompetition}
                                >
                                    <Users className="h-4 w-4 mr-2" />
                                    Competition
                                </Button>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="sm">
                                            <Gamepad2 className="h-4 w-4 mr-2" />
                                            Start Server
                                            <ChevronDown className="h-4 w-4 ml-1" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        align="end"
                                        className="w-48"
                                    >
                                        <DropdownMenuItem
                                            onClick={handleCopyCode}
                                        >
                                            <Copy className="h-4 w-4 mr-2" />
                                            Copy Server Code
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={handleShareCode}
                                        >
                                            <Share className="h-4 w-4 mr-2" />
                                            Share Server Code
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                {serverCode && (
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-xs"
                                            >
                                                View Code: {serverCode}
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-sm">
                                            <DialogHeader>
                                                <DialogTitle className="flex items-center gap-2">
                                                    <Gamepad2 className="h-5 w-5 text-primary" />
                                                    Server Active
                                                </DialogTitle>
                                                <DialogDescription>
                                                    Your server code for friends
                                                    to join
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="flex items-center gap-2 p-4 bg-muted rounded-lg">
                                                <code className="flex-1 text-lg font-mono font-bold text-primary">
                                                    {serverCode}
                                                </code>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={copyServerCode}
                                                    className="shrink-0"
                                                >
                                                    {copied ? (
                                                        <Check className="h-4 w-4 text-green-500" />
                                                    ) : (
                                                        <Copy className="h-4 w-4" />
                                                    )}
                                                </Button>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                )}

                                <ThemeToggle />

                                {/* User Profile Dropdown */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="relative h-8 w-8 rounded-full"
                                        >
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage
                                                    src={user.avatar}
                                                    alt={user.name}
                                                />
                                                <AvatarFallback>
                                                    {getUserInitials()}
                                                </AvatarFallback>
                                            </Avatar>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        align="end"
                                        className="w-56"
                                    >
                                        <div className="flex items-center justify-start gap-2 p-2">
                                            <div className="flex flex-col space-y-1 leading-none">
                                                <p className="font-medium">
                                                    {user.name}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {user.email}
                                                </p>
                                            </div>
                                        </div>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild>
                                            <Link
                                                to="/profile"
                                                className="cursor-pointer"
                                            >
                                                <UserIcon className="mr-2 h-4 w-4" />
                                                Profile
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={handleLogout}
                                            className="text-red-600"
                                        >
                                            <LogOut className="mr-2 h-4 w-4" />
                                            Log out
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </>
                    )}
                </nav>
            </div>

            {/* Login Modal */}
            <LoginModal
                open={loginModalOpen}
                onOpenChange={setLoginModalOpen}
            />
        </header>
    );
};
