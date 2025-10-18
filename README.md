<div align="center">

# 🌟 Kwada

### Discovering and Nurturing Talent from Bunyala

_A homegrown platform built with love by engineers from Bunyala, for the next generation of problem solvers_

[![Demo Video](screen/thumbnail.png)](https://raw.githubusercontent.com/calestousjuma/sun/slave/screen/video.mp4)

[View Demo](https://raw.githubusercontent.com/calestousjuma/sun/slave/screen/video.mp4) • [Report Bug](./FIX.md) • [Contribute](#contributing)

---

</div>

## 🎯 About Kwada

Kwada is more than just a coding platform—it's a mission to identify and empower talented young minds from Bunyala and beyond. Born from the vision of engineers who understand the transformative power of technology and education, Kwada provides an accessible, engaging environment for aspiring developers to hone their skills through real-world coding challenges.

Our platform combines the best aspects of competitive programming with collaborative learning, creating a space where talent can flourish regardless of background or circumstance.

## ✨ Features

### 🚀 Currently Available

- **Interactive Code Editor** - Built with Monaco Editor, featuring syntax highlighting, auto-completion, and multi-language support (Python, JavaScript, Java, C++, and more)
- **LeetCode Integration** - Access to thousands of coding problems synced from LeetCode's extensive question bank
- **Smart Question Browser** - Filter problems by difficulty (Easy, Medium, Hard), topic tags, and acceptance rates
- **Real-time Code Execution** - Test your solutions instantly with built-in test cases
- **Progress Tracking** - Monitor your journey with detailed stats on attempted and solved problems
- **User Profiles** - Personalized dashboards showing your coding streak, favorite topics, and achievement milestones
- **Topic-Based Learning** - Navigate problems by data structures and algorithms (Arrays, Hash Tables, Trees, Graphs, Dynamic Programming, etc.)
- **Dark/Light Mode** - Beautiful themes optimized for extended coding sessions
- **Responsive Design** - Seamless experience across desktop, tablet, and mobile devices
- **RESTful API** - Backend server with Express.js serving question data and user progress
- **SQLite Database** - Efficient local data persistence with Prisma ORM
- **Question Statistics** - View aggregated stats including total questions, difficulty distribution, and popular topics

### 🎨 User Experience

- **Clean, Intuitive Interface** - Built with React, TailwindCSS, and shadcn/ui components
- **Smooth Animations** - Polished transitions and micro-interactions for delightful UX
- **Pagination** - Browse through questions efficiently with 50 items per page
- **Leaderboard Preview** - Top 5 performers showcased to inspire healthy competition
- **Slug-Based URLs** - SEO-friendly routes for every question (e.g., `/questions/two-sum`)

## 🔮 Roadmap

Here's what we're building next to make Kwada even more powerful:

| Feature                     | Description                                                 | Priority | Status         |
| --------------------------- | ----------------------------------------------------------- | -------- | -------------- |
| **OAuth Authentication**    | Google and Facebook login integration                       | High     | 🟡 In Progress |
| **Collaborative Rooms**     | Real-time code sharing with friends (Discord-style servers) | High     | 📋 Planned     |
| **Live Code Execution**     | Run code against actual test cases with instant feedback    | High     | 📋 Planned     |
| **Streak System**           | Daily coding challenges to build consistency                | Medium   | 📋 Planned     |
| **Code Submission History** | Track all your attempts and solutions over time             | Medium   | 📋 Planned     |
| **Discussion Forums**       | Community-driven Q&A for each problem                       | Medium   | 📋 Planned     |
| **Video Explanations**      | Step-by-step solution walkthroughs                          | Medium   | 📋 Planned     |
| **Peer Code Review**        | Get feedback from the community on your solutions           | Low      | 📋 Planned     |
| **Custom Contests**         | Create and host timed coding competitions                   | Low      | 📋 Planned     |
| **AI Hints System**         | Smart hints that guide without spoiling                     | Low      | 📋 Planned     |
| **Mobile Apps**             | Native iOS and Android applications                         | Low      | 📋 Planned     |
| **Offline Mode**            | Practice coding without internet connectivity               | Low      | 📋 Planned     |

**Legend:** 🟢 Live • 🟡 In Progress • 📋 Planned

## 🛠️ Technology Stack

**Frontend:**

- React 18 with TypeScript
- Vite for lightning-fast builds
- TailwindCSS + shadcn/ui for beautiful components
- Monaco Editor for code editing
- React Router for navigation
- TanStack Query for data fetching

**Backend:**

- Node.js + Express
- Prisma ORM
- SQLite database
- CORS-enabled API

**Development:**

- ESLint + Prettier for code quality
- TypeScript for type safety
- Concurrently for parallel dev servers

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository**

    ```bash
    git clone https://github.com/yourusername/kwada.git
    cd kwada
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Set up the database**

    ```bash
    npx prisma migrate dev --name init
    ```

4. **Start the development servers**

    ```bash
    npm run dev:all
    ```

    This runs both the Vite dev server (port 5173) and Express API server (port 3001) concurrently.

5. **Open your browser**
    ```
    http://localhost:5173
    ```

### Available Scripts

```bash
npm run dev          # Start frontend only
npm run server       # Start backend API only
npm run dev:all      # Start both frontend and backend
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

## 📖 API Documentation

### Endpoints

- `GET /api/health` - Health check
- `GET /api/questions` - List all questions (supports `?limit=N`)
- `GET /api/questions/topics` - Get all unique topic tags
- `GET /api/questions/stats` - Get question statistics

## 🤝 Contributing

We welcome contributions from developers of all skill levels! Whether you're fixing bugs, adding features, or improving documentation, your help makes Kwada better for everyone.

**How to contribute:**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Check out our [contribution guide](./FIX.md) for more details.

## 💡 Philosophy

Kwada believes that:

- **Talent is universal, but opportunity is not.** We're here to bridge that gap.
- **Learning should be engaging and accessible.** No paywalls, no gatekeeping.
- **Community makes us stronger.** We grow together, learn together, succeed together.
- **Representation matters.** Built by engineers from Bunyala, for aspiring developers everywhere.

## 🌍 From Bunyala, With Love

This project is built by engineers who trace their roots to Bunyala—a place that has nurtured talent despite limited resources. Kwada is our way of giving back, creating opportunities for the next generation of developers, and proving that great engineering can come from anywhere.

## 📄 License

This project is open source and available under the MIT License.

---

<div align="center">

**© Kwada 2025**

_Empowering the next generation of developers, one line of code at a time._

Made with ❤️ by engineers from Bunyala

</div>
