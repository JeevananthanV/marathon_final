# Route Conventions: Run Beyond Limits 2026

TanStack Start uses **file-based routing**. Every `.tsx` file in this directory defines a route. Do **not** create `src/pages/`, `src/routes/_app/index.tsx`, or `app/layout.tsx` — those are Next.js / Remix conventions. The only root layout is `src/routes/__root.tsx`.

`routeTree.gen.ts` is auto-generated during `npm run build` or Vite startup. Never edit it manually.

---

## 🗺️ Active Route Mapping

| Route File | URL Path | Type | Description |
|---|---|---|---|
| `__root.tsx` | App Shell | Layout | Global wrapper (Navbar, Footer, Toaster) |
| `index.tsx` | `/` | Page | Public home page with Hero, Categories & Countdown |
| `about.tsx` | `/about` | Page | About the organization and marathon mission |
| `event.tsx` | `/event` | Page | Event cities overview (Chennai, Bengaluru, Salem) |
| `event-info.tsx` | `/event-info` | Page | Schedule, timeline, bib collection, and race rules |
| `register.tsx` | `/register` | Page | Multi-step registration wizard with DOB verification |
| `checkout-summary.tsx` | `/checkout-summary` | Page | Order review & Razorpay Standard Checkout trigger |
| `status.success.tsx` | `/status/success` | Page | **Official Runner Pass & Kit Voucher** with QR & PDF download |
| `status.failure.tsx` | `/status/failure` | Page | Payment failure handling & retry checkout |
| `admin.tsx` | `/admin` | Page (SPA) | **Admin Management Suite** (Dashboard, Players, T-Shirts, Reports, CRM) |
| `scan.tsx` | `/scan` | Page | Camera-based volunteer QR scanner for expo kit distribution |
| `verify.tsx` | `/verify` | Page | Staff manual verification & gate check-in console |
| `certificates.tsx` | `/certificates` | Page | Runner finisher certificate search & download |
| `gallery.tsx` | `/gallery` | Page | Photo gallery |
| `contact.tsx` | `/contact` | Page | Contact form & venue map |
| `terms-and-conditions.tsx` | `/terms-and-conditions` | Legal | Mandatory Razorpay Terms & Conditions |
| `privacy-policy.tsx` | `/privacy-policy` | Legal | Mandatory DPDP-compliant Privacy Policy |
| `refund-policy.tsx` | `/refund-policy` | Legal | Mandatory Cancellation & Refund Policy |
| `shipping-policy.tsx` | `/shipping-policy` | Legal | Mandatory Expo Kit Pickup & Shipping Policy |
| `contact-us.tsx` | `/contact-us` | Legal | Mandatory Nodal Officer & Corporate Inquiries |

---

## 📌 TanStack Routing Syntax Reference

* **Static Route:** `about.tsx` → `/about`
* **Dynamic Route:** `runner/$id.tsx` → `/runner/:id`
* **Query Parameters:** Use TanStack's `useSearch()` hook with Zod search schema validation.
* **Layout Route:** `_layout.tsx` (renders child routes via `<Outlet />`).
