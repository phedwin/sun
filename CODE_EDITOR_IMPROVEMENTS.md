# Code Editor Improvements - TODO

## ✅ Completed
1. Created `codeSkeletonGenerator.ts` - Generates proper function skeletons from slug names
2. Updated `CodePlatform.tsx` - New layout with question left, editor right
3. Added problem fetching with caching
4. Better error handling with African personality

## 🚧 Remaining Tasks

### 1. Update CodeEditor Component
**File:** `src/components/CodeEditor.tsx`

**Changes needed:**
```typescript
// Add props interface at the top
interface CodeEditorProps {
    initialCode?: { [key: string]: string };
    problemSlug?: string;
    problemTitle?: string;
}

// Update export line 49
export const CodeEditor = ({ initialCode, problemSlug, problemTitle }: CodeEditorProps) => {

// Update the code state initialization (line 92)
const [code, setCode] = useState(
    initialCode?.javascript || getCodeTemplate("javascript")
);

// Update useEffect for loading templates (around line 95)
useEffect(() => {
    // If initialCode is provided, use it
    if (initialCode && initialCode[language]) {
        setCode(initialCode[language]);
    } else {
        // Fallback to templates logic
        const storedTemplates = localStorage.getItem("codeTemplates");
        if (storedTemplates) {
            try {
                const templates: CodeTemplate = JSON.parse(storedTemplates);
                setCodeTemplates(templates);
                setCode(templates[language as keyof CodeTemplate] || getCodeTemplate(language));
            } catch (error) {
                console.error("Error parsing code templates:", error);
            }
        }
    }
}, [initialCode, language]);

// Update handleLanguageChange (line 147)
const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
    if (initialCode && initialCode[newLang]) {
        setCode(initialCode[newLang]);
    } else if (codeTemplates) {
        setCode(codeTemplates[newLang as keyof CodeTemplate] || getCodeTemplate(newLang));
    } else {
        setCode(getCodeTemplate(newLang));
    }
};

// Update handleReset (line 161)
const handleReset = () => {
    if (initialCode && initialCode[language]) {
        setCode(initialCode[language]);
    } else if (codeTemplates) {
        setCode(codeTemplates[language as keyof CodeTemplate] || getCodeTemplate(language));
    } else {
        setCode(getCodeTemplate(language));
    }
};

// Add problem title to header (line 213, after language selects)
{problemTitle && (
    <h2 className="text-lg font-bold ml-4 bg-gradient-to-r from-[hsl(var(--sunset-orange))] to-[hsl(var(--savanna-gold))] bg-clip-text text-transparent">
        {problemTitle}
    </h2>
)}
```

### 2. Update QuestionPanel Component
**File:** `src/components/QuestionPanel.tsx`

**Changes needed:**
```typescript
// Update interface/props
interface QuestionPanelProps {
    problem?: LeetCodeProblemDetail | null;
}

export const QuestionPanel = ({ problem }: QuestionPanelProps) => {

// Replace the component content with:
if (!problem) {
    return (
        <div className="p-8 text-center">
            <p className="text-muted-foreground">No problem selected</p>
        </div>
    );
}

// Then display the actual problem data:
<div className="p-6 space-y-6">
    {/* Problem Title */}
    <div>
        <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold">{problem.questionTitle}</h1>
            <Badge className={
                problem.difficulty === "Easy" ? "bg-green-500" :
                problem.difficulty === "Medium" ? "bg-yellow-500" :
                "bg-red-500"
            }>
                {problem.difficulty}
            </Badge>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {problem.likes} likes
            </span>
        </div>
    </div>

    {/* Problem Description */}
    <div
        className="prose prose-sm dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: problem.question }}
    />

    {/* Hints (collapsible) */}
    {problem.hints && problem.hints.length > 0 && (
        <Collapsible>
            <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full">
                    💡 Show Hints ({problem.hints.length})
                </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4 space-y-2">
                {problem.hints.map((hint, i) => (
                    <Card key={i}>
                        <CardContent className="p-4">
                            <p className="text-sm">{hint}</p>
                        </CardContent>
                    </Card>
                ))}
            </CollapsibleContent>
        </Collapsible>
    )}
</div>
```

### 3. Fix API Problem Fetching
**File:** `src/lib/leetcodeApi.ts`

The `fetchProblemDetail` function should already work, but ensure it handles rate limits:

```typescript
export async function fetchProblemDetail(titleSlug: string): Promise<LeetCodeProblemDetail> {
    try {
        const response = await fetchWithRetry(
            `${API_BASE_URL}/select?titleSlug=${titleSlug}`
        );

        if (!response.ok) {
            if (response.status === 429) {
                throw new Error("Rate limit exceeded. Please try again in a moment.");
            }
            throw new Error(`Failed to fetch problem: ${response.statusText}`);
        }

        const data: LeetCodeProblemDetail = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching problem detail:", error);
        throw error;
    }
}
```

## Summary of What You Get

When complete, the code editor will:

1. **Layout**: Question on left (scrollable), editor on right (sticky with output visible)
2. **Problem Loading**: Fetches from API or cache, displays properly
3. **Code Skeleton**: Generated from slug name
   - `add-two-numbers` → `function addTwoNumbers() {}`
   - `two-sum` → `function twoSum() {}`
4. **Multi-language**: Works for JavaScript, Python, Java, C++
5. **Entry File Pattern**: Immutable structure that calls user function
6. **Sticky Output**: Output panel always visible, no scrolling needed
7. **African Personality**: Beautiful error messages and loading states

## Example Generated Code

For problem `add-two-numbers` in JavaScript:
```javascript
// Entry point - DO NOT MODIFY
// This file calls your solution function

function addTwoNumbers() {
    // Write your solution here

}

// Test your solution
const result = addTwoNumbers();
console.log(result);
```

For Python:
```python
# Entry point - DO NOT MODIFY
# This file calls your solution function

def add_two_numbers():
    """Write your solution here"""
    pass

# Test your solution
if __name__ == "__main__":
    result = add_two_numbers()
    print(result)
```
