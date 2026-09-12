# 🤖 Multi-Agent AI System

<div align="center">

![Project Status](https://img.shields.io/badge/status-active%20development-blue?style=for-the-badge)
![Architecture](https://img.shields.io/badge/architecture-microservices%20%7C%20multi--agent-purple?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/stack-React%20%7C%20Node%20%7C%20Redis%20%7C%20Mongo%20%7C%20LangGraph-orange?style=for-the-badge)
![Deployment](https://img.shields.io/badge/cloud-Docker%20%7C%20AWS-232F3E?style=for-the-badge&logo=amazon-aws)

**An enterprise-grade, distributed multi-agent platform combining Generative AI, Retrieval-Augmented Generation (RAG), microservices, and cloud infrastructure for autonomous research, code intelligence, document analysis, and automated presentation generation.**

</div>

---

## 📑 Table of Contents

- [📌 Overview](#-overview)
- [🏗️ High-Level System Architecture](#️-high-level-system-architecture)
- [🧠 Multi-Agent Orchestration](#-multi-agent-orchestration)
- [🔄 Core Workflow Pipelines](#-core-workflow-pipelines)
  - [1. Research & Presentation Pipeline](#1-research--presentation-pipeline)
  - [2. PDF Intelligence & RAG Retrieval](#2-pdf-intelligence--rag-retrieval)
  - [3. Code Generation & Analysis Loop](#3-code-generation--analysis-loop)
- [🧩 Microservices & Distributed Communication](#-microservices--distributed-communication)
- [🗄️ Polyglot Data Architecture](#️-polyglot-data-architecture)
- [☁️ Cloud & Production Infrastructure](#️-cloud--production-infrastructure)
- [📂 Project Directory Structure](#-project-directory-structure)
- [🛠️ Technology Stack](#️-technology-stack)
- [🚦 Getting Started & Local Development](#-getting-started--local-development)
  - [Prerequisites](#prerequisites)
  - [Environment Setup](#environment-setup)
  - [Running the Services](#running-the-services)
- [🧪 Testing & Quality Strategy](#-testing--quality-strategy)
- [🚀 Roadmap & Implementation Milestones](#-roadmap--implementation-milestones)
- [🔐 Security Guidelines](#-security-guidelines)
- [👨‍💻 Author & Contact](#-author--contact)
- [📜 License](#-license)

---

## 📌 Overview

The **Multi-Agent AI System** solves complex knowledge and technical tasks by moving away from brittle, monolithic prompts toward an **orchestrated ecosystem of autonomous, specialized agents**.

Rather than expecting a single language model to handle broad research, synthesis, coding, document parsing, and file generation simultaneously, the platform delegates requests through an **Agent Supervisor (LangGraph)** to specialized workers:

* 🔎 **Research Agent**: Conducts multi-step web queries, validates source credibility, and aggregates cited findings.
* 💻 **Coding Agent**: Handles code generation, debugging, refactoring, code review, and test design.
* 📄 **PDF & Document Agent**: Extracts text, structures metadata, and chunks complex files for vector search.
* 📚 **RAG Agent**: Queries semantic vector embeddings with dense retrieval and contextual reranking.
* 📊 **Presentation (PPT) Agent**: Plans slide decks, formats content, and generates downloadable `.pptx` documents.

---

## 🏗️ High-Level System Architecture

The application is structured into decoupled layers: a modern single-page frontend, a central API Gateway with reverse-proxy routing and JWT validation, isolated microservices, a distributed agent orchestration engine, and polyglot persistent storage.

```mermaid
flowchart TB
    subgraph ClientLayer["Frontend Client Layer"]
        UI["React SPA (Vite + Redux + Tailwind)"]
    end

    subgraph GatewayLayer["API Gateway Layer (Reverse Proxy)"]
        Gateway["Express API Gateway"]
        AuthCheck["Auth Middleware & JWT Validator"]
        RateLimit["Rate Limiting & CORS"]
        Gateway --> RateLimit
        RateLimit --> AuthCheck
    end

    subgraph ServiceMesh["Backend Microservices Layer"]
        AuthSvc["Auth Service (Port 5001)"]
        ChatSvc["Chat & Session Service (Port 5002)"]
        UserSvc["User Service"]
        AgentSvc["Agent Orchestrator Service"]
        PdfSvc["PDF Document Service"]
        PptSvc["PPT Generation Service"]
    end

    subgraph AIOrchestration["AI Agent Supervisor (LangGraph)"]
        Supervisor["Supervisor Router Node"]
        ResearchAgent["Research Agent"]
        CodingAgent["Coding Agent"]
        RAGAgent["RAG Agent"]
        PPTAgent["Presentation Agent"]
    end

    subgraph StorageLayer["Data & Persistence Tier"]
        MongoDB[("MongoDB (Auth, Users, Chats)")]
        RedisCache[("Redis (Tokens, Queues, Cache)")]
        VectorStore[("Vector DB (Qdrant / Chroma / Pinecone)")]
        FileStore[("Object Storage (AWS S3 / MinIO)")]
    end

    UI -->|"HTTP / REST / WebSocket"| Gateway
    AuthCheck -->|"/api/auth Proxy"| AuthSvc
    AuthCheck -->|"/api/chat Proxy"| ChatSvc
    AuthCheck -->|"/api/agents Proxy"| AgentSvc

    AuthSvc --> MongoDB
    AuthSvc --> RedisCache
    ChatSvc --> MongoDB
    ChatSvc --> RedisCache

    AgentSvc --> Supervisor
    Supervisor --> ResearchAgent
    Supervisor --> CodingAgent
    Supervisor --> RAGAgent
    Supervisor --> PPTAgent

    RAGAgent --> VectorStore
    PdfSvc --> FileStore
    PptSvc --> FileStore
```

---

## 🧠 Multi-Agent Orchestration

The AI layer is structured around the **Supervisor-Worker Pattern** using **LangGraph**. The supervisor analyzes the user's intent, breaks it down into executable subtasks, coordinates tool-assisted subagents, and synthesizes the final result.

```mermaid
flowchart TD
    UserPrompt(["User Prompt / Task Input"]) --> SupervisorNode["AI Supervisor (LangGraph State Machine)"]

    SupervisorNode --> Planning{"Route & Plan"}

    Planning -->|"Research Query"| ResearchNode["Research Agent"]
    Planning -->|"Code Generation / Debug"| CodeNode["Coding Agent"]
    Planning -->|"Document Lookup"| RAGNode["RAG Agent"]
    Planning -->|"Deck Creation"| DeckNode["Presentation Agent"]

    subgraph ResearchTools["Research Agent Tools"]
        SearchAPI["Web Search (Tavily / Serper)"]
        Scraper["Web Page Parser & Synthesizer"]
    end
    ResearchNode --> SearchAPI
    ResearchNode --> Scraper

    subgraph CodingTools["Coding Agent Tools"]
        SyntaxValidator["Syntax Checker & Linter"]
        CodeRunner["Sandboxed Execution / Pytest"]
    end
    CodeNode --> SyntaxValidator
    CodeNode --> CodeRunner

    subgraph RAGTools["RAG Agent Tools"]
        DenseRetriever["Vector Retriever"]
        ContextReranker["Context Reranker"]
    end
    RAGNode --> DenseRetriever
    RAGNode --> ContextReranker

    subgraph PPTTools["Presentation Agent Tools"]
        SlidePlanner["Slide Outline Generator"]
        PPTXBuilder["python-pptx Engine"]
    end
    DeckNode --> SlidePlanner
    DeckNode --> PPTXBuilder

    ResearchNode -->|"Report & Sources"| Consolidate["Supervisor Aggregation & Review"]
    CodeNode -->|"Verified Code"| Consolidate
    RAGNode -->|"Document Answer"| Consolidate
    DeckNode -->|"Generated Presentation (.pptx)"| Consolidate

    Consolidate --> Decision{"Requires Further Steps?"}
    Decision -->|"Yes"| SupervisorNode
    Decision -->|"Complete"| FinalOutput(["Final Structured Response"])
```

---

## 🔄 Core Workflow Pipelines

### 1. Research & Presentation Pipeline

When a user requests research on a topic and asks for a slide deck, the Supervisor sequences the task across multiple agents.

```mermaid
sequenceDiagram
    autonumber
    actor User as User
    participant UI as React Frontend
    participant GW as API Gateway
    participant AgentSvc as Agent Supervisor
    participant Research as Research Agent
    participant Web as Web Search Engine
    participant PPT as PPT Agent
    participant Storage as S3 / File System

    User->>UI: "Research EV battery breakthroughs and create a 6-slide deck"
    UI->>GW: POST /api/agents/task
    GW->>AgentSvc: Forward task with JWT Context
    AgentSvc->>AgentSvc: Determine plan: [Step 1: Research, Step 2: Build PPT]

    AgentSvc->>Research: Execute research task
    activate Research
    Research->>Web: Search latest breakthroughs & benchmarks
    Web-->>Research: Search results & articles
    Research->>Research: Extract key facts, summarize & generate citations
    Research-->>AgentSvc: Structured research findings
    deactivate Research

    AgentSvc->>PPT: Hand off structured findings + slide plan
    activate PPT
    PPT->>PPT: Generate slide titles, bullets, notes
    PPT->>Storage: Render and save presentation (.pptx)
    Storage-->>PPT: File URL / Download Path
    PPT-->>AgentSvc: Slide deck metadata & download link
    deactivate PPT

    AgentSvc-->>GW: Final response with summary & download URL
    GW-->>UI: Complete response payload
    UI-->>User: Display report + PPT download button
```

---

### 2. PDF Intelligence & RAG Retrieval

Documents are ingested, parsed into semantically cohesive passages, embedded with dense representation models, and indexed for low-latency contextual search.

```mermaid
flowchart LR
    subgraph Ingestion["1. Document Ingestion"]
        Doc["Upload PDF Document"] --> Extractor["Text & Metadata Extraction"]
        Extractor --> Splitter["Recursive Character / Semantic Chunking"]
    end

    subgraph Indexing["2. Vector Indexing"]
        Splitter --> Embedder["Embedding Model (OpenAI / HuggingFace)"]
        Embedder --> VectorDB[("Vector DB (Qdrant / Chroma)")]
    end

    subgraph QueryPipeline["3. RAG Query Execution"]
        UserQ["User Question"] --> QEmbed["Query Embedding"]
        QEmbed --> Retriever["Top-K Similarity Retrieval"]
        VectorDB -.->|"Embeddings"| Retriever
        Retriever --> Reranker["Reranking & Context Selection"]
        Reranker --> PromptBuilder["Prompt Augmentation with Context"]
        PromptBuilder --> LLM["LLM (Contextual Answering)"]
        LLM --> Answer["Grounded Answer + Citations"]
    end
```

---

### 3. Code Generation & Analysis Loop

The Coding Agent performs automated verification and iterative refinement to ensure syntax validity and proper formatting before delivering solutions.

```mermaid
flowchart TD
    Prompt["Coding Prompt / Bug Description"] --> Analyzer["Context & Requirements Analysis"]
    Analyzer --> CodeGen["LLM Code Generator"]
    CodeGen --> Linting["Static Syntax & Linter Validation"]
    
    Linting --> ValidationCheck{"Passes Syntax Check?"}
    ValidationCheck -->|"Fail"| ErrorFeedback["Inject Lint Error Context"]
    ErrorFeedback --> CodeGen
    
    ValidationCheck -->|"Pass"| DryRun["Unit Test Generation / Sandbox Check"]
    DryRun --> DocGen["Add Explanations, Complexity, & Docs"]
    DocGen --> OutputCode["Deliver Production-Grade Code"]
```

---

## 🧩 Microservices & Distributed Communication

The system combines synchronous REST calls for user-facing interactions and asynchronous message brokering for compute-heavy AI tasks.

```mermaid
flowchart LR
    subgraph Client["Client Application"]
        Browser["React Client (Vite)"]
    end

    subgraph Gateway["Central Entry Point"]
        APIGW["Express Gateway (Port 5000)"]
    end

    subgraph Services["Independent Microservices"]
        AuthMicro["Auth Service (:5001)"]
        ChatMicro["Chat Service (:5002)"]
        AgentMicro["Agent Service (:5003)"]
        WorkerMicro["Async AI Workers"]
    end

    subgraph Broker["Message Queue & Cache"]
        RedisPubSub["Redis (BullMQ / PubSub)"]
    end

    Browser -->|"HTTP / REST"| APIGW
    APIGW -->|"Proxy (Sync HTTP)"| AuthMicro
    APIGW -->|"Proxy (Sync HTTP)"| ChatMicro
    APIGW -->|"Proxy (Sync HTTP)"| AgentMicro

    AgentMicro -->|"Enqueue Heavy Jobs"| RedisPubSub
    RedisPubSub -->|"Job Consumption"| WorkerMicro
    WorkerMicro -.->|"Push Status / WebSockets"| APIGW
```

---

## 🗄️ Polyglot Data Architecture

To balance performance, flexibility, and scalability, each category of data is assigned to its ideal persistence technology:

```mermaid
flowchart TD
    AppLayer["Application Services"]

    AppLayer -->|"User profiles, auth credentials, chats, agent runs"| Mongo[("MongoDB")]
    AppLayer -->|"Session stores, token blacklists, cache, job queues"| Redis[("Redis")]
    AppLayer -->|"Transactional billing, audits, relationship tables"| Postgres[("PostgreSQL")]
    AppLayer -->|"Document embeddings, vector indexing, similarity search"| VectorDB[("Vector DB (Qdrant / Pinecone)")]
    AppLayer -->|"Uploaded PDFs, generated presentations, artifacts"| S3[("Object Storage (S3)")]

    subgraph DatabaseTier["Data & Storage Roles"]
        Mongo
        Redis
        Postgres
        VectorDB
        S3
    end
```

| Storage Engine | Purpose | Data Stored |
|---|---|---|
| **MongoDB** | Document Store | User credentials, agent execution logs, conversation histories, prompt templates |
| **Redis** | In-Memory Key-Value & Queue | Refresh token cache, session storage, rate limiting counters, BullMQ job queues |
| **Vector DB** | Vector Index | High-dimensional chunk embeddings, semantic document search indices |
| **AWS S3 / MinIO** | Blob Storage | User-uploaded PDF documents, compiled `.pptx` presentation artifacts |
| **PostgreSQL** | Relational Store | Multi-tenant accounts, billing records, structured audit trails |

---

## ☁️ Cloud & Production Infrastructure

The application is engineered for containerized orchestration and deployment to Amazon Web Services (AWS) using industry standards.

```mermaid
flowchart TB
    subgraph InternetLayer["Public Internet"]
        ClientUser["End Users"]
    end

    subgraph AWSCloud["AWS Cloud VPC"]
        Route53["Amazon Route 53 (DNS)"]
        CloudFront["AWS CloudFront (CDN)"]
        ALB["Application Load Balancer (ALB)"]

        subgraph PublicSubnet["Public Subnets"]
            NAT["NAT Gateway"]
            Bastion["Bastion Host"]
        end

        subgraph PrivateSubnet["Private ECS Workloads"]
            ECS_GW["ECS: API Gateway Container"]
            ECS_Auth["ECS: Auth Service Container"]
            ECS_Chat["ECS: Chat Service Container"]
            ECS_Agent["ECS: Multi-Agent Worker Containers"]
        end

        subgraph DataSubnet["Isolated Data Subnets"]
            DocDB[("Amazon DocumentDB / MongoDB")]
            ElastiCache[("Amazon ElastiCache (Redis)")]
            RDS[("Amazon RDS (PostgreSQL)")]
        end

        subgraph ManagedAWS["Managed AWS Cloud Services"]
            S3Bucket[("Amazon S3 (Artifacts & Static Uploads)")]
            SecretsMgr["AWS Secrets Manager"]
            CloudWatch["Amazon CloudWatch (Logs & Metrics)"]
        end
    end

    ClientUser --> Route53
    Route53 --> CloudFront
    CloudFront -->|"Static Assets"| S3Bucket
    CloudFront -->|"Dynamic APIs"| ALB
    ALB --> ECS_GW

    ECS_GW --> ECS_Auth
    ECS_GW --> ECS_Chat
    ECS_GW --> ECS_Agent

    ECS_Auth --> DocDB
    ECS_Auth --> ElastiCache
    ECS_Chat --> DocDB
    ECS_Agent --> ElastiCache
    ECS_Agent --> S3Bucket

    PrivateSubnet -.->|"Fetch Credentials"| SecretsMgr
    PrivateSubnet -.->|"Stream Logs"| CloudWatch
```

---

## 📂 Project Directory Structure

```text
MultiAgentAI/
├── frontend/                     # React Single Page Application
│   ├── public/                   # Static assets & favicon
│   ├── src/
│   │   ├── apis/                 # Axios HTTP clients & service endpoints
│   │   ├── assets/               # Brand SVGs and design assets
│   │   ├── pages/                # Route views (Chat, Login, Dashboard)
│   │   ├── redux/                # Global state slices (auth, sessions, agents)
│   │   ├── App.jsx               # Application route layout
│   │   ├── index.css             # Tailwind design system tokens
│   │   └── main.jsx              # React DOM entry point
│   ├── package.json              # Frontend dependencies (React, Redux, Tailwind)
│   └── vite.config.js            # Vite build configuration
│
├── backend/                      # Microservices Backend Architecture
│   ├── docker-compose.yml        # Multi-container orchestration (Redis, Mongo)
│   ├── package.json              # Root backend tooling & shared scripts
│   │
│   ├── gateway/                  # Central API Gateway (:5000)
│   │   ├── controller/           # Gateway route controllers
│   │   ├── middleware/           # auth.middleware.js, rate-limiter, error-handler
│   │   ├── index.js              # Gateway entry point & reverse-proxy routing
│   │   └── package.json
│   │
│   ├── services/
│   │   ├── auth/                 # Authentication Service (:5001)
│   │   │   ├── config/           # MongoDB connection & env validation
│   │   │   ├── controller/       # Register, Login, Token Refresh handlers
│   │   │   ├── models/           # User schema & encryption methods
│   │   │   ├── routes/           # /api/auth routes
│   │   │   ├── index.js          # Auth Express microservice entry
│   │   │   └── package.json
│   │   │
│   │   ├── chat/                 # Chat & Conversation Service (:5002)
│   │   │   ├── config/           # Database & session cache setup
│   │   │   ├── models/           # Conversation & Message schemas
│   │   │   ├── index.js          # Chat Express microservice entry
│   │   │   └── package.json
│   │   │
│   │   ├── agent/                # [Roadmap] LangGraph Multi-Agent Orchestrator
│   │   ├── research/             # [Roadmap] Web Search & Synthesis Worker
│   │   ├── rag/                  # [Roadmap] Vector Search & Document Ingestion
│   │   ├── pdf/                  # [Roadmap] PDF Parsing & Chunking Service
│   │   └── ppt/                  # [Roadmap] Automated PowerPoint Builder
│   │
│   └── shared/                   # Reusable cross-service utilities
│       └── redis/                # Shared Redis connection client
│
├── infrastructure/               # [Roadmap] Infrastructure-as-Code (Terraform, Docker)
└── README.md                     # Comprehensive project documentation
```

---

## 🛠️ Technology Stack

| Domain | Technologies |
|---|---|
| **Frontend** | React 19, Vite, Redux Toolkit, Tailwind CSS, Axios, React Router |
| **Backend & Microservices** | Node.js (ESM), Express.js, `express-http-proxy`, Cookie-Parser, CORS |
| **Multi-Agent Orchestration** | LangGraph, LangChain, OpenAI / Anthropic / Gemini APIs, Tool Calling |
| **Information Retrieval & RAG** | Vector Databases (Qdrant, Pinecone, Chroma), Text Splitters, Dense Embeddings |
| **Databases & Caching** | MongoDB (Mongoose), Redis (ioredis), PostgreSQL |
| **File & Document Processing** | `pdf-parse`, `python-pptx`, Cloudinary / AWS S3 SDK |
| **DevOps & Containers** | Docker, Docker Compose, Nginx, GitHub Actions |
| **Cloud (AWS)** | AWS ECS, ECR, S3, CloudFront, Route 53, ALB, CloudWatch, Secrets Manager |

---

## 🚦 Getting Started & Local Development

### Prerequisites

Ensure you have the following installed locally:
* **Node.js**: `v18.0.0+`
* **npm**: `v9.0.0+`
* **Docker & Docker Compose**: For local Redis and MongoDB containers
* **Git**

---

### Environment Setup

Create `.env` files for each running service:

#### 1. API Gateway (`backend/gateway/.env`)
```env
PORT=5000
FRONTEND_URL=http://localhost:5173
AUTH_SERVICE=http://localhost:5001
CHAT_SERVICE=http://localhost:5002
JWT_SECRET=your_super_secret_jwt_key
```

#### 2. Auth Service (`backend/services/auth/.env`)
```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/multi_agent_ai
JWT_SECRET=your_super_secret_jwt_key
REDIS_HOST=localhost
REDIS_PORT=6379
```

#### 3. Chat Service (`backend/services/chat/.env`)
```env
PORT=5002
MONGO_URI=mongodb://localhost:27017/multi_agent_ai
JWT_SECRET=your_super_secret_jwt_key
REDIS_HOST=localhost
REDIS_PORT=6379
```

#### 4. Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:5000
```

---

### Running the Services

#### Step 1: Start Redis using Docker Compose
```bash
cd backend
docker-compose up -d redis
```

#### Step 2: Start the Backend Microservices
Open separate terminal tabs or use a process runner:

```bash
# Terminal 1: Auth Service
cd backend/services/auth
npm install
npm run dev # or node index.js

# Terminal 2: Chat Service
cd backend/services/chat
npm install
npm run dev # or node index.js

# Terminal 3: API Gateway
cd backend/gateway
npm install
npm run dev # or node index.js
```

#### Step 3: Start the Frontend Application
```bash
cd frontend
npm install
npm run dev
```

Visit **`http://localhost:5173`** in your browser to interact with the platform.

---

## 🧪 Testing & Quality Strategy

```mermaid
flowchart LR
    Unit["Unit Tests (Jest / Pytest)"] --> Integration["Service Integration (Supertest)"]
    Integration --> E2E["End-to-End Tests (Playwright)"]
    E2E --> Eval["RAG & Agent Evaluation (Ragas / TruLens)"]
```

* **Unit Testing**: Tests domain logic, token generation, parsing, and data validation in isolation.
* **Integration Testing**: Verifies reverse-proxy gateway routing, JWT validation middleware, and service-to-service calls.
* **RAG & Agent Evaluation**: Evaluates retrieval recall, context relevancy, faithfulness, and answer correctness.
* **E2E Testing**: Validates end-to-end user journeys from login to multi-agent task completion.

---

## 🚀 Roadmap & Implementation Milestones

```mermaid
gantt
    title Multi-Agent AI Development Roadmap
    dateFormat  YYYY-MM
    section Core Platform
    Frontend UI & State Management       :done,    des1, 2026-07, 2026-08
    API Gateway & Reverse Proxy          :done,    des2, 2026-08, 2026-09
    Auth & Chat Microservices (MongoDB)  :active,  des3, 2026-08, 2026-10
    section Multi-Agent Intelligence
    LangGraph Supervisor Engine          :active,  des4, 2026-09, 2026-11
    Research Agent (Web Search Pipeline) :         des5, 2026-10, 2026-12
    RAG & Vector Search (PDF Service)    :         des6, 2026-11, 2027-01
    Coding Agent & Sandbox Runner        :         des7, 2026-12, 2027-02
    Automated PPT Presentation Service   :         des8, 2027-01, 2027-03
    section Production & Scale
    Docker Compose Service Mesh          :         des9, 2027-02, 2027-04
    CI/CD & AWS Deployment (ECS / S3)    :         des10, 2027-03, 2027-05
```

- [x] **Phase 1: Frontend Foundation** — Responsive UI, Redux stores, authentication forms, chat screens.
- [x] **Phase 2: API Gateway Layer** — Reverse proxy routing, cookie validation, JWT verification, and CORS configuration.
- [x] **Phase 3: Core Microservices** — Auth Service (registration/login/JWT), Chat Service with MongoDB integration, Redis container.
- [ ] **Phase 4: LangGraph Supervisor Orchestrator** — Dynamic task planning, state machine routing, fallback policies.
- [ ] **Phase 5: Autonomous Research Agent** — Multi-query web exploration, citation tracking, and report synthesis.
- [ ] **Phase 6: PDF Processing & RAG Engine** — Document upload, semantic chunking, vector embeddings, and dense retrieval.
- [ ] **Phase 7: Coding Agent** — Automated code generation, syntax validation, and self-correcting execution loops.
- [ ] **Phase 8: Automated PPT Generation** — Outline synthesis, slide layout generation, and direct `.pptx` downloads.
- [ ] **Phase 9: Distributed Background Workers** — BullMQ queues, asynchronous execution, and WebSocket notifications.
- [ ] **Phase 10: Production Cloud Deployment** — AWS ECS, CloudFront, ALB, S3, Secrets Manager, and CI/CD pipelines.

---

## 🔐 Security Guidelines

> [!IMPORTANT]
> **Zero Secrets in Version Control**: Never commit `.env` files, JWT secrets, database connection strings, or cloud provider access keys to source repositories.

* **Authentication & Authorization**: HttpOnly cookies with JWT token rotation and secure session expiration.
* **Network Isolation**: Backend microservices and databases reside in private subnets, accessible only through the API Gateway.
* **Input Sanitization**: Strict schema validation on all ingress endpoints to prevent SQL/NoSQL injection and prompt injection.
* **Rate Limiting**: Request throttling at the API Gateway level to safeguard against DDoS and API key quota exhaustion.

---

**Abhishek Roy**  

---

## 📜 License

This project is licensed under the [MIT License](LICENSE) — free for educational, research, and portfolio use.
