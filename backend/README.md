Backend for Trans-Logic

1. Ensure MySQL is running locally and create the database/tables:

   - Edit `backend/.env` or set environment variables:
     - `PORT=8000`
     - `DB_HOST=localhost`
     - `DB_PORT=3306`
     - `DB_NAME=translogic`
     - `DB_USER=root`
     - `DB_PASSWORD=root`

   - Run the SQL in `backend/init.sql` to create the `translogic` DB and `trucks` table.

2. Install & start

```powershell
cd backend
npm install
npm run start
```

The server listens on `PORT` (default 8000) and exposes:

- `POST /providers/trucks` — create a new truck (JSON payload).
