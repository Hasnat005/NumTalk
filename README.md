# NumTalk

## 1. Project Title & Badges
> Identification: What is the project called? (Includes status badges like build success, license, and version.)

**NumTalk** — collaborative, arithmetic-first conversations.

![Status](https://img.shields.io/badge/status-active-success?style=flat-square)
![Node](https://img.shields.io/badge/node-20%2B-339933?logo=node.js&logoColor=white&style=flat-square)
![Tests](https://img.shields.io/badge/tests-Jest%20%26%20Vitest-informational?style=flat-square)
![License](https://img.shields.io/badge/license-TBD-lightgrey?style=flat-square)

## 2. Short Description
> The "What": A concise one- or two-sentence summary of the project's purpose and its value.

NumTalk is a full-stack assessment project where users build threaded discussions by chaining numbers and arithmetic operations. The stack pairs an Express/TypeScript API (Prisma + Postgres) with a React/Vite client powered by React Query and Axios.

## 3. Visual Demonstration
> Engagement: Show, don't just tell. Include a screenshot or an animated GIF of the application running, if applicable.

![NumTalk Demo](client/public/image.png)

_Screenshot: Home view showing the calculation tree, authentication panel, and respond form running in Vite dev mode._

## 4. Table of Contents (TOC)
> Navigation: Allows users to quickly jump to the Installation or Contributing sections if the README is long.

- [1. Project Title & Badges](#1-project-title--badges)
- [2. Short Description](#2-short-description)
- [3. Visual Demonstration](#3-visual-demonstration)
- [4. Table of Contents (TOC)](#4-table-of-contents-toc)
- [5. Getting Started (Installation)](#5-getting-started-installation)
- [6. Usage Examples](#6-usage-examples)
- [7. Contributing Guidelines](#7-contributing-guidelines)
- [8. Roadmap / Features](#8-roadmap--features)
- [9. License & Contact](#9-license--contact)

## 5. Getting Started (Installation)
> Setup: Exact, copy-pasteable commands and prerequisites required to clone the repo and get the project running locally.

**Prerequisites**
- Node.js 20+
- npm 10+
- Docker Desktop (optional, for the compose stack)
- ngrok account if you need a public tunnel for Vercel

**Clone & Install**

```powershell
git clone https://github.com/Hasnat005/NumTalk.git
cd NumTalk

# API dependencies + Prisma client
npm install --prefix server
npx prisma generate --schema server/prisma/schema.prisma

# Front-end dependencies
npm install --prefix client

# Copy environment templates
Copy-Item server/.env.example server/.env -Force
Copy-Item client/.env.example client/.env -Force
```

**Running everything locally**

```powershell
# Terminal 1 – API
cd server
npm run dev

# Terminal 2 – Client
cd client
npm run dev

# Optional terminal 3 – expose API via ngrok for Vercel
ngrok http 4000 --domain=newsworthy-kristian-noninterchangeably.ngrok-free.dev
```

Update `server/.env` → `ALLOWED_ORIGINS` with every front-end origin you plan to use (localhost, ngrok, Vercel). Set `client/.env` → `VITE_API_URL` to either `http://localhost:4000` or your ngrok/Vercel URL.

## 6. Usage Examples
> Functionality: Code snippets or instructions showing how to run the project's main features or functions.

**Check API health**

```powershell
curl.exe https://newsworthy-kristian-noninterchangeably.ngrok-free.dev/api/health `
	-H "Origin: https://num-talk.vercel.app" `
	-H "ngrok-skip-browser-warning: true"
```

**Create a starting calculation (authenticated)**

```powershell
curl.exe -X POST https://localhost:4000/api/calculations `
	-H "Content-Type: application/json" `
	-H "Authorization: Bearer <JWT>" `
	-d '{"value": 42}'
```

**Run the React client**

```powershell
cd client
VITE_API_URL=http://localhost:4000 npm run dev
```

## 7. Contributing Guidelines
> Collaboration: How can other developers submit bug fixes or new features? (Link to a CONTRIBUTING.md if complex.)

1. Fork the repository and create a topic branch from `main`.
2. Install dependencies (`npm install --prefix server` and `npm install --prefix client`).
3. Run `npm test` (server) and `npm run build` (client) to ensure nothing regresses.
4. Follow the existing ESLint/TypeScript conventions; add tests for new logic where possible.
5. Submit a pull request describing the change, screenshots/GIFs for UI updates, and reproduction steps for bug fixes.

_Need deeper processes (e.g., release trains, code owners)? Add a dedicated `CONTRIBUTING.md` and link it here._

## 8. Roadmap / Features
> Future: What functionality is planned, and what is the current state of the project?

| Status | Item |
| --- | --- |
| ✅ | Read-only discussion tree for anonymous visitors |
| ✅ | Auth flows with JWT-backed sessions |
| ✅ | React Query-powered optimistic UI for calculations |
| 🔄 | Production-ready hosting for the API (ngrok today, managed host later) |
| 🔄 | Rate limiting, audit logging, and CI workflows |
| ⏳ | React Testing Library suites + Vitest component coverage |
| ⏳ | Pagination / virtualization for massive trees |

## 9. License & Contact
> Legal/Contact: Which license is the project under? How can people reach the main maintainers?

- **License:** Not specified yet. Until a license file is added, please treat this repository as "all rights reserved" and contact the maintainers for reuse.
- **Contact:** Open an issue on GitHub or reach out to [@Hasnat005](https://github.com/Hasnat005) for collaboration and support inquiries.

---

Need a different README format (docs site, wiki, or feature deep-dive)? Open a discussion and outline the desired structure.
