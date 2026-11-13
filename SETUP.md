# Infinity Marathon 2027 — Setup & Operations Guide

Welcome to the **Infinity Marathon 2027 – Run Beyond Limits!** setup guide. This document provides step-by-step instructions for running the 12-city registration engine, city-tiered fee calculator, digital bib generation, and the administration control center.

- **GitHub Repository**: [https://github.com/JeevananthanV/marathon_final](https://github.com/JeevananthanV/marathon_final)
- **Author**: Jeevananthan V

---

## 📋 System Prerequisites

- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm**: v9.0.0 or higher
- **Git**: v2.30.0 or higher

---

## 📥 1. Clone the Repository

```bash
git clone https://github.com/JeevananthanV/marathon_final.git
cd marathon_final
```

---

## ⚙️ 2. Environment Variables Configuration

### Frontend Environment (`frontend/.env`)

Create a `.env` file in `frontend/`:

```env
VITE_API_URL=http://localhost:5000
VITE_EVENT_NAME="Infinity Marathon 2027"
VITE_DEFAULT_CITY="Vadodara"
```

### Backend Environment (`backend/.env` if running standalone backend)

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5175
JWT_SECRET=infinity_marathon_jwt_secret_2027
ADMIN_USER=admin
ADMIN_PASS=infinity2027
```

---

## 📦 3. Install Dependencies

```bash
# Navigate to frontend and install
cd frontend
npm install

# If using standalone backend:
# cd ../backend
# npm install
```

---

## 🚀 4. Running the Development Server

Start the frontend development server on port **5175**:

```bash
cd frontend
npm run dev -- --port 5175
```

Open `http://localhost:5175` to interact with the platform.

---

## 🏁 5. City-Wise Fee Schedule & Race Dates

The platform features built-in validation for 12 cities and dynamic pricing rules:

| City | Date | 3K Run | 5K Run | 10K Run |
|---|---|:---:|:---:|:---:|
| **Vadodara** | 1 May (Sat) | ₹399 | ₹599 | ₹799 |
| **Chennai** | 1 May (Sat) | ₹449 | ₹649 | ₹849 |
| **Mumbai** | 2 May (Sun) | ₹499 | ₹699 | ₹899 |
| **Kolkata** | 2 May (Sun) | ₹399 | ₹599 | ₹799 |
| **Surat** | 9 May (Sun) | ₹399 | ₹599 | ₹799 |
| **Delhi** | 9 May (Sun) | ₹499 | ₹699 | ₹899 |
| **Bengaluru** | 16 May (Sun) | ₹499 | ₹699 | ₹899 |
| **Jaipur** | 16 May (Sun) | ₹399 | ₹599 | ₹799 |
| **Hyderabad** | 23 May (Sun) | ₹449 | ₹649 | ₹849 |
| **Pune** | 23 May (Sun) | ₹449 | ₹649 | ₹849 |
| **Goa** | 30 May (Sun) | ₹499 | ₹699 | ₹899 |
| **Ahmedabad** | 30 May (Sun) | ₹399 | ₹599 | ₹799 |

---

## 🔐 6. Admin Panel Access

- **Admin URL**: `http://localhost:5175/admin`
- **Username**: `admin`
- **Password**: `infinity2027`

**Admin Capabilities**:
- Live runner registration count per city and category.
- Payment approval and automated digital BIB assignment.
- T-shirt size inventory reconciliation (XS to XXL).
- CSV/Excel export of city-wise runner rosters.

---

## 🏗️ 7. Production Build

```bash
cd frontend
npm run build
```
The optimized production output will be located in `frontend/dist/`.

---

## 🛠️ Troubleshooting

- **Port in use (5175)**: Run `npm run dev -- --port 5176` or specify any open port.
- **BIB Generator font rendering**: Ensure the system has standard Unicode fonts installed or let Vite bundle the local SVG canvas assets.

