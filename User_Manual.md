# 🏃 Run Beyond Limits 2026 — User & Operations Manual
*A complete guide for Runners, Expo Volunteers, and Event Administrators*

---

## 📖 Welcome

**Run Beyond Limits 2026** is an integrated marathon platform spanning **Chennai**, **Bengaluru**, and **Salem**. This manual covers everything you need to know, whether you are a runner registering for the race, an expo volunteer scanning participant passes, or an event administrator managing registrations.

* **Website Link:** [http://localhost:8080](http://localhost:8080)
* **Admin Portal:** [http://localhost:8080/admin](http://localhost:8080/admin)
* **Volunteer Scanner:** [http://localhost:8080/scan](http://localhost:8080/scan)
* **Verification Booth:** [http://localhost:8080/verify](http://localhost:8080/verify)

---

## 🏃 PART 1: FOR RUNNERS (How to Register & Get Your Pass)

### Step 1: Open the Registration Form
1. Go to the website and click **"Register Now"** on the navigation bar or hero banner.
2. Direct link: [http://localhost:8080/register](http://localhost:8080/register).

### Step 2: Fill in Your Personal & Medical Details
1. **Runner Details:** Enter your Full Legal Name, Email, and 10-digit Phone Number.
2. **Date of Birth & Age Verification:** Select your birth date. The system automatically confirms that you meet the age requirements for your selected category (e.g., minimum 18 years for the 21.1K Half Marathon).
3. **Emergency Contact:** Enter the name and mobile number of a family member or friend.
4. **Medical Declaration:** Confirm your physical fitness and accept the standard marathon medical liability waiver.

### Step 3: Choose Your City, Race & T-Shirt Size
1. **Select Host City:** Choose between **Chennai** (Marina Beach), **Bengaluru** (Kanteerava Stadium), or **Salem** (Mahatma Gandhi Stadium).
2. **Select Distance:**
   * **5K Fun Run (₹499):** Perfect for families, beginners, and fitness enthusiasts.
   * **10K Challenge (₹799):** Timed run for passionate runners.
   * **21.1K Half Marathon (₹999):** Premier timed endurance race with timing chip.
3. **Choose Dry-Fit T-Shirt Size:** Select your size (`XS`, `S`, `M`, `L`, `XL`, `XXL`). Your official event dry-fit t-shirt will be packed accordingly.

### Step 4: Pay Securely via Razorpay
1. Click **"Proceed to Payment"**.
2. A secure **Razorpay Checkout modal** will open.
3. Choose your preferred payment method:
   * **UPI (Recommended):** Google Pay, PhonePe, Paytm, or enter your UPI ID.
   * **Cards:** Any Visa, MasterCard, RuPay, or Maestro Credit/Debit card.
   * **NetBanking:** Over 50+ supported Indian banks.
   * **Wallets:** Amazon Pay, Mobikwik, etc.
4. Complete the authorization (UPI PIN / OTP).

### Step 5: Your Official Runner Pass & Kit Voucher
Once payment is approved, you will be redirected immediately to your **Official Runner Pass**:
* **Your BIB Number** (e.g., `CHE-10K-0001`) is prominently displayed.
* **Scannable QR Code:** A digital pass unique to your registration.
* **Kit Inclusions Voucher:** Confirming your T-shirt size and event kit pickup.
* **Action Buttons:**
  * **"Download Official Ticket (PDF)":** Saves a printable A4 official pass to your phone or computer.
  * **"Print Entry Pass":** Opens your browser's print dialog directly.
  * **"Add to Calendar (.ICS)":** Adds the race start time (05:00 AM) to your Google Calendar or Apple Calendar.

### Step 6: Expo Kit Collection (What to Bring)
1. Visit the Marathon Expo 1–2 days before race day.
2. Show your **WhatsApp confirmation pass** or **printed PDF ticket** on your phone.
3. The volunteer will scan your QR code and hand over your race kit containing:
   * Official BIB with attached RFID Timing Chip
   * Run Beyond Limits Event Dry-Fit Running Tee
   * Official Marathon Drawstring Kit Bag
   * Energy gel & electrolyte sachet
   * Finisher Medal Claim Voucher

---

## 📷 PART 2: FOR EXPO VOLUNTEERS (Scanning & Kit Handover)

Volunteers stationed at the kit distribution counters use the fast-track scanning tools to ensure zero waiting lines.

### Using the QR Scanner (`/scan`)
1. On your smartphone or tablet, open [http://localhost:8080/scan](http://localhost:8080/scan).
2. Allow camera access.
3. Point the camera at the runner’s phone screen or printed ticket QR code.
4. The scanner instantly beeps and loads the runner’s profile:
   * **Runner Name & BIB**
   * **T-Shirt Size** (e.g., `Size L`)
   * **Kit Status** (`Pending` or `Already Collected`)
5. Tap **"Mark Kit Handed Over"**. The system updates the central database in real time.

### Using the Manual Verification Booth (`/verify`)
If a runner's phone camera is cracked or their QR code is smudged:
1. Open [http://localhost:8080/verify](http://localhost:8080/verify).
2. Type the runner’s 6-character code, BIB number, or mobile number into the search bar.
3. Verify their government photo ID matches the name on screen.
4. Tap **"Mark T-Shirt & Kit as Handed Over"** or **"Check-In Runner at Gate"**.

---

## 🔐 PART 3: FOR EVENT ADMINISTRATORS & ORGANIZERS

### 1. Logging In to the Admin Panel
1. Navigate to [http://localhost:8080/admin](http://localhost:8080/admin).
2. Enter your administrator credentials:
   * **Username:** `admin`
   * **Password:** `password123` (or `adminpass` in development)
3. Click **Sign In**.

### 2. Dashboard Overview (`Dashboard` Tab)
* **Real-time Metrics:** Total registrations, confirmed paid runners, pending payments, and gross revenue.
* **City Distribution:** Runners breakdown across Chennai, Bengaluru, and Salem.
* **Category Share:** 5K vs 10K vs 21K registrations.
* **Daily Registration Velocity:** Graph showing registrations over the last 14 days.

### 3. Managing Participants (`Players` Tab)
* **Live Search & Filters:**
  * Search instantly across runner name, email, mobile number, or BIB number.
  * Filter by **City** (All, Chennai, Bengaluru, Salem).
  * Filter by **Race** (All, 5K, 10K, 21K).
  * Filter by **Payment** (Paid vs Pending).
  * Filter by **Kit Status** (`All Kits`, `Kit Collected`, `Kit Pending`).
* **Kit Handover Status:**
  * Runners show an emerald badge **"Kit Handed"** or an amber badge **"Kit Pending"**.
  * Click the badge directly in the table to toggle kit distribution status.
* **1-Click Ticket Download:**
  * Click the emerald **Download** icon in the Actions column to download any runner's official PDF ticket pass.
* **Expand Row Details:**
  * Click the **Eye** icon next to any runner to view their full emergency contact, shipping address, pass verification code, and direct link to the verification booth.
* **Exporting Data:**
  * Click **"CSV"** or **"Excel"** in the top right to download comprehensive runner rosters, including BIBs, kit collection timestamps, and gate check-in status.

### 4. T-Shirt Inventory & Kit Fulfillment (`T-Shirts` Tab)
* **Fulfillment Progress Cards:**
  * **Total Kits:** Total runners requiring race kits.
  * **Kits Collected:** Number and percentage of kits successfully handed over at the expo.
  * **Kits Pending:** Remaining kits awaiting pickup.
* **Size Matrix:**
  * Detailed breakdown of required inventory for sizes `XS`, `S`, `M`, `L`, `XL`, and `XXL` across 5K, 10K, and 21K races.
  * Exportable T-Shirt procurement report for apparel manufacturers.

### 5. WhatsApp Automation (`WhatsApp` Tab)
* **Link WhatsApp Number:** Scan the on-screen QR code using WhatsApp on your organization’s phone.
* **Automatic Triggers:**
  * The moment a runner pays, they receive an automated WhatsApp confirmation with their BIB number, ticket pass, and reporting schedule.
  * Booth verification automatically pushes a *"Welcome to the Marathon"* WhatsApp notification.
* **Test Messaging:** Send manual test messages to any phone number to verify connectivity.

### 6. Statutory Compliance & Legal Pages
All regulatory pages are accessible directly from the footer and navigation:
* `/terms-and-conditions` — Runner rules, age eligibility, and medical disclaimers.
* `/privacy-policy` — Data protection and medical sharing guidelines.
* `/refund-policy` — Official policy on entry fee non-refundability and force majeure.
* `/shipping-policy` — Physical bib expo pickup schedule and requirements.
* `/contact-us` — Official nodal officer contacts, office address, and support desk.

---

## ❓ Frequently Asked Questions

**Q: Can a friend pick up my kit at the expo?**  
A: Yes. Your friend must present a copy of your **Official PDF Ticket Pass** (with its QR code) along with a photo of your valid Government ID.

**Q: Can an admin reissue a lost BIB?**  
A: Yes. Inside the Admin Panel under the **Players** tab, click **Edit** on the participant's row to re-allocate or correct their BIB number.

**Q: What happens if a runner's payment fails?**  
A: The order is marked as `Pending` or `Dropped`. The runner can simply return to `/register` or click their automated WhatsApp recovery link to re-attempt checkout without losing their details.
