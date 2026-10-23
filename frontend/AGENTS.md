# Frontend Agent & Developer Guidelines: Run Beyond Limits 2026

This document provides architectural standards, conventions, and design tokens for AI agents and human developers maintaining the `frontend/` package.

---

## 1. Technology Stack & Framework Rules

| Responsibility | Tooling / Library | Rules & Conventions |
|---|---|---|
| **Framework** | [TanStack Start](https://tanstack.com/start) (React 19) | Server-Side Rendered (SSR) with Nitro node-server adapter. |
| **Routing** | [TanStack Router](https://tanstack.com/router) | **File-based routing strictly under `src/routes/`**. Never create `src/pages/` or Next.js `layout.js` files. Root layout is `src/routes/__root.tsx`. |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | Use the curated brand palette. Do NOT use Tailwind v3 `@tailwind base;` directives — Tailwind v4 uses `@import "tailwindcss";` in `src/styles.css`. |
| **Icons** | [Lucide React](https://lucide.dev/) | Consistent icon set. Prefer 16px (`h-4 w-4`) in buttons and 18–20px (`h-5 w-5`) in cards. |
| **Forms & Validation** | [Zod](https://zod.dev/) + React Hook Form | Every public form must validate against strict Zod schemas before network dispatch. |
| **Charts** | [Recharts](https://recharts.org/) | Use wrapped components from `src/components/admin/charts/PremiumCharts.tsx`. |
| **Notifications** | [Sonner](https://sonner.emilkowal.ski/) | Use `toast.success()`, `toast.error()`, and `toast.info()` for non-intrusive feedback. |

---

## 2. Brand Identity & Design System

The platform features an athletic, high-contrast, premium aesthetic:

### Color Tokens
* **Primary Hot Pink / Magenta:** `#e9387c` (`var(--primary)`)
* **Vibrant Orange / Coral:** `#ff6b35` (`var(--accent)`)
* **Deep Navy / Slate Charcoal:** `#0f172a` (`var(--background)` in dark mode)
* **Emerald Success:** `#10b981` (used for `Paid`, `Kit Collected`, and confirmed states)
* **Amber Warning:** `#f59e0b` (used for `Pending`, `Kit Pending`, and waiting states)

### Gradients
* **Hero Gradient:** `linear-gradient(135deg, #e9387c 0%, #ff6b35 100%)`
* **Card Gradient:** `linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)`

### Typography
* **Headings:** Bold, punchy tracking (`font-black tracking-tight`).
* **Numbers / BIBs / IDs:** Clean monospaced styling (`font-mono font-bold tracking-wide`).

---

## 3. Directory Layout

```
frontend/src/
├── components/
│   ├── admin/               # Admin panel tabs & UI
│   │   ├── AdminLayout.tsx  # Sidebar navigation shell
│   │   ├── DashboardTab.tsx # Key metrics & analytics charts
│   │   ├── ParticipantsTab.tsx # Runner table, kit handover, PDF download
│   │   ├── TShirtTab.tsx    # Kit distribution metrics & size matrix
│   │   ├── ReportsTab.tsx   # Revenue & city reports
│   │   ├── WhatsAppTab.tsx  # WhatsApp client manager
│   │   ├── CrmTab.tsx       # Zoho & Salesforce sync manager
│   │   └── types.ts         # Shared admin TypeScript interfaces
│   ├── marathon/            # Public marketing & registration components
│   │   ├── HeroSection.tsx
│   │   ├── RaceCategories.tsx
│   │   ├── BibPickupSection.tsx
│   │   └── ...
│   └── ui/                  # Reusable shadcn/ui components (Card, Button, Dialog)
├── hooks/
│   ├── use-admin.ts         # Central admin state, API fetches, kit toggles, ticket downloads
│   └── use-theme.ts         # Light/dark mode persistence
├── routes/                  # File-based TanStack routes
│   ├── __root.tsx           # Global shell (Navbar, Footer, Toaster)
│   ├── index.tsx            # Home page
│   ├── register.tsx         # Multi-step registration wizard
│   ├── checkout-summary.tsx # Order review & Razorpay payment trigger
│   ├── status.success.tsx   # Official Runner Pass & Kit Voucher with QR
│   ├── status.failure.tsx   # Payment retry & support
│   ├── admin.tsx            # Protected Admin Dashboard
│   ├── scan.tsx             # Camera-based volunteer QR scanner
│   ├── verify.tsx           # Manual expo verification console
│   └── ... (compliance pages)
└── styles.css               # Global Tailwind CSS v4 styling
```

---

## 4. Key Architectural Patterns

### 1. Razorpay Checkout Handshake
Always launch Razorpay using the server-generated `orderId` and verify cryptographic signatures on the backend. Never update database state directly from frontend callbacks.
* Component: `src/routes/checkout-summary.tsx`
* Success Redirect: `/status/success?id=${participantId}`

### 2. Official Pass & Ticket PDF Download
* Success Page: `src/routes/status.success.tsx` renders the Base64 QR code and provides direct downloads via `/api/v1/marathon/ticket-pdf/:id`.
* Admin Dashboard: `src/components/admin/ParticipantsTab.tsx` provides a 1-click download button invoking `downloadTicket(id, bib, name)` in `use-admin.ts`.

### 3. Kit & T-Shirt Distribution State
Participant objects contain `kitCollected` (`Yes` | `No`), `kitCollectedAt`, `attendeeCheckedIn`, and `checkedInAt`.
* Mutation: `PUT /api/admin/participants/:id/kit-distribution`
* Hook function: `toggleKitStatus(id, currentStatus)` in `use-admin.ts`
* UI Components: `ParticipantsTab` (inline toggle button & kit filter) and `TShirtTab` (fulfillment KPI cards).

### 4. Admin Authentication
Admin tokens are stored in `localStorage` under `admin_token`. All admin API calls must include the authorization header:
```javascript
headers: {
  Authorization: `Bearer ${token}`
}
```

---

## 5. Build & Verification Commands

```bash
# Start frontend dev server
npm run dev

# Run full production build (validates route tree, SSR Nitro server, and types)
npm run build

# Preview built production bundle
npm run preview
```

Always ensure `npm run build` exits with code `0` after modifying routes or TypeScript types.
