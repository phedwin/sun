/*
 * CJLF LICENSE (c) 2025
 */

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import FooterComponent from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Trophy,
    Zap,
    Target,
    TrendingUp,
    Calendar,
    Code,
    Award,
    Settings,
    Trash2,
    Edit,
    BarChart3,
    CheckCircle2,
    XCircle,
    Clock,
    Flame,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import MOCK_LEADERBOARD from "../../seed/mock_leaderboard";
import { DAYS_OF_THE_WEEK } from "@/lib/CONSTATS";

// Mock data - will be replaced with database queries
const generateStreakData = () => {
    const today = new Date();
    const streakDays = [];
    for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const worked = Math.random() > 0.3;
        streakDays.push({ date, worked });
    }
    return streakDays;
};

const mockProgressData = {
    totalSolved: 47,
    totalAttempted: 82,
    easySolved: 25,
    mediumSolved: 18,
    hardSolved: 4,
    easyTotal: 150,
    mediumTotal: 200,
    hardTotal: 100,
    recentlySolved: [
        { id: "1", title: "Two Sum", difficulty: "Easy", solvedAt: "2 hours ago" },
        { id: "2", title: "Add Two Numbers", difficulty: "Medium", solvedAt: "1 day ago" },
        { id: "3", title: "Longest Substring", difficulty: "Medium", solvedAt: "2 days ago" },
        { id: "4", title: "Merge Two Lists", difficulty: "Easy", solvedAt: "3 days ago" },
        { id: "5", title: "Valid Parentheses", difficulty: "Easy", solvedAt: "4 days ago" },
    ],
    languageStats: [
        { language: "JavaScript", count: 25, percentage: 53 },
        { language: "Python", count: 15, percentage: 32 },
        { language: "TypeScript", count: 7, percentage: 15 },
    ],
};

const Profile = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [streakData] = useState(generateStreakData());
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [editedName, setEditedName] = useState("");
    const [editedEmail, setEditedEmail] = useState("");

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/");
            toast({
                title: "Authentication Required",
                description: "Please sign in to view your profile",
                variant: "destructive",
            });
        }
    }, [isAuthenticated, navigate, toast]);

    useEffect(() => {
        if (user) {
            setEditedName(user.name);
            setEditedEmail(user.email);
        }
    }, [user]);

    if (!user) return null;

    const currentStreak = streakData.filter(d => d.worked).length;
    const longestStreak = 14; // Mock data
    const totalXP = 1250;
    const userRank = 42; // Mock rank
    const totalUsers = 1523;
    const accuracyRate = ((mockProgressData.totalSolved / mockProgressData.totalAttempted) * 100).toFixed(1);

    const handleSaveProfile = () => {
        // TODO: Update user in database
        toast({
            title: "Profile Updated",
            description: "Your profile has been successfully updated",
        });
        setEditModalOpen(false);
    };

    const handleDeleteAccount = () => {
        // TODO: Delete user from database
        logout();
        navigate("/");
        toast({
            title: "Account Deleted",
            description: "Your account has been permanently deleted",
            variant: "destructive",
        });
    };

    const getUserInitials = () => {
        return user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty.toLowerCase()) {
            case "easy":
                return "text-green-500 bg-green-500/10";
            case "medium":
                return "text-yellow-500 bg-yellow-500/10";
            case "hard":
                return "text-red-500 bg-red-500/10";
            default:
                return "";
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="container py-8">
                <div className="space-y-8">
                    {/* Profile Header */}
                    <Card className="border-2">
                        <CardContent className="pt-6">
                            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                                <Avatar className="h-24 w-24 border-4 border-primary">
                                    <AvatarImage src={user.avatar} alt={user.name} />
                                    <AvatarFallback className="text-2xl">{getUserInitials()}</AvatarFallback>
                                </Avatar>

                                <div className="flex-1 space-y-3">
                                    <div>
                                        <h1 className="text-3xl font-bold">{user.name}</h1>
                                        <p className="text-muted-foreground">{user.email}</p>
                                        <Badge variant="outline" className="mt-2">
                                            {user.provider === 'demo' ? 'Demo Account' : `${user.provider} Account`}
                                        </Badge>
                                    </div>

                                    <div className="flex flex-wrap gap-4">
                                        <div className="flex items-center gap-2">
                                            <Trophy className="h-5 w-5 text-yellow-500" />
                                            <span className="font-semibold">{totalXP} XP</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Zap className="h-5 w-5 text-primary" />
                                            <span className="font-semibold">{currentStreak} Day Streak</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Target className="h-5 w-5 text-green-500" />
                                            <span className="font-semibold">Rank #{userRank}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" size="sm">
                                                <Edit className="h-4 w-4 mr-2" />
                                                Edit Profile
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Edit Profile</DialogTitle>
                                                <DialogDescription>
                                                    Update your profile information
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="space-y-4 py-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="edit-name">Name</Label>
                                                    <Input
                                                        id="edit-name"
                                                        value={editedName}
                                                        onChange={(e) => setEditedName(e.target.value)}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="edit-email">Email</Label>
                                                    <Input
                                                        id="edit-email"
                                                        type="email"
                                                        value={editedEmail}
                                                        onChange={(e) => setEditedEmail(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <DialogFooter>
                                                <Button variant="outline" onClick={() => setEditModalOpen(false)}>
                                                    Cancel
                                                </Button>
                                                <Button onClick={handleSaveProfile}>
                                                    Save Changes
                                                </Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>

                                    <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
                                        <DialogTrigger asChild>
                                            <Button variant="destructive" size="sm">
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Delete Account
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Delete Account</DialogTitle>
                                                <DialogDescription>
                                                    This action cannot be undone. All your progress will be permanently deleted.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <DialogFooter>
                                                <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
                                                    Cancel
                                                </Button>
                                                <Button variant="destructive" onClick={handleDeleteAccount}>
                                                    Delete Permanently
                                                </Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Solved</CardTitle>
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{mockProgressData.totalSolved}</div>
                                <p className="text-xs text-muted-foreground">
                                    of {mockProgressData.totalAttempted} attempted
                                </p>
                                <Progress value={(mockProgressData.totalSolved / mockProgressData.totalAttempted) * 100} className="mt-2" />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
                                <Flame className="h-4 w-4 text-orange-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{currentStreak} Days</div>
                                <p className="text-xs text-muted-foreground">
                                    Longest: {longestStreak} days
                                </p>
                                <Progress value={(currentStreak / longestStreak) * 100} className="mt-2" />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Accuracy Rate</CardTitle>
                                <Target className="h-4 w-4 text-blue-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{accuracyRate}%</div>
                                <p className="text-xs text-muted-foreground">
                                    Success rate
                                </p>
                                <Progress value={parseFloat(accuracyRate)} className="mt-2" />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Leaderboard Rank</CardTitle>
                                <Award className="h-4 w-4 text-yellow-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">#{userRank}</div>
                                <p className="text-xs text-muted-foreground">
                                    Top {((userRank / totalUsers) * 100).toFixed(1)}%
                                </p>
                                <Progress value={100 - ((userRank / totalUsers) * 100)} className="mt-2" />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content Tabs */}
                    <Tabs defaultValue="progress" className="space-y-4">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="progress">Progress</TabsTrigger>
                            <TabsTrigger value="streak">Streak</TabsTrigger>
                            <TabsTrigger value="stats">Statistics</TabsTrigger>
                            <TabsTrigger value="activity">Activity</TabsTrigger>
                        </TabsList>

                        {/* Progress Tab */}
                        <TabsContent value="progress" className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <div className="h-3 w-3 rounded-full bg-green-500"></div>
                                            Easy
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold">{mockProgressData.easySolved}</div>
                                        <p className="text-sm text-muted-foreground">of {mockProgressData.easyTotal} solved</p>
                                        <Progress value={(mockProgressData.easySolved / mockProgressData.easyTotal) * 100} className="mt-3" />
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                                            Medium
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold">{mockProgressData.mediumSolved}</div>
                                        <p className="text-sm text-muted-foreground">of {mockProgressData.mediumTotal} solved</p>
                                        <Progress value={(mockProgressData.mediumSolved / mockProgressData.mediumTotal) * 100} className="mt-3" />
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <div className="h-3 w-3 rounded-full bg-red-500"></div>
                                            Hard
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold">{mockProgressData.hardSolved}</div>
                                        <p className="text-sm text-muted-foreground">of {mockProgressData.hardTotal} solved</p>
                                        <Progress value={(mockProgressData.hardSolved / mockProgressData.hardTotal) * 100} className="mt-3" />
                                    </CardContent>
                                </Card>
                            </div>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Recently Solved</CardTitle>
                                    <CardDescription>Your latest accomplishments</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {mockProgressData.recentlySolved.map((problem) => (
                                            <div key={problem.id} className="flex items-center justify-between p-3 rounded-lg border">
                                                <div className="flex items-center gap-3">
                                                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                                                    <div>
                                                        <p className="font-medium">{problem.title}</p>
                                                        <p className="text-sm text-muted-foreground">{problem.solvedAt}</p>
                                                    </div>
                                                </div>
                                                <Badge className={getDifficultyColor(problem.difficulty)}>
                                                    {problem.difficulty}
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Streak Tab */}
                        <TabsContent value="streak" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Flame className="h-5 w-5 text-orange-500" />
                                        30-Day Streak Calendar
                                    </CardTitle>
                                    <CardDescription>Your daily coding activity</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-7 gap-1 text-xs text-muted-foreground">
                                            {DAYS_OF_THE_WEEK.map((day) => (
                                                <div key={day} className="text-center p-1 font-medium">
                                                    {day}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="grid grid-cols-7 gap-2">
                                            {streakData.map((day, index) => (
                                                <div
                                                    key={index}
                                                    className={`aspect-square rounded-lg text-xs flex flex-col items-center justify-center transition-all ${
                                                        day.worked
                                                            ? "bg-primary text-primary-foreground shadow-md hover:scale-110"
                                                            : "bg-muted hover:bg-muted/80"
                                                    }`}
                                                    title={day.date.toDateString()}
                                                >
                                                    <div className="font-bold">{day.date.getDate()}</div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <div className="w-4 h-4 bg-muted rounded"></div>
                                                <span>No activity</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-4 bg-primary rounded"></div>
                                                <span className="text-primary font-medium">Active day</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Streak Stats</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-muted-foreground">Current Streak</span>
                                            <span className="text-2xl font-bold text-primary">{currentStreak} days</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-muted-foreground">Longest Streak</span>
                                            <span className="text-2xl font-bold text-yellow-500">{longestStreak} days</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-muted-foreground">Total Active Days</span>
                                            <span className="text-2xl font-bold">{streakData.filter(d => d.worked).length}</span>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Keep It Going!</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            <p className="text-sm text-muted-foreground">
                                                You're on a {currentStreak}-day streak! Solve a problem today to keep it alive.
                                            </p>
                                            <Button className="w-full" onClick={() => navigate("/questions")}>
                                                <Code className="mr-2 h-4 w-4" />
                                                Solve a Problem
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        {/* Statistics Tab */}
                        <TabsContent value="stats" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Language Distribution</CardTitle>
                                    <CardDescription>Problems solved by programming language</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {mockProgressData.languageStats.map((lang) => (
                                        <div key={lang.language} className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="font-medium">{lang.language}</span>
                                                <span className="text-muted-foreground">{lang.count} problems ({lang.percentage}%)</span>
                                            </div>
                                            <Progress value={lang.percentage} />
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Leaderboard Position</CardTitle>
                                    <CardDescription>See where you rank globally</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {MOCK_LEADERBOARD.slice(0, 10).map((entry) => (
                                            <div
                                                key={entry.rank}
                                                className={`flex items-center justify-between p-3 rounded-lg ${
                                                    entry.rank === userRank ? "bg-primary/10 border-2 border-primary" : "border"
                                                }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="font-bold text-lg w-8">#{entry.rank}</span>
                                                    <span className={entry.rank === userRank ? "font-bold" : ""}>
                                                        {entry.rank === userRank ? user.name : entry.name}
                                                    </span>
                                                </div>
                                                <span className="font-mono">{entry.xp.toLocaleString()} XP</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Activity Tab */}
                        <TabsContent value="activity" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Recent Activity</CardTitle>
                                    <CardDescription>Your coding journey timeline</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {[
                                            { type: "solved", text: "Solved 'Two Sum' problem", time: "2 hours ago", icon: CheckCircle2, color: "text-green-500" },
                                            { type: "streak", text: "Achieved 7-day streak!", time: "1 day ago", icon: Flame, color: "text-orange-500" },
                                            { type: "rank", text: "Climbed to rank #42", time: "2 days ago", icon: TrendingUp, color: "text-blue-500" },
                                            { type: "solved", text: "Solved 3 medium problems", time: "3 days ago", icon: CheckCircle2, color: "text-green-500" },
                                            { type: "milestone", text: "Reached 1000 XP!", time: "5 days ago", icon: Trophy, color: "text-yellow-500" },
                                        ].map((activity, index) => {
                                            const Icon = activity.icon;
                                            return (
                                                <div key={index} className="flex gap-4 items-start">
                                                    <div className={`mt-1 ${activity.color}`}>
                                                        <Icon className="h-5 w-5" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-medium">{activity.text}</p>
                                                        <p className="text-sm text-muted-foreground">{activity.time}</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </main>

            <FooterComponent />
        </div>
    );
};

export default Profile;
