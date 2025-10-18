# LeetCode API / LeetCode Sorted

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)](https://leetcode-api-pied.vercel.app) [![FastAPI](https://img.shields.io/badge/Powered%20By-FastAPI-%2300C7B7?logo=fastapi)](https://fastapi.tiangolo.com) [![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

_"Yet Another LeetCode API" - Because why reinvent the wheel? (But we did anyway 🛠️)_

## 🚀 Core Services

- **Live Demo**: [leetcode-api-pied.vercel.app](https://leetcode-api-pied.vercel.app)
- **Interactive Docs**: [leetcode-api-pied.vercel.app/docs](https://leetcode-api-pied.vercel.app/docs)
- **Google Sheet**: [View Sheet](https://docs.google.com/spreadsheets/d/1sRWp95wqo3a7lLBbtNd_3KkTyGjx_9sctTOL5JOb6pA/edit?usp=sharing)  
  _(Daily updated LeetCode question database with sorting/filtering)_

    **Enable Filtering/Sorting:**
    1. Select **Row 3**.
    2. Go to **Data > Filter views > Create new filter view**.

## ⚡ Quick Start

```bash
# Get today's daily challenge
curl https://leetcode-api-pied.vercel.app/daily

# Find a problem by ID/slug
curl https://leetcode-api-pied.vercel.app/problem/1
curl https://leetcode-api-pied.vercel.app/problem/two-sum

# Get user profile (try your LeetCode username!)
curl https://leetcode-api-pied.vercel.app/user/lee215
```

## 🔍 API Endpoints

| Endpoint                       | Method | Description               | Example                                                                                                                                    |
| ------------------------------ | ------ | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `/problems`                    | GET    | All LeetCode problems     | [/problems](https://leetcode-api-pied.vercel.app/problems)                                                                                 |
| `/problem/{id_or_slug}`        | GET    | Get problem by ID/slug    | [/problem/1](https://leetcode-api-pied.vercel.app/problem/1)<br />[/problem/two-sum](https://leetcode-api-pied.vercel.app/problem/two-sum) |
| `/search/{query}`              | GET    | Search for problems       | [/search?query=two%20sum](https://leetcode-api-pied.vercel.app/search?query=two%20sum)                                                     |
| `/random`                      | GET    | Random LeetCode problem   | [/random](https://leetcode-api-pied.vercel.app/random)                                                                                     |
| `/user/{username}`             | GET    | User profile & stats      | [/user/lee215](https://leetcode-api-pied.vercel.app/user/lee215)                                                                           |
| `/user/{username}/contests`    | GET    | User's recent contests    | [/user/lee215/contests](https://leetcode-api-pied.vercel.app/user/lee215/contests)                                                         |
| `/user/{username}/submissions` | GET    | User's recent submissions | [/user/lee215/submissions](https://leetcode-api-pied.vercel.app/user/lee215/submissions)                                                   |
| `/daily`                       | GET    | Today's coding challenge  | [/daily](https://leetcode-api-pied.vercel.app/daily)                                                                                       |

## 🤔 Why This API?

- Always Fresh Data 🥬
  Auto-updating cache system (no stale LeetCode questions!)

- Vercel-Ready ⚡
  One-click deployment with serverless architecture

- No API Keys 🔓
  Free to use with sensible rate limits

- Real LeetCode Data 🔥
  Direct integration with LeetCode's GraphQL API

---

_Disclaimer: This project isn't affiliated with LeetCode. Use at your own risk._

## credits

Made with ❤️ by [Yan-Ying Liao](http://noworneverev.github.io)
