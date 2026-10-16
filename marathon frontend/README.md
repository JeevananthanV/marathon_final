# 🏃 Marathon Web

A modern, full-featured marathon event website built with **React 19**, **TanStack Start**, and **Tailwind CSS v4**. Features a stunning UI with animated sections, race registration, gallery, FAQs, and more.

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Framework | [TanStack Start](https://tanstack.com/start) (React 19 + SSR) |
| Routing | [TanStack Router](https://tanstack.com/router) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) |
| UI Components | [Radix UI](https://www.radix-ui.com/) + [shadcn/ui](https://ui.shadcn.com/) |
| Animations | [Framer Motion](https://www.framer.com/motion/) |
| Forms | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) |
| Data Fetching | [TanStack Query](https://tanstack.com/query) |
| Icons | [Lucide React](https://lucide.dev/) |
| Build Tool | [Vite](https://vitejs.dev/) |
| Server | [Nitro](https://nitro.build/) |

---

## 📁 Project Structure

```
src/
├── assets/          # Static images and media
├── components/
│   ├── marathon/    # Marathon-specific sections
│   │   ├── HeroSection.tsx
│   │   ├── Countdown.tsx
│   │   ├── RaceCategories.tsx
│   │   ├── Gallery.tsx
│   │   ├── FAQ.tsx
│   │   ├── ContactSection.tsx
│   │   ├── BibPickupSection.tsx
│   │   ├── RegistrationCTA.tsx
│   │   └── ... (17 components)
│   ├── ui/          # Reusable shadcn/ui components
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   └── LoadingScreen.tsx
├── routes/          # File-based routing
│   ├── index.tsx    # Home page
│   ├── about.tsx
│   ├── event-info.tsx
│   ├── gallery.tsx
│   ├── contact.tsx
│   └── register.tsx
├── data/            # Static data / constants
├── hooks/           # Custom React hooks
├── lib/             # Utility functions
├── styles.css       # Global styles
└── router.tsx       # Router configuration
```

---

## 📄 Pages

| Route | Description |
|---|---|
| `/` | Home — Hero, Countdown, Highlights, Categories |
| `/about` | About the event and organizers |
| `/event-info` | Race details, timeline, bib pickup |
| `/gallery` | Photo gallery |
| `/contact` | Contact form and map |
| `/register` | Race registration form |

---

## 🛠️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) >= 18
- [Bun](https://bun.sh/) (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/Gokulraj-N80/Marathon-web.git
cd Marathon-web

# Install dependencies
npm install
# or with bun
bun install
```

### Development

```bash
npm run dev
# or
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

---

## 🧹 Code Quality

```bash
# Lint
npm run lint

# Format
npm run format
```

---

## 📦 Key Features

- ⚡ **SSR-ready** with TanStack Start + Nitro
- 🎨 **Glassmorphism & dark UI** design
- 🏅 **Race categories** with detailed info
- ⏱️ **Live countdown** to race day
- 📝 **Registration form** with validation
- 📸 **Photo gallery**
- ❓ **FAQ accordion**
- 📱 **Fully responsive** across all devices
- 💬 **WhatsApp floating button**
- 🗞️ **Press highlights** section

---

## 📜 License

This project is private. All rights reserved.
