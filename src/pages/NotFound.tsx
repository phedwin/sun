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

import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, MapPin, Compass } from "lucide-react";

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-b from-[hsl(var(--background))] to-[hsl(var(--earth-brown))]/10 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full text-center space-y-8">
                {/* African Sun Logo */}
                <div className="flex justify-center">
                    <div className="text-9xl animate-[wiggle_3s_ease-in-out_infinite]">
                        ☀️
                    </div>
                </div>

                {/* 404 Error */}
                <div className="space-y-4">
                    <h1 className="text-9xl font-bold bg-gradient-to-r from-[hsl(var(--sunset-orange))] via-[hsl(var(--savanna-gold))] to-[hsl(var(--sunset-pink))] bg-clip-text text-transparent animate-[float_3s_ease-in-out_infinite]">
                        404
                    </h1>
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                        Lost in the Savanna!
                    </h2>
                </div>

                {/* African-themed Message */}
                <div className="space-y-4">
                    <p className="text-xl text-muted-foreground leading-relaxed">
                        Uh oh! This path has wandered too far from the village. 🛖
                    </p>
                    <p className="text-lg text-muted-foreground">
                        Even the wise elephants can't find this page. Let's get you back on track!
                    </p>
                </div>

                {/* African Scenery */}
                <div className="flex justify-center items-center gap-4 text-6xl my-8">
                    <span className="animate-[float_2s_ease-in-out_infinite]">🌴</span>
                    <span className="animate-[float_2.5s_ease-in-out_infinite]">🦁</span>
                    <span className="animate-[float_3s_ease-in-out_infinite]">🦒</span>
                    <span className="animate-[float_2.2s_ease-in-out_infinite]">🐘</span>
                    <span className="animate-[float_2.8s_ease-in-out_infinite]">🦓</span>
                </div>

                {/* Navigation Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
                    <Button
                        onClick={() => navigate("/")}
                        size="lg"
                        className="bg-gradient-to-r from-[hsl(var(--sunset-orange))] to-[hsl(var(--savanna-gold))] hover:from-[hsl(var(--sunset-orange))]/90 hover:to-[hsl(var(--savanna-gold))]/90 text-white font-bold px-8"
                    >
                        <Home className="mr-2 h-5 w-5" />
                        Return Home
                    </Button>

                    <Button
                        onClick={() => navigate("/questions")}
                        size="lg"
                        variant="outline"
                        className="border-2 border-[hsl(var(--sunset-orange))] hover:bg-[hsl(var(--sunset-orange))]/10 font-bold px-8"
                    >
                        <Compass className="mr-2 h-5 w-5" />
                        Explore Problems
                    </Button>

                    <Button
                        onClick={() => navigate("/curriculum")}
                        size="lg"
                        variant="outline"
                        className="border-2 border-[hsl(var(--savanna-gold))] hover:bg-[hsl(var(--savanna-gold))]/10 font-bold px-8"
                    >
                        <MapPin className="mr-2 h-5 w-5" />
                        View Roadmap
                    </Button>
                </div>

                {/* Fun Footer Message */}
                <div className="pt-12">
                    <p className="text-sm text-muted-foreground italic">
                        "Not all who wander are lost... but this page definitely is!" 🗺️
                    </p>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
