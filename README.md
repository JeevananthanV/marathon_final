# 🏃 Run Beyond Limits 2026

[![View Site](https://img.shields.io/badge/View%20Site-marathon--website--five.vercel.app-brightgreen?logo=vercel&logoColor=white)](https://marathon-website-five.vercel.app/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)

A full-stack marathon event registration and management platform for **Run Beyond Limits 2026** — a multi-city running event held simultaneously across **Chennai, Bengaluru, and Salem**.

---

## 🔗 Live Links

| | URL |
|---|---|
| 🌐 **View Site** | [https://marathon-website-five.vercel.app/](https://marathon-website-five.vercel.app/) |
| 🔐 **View Admin Dashboard** | [https://marathon-website-five.vercel.app/admin](https://marathon-website-five.vercel.app/admin) |

> **Demo Credentials** — Username: `admin` / Password: `password123`

---

## ✨ Key Features

### 🏃 Runner Portal
- Multi-step registration form with real-time Zod schema validation
- Race category selection (5K / 10K / Half Marathon) with T-shirt size picker
- Confirmation email with PDF certificate sent automatically on payment approval
- Certificate download page — lookup by email or phone number

### 🔐 Admin Dashboard
- **Dashboard Overview** — Live stats: total registrations, revenue, payment breakdown, category distribution
- **Participants Table** — Search, filter, sort, and paginate all registered runners
- **Payment Management** — Approve/reject payments; auto-generates BIB numbers on approval
- **T-Shirt Management** — Track T-shirt size allocations per runner
- **Reports & Exports** — Download participant data as CSV/Excel reports
- **Contacts** — View and manage contact form submissions
- **Light / Dark Theme** — Toggle between themes; preference saved in localStorage
- Secure JWT-based authentication with session persistence

### 📧 Automation
- Styled HTML confirmation emails via Nodemailer (Gmail SMTP)
- Dynamically generated PDF certificates with QR code validation
- Automatic BIB number assignment upon payment approval
- **WhatsApp messaging** — automatic registration & payment (BIB) messages to the runner's phone
- **Zoho CRM / Salesforce lead sync** on every registration (skipped gracefully until credentials are set)

### 💬 WhatsApp Automation
- Link a real WhatsApp number once by scanning a QR code in **Admin → WhatsApp** (no API keys needed)
- Channel fallback: QR-linked WhatsApp Web → Meta Cloud API → Twilio → console mock (never breaks registration)
- Session persists on disk, so the QR is scanned only once; status/QR/test-send are managed from the admin tab
- Self-healing browser startup: orphaned browsers are cleaned up automatically and init retries with backoff

### 🗺️ Multi-City Support
- **Chennai** — Marina Beach coastal route
- **Bengaluru** — Vidhana Soudha heritage route
- **Salem** — Yercaud scenic hills route

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | TanStack Start (SSR), React 19, TypeScript, Tailwind CSS v4 |
| **Backend** | Node.js, Express.js, PostgreSQL, pg |
| **Auth** | JWT (JSON Web Tokens) + bcryptjs |
| **Email** | Nodemailer (Gmail SMTP) |
| **PDF** | PDFKit |
| **Deployment** | Render.com (Web Services) |

---

## 🏁 Race Categories

| Category | Distance | Entry Fee |
|---|---|---|
| Fun Run | 5K | ₹499 |
| Challenge | 10K | ₹799 |
| Half Marathon | 21K | ₹999 |

---

## 📡 Core API Routes

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/register` | Register new participant | Public |
| `POST` | `/api/admin/login` | Admin login → returns JWT | Public |
| `GET` | `/api/admin/participants` | List all participants | Admin JWT |
| `GET` | `/api/admin/stats` | Dashboard statistics | Admin JWT |
| `PUT` | `/api/admin/participants/:id/payment` | Approve/reject payment, assign BIB | Admin JWT |
| `GET` | `/api/certificate/lookup` | Find participant by email or phone | Public |
| `GET` | `/api/certificate/download/:id` | Generate & download PDF certificate | Public |
| `GET` | `/api/admin/whatsapp/status` | WhatsApp channel status + pending QR | Admin JWT |
| `POST` | `/api/admin/whatsapp/qr` | (Re)start client to get a fresh QR | Admin JWT |
| `POST` | `/api/admin/whatsapp/test` | Send a test WhatsApp message | Admin JWT |

---

## 🚀 Local Development

### 1. Backend Setup

Create `backend/.env`:
```env
PORT=5000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/marathon_db
JWT_SECRET=your_jwt_secret
BASE_URL=http://localhost:5000
ADMIN_USERNAME=admin
ADMIN_PASSWORD=password123
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_gmail_app_password
SMTP_FROM=your_email@gmail.com
# WhatsApp automation: QR-linked web client (set to false to disable)
WHATSAPP_WEB_CLIENT=true
```

```bash
cd backend
npm install
npm run seed     # Seeds admin + 100 test participants
npm run dev      # Starts API at http://localhost:5000
```

### 2. Frontend Setup

Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000
```

```bash
cd frontend
bun install      # or npm install
npm run dev      # Starts site at http://localhost:8080
```

---

## 🌐 Deployment (Render.com)

### Backend Web Service
| Setting | Value |
|---|---|
| Root Directory | `backend` |
| Build Command | `npm install` |
| Start Command | `npm start` |
| Env: `WHATSAPP_WEB_CLIENT` | `false` (no browser on the server — use Meta/Twilio instead) |

### Frontend Web Service
| Setting | Value |
|---|---|
| Root Directory | `frontend` |
| Build Command | `bun install && NITRO_PRESET=node-server npm run build` |
| Start Command | `node .output/server/index.mjs` |
| Env: `VITE_API_URL` | Your backend Render URL |

---

## 👨‍💻 Author

**Gokulraj N** — [@Gokulraj-N80](https://github.com/Gokulraj-N80)
