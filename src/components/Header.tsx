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

// Mock streak data - last 30 days
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
        const currentStreak = streakData.filter(day => day.worked).length;
        const baseScore = (solvedProblems * 5) + (currentStreak * 2);
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
        return user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <header className="h-16 border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
            <div className="h-full px-6 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <Link
                        to="/"
                        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                    >
                        <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                            📚 Bestie 📚
                        </h1>
                    </Link>

                    <nav className="hidden md:flex items-center gap-4">
                        <Link
                            to="/"
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Problems
                        </Link>
                        {isAuthenticated && (
                            <Link
                                to="/learn"
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Learn Python
                            </Link>
                        )}
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
                                <button className="flex items-center gap-2 hover:text-foreground transition-colors">
                                    <Trophy className="h-4 w-4 text-yellow-500" />
                                    <span className="text-sm font-medium">
                                        1,250 XP
                                    </span>
                                </button>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <button className="flex items-center gap-2 hover:text-foreground transition-colors">
                                            <Zap className="h-4 w-4 text-primary" />
                                            <span className="text-sm font-medium">
                                                7 Day Streak
                                            </span>
                                        </button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-sm">
                                        <DialogHeader>
                                            <DialogTitle className="flex items-center gap-2">
                                                <Zap className="h-5 w-5 text-primary" />
                                                {user.name} :: streak calendar
                                            </DialogTitle>
                                            <DialogDescription>
                                                coding activity over the last 30 days
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-7 gap-1 text-xs text-muted-foreground">
                                                {DAYS_OF_THE_WEEK.map((day) => (
                                                    <div
                                                        key={day}
                                                        className="text-center p-1"
                                                    >
                                                        {day}
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="grid grid-cols-7 gap-1">
                                                {streakData.map((day, index) => (
                                                    <div
                                                        key={index}
                                                        className={`aspect-square rounded text-xs flex items-center justify-center ${
                                                            day.worked
                                                                ? "bg-primary text-primary-foreground"
                                                                : "bg-muted hover:bg-muted/80"
                                                        }`}
                                                    >
                                                        {day.date.getDate()}
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <div className="w-3 h-3 bg-muted rounded"></div>
                                                <span>No activity</span>
                                                <div className="w-3 h-3 bg-primary rounded ml-4"></div>
                                                <span>Coded today</span>
                                            </div>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                                <button className="flex items-center gap-2 hover:text-foreground transition-colors">
                                    <Target className="h-4 w-4 text-green-500" />
                                    <span className="text-sm font-medium">
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
                                            className="text-muted-foreground hover:text-foreground"
                                        >
                                            <Trophy className="h-4 w-4 mr-2" />
                                            Leaderboard
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-md">
                                        <DialogHeader>
                                            <DialogTitle className="flex items-center gap-2">
                                                <Trophy className="h-5 w-5 text-yellow-500" />
                                                Global Leaderboard
                                            </DialogTitle>
                                            <DialogDescription>
                                                Top performers this week
                                            </DialogDescription>
                                        </DialogHeader>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="w-12">
                                                        #
                                                    </TableHead>
                                                    <TableHead>Name</TableHead>
                                                    <TableHead className="text-right">
                                                        XP
                                                    </TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {MOCK_LEADERBOARD.map((leaderUser) => (
                                                    <TableRow
                                                        key={leaderUser.rank}
                                                        className={
                                                            leaderUser.name === "You"
                                                                ? "bg-primary/10"
                                                                : ""
                                                        }
                                                    >
                                                        <TableCell className="font-medium">
                                                            {leaderUser.rank}
                                                        </TableCell>
                                                        <TableCell className="font-medium">
                                                            {leaderUser.name}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            {leaderUser.xp.toLocaleString()}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
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
                                    <DropdownMenuContent align="end" className="w-48">
                                        <DropdownMenuItem onClick={handleCopyCode}>
                                            <Copy className="h-4 w-4 mr-2" />
                                            Copy Server Code
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={handleShareCode}>
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
                                                    Your server code for friends to join
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
                                        <Button variant="ghost" size="sm" className="relative h-8 w-8 rounded-full">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={user.avatar} alt={user.name} />
                                                <AvatarFallback>{getUserInitials()}</AvatarFallback>
                                            </Avatar>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56">
                                        <div className="flex items-center justify-start gap-2 p-2">
                                            <div className="flex flex-col space-y-1 leading-none">
                                                <p className="font-medium">{user.name}</p>
                                                <p className="text-sm text-muted-foreground">{user.email}</p>
                                            </div>
                                        </div>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild>
                                            <Link to="/profile" className="cursor-pointer">
                                                <UserIcon className="mr-2 h-4 w-4" />
                                                Profile
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={handleLogout} className="text-red-600">
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
            <LoginModal open={loginModalOpen} onOpenChange={setLoginModalOpen} />
        </header>
    );
};
