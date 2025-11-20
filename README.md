# NumTalk

![NumTalk Demo](client/public/image.png)

> Collaborative, arithmetic-first conversations where discussions are built with numbers.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/Hasnat005/NumTalk)

## 📄 Table of Contents
- [About](#-about)
- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Getting Started](#-getting-started)
- [Usage](#-usage)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

## 🧐 About
NumTalk is a full-stack assessment project where users build threaded discussions by chaining numbers and arithmetic operations. It solves the problem of unstructured debate by enforcing mathematical logic on conversation threads. I built this to demonstrate full-stack capabilities using modern TypeScript, React, and Node.js.

## ✨ Features
* **Arithmetic Threads:** Start with a number, respond with an operation (+, -, *, /).
* **Secure Authentication:** JWT-backed login and registration system.
* **Optimistic UI:** Immediate feedback on calculations using React Query.
* **Responsive Design:** Clean, component-first UI without heavy frameworks.

## 🛠️ Tech Stack
- **Frontend:** React, Vite, TypeScript, React Query, Axios
- **Backend:** Node.js, Express, Prisma ORM
- **Database:** PostgreSQL (Supabase)
- **DevOps:** Vercel, Docker

## 🚀 Getting Started

### Prerequisites
* Node.js v20+
* npm or yarn

### Installation
1. Clone the repo
   ```sh
   git clone https://github.com/Hasnat005/NumTalk.git
   ```
2. Install dependencies
   ```sh
   # Server
   cd server
   npm install
   
   # Client
   cd ../client
   npm install
   ```
3. Configure Environment
   Create `.env` files in both `server` and `client` folders based on `.env.example`.

## 💡 Usage

Run the application locally:

```sh
# Terminal 1: Backend
cd server
npm run dev

# Terminal 2: Frontend
cd client
npm run dev
```

## 🤝 Contributing

Contributions are welcome! Please read `CONTRIBUTING.md` for details on our code of conduct, and the process for submitting pull requests.

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📬 Contact

Hasnat - [@Hasnat005](https://github.com/Hasnat005)
Project Link: [https://github.com/Hasnat005/NumTalk](https://github.com/Hasnat005/NumTalk)
