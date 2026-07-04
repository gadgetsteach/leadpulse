# LeadPulse | Business Leads Generator

LeadPulse is a premium, next-generation lead generation platform. It allows businesses to deploy dynamic, fully SEO-optimized Q&A questionnaires (styled with modern Material 3 aesthetics) and track/manage incoming customer bids in a consolidated real-time admin pipeline.

---

## Technical Stack

* **Frontend:** Angular 21, Angular SSR (Server-Side Rendering for SEO indexability), Material Design Icons, Outfit & Playfair Display fonts, Glassmorphic styling.
* **Backend:** Express.js, TypeScript, TSX (hot watch reloading), Prisma ORM.
* **Database:** PostgreSQL.

---

## Project Structure

```
├── backend/          # Express API server & Prisma Database Client
└── frontend/         # Angular 21 Client Application (SSR enabled)
```

---

## Setup Instructions

### 1. Prerequisites
Ensure you have the following installed on your local machine:
* **Node.js** (v18+ recommended)
* **PostgreSQL** database server
* **npm** or another package manager

---

### 2. Database Configuration
1. Make sure your PostgreSQL server is running (e.g., `brew services start postgresql` on macOS).
2. Connect to PostgreSQL and create a database named `fintel_db`:
   ```bash
   psql -d postgres -c "CREATE DATABASE fintel_db;"
   ```

---

### 3. Backend Setup
1. Navigate into the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables. Create a `.env` file in the `backend/` folder:
   ```env
   PORT=3000
   DATABASE_URL="postgresql://<YOUR_PG_USER>@localhost:5432/fintel_db?schema=public"
   JWT_SECRET="leadpulse_super_secret_jwt_key_2026_purple_m3"
   ```
   *(Note: Replace `<YOUR_PG_USER>` with your local database username).*
4. Run database migrations to set up the tables:
   ```bash
   npx prisma migrate dev --name init
   ```
5. Seed the database with sample forms (Home Cleaning questionnaire & Web Design proposal):
   ```bash
   npx tsx src/seed.ts
   ```
6. Start the backend development server:
   ```bash
   npm run dev
   ```
   The backend will be running at `http://localhost:3000` and watching for changes.

---

### 4. Frontend Setup
1. Open a new terminal window and navigate into the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Angular client:
   ```bash
   npm start
   ```
   The application will compile and serve at `http://localhost:4200/`.

---

## How to Test and Use the Application

Once both the backend and frontend servers are running, follow these steps to experience the complete lead capture pipeline:

### 1. Business Registration
* Open `http://localhost:4200/login` in your browser.
* Switch to **Sign Up** mode to register your business.
* Fill in your business name, email, password, and a short branding description.
* Click **Create Account**. You will be logged in and redirected to the **Seller Overview** dashboard.

### 2. Create and Customize Forms
* Go to the **Dynamic Forms** tab on the sidebar.
* Click **Create Form** to instantiate a template.
* Click **Customize Questions** to go to the drag-and-drop form builder:
  * You can add, edit, or delete questions.
  * Supported input types: Text, Textarea, Dropdowns (Select), Radio buttons, Checkboxes, Dates, and Numbers.
  * You can toggle whether a question is **Required** or optional.

### 3. Experience the Public Lead Capture Form (SEO-Friendly)
* Copy the public link for your form from the **Dynamic Forms** list (e.g. `http://localhost:4200/f/<your-form-slug>`).
* Open it in your browser (or in an incognito window).
* Experience the Material 3 slide-based Q&A wizard. 
* At the final step, fill in the customer contact details (name, email, phone) and submit the form.

### 4. Track Leads in the Pipeline Dashboard
* Return to the logged-in Admin panel (`http://localhost:4200/dashboard`).
* Under the **Overview** tab, see your stats (Total Leads, Won Leads, Conversion Rates) update instantly.
* Click on **Manage Leads** to see the pipeline:
  * Click any lead to slide out their profile drawer.
  * View their specific custom answers to your questionnaire.
  * Move their pipeline status (New, Contacted, In Progress, Won, Lost).
  * Save internal notes for follow-up history.

### 5. Forgot Password / Reset Password Flow
* Go to the Login page and click the **Forgot Password?** link next to the password field.
* Enter your registered email address and submit.
* **Testing Mechanism:** Since no mail server is configured locally, the reset link is printed directly to the **backend terminal console**. Additionally, a helpful **"Testing Mode" box** will appear on the frontend success screen with the link.
* Click the reset link to open the **Set New Password** page.
* Type a new password and submit. Once updated, you can sign in to the platform with your updated credentials.
