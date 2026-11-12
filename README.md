# 🏃‍♂️ Infinity Marathon 2027 – Run Beyond Limits!

[![GitHub Repository](https://img.shields.io/badge/GitHub-JeevananthanV%2Fmarathon__final-orange?style=for-the-badge&logo=github)](https://github.com/JeevananthanV/marathon_final)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![React 19](https://img.shields.io/badge/Frontend-React%2019%20%7C%20Vite-61dafb?style=for-the-badge&logo=react)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-339933?style=for-the-badge&logo=nodedotjs)](https://nodejs.org)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL%20%7C%20PGlite-4169E1?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)

> An enterprise-grade, multi-city marathon event registration and management platform for **Infinity Marathon 2027 – Run Beyond Limits!** featuring **12 iconic Indian cities**, dynamic category tier pricing (3K, 5K, 10K), digital BIB generation, QR ticketing, and a comprehensive real-time Admin Operations Suite.

---

## 📅 12-City Race Calendar & Tier Pricing (May 2027)

All races feature **3K Fun Run**, **5K Fitness Run**, and **10K Challenge Run** categories with automated city-tier pricing:

| # | Date & Day | City / Region | 3K Fee | 5K Fee | 10K Fee | Inclusions |
| :-: | :--- | :--- | :-: | :-: | :-: | :--- |
| **1** | 1 May 2027 (Saturday) | 📍 **Vadodara** | ₹399 | ₹599 | ₹799 | Timing chip BIB, Dry-fit Tee, Finisher Medal, Breakfast |
| **2** | 1 May 2027 (Saturday) | 📍 **Chennai** | ₹449 | ₹649 | ₹849 | Timing chip BIB, Dry-fit Tee, Finisher Medal, Breakfast |
| **3** | 2 May 2027 (Sunday) | 📍 **Mumbai** | ₹499 | ₹699 | ₹899 | Timing chip BIB, Dry-fit Tee, Finisher Medal, Breakfast |
| **4** | 2 May 2027 (Sunday) | 📍 **Kolkata** | ₹399 | ₹599 | ₹799 | Timing chip BIB, Dry-fit Tee, Finisher Medal, Breakfast |
| **5** | 9 May 2027 (Sunday) | 📍 **Surat** | ₹399 | ₹599 | ₹799 | Timing chip BIB, Dry-fit Tee, Finisher Medal, Breakfast |
| **6** | 9 May 2027 (Sunday) | 📍 **Delhi** | ₹499 | ₹699 | ₹899 | Timing chip BIB, Dry-fit Tee, Finisher Medal, Breakfast |
| **7** | 16 May 2027 (Sunday) | 📍 **Bengaluru** | ₹499 | ₹699 | ₹899 | Timing chip BIB, Dry-fit Tee, Finisher Medal, Breakfast |
| **8** | 16 May 2027 (Sunday) | 📍 **Jaipur** | ₹399 | ₹599 | ₹799 | Timing chip BIB, Dry-fit Tee, Finisher Medal, Breakfast |
| **9** | 23 May 2027 (Sunday) | 📍 **Hyderabad** | ₹449 | ₹649 | ₹849 | Timing chip BIB, Dry-fit Tee, Finisher Medal, Breakfast |
| **10** | 23 May 2027 (Sunday) | 📍 **Pune** | ₹449 | ₹649 | ₹849 | Timing chip BIB, Dry-fit Tee, Finisher Medal, Breakfast |
| **11** | 30 May 2027 (Sunday) | 📍 **Goa** | ₹499 | ₹699 | ₹899 | Timing chip BIB, Dry-fit Tee, Finisher Medal, Breakfast |
| **12** | 30 May 2027 (Sunday) | 📍 **Ahmedabad** | ₹399 | ₹599 | ₹799 | Timing chip BIB, Dry-fit Tee, Finisher Medal, Breakfast |

---

## ✨ Platform Features

### 1. 🎽 Registration & Dynamic City Checkout
- **Instant City-Based Fee Computation**: Automatic calculation of registration fee based on selected city tier and distance category (3K, 5K, 10K).
- **Dry-Fit T-Shirt Sizing**: Real-time inventory tracking across sizes (`XS`, `S`, `M`, `L`, `XL`, `2XL`).
- **Emergency Contacts & Medical Info**: Runner safety metadata collected during checkout.

### 2. 🎟️ Digital BIB & QR Pass
- **Automated BIB Allocation**: Unique bib generation (e.g. `IM-BLR-10K-1042`).
- **Scannable QR Ticket**: Mobile-friendly digital ticket for rapid volunteer kit collection booth verification.

### 3. 🔐 Admin Operations Console
- **Analytics & Revenues**: Real-time counts of total registrations, confirmed revenues, and city breakdowns.
- **Participant Manifest**: Search by BIB number, runner name, category, or city.
- **Kit Distribution Logistics**: 1-click toggle for T-shirt and expo kit collection.
- **Official Finisher Certificates**: Digital certificate generation and verification.

---

## 🛠️ Architecture & Local Setup

- **Frontend**: React 19, Vite, Tailwind CSS, Lucide Icons (`http://localhost:5175`)
- **Backend**: Node.js, Express, PostgreSQL / PGlite (`http://localhost:5002`)

### Running Locally
```bash
# Frontend
cd marathon_final/frontend
npm install
npm run dev -- --port 5175

# Backend
cd marathon_final/backend
npm install
node server.js
```

---

## 👤 Author & Repository

- **Repository**: [https://github.com/JeevananthanV/marathon_final](https://github.com/JeevananthanV/marathon_final)
- **Author**: Jeevananthan V ([@JeevananthanV](https://github.com/JeevananthanV))
