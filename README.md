# Loan Tracker

A simple loan tracking app built with React and Vite. It helps manage customers, loans, payment schedules, and penalties with a Supabase backend.

Features

- Add and manage customers
- Create loans and payment schedules
- Record payments and track outstanding balances
- Apply penalties and view loan details
- Basic authentication and an admin panel

Quick Start

1. Install dependencies: `npm install`
2. Run the dev server: `npm run dev`
3. Build for production: `npm run build`

Configuration

- This project uses Supabase for backend services. Update your Supabase URL and keys in `src/services/supabaseClient.js` or an environment file.
- If a `.env.example` exists, copy it to `.env` and set your variables.

Tech Stack

- React + Vite
- Supabase

Project Structure (high level)

- `src/pages` — app pages (Dashboard, Loans, Customers, etc.)
- `src/components` — shared UI components
- `src/services` — API wrappers and data services
- `src/context` — authentication context
- `src/utils` — helper functions (calculations, etc.)

Contributing

- Open an issue or submit a pull request with improvements or fixes.

License

- MIT (choose your preferred license)
