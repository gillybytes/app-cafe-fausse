# Café Fausse Web Application

React (Vite) frontend + Flask backend + PostgreSQL database (local) + npm

## Requirements
- macOS
- Node 18+
- npm
- Python 3.11+
- PostgreSQL (e.g., Homebrew Postgres 16)

## 1) Install and start PostgreSQL (macOS)
```bash
brew install postgresql@16
brew services start postgresql@16
createdb cafefausse
# Optionally ensure your macOS user can access Postgres:
# createuser -s $USER
```

## 2) Backend setup
Create virtual environment and install dependencies.
```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt
```

Create backend/.env from the example and set your DB URL.
```bash
cp backend/.env.example backend/.env
# edit backend/.env as needed
```

Run the backend (Flask dev server at http://localhost:5000):
```bash
# from the repo root or ./backend
export FLASK_APP=backend.app:app
export FLASK_ENV=development
flask run -p 5000
```

Health check:
```
GET http://localhost:5000/api/health -> {"status":"ok"}
```

## 3) Frontend setup
```bash
cd frontend
npm install
cp .env.example .env
# ensure VITE_API_BASE is http://localhost:5000
npm run dev
```
Dev server at: http://localhost:5173

## 4) Pages and Features (SRS Compliance)
- Home: Name, contact, hours; newsletter signup (email validated and stored).
- Menu: Static menu items and prices by category.
- Reservations: Form for date/time, guests, name, email, optional phone.
  - Backend assigns a random free table (1–30) per exact time slot.
  - Prevents overbooking via unique (time_slot, table_number).
- About Us: History, founders, commitment to quality and local sourcing.
- Gallery: Image grid with lightbox, awards, and reviews.

## 5) API
Base URL: `${VITE_API_BASE}/api`

- POST `/reservations`
  - Body: `{ timeSlot: ISOString, guests: number, name: string, email: string, phone?: string }`
  - Validates service hours:
    - Mon–Sat: 17:00–23:00, Sun: 17:00–21:00
  - On success: `{ message, tableNumber, timeSlot }`, HTTP 201
  - On full slot: `{ error }`, HTTP 409

- POST `/newsletter`
  - Body: `{ email: string, name?: string }`
  - On success: `{ message }`, HTTP 200

## 6) Configuration
- `backend/.env` (example provided):
  - `DATABASE_URL=postgresql+psycopg2://<user>:<pass>@localhost:5432/cafefausse`
  - `CORS_ORIGINS=http://localhost:5173`
  - `PORT=5000` (optional)
- `frontend/.env` (example provided):
  - `VITE_API_BASE=http://localhost:5000`

## 7) Notes
- Time slots are treated as exact timestamps (minute precision from the UI). Two reservations at the same exact minute share the same slot capacity pool.
- This project uses SQLAlchemy metadata create_all for simplicity.

## 8) Troubleshooting
- `psycopg2` build issues: ensure Postgres client tools/headers installed (Homebrew). Use `psycopg2-binary` (already included) for easier local installs.
- CORS errors: confirm backend `CORS_ORIGINS` matches frontend origin (http://localhost:5173).
- 500 errors: check backend console for stack traces and verify `DATABASE_URL`.

## 9) Deployment
- Backend: Render/Fly/Heroku-like. Set `DATABASE_URL` and run via Gunicorn (e.g., `gunicorn 'backend.app:create_app()'`).
- DB: Managed Postgres (Neon/Supabase) with the same schema.
- Frontend: `npm run build` then deploy `dist/` to Netlify/Vercel; set `VITE_API_BASE` to your backend URL and rebuild.
