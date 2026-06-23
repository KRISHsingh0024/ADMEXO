# ADEMXO Lead Generation System Setup Guide

This guide will walk you through setting up the integrations for **Google Sheets database** and **SMTP email automation**.

---

## 📊 1. Google Sheets Setup

The system writes new leads into a Google Sheet using a Google Cloud Service Account.

### Step 1: Create a Google Cloud Project & Enable Sheets API
1. Open the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project (e.g., `ademxo-lead-gen`).
3. Search for the **Google Sheets API** in the search bar and click **Enable**.

### Step 2: Create a Service Account
1. In the left navigation, click on **IAM & Admin** > **Service Accounts**.
2. Click **Create Service Account** at the top.
3. Fill in the service account details (e.g., Name: `sheets-writer`) and click **Create and Continue**.
4. Skip role assignment and click **Done**.

### Step 3: Generate a Private Key (JSON)
1. In the list of Service Accounts, click on the email address of the account you just created.
2. Go to the **Keys** tab.
3. Click **Add Key** > **Create New Key**.
4. Select **JSON** and click **Create**. A file will automatically download to your computer.

### Step 4: Share your Google Sheet
1. Open the Google Sheet where you want leads stored (or create a new one).
2. Copy the **Service Account Email** (e.g. `sheets-writer@project.iam.gserviceaccount.com`).
3. Click **Share** in the top right corner of your Google Sheet.
4. Paste the email, grant it **Editor** permissions, and click **Share**.
5. Copy the **Spreadsheet ID** from the URL:
   `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`

### Step 5: Update `.env.local`
Paste the following values from your downloaded JSON file into your `.env.local` file:
- `GOOGLE_SERVICE_ACCOUNT_EMAIL` = `client_email` from JSON
- `GOOGLE_PRIVATE_KEY` = `private_key` from JSON (Ensure newlines are escaped as `\n` in the string value)
- `GOOGLE_SHEET_ID` = The Spreadsheet ID from Step 4.

---

## 📧 2. SMTP/Email Setup

The system automatically sends a summary prospectus email back to the contact person.

### Option A: Gmail (Recommended for testing/light use)
If using a standard Gmail account:
1. Log in to your Google Account and go to **Security**.
2. Under **How you sign in to Google**, ensure **2-Step Verification** is turned ON.
3. Search for **App Passwords** in the search bar or go to [App Passwords page](https://myaccount.google.com/apppasswords).
4. Enter an App Name (e.g., `ADEMXO Lead Gen`) and click **Create**.
5. Copy the **16-character password** displayed.
6. Configure `.env.local`:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASSWORD=your-16-char-app-password
   SMTP_FROM_NAME=ADEMXO
   SMTP_FROM_EMAIL=your-email@gmail.com
   ```

### Option B: Custom SMTP / Third-Party Providers (SendGrid, Mailgun, AWS SES)
Enter your provider settings in `.env.local`:
```env
SMTP_HOST=smtp.yourprovider.com
SMTP_PORT=587 (or 465 for SSL)
SMTP_USER=your-smtp-username
SMTP_PASSWORD=your-smtp-password
SMTP_FROM_NAME=ADEMXO
SMTP_FROM_EMAIL=inquiries@yourdomain.com
```

---

## ⚙️ 3. Environment Variable Checklist

Create a `.env.local` file in the root directory (based on `.env.example`) and fill it out:

```env
# Google Sheets
GOOGLE_SERVICE_ACCOUNT_EMAIL="your-service-account-email@project-id.iam.gserviceaccount.com"
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDd...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID="your-google-sheet-id"

# SMTP Settings
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
SMTP_FROM_NAME="ADEMXO"
SMTP_FROM_EMAIL="your-email@gmail.com"
```

*Note: Make sure `.env.local` is never committed to GitHub (it is already added to `.gitignore`).*

---

## 🏃 4. Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the dev server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000) to see the live site.
