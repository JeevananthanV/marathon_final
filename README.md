# 🏃 Run Beyond Limits 2026

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Razorpay](https://img.shields.io/badge/Razorpay-Standard_Checkout-0C2340?logo=razorpay&logoColor=white)](https://razorpay.com/)

A full-stack, enterprise-grade marathon event registration and management platform for **Run Beyond Limits 2026** — a multi-city running event held simultaneously across **Chennai, Bengaluru, and Salem**. Integrated with **Razorpay Standard Checkout**, **scannable QR ticketing**, **kit distribution logistics**, and **India Stack digital ecosystem automation**.

---

## 🔗 Quick Navigation

| Resource | URL / Path | Description |
|---|---|---|
| 🌐 **Public Website** | `http://localhost:8080/` | Public discovery, race details, and categories |
| 📝 **Registration Portal** | `http://localhost:8080/register` | Multi-step registration with DOB age check |
| 🔐 **Admin Dashboard** | `http://localhost:8080/admin` | Management suite (Dashboard, Players, T-Shirts, Reports, CRM) |
| 📷 **Volunteer QR Scanner** | `http://localhost:8080/scan` | Camera-based scanner for instant expo kit handover |
| 🔍 **Verification Booth** | `http://localhost:8080/verify` | Staff manual lookup & verify console |
| 📜 **Finisher Certificate** | `http://localhost:8080/certificates` | Search & download official certificates |

> **Admin Demo Credentials** — Username: `admin` / Password: `password123` (or `adminpass` in dev)

---

## ✨ Key Features

### 💳 1. Razorpay Payment Gateway & Checkout Flow
- **Standard Checkout Modal:** Accepts UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards, NetBanking, and Wallets.
- **Server-Side Cryptographic Verification:** Recreates and validates HMAC SHA256 signatures (`crypto.createHmac('sha256', secret)`) on the server.
- **Payment Idempotency:** Prevents duplicate charges or multiple BIB assignments if a runner refreshes the checkout.
- **Automated Order Pipeline:** Automatic transition from `Pending` → `Paid`, deterministic BIB allocation, and background automation triggers.

### 🎟️ 2. Official Runner Pass & QR Ticketing
- **Dynamic Scannable QR Code:** Instantly generated upon payment confirmation (`/status/success`), linking to the booth verification portal.
- **Printable A4 PDF Ticket:** High-resolution official entry pass generated on-demand via **PDFKit** featuring:
  - Visible BIB badge & runner full name
  - Race category (5K, 10K, Half Marathon) & event city
  - Venue address & morning reporting time (05:00 AM)
  - Selected Dry-Fit T-shirt size badge
  - Kit inclusions checklist (BIB with timing chip, T-shirt, sling bag, energy gel, medal voucher)
  - Emergency contact details and medical declaration

### 📦 3. Expo Kit & T-Shirt Distribution Management
- **Database Tracking:** Persistent columns `kitCollected`, `kitCollectedAt`, `attendeeCheckedIn`, and `checkedInAt`.
- **Admin Kit Distribution Actions:**
  - One-click toggle between `Kit Pending` (amber) and `Kit Handed` (emerald) directly inside the Participants table.
  - Dedicated **Kit Filter** (`All Kits`, `Kit Collected`, `Kit Pending`) to view remaining pickups.
  - One-click **Download Official Ticket (PDF)** button for any runner.
- **T-Shirt Fulfillment Counter:** Dashboard tab displaying live distribution progress:
  - Total Kits Required
  - Kits Handed Over count & fulfillment percentage bar
  - Kits Pending Pickup count
  - Size breakdown (XS, S, M, L, XL, XXL) across all race categories.

### 📱 4. Volunteer On-Ground Scanning Tools
- **Camera QR Scanner (`/scan`):** HTML5 video scanner that instantly reads runner QR codes from phones or printed passes.
- **Booth Verification Console (`/verify`):** Shows runner verification status, T-shirt size, kit handover buttons, and gate check-in controls.
- **Rapid Queue Throughput:** Volunteer verifies identity and marks kit handed over in under 2 seconds.

### ⚖️ 5. Mandatory Razorpay Compliance Pages
Live legal pages built to comply with Razorpay activation standards and the Indian IT Act:
- **Terms & Conditions (`/terms-and-conditions`)**: Event eligibility, non-transferability of BIBs, medical waiver, and dispute jurisdiction.
- **Privacy Policy (`/privacy-policy`)**: DPDP Act compliance, emergency data sharing with medical marshals, and data retention.
- **Refund & Cancellation Policy (`/refund-policy`)**: Clear non-refundable entry policy, force majeure event postponement terms.
- **Shipping & Delivery Policy (`/shipping-policy`)**: Expo bib pickup dates, physical handover requirements, and photo ID validation.
- **Contact Us (`/contact-us`)**: Complete nodal officer details, physical office address, support email, and emergency contact.

### 🇮🇳 6. India Digital Ecosystem Operations
- **WhatsApp Business API Gateway:** Automatic delivery of scannable QR passes and confirmation notices directly to runners' WhatsApp.
- **UPI Intent Link Recovery:** Captures dropped checkout attempts and pushes direct 1-tap PhonePe/GPay links.
- **DigiLocker KYC & Age Auditing:** Government identity DOB verification to prevent age fraud in podium prize brackets.
- **GST SAC 999692 Tax Invoicing:** Automated GST tax invoices with 18% tax breakdown (CGST 9% + SGST 9% or IGST 18%) and Section 194C corporate TDS notes.
- **Traffic Police Manifest:** Hourly wave clearance schedules for City Traffic Police route management.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | [TanStack Start](https://tanstack.com/start) (React 19 + SSR) |
| **Routing** | [TanStack Router](https://tanstack.com/router) (Type-safe file-based routing) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) with custom palette |
| **Backend Framework** | [Node.js](https://nodejs.org/) (ESM) + [Express.js](https://expressjs.com/) |
| **Database** | [PostgreSQL](https://www.postgresql.org/) (Embedded [PGlite](https://pglite.electric-sql.com/) / Native PG) |
| **Payment Gateway** | [Razorpay Standard Checkout SDK](https://razorpay.com/docs/) |
| **PDF & QR Engine** | [PDFKit](https://pdfkit.org/) + [QRCode](https://www.npmjs.com/package/qrcode) |
| **Validation & Auth** | [Zod](https://zod.dev/) + [JWT](https://jwt.io/) + [Bcrypt.js](https://www.npmjs.com/package/bcryptjs) |
| **Messaging & CRM** | Nodemailer (Gmail/Brevo), Meta WhatsApp API, Twilio SMS, Zoho CRM, Salesforce |

---

## 🏁 Race Categories & Pricing

| Category | Distance | Entry Fee (INR) | Inclusions |
|---|---|---|---|
| **Fun Run** | 5 KM | ₹499 | Timing Chip BIB, Event Dry-Fit Tee, Finisher Medal, E-Certificate, Refreshments |
| **Challenge** | 10 KM | ₹799 | Timing Chip BIB, Event Dry-Fit Tee, Finisher Medal, Hydration Support, E-Certificate |
| **Half Marathon** | 21.1 KM | ₹999 | Timing Chip BIB, Event Dry-Fit Tee, Premium Medal, Energy Gels, Timing Certificate |

**Host Cities:**
* **Chennai** — Marina Beach Promenade & Loop Road
* **Bengaluru** — Kanteerava Stadium & Cubbon Park
* **Salem** — Mahatma Gandhi Stadium & Yercaud Foothills

---

## 📡 Key REST API Routes

### Public Endpoints
```http
POST /api/v1/marathon/create-order          # Create Razorpay order for runner
POST /api/v1/marathon/verify-signature      # Cryptographically verify payment
GET  /api/v1/marathon/order-status/:id      # Fetch payment, BIB, and QR code URL
GET  /api/v1/marathon/ticket-pdf/:id        # Download Official Ticket Pass (PDF)
GET  /api/v1/marathon/ticket-data/:id       # JSON metadata + Base64 QR data URL
GET  /api/verify/:code                      # Look up runner by booth QR code
POST /api/verify/kit                        # Volunteer marks kit handed over
POST /api/verify/gate-checkin               # Volunteer marks gate check-in
GET  /api/certificate/lookup                # Search certificates by email/phone
GET  /api/certificate/download/:id          # Download official Finisher Certificate
```

### Admin Endpoints (Require Bearer Token)
```http
POST /api/admin/login                       # Admin login -> JWT token
GET  /api/admin/participants                # List all participants
PUT  /api/admin/participants/:id/kit-distribution # Update kit collection & check-in
PUT  /api/admin/participants/:id/payment    # Manual payment status update
PUT  /api/admin/participants/:id            # Edit participant details
DELETE /api/admin/participants/:id          # Delete participant record
GET  /api/admin/reports/tshirt              # T-Shirt size report breakdown
POST /api/admin/participants/:id/resend-qr  # Resend WhatsApp QR code pass
GET  /api/admin/whatsapp/status             # WhatsApp client connection status
```

---

## 🚀 Quick Start & Local Setup

### 1. Clone & Install Dependencies

```bash
# Clone the repository
git clone https://github.com/JeevananthanV/marathon_final.git
cd marathon_final

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment Variables

**`backend/.env`**:
```env
PORT=5000
BASE_URL=http://localhost:5000
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
JWT_SECRET=dev_secret_key_run_beyond_limits
ADMIN_USERNAME=admin
ADMIN_PASSWORD=adminpass
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_gmail_app_password
SMTP_FROM=your_email@gmail.com
WHATSAPP_WEB_CLIENT=false
```

**`frontend/.env`**:
```env
VITE_API_URL=http://localhost:5000
```

### 3. Run Development Servers

In terminal 1 (Backend API):
```bash
cd backend
npm run dev
# Starts backend server at http://localhost:5000
```

In terminal 2 (Frontend App):
```bash
cd frontend
npm run dev
# Starts frontend web app at http://localhost:8080
```

Open [http://localhost:8080](http://localhost:8080) to register, pay via test Razorpay, and view your ticket with QR pass!

---

## 👨‍💻 Author & Maintainer

**Jeevananthan V** — [@JeevananthanV](https://github.com/JeevananthanV)  
Project Repository: [JeevananthanV/marathon_final](https://github.com/JeevananthanV/marathon_final)
