# BharatDocs
Ms Doc but for India, reimagined for Indian students, faculty, and organizations.

![BharatDocs preview](image.png)

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![Convex](https://img.shields.io/badge/Convex-Backend-green)
![Clerk](https://img.shields.io/badge/Clerk-Auth-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38bdf8)

## Overview
BharatDocs is a web-based word processor designed for Indian languages, accents, and academic workflows. It prioritizes multilingual authoring, translation, and low-data performance while keeping a modern, cloud-first experience.

### Why BharatDocs
- Built for Indian linguistic diversity and academic writing styles
- Voice typing tuned for Indian accents
- Real-time translation across Indian languages and English
- AI-assisted academic workflows and summarization
- Fast and reliable even in low-bandwidth environments

## Core Features
| Category | Highlights |
| --- | --- |
| 🗣️ Language + Accent Support | Hindi, Marathi, Tamil, Telugu, Bengali, and more, with script handling for Indic languages |
| 🌐 Live Translation | Real-time translation between Indian languages and English |
| ✍️ Smart Writing | Grammar suggestions, sentence improvement, and style correction for academic tone |
| 🧠 AI Summary | Auto-summaries and key-point extraction for quick revision |
| ☁️ Cloud Sync | Web-based access with continuous sync and no installs |

## Key Objectives
- Provide a word processor tailored to Indian linguistic diversity
- Support multilingual writing and translation workflows
- Enable efficient document creation on low bandwidth
- Assist students and faculty with smart academic tools
- Offer a cloud-synced, accessible web solution

## Getting Started
### Local Development
```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Docker (Quick Start)
```bash
docker build -t indian-word-processor .
docker run -d -p 3000:3000 --name my-word-app indian-word-processor
```

<details>
<summary>Docker Installation Guide (macOS & Windows)</summary>

#### What is included
- Docker Engine
- Docker CLI
- Docker Compose

#### macOS setup
1. Download Docker Desktop: https://www.docker.com/products/docker-desktop/
2. Install Docker Desktop and start it.
3. Verify:

```bash
docker --version
docker compose version
```

#### Windows setup (Windows 10/11)
1. Enable WSL2:

```powershell
wsl --install
```

2. Install Docker Desktop and enable WSL2 backend.
3. Verify:

```bash
docker --version
docker compose version
```

#### Common Docker commands
```bash
docker info
docker pull nginx
docker run -d -p 8080:80 nginx
docker ps
docker ps -a
docker stop <container_id>
docker rm <container_id>
```

#### Docker Compose test
```yaml
services:
  web:
    image: nginx
    ports:
      - "8080:80"
```

```bash
docker compose up -d
docker compose down
```
</details>

## Project Structure
```bash
Indian_Word_Processor/
├─ convex/
│  ├─ _generated/
│  ├─ auth.config.ts
│  ├─ documents.ts
│  ├─ liveblocks.ts
│  ├─ schema.ts
│  └─ tsconfig.json
├─ src/
│  ├─ app/
│  │  ├─ (auth)/
│  │  ├─ documents/
│  │  ├─ fonts/
│  │  ├─ ConvexClientProvider.tsx
│  │  ├─ globals.css
│  │  ├─ layout.tsx
│  │  └─ page.tsx
│  ├─ components/
│  ├─ extensions/
│  ├─ hooks/
│  ├─ lib/
│  └─ store/
├─ docker-compose.yml
├─ Dockerfile
├─ next.config.ts
├─ package.json
├─ tailwind.config.ts
└─ tsconfig.json
```

## Learn More
- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)
- [Next.js GitHub Repository](https://github.com/vercel/next.js)