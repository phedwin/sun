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

import { useState, useRef, useEffect } from "react";
import {
    Play,
    RotateCcw,
    Settings,
    Loader2,
    CheckCircle2,
    XCircle,
    Palette,
    Sparkles,
} from "lucide-react";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import Editor from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { CodeTemplate } from "@/lib/codeTemplates";
import { executeCode, ExecutionResult } from "@/lib/codeExecution";
import { useTheme } from "next-themes";

export const CodeEditor = () => {
    const { theme: systemTheme } = useTheme();
    const [language, setLanguage] = useState("javascript");
    const [fontFamily, setFontFamily] = useState("Fira Code");
    const [editorTheme, setEditorTheme] = useState("vs-dark");
    const [codeTemplates, setCodeTemplates] = useState<CodeTemplate | null>(
        null
    );
    const [isExecuting, setIsExecuting] = useState(false);
    const [executionResult, setExecutionResult] =
        useState<ExecutionResult | null>(null);
    const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

    // monaco language mapping
    const getMonacoLanguage = (lang: string) => {
        const languageMap: { [key: string]: string } = {
            javascript: "javascript",
            python: "python",
            java: "java",
            cpp: "cpp",
        };
        return languageMap[lang] || "javascript";
    };

    // Get code template from stored templates or fallback to simple comment
    const getCodeTemplate = (lang: string) => {
        if (codeTemplates) {
            return (
                codeTemplates[lang as keyof CodeTemplate] ||
                `// Write your code here`
            );
        }

        // Fallback to simple comments if no templates are loaded
        const commentMap: { [key: string]: string } = {
            javascript: `// Write your code here`,
            python: "# Write your code here",
            java: "// Write your code here",
            cpp: "// Write your code here",
        };
        return commentMap[lang] || "// Write your code here";
    };

    const [code, setCode] = useState(getCodeTemplate("javascript"));

    // Load code templates from localStorage on mount
    useEffect(() => {
        const storedTemplates = localStorage.getItem("codeTemplates");
        if (storedTemplates) {
            try {
                const templates: CodeTemplate = JSON.parse(storedTemplates);
                setCodeTemplates(templates);
                // Update code with the loaded template for current language
                setCode(
                    templates[language as keyof CodeTemplate] ||
                        getCodeTemplate(language)
                );
            } catch (error) {
                console.error("Error parsing code templates:", error);
            }
        }
    }, []);

    // Auto-switch editor theme based on system theme
    useEffect(() => {
        if (systemTheme === "light") {
            setEditorTheme("vs");
        } else if (systemTheme === "dark") {
            setEditorTheme("vs-dark");
        }
    }, [systemTheme]);

    // Handle Monaco editor mount
    const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor) => {
        editorRef.current = editor;

        // Configure editor options
        editor.updateOptions({
            fontSize: 14,
            fontFamily: `${fontFamily}, Consolas, Monaco, monospace`,
            tabSize: 4,
            insertSpaces: true,
            automaticLayout: true,
            fontLigatures: true,
        });
    };

    // Update font when changed
    const handleFontChange = (newFont: string) => {
        setFontFamily(newFont);
        if (editorRef.current) {
            editorRef.current.updateOptions({
                fontFamily: `${newFont}, Consolas, Monaco, monospace`,
            });
        }
    };

    // Update code template when language changes
    const handleLanguageChange = (newLang: string) => {
        setLanguage(newLang);
        // Use the template from codeTemplates if available
        if (codeTemplates) {
            setCode(
                codeTemplates[newLang as keyof CodeTemplate] ||
                    getCodeTemplate(newLang)
            );
        } else {
            setCode(getCodeTemplate(newLang));
        }
    };

    // Handle reset button
    const handleReset = () => {
        if (codeTemplates) {
            setCode(
                codeTemplates[language as keyof CodeTemplate] ||
                    getCodeTemplate(language)
            );
        } else {
            setCode(getCodeTemplate(language));
        }
    };

    // Celebration confetti!
    const celebrate = () => {
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = {
            startVelocity: 30,
            spread: 360,
            ticks: 60,
            zIndex: 0,
        };

        function randomInRange(min: number, max: number) {
            return Math.random() * (max - min) + min;
        }

        const interval: any = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);

            // Multiple confetti bursts from different origins
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
            });
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
            });
        }, 250);
    };

    return (
        <div className="h-full flex flex-col bg-surface">
            {/* Editor Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center gap-3">
                    <Select
                        value={language}
                        onValueChange={handleLanguageChange}
                    >
                        <SelectTrigger className="w-32">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="javascript">
                                JavaScript
                            </SelectItem>
                            <SelectItem value="python">Python</SelectItem>
                            <SelectItem value="java">Java</SelectItem>
                            <SelectItem value="cpp">C++</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={fontFamily} onValueChange={handleFontChange}>
                        <SelectTrigger className="w-40">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Fira Code">Fira Code</SelectItem>
                            <SelectItem value="Cascadia Code">
                                Cascadia Code
                            </SelectItem>
                            <SelectItem value="Monaspace Argon">
                                Monaspace Argon
                            </SelectItem>
                            <SelectItem value="Monaspace Neon">
                                Monaspace Neon
                            </SelectItem>
                            <SelectItem value="Monaco">Monaco</SelectItem>
                            <SelectItem value="Consolas">Consolas</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={editorTheme} onValueChange={setEditorTheme}>
                        <SelectTrigger className="w-48">
                            <Palette className="h-4 w-4 mr-2" />
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="vs-dark">
                                Dark (Default)
                            </SelectItem>
                            <SelectItem value="vs">Light</SelectItem>
                            <SelectItem value="hc-black">
                                High Contrast Dark
                            </SelectItem>
                            <SelectItem value="hc-light">
                                High Contrast Light
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={handleReset}>
                        <RotateCcw className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
                    </Button>
                    <Button
                        className="bg-primary hover:bg-primary-hover text-primary-foreground glow-effect"
                        onClick={async () => {
                            setIsExecuting(true);
                            setExecutionResult(null);

                            try {
                                const result = await executeCode(
                                    code,
                                    language
                                );
                                setExecutionResult(result);

                                // 🎉 Celebrate on successful execution!
                                if (result.success && result.output) {
                                    celebrate();
                                }
                            } catch (err) {
                                console.error("Execution error:", err);
                                setExecutionResult({
                                    success: false,
                                    output: "",
                                    error:
                                        err instanceof Error
                                            ? err.message
                                            : "Unknown error occurred",
                                });
                            } finally {
                                setIsExecuting(false);
                            }
                        }}
                        disabled={isExecuting}
                    >
                        {isExecuting ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Running...
                            </>
                        ) : (
                            <>
                                <Play className="h-4 w-4 mr-2" />
                                Run Code
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* Code Editor */}
            <div className="flex-1">
                <Editor
                    height="100%"
                    language={getMonacoLanguage(language)}
                    value={code}
                    onChange={(value) => setCode(value || "")}
                    onMount={handleEditorDidMount}
                    theme={editorTheme}
                    options={{
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        wordWrap: "on",
                        lineNumbers: "on",
                        glyphMargin: false,
                        folding: false,
                        lineDecorationsWidth: 10,
                        lineNumbersMinChars: 3,
                        renderLineHighlight: "line",
                        contextmenu: false,
                    }}
                />
            </div>
            {/* Output Panel */}
            <div className="h-48 border-t border-border bg-gradient-to-b from-surface-elevated to-surface overflow-y-auto">
                <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            {executionResult === null ? (
                                <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                            ) : executionResult.success ? (
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="h-5 w-5 text-green-500 animate-pulse" />
                                    <span className="text-sm font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                                        Success
                                    </span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <XCircle className="h-5 w-5 text-red-500 animate-pulse" />
                                    <span className="text-sm font-bold bg-gradient-to-r from-red-400 to-rose-500 bg-clip-text text-transparent">
                                        Error
                                    </span>
                                </div>
                            )}
                        </div>
                        {executionResult?.executionTime && (
                            <span className="text-xs font-mono px-2 py-1 rounded-full bg-primary/10 text-primary">
                                ⚡ {executionResult.executionTime}ms
                            </span>
                        )}
                    </div>

                    {isExecuting ? (
                        <div className="flex flex-col items-center justify-center gap-3 text-sm text-primary py-8">
                            <Loader2 className="h-8 w-8 animate-spin" />
                            <span className="font-semibold text-lg">
                                {
                                    [
                                        "Running your code...",
                                        "Crunching numbers...",
                                        "Working on it...",
                                        "Almost there...",
                                    ][Math.floor(Math.random() * 4)]
                                }
                            </span>
                            <span className="text-xs text-muted-foreground">
                                {
                                    [
                                        "This is exciting! 🚀",
                                        "You got this! 💪",
                                        "Let's see what happens! 👀",
                                        "Magic in progress... ✨",
                                    ][Math.floor(Math.random() * 4)]
                                }
                            </span>
                        </div>
                    ) : executionResult === null ? (
                        <div className="text-center py-8">
                            <div className="text-lg mb-2">👋</div>
                            <div className="text-sm text-muted-foreground font-mono mb-1">
                                Ready to run some code?
                            </div>
                            <div className="text-xs text-muted-foreground">
                                Click "Run Code" and let's see what you can
                                build! 🎨
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {executionResult.output && (
                                <>
                                    <div className="text-center mb-2">
                                        <span className="text-2xl">🎉</span>
                                        <span className="ml-2 text-sm font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                            {
                                                [
                                                    "Amazing!",
                                                    "You rock!",
                                                    "Fantastic!",
                                                    "Well done!",
                                                    "Awesome!",
                                                    "Great job!",
                                                ][Math.floor(Math.random() * 6)]
                                            }
                                        </span>
                                        <span className="ml-2 text-2xl">
                                            🎉
                                        </span>
                                    </div>
                                    <div className="bg-gradient-to-br from-emerald-500/5 to-green-500/5 dark:from-emerald-500/10 dark:to-green-500/10 rounded-lg p-4 border-2 border-green-500/20 shadow-lg shadow-green-500/5">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                            <span className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-wider">
                                                Output
                                            </span>
                                        </div>
                                        <pre className="text-sm text-foreground font-mono whitespace-pre-wrap leading-relaxed">
                                            {executionResult.output}
                                        </pre>
                                    </div>
                                </>
                            )}
                            {executionResult.error && (
                                <>
                                    <div className="text-center mb-2">
                                        <span className="text-2xl">🤔</span>
                                        <span className="ml-2 text-sm font-bold text-orange-500">
                                            {
                                                [
                                                    "Oops! Let's fix this!",
                                                    "Don't worry, errors happen!",
                                                    "Almost there!",
                                                    "Learning moment!",
                                                ][Math.floor(Math.random() * 4)]
                                            }
                                        </span>
                                        <span className="ml-2 text-2xl">
                                            💡
                                        </span>
                                    </div>
                                    <div className="bg-gradient-to-br from-red-500/5 to-rose-500/5 dark:from-red-500/10 dark:to-rose-500/10 rounded-lg p-4 border-2 border-red-500/30 shadow-lg shadow-red-500/10">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                            <span className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">
                                                Error Details
                                            </span>
                                        </div>
                                        <pre className="text-sm text-red-700 dark:text-red-300 font-mono whitespace-pre-wrap leading-relaxed">
                                            {executionResult.error}
                                        </pre>
                                        <div className="mt-3 text-xs text-muted-foreground italic">
                                            💪 Keep going! Every error teaches
                                            you something new.
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
