# Onboarding Web App

This is a full-stack onboarding web application built with **Next.js**, **Supabase**, and **Tailwind CSS**. It allows users to create a profile, upload important documents (photo, passport, resume, I-94), and visualize job and travel history through timelines.

## Features

- User Registration & Authentication (via Supabase)
- Profile creation with file uploads
- Job history entry with auto-description enrichment
- Travel history via I-94 document parsing
- Vertical timeline visualizations for job & travel
- Dashboard to view all submitted data

## AI Tool Usage

- Auto-generates job descriptions based on job titles using a mock AI-powered map (`job_description_map.ts`)
- Supports enrichment capabilities that can be extended using LinkedIn/Glassdoor APIs or OpenAI

## 🛠️ Tech Stack

- **Frontend:** Next.js 14, Tailwind CSS, React
- **Backend/Storage:** Supabase (Auth, Database, Storage)
- **Visualization:** react-vertical-timeline-component
- **AI/Data Mapping:** Static enrichment map (extensible)

## 🛡️ Security Considerations

- File uploads are securely handled via Supabase Storage
- All user data is scoped by authenticated Supabase session
- Sensitive documents (I-94, Resume, Passport) are stored in private buckets (customizable)
- Environment variables are used to manage credentials (`.env.local` not committed)

## Setup Instructions

1. **Clone the repo:**
   ```bash
   git clone https://github.com/ananyapenuballi/onboarding_app.git
   cd onboarding_app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env.local`:**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **Run the app:**
   ```bash
   npm run dev
   ```

5. **Visit:**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📂 Project Structure

```
src/
  app/
    profile/       // Profile creation & upload
    dashboard/     // Dashboard timeline viewer
    travel/        // I-94 upload & travel timeline
  data/
    job_description_map.ts
  lib/
    supabase.ts    // Supabase client config
```

## Future Improvements

- Integrate real-time LinkedIn API to fetch job history
- Use OCR (e.g., Google Cloud Vision) to auto-extract I-94 travel entries
- Add image preview and validation for uploads
- Improve UX with toast notifications & loading spinners
