# Python Programming Curriculum

This directory contains the complete Python curriculum for the learning platform.

## Structure

```
curriculum/
├── index.json           # Curriculum index with all topics
├── beginner/            # Beginner level topics
├── intermediate/        # Intermediate level topics
├── advanced/            # Advanced level topics
└── expert/              # Expert level topics
```

## How It Works

1. **index.json** - Contains the curriculum structure with:
    - Categories (Beginner, Intermediate, Advanced, Expert)
    - Topics within each category
    - Associated practice problems for each topic

2. **Markdown Files** - Each topic has a `.md` file that contains:
    - Lesson content
    - Code examples
    - Explanations
    - Practice exercises

3. **Easy to Edit** - Teachers can edit Markdown files:
    - No HTML knowledge needed!
    - Write in simple Markdown syntax
    - Changes are reflected immediately
    - Automatic syntax highlighting
    - Beautiful rendering

## Adding a New Topic

1. Add the topic to `index.json`:

```json
{
    "id": "new-topic",
    "title": "New Topic Title",
    "description": "Brief description",
    "file": "beginner/06-new-topic.md",
    "questions": ["question-slug-1", "question-slug-2"]
}
```

2. Create a Markdown file in the appropriate directory:

````markdown
# Topic Title

Your introduction text here...

## Section Heading

Explanation paragraph...

### Subsection

More details...

## Code Examples

```python
def hello():
    print("Hello, World!")

hello()
```

## Lists

- First item
- Second item
- Third item

## Important Note

---

### 💡 Pro Tip

Use this format for helpful tips!

---

### ⚠️ Warning

Use this format for warnings!

---

### 📚 Further Reading

Use this format for additional resources!
````

## Markdown Syntax Guide

### Headings

```markdown
# Main Title (H1)

## Section (H2)

### Subsection (H3)
```

### Text Formatting

```markdown
**Bold text**
_Italic text_
`Inline code`
```

### Code Blocks

````markdown
```python
def greet(name):
    print(f"Hello, {name}!")
```
````

### Lists

**Unordered:**

```markdown
- Item 1
- Item 2
    - Nested item
```

**Ordered:**

```markdown
1. First step
2. Second step
3. Third step
```

### Blockquotes

```markdown
> This is a quote
>
> It can span multiple lines
```

### Links

```markdown
[Link Text](https://example.com)
```

### Horizontal Rules

```markdown
---
```

### Special Callouts

Use horizontal rules with emoji headings for special callouts:

```markdown
---
### 💡 Pro Tip

Helpful advice goes here!
---

### ⚠️ Warning

Important warning here!

---

### 📚 Further Reading

Additional resources here!
```

## Practice Problems

Associate LeetCode problems with topics by adding their slugs to the `questions` array:

```json
"questions": ["two-sum", "valid-parentheses", "reverse-string"]
```

Students will see these as clickable buttons after reading the topic!

## Features

✅ **Markdown-based** - Simple, teacher-friendly format
✅ **Syntax highlighting** - Automatic for all code blocks
✅ **No rebuild needed** - Changes appear instantly
✅ **Special callouts** - Tips, warnings, and notes with emoji
✅ **Practice integration** - Link to coding problems
✅ **Beautiful rendering** - Professional typography
✅ **Dark/light mode** - Theme-aware display

## Example Topic Structure

````markdown
# Variables and Data Types

Variables are containers for storing data values.

## Creating Variables

```python
name = "Alice"
age = 25
price = 19.99
```

## Data Types

### Strings

Text data enclosed in quotes.

### Integers

Whole numbers without decimals.

### Floats

Numbers with decimal points.

## Practice Exercise

1. Create a variable for your name
2. Create a variable for your age
3. Print both using `print()`

---

### 💡 Best Practice

Use descriptive variable names like `user_age` instead of `a`.
````

## Benefits Over HTML

| Feature              | Markdown | HTML      |
| -------------------- | -------- | --------- |
| Easy to learn        | ✅ Yes   | ❌ No     |
| Quick to write       | ✅ Yes   | ❌ No     |
| Readable in raw form | ✅ Yes   | ❌ No     |
| Syntax highlighting  | ✅ Auto  | ⚠️ Manual |
| Teacher-friendly     | ✅ Yes   | ❌ No     |
| Version control      | ✅ Clean | ⚠️ Messy  |

## Tips for Educators

1. **Keep it simple** - Markdown is meant to be readable as plain text
2. **Use code blocks** - Always specify the language for proper highlighting
3. **Add callouts** - Use emoji headings for tips, warnings, and notes
4. **Link problems** - Connect theory to practice with the questions array
5. **Stay consistent** - Use the same formatting across all topics
6. **Test locally** - View your changes before committing

## Future Expansion

You can easily add:

- More categories (Projects, Web Development, Data Science)
- More languages (JavaScript, Java, C++, etc.)
- Embedded videos (YouTube, Vimeo)
- Interactive diagrams (Mermaid)
- Math formulas (LaTeX via plugins)
- Quizzes and assessments

Just update `index.json` and add the Markdown files!
