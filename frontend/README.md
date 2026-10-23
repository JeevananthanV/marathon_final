# 🏃 Run Beyond Limits 2026 — Frontend Application

A state-of-the-art marathon event registration, ticketing, and administrative platform built with **React 19**, **TanStack Start (SSR)**, and **Tailwind CSS v4**.

---

## 🚀 Key Modules & Capabilities

- ⚡ **TanStack Start (SSR):** High-performance server-side rendering for public marketing and registration pages.
- 💳 **Razorpay Standard Checkout:** Embedded checkout flow with UPI intent, Cards, and NetBanking support.
- 🎟️ **Official Pass & QR Ticketing:** Instant Runner Pass & Kit Voucher rendering with dynamic Base64 QR code and printable A4 PDF download.
- 📦 **Kit & T-Shirt Distribution Station:** Admin distribution tracking (`kitCollected`, `kitCollectedAt`, `attendeeCheckedIn`) with 1-click status toggle and real-time inventory fulfillment metrics.
- 📷 **Volunteer Scanning Tools:** Mobile camera-based QR scanner (`/scan`) and expo verification booth (`/verify`) for sub-2-second kit handovers.
- ⚖️ **Mandatory Legal Compliance Pages:** Terms & Conditions, Privacy Policy, Refund Policy, Shipping Policy, and Contact Us.
- 🎨 **Dynamic Dark / Light Themes:** Persisted theme switcher with tailored gradients and glassmorphism.

---

## 📄 Complete Route Map

| URL Path | Route File | Purpose |
|---|---|---|
| `/` | `src/routes/index.tsx` | Landing page with Hero, Countdown, Highlights & Categories |
| `/about` | `src/routes/about.tsx` | Organization mission, causes, and leadership |
| `/event` | `src/routes/event.tsx` | Multi-city race breakdown (Chennai, Bengaluru, Salem) |
| `/event-info` | `src/routes/event-info.tsx` | Timeline, bib pickup expo details, and rules |
| `/register` | `src/routes/register.tsx` | Multi-step registration wizard with DOB verification |
| `/checkout-summary` | `src/routes/checkout-summary.tsx` | Order summary & Razorpay payment trigger |
| `/status/success` | `src/routes/status.success.tsx` | **Official Runner Pass & Kit Voucher** with QR code & PDF download |
| `/status/failure` | `src/routes/status.failure.tsx` | Payment failure recovery & retry options |
| `/admin` | `src/routes/admin.tsx` | **Admin Dashboard** (Players, T-Shirts, Reports, CRM, WhatsApp) |
| `/scan` | `src/routes/scan.tsx` | Camera-based volunteer QR scanner for expo kit distribution |
| `/verify` | `src/routes/verify.tsx` | Manual expo verification & gate check-in console |
| `/certificates` | `src/routes/certificates.tsx` | Finisher certificate search & download |
| `/gallery` | `src/routes/gallery.tsx` | High-resolution race photography gallery |
| `/contact` | `src/routes/contact.tsx` | Inquiries form & venue interactive map |
| `/terms-and-conditions` | `src/routes/terms-and-conditions.tsx` | Mandatory Razorpay Terms & Conditions |
| `/privacy-policy` | `src/routes/privacy-policy.tsx` | Mandatory DPDP-compliant Privacy Policy |
| `/refund-policy` | `src/routes/refund-policy.tsx` | Mandatory Refund & Cancellation Policy |
| `/shipping-policy` | `src/routes/shipping-policy.tsx` | Mandatory Expo Kit Pickup & Shipping Policy |
| `/contact-us` | `src/routes/contact-us.tsx` | Mandatory Corporate Nodal Officer & Contact Details |

---

## 🛠️ Technology Stack

| Layer | Tooling |
|---|---|
| **Framework** | [TanStack Start](https://tanstack.com/start) (React 19 + SSR) |
| **Routing** | [TanStack Router](https://tanstack.com/router) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **Components** | [Radix UI](https://www.radix-ui.com/) + [shadcn/ui](https://ui.shadcn.com/) |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Forms** | [Zod](https://zod.dev/) + React Hook Form |
| **Charts** | [Recharts](https://recharts.org/) |
| **Bundler & Server** | [Vite](https://vitejs.dev/) + [Nitro](https://nitro.build/) |

---

## 💻 Development Commands

```bash
# Install dependencies
npm install

# Start local development server (port 8080)
npm run dev

# Full production build (validates route trees, client bundle, and SSR server)
npm run build

# Preview production build locally
npm run preview
```

---

## 🔐 Environment Variables

Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000
```
