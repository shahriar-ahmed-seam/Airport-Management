# Airport Management System

[![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-blue.svg)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16%2B%20%2F%2018-blue.svg)](https://www.postgresql.org/)
[![Oracle](https://img.shields.io/badge/Oracle-Database-red.svg)](https://www.oracle.com/database/)

A full-stack Airport Management web application developed with **Node.js**, **Express**, and **EJS**, featuring **Dual-Database Architecture** with cross-engine support for both **PostgreSQL** and **Oracle Database**.

---

## Project Structure

```
Airport-Management/
├── config/
│   └── db.js                 # Dual-driver database abstraction (PostgreSQL & Oracle)
├── database/
│   ├── oracle/               # Oracle SQL DDL, PL/SQL Functions, Procedures, Triggers & Queries
│   │   ├── Table.sql
│   │   ├── Function.sql
│   │   ├── PROCEDURE.sql
│   │   ├── Trigger.sql
│   │   ├── BasicQuery.sql
│   │   └── join.sql
│   └── postgres/             # PostgreSQL DDL, PL/pgSQL Functions, Triggers & Seed data
│       ├── 01_tables.sql
│       ├── 02_functions_and_triggers.sql
│       └── 03_seed.sql
├── public/                   # Static assets (CSS, JS, Images, Downloads)
│   ├── css/
│   ├── images/
│   ├── js/
│   └── Ticket.txt
├── scripts/
│   └── init_postgres.js      # Automated PostgreSQL schema & seed initialization
├── views/                    # EJS Templates
├── .env                      # Local environment configuration
├── .env.example              # Template environment configuration
├── .gitignore
├── package.json
├── server.js                 # Application server & Express routes
├── Table.sql                 # Oracle root files preserved for submission
├── Function.sql
├── PROCEDURE.sql
├── Trigger.sql
├── BasicQuery.sql
└── join.sql
```

---

## Key Features

- **Passenger Portal**:
  - User Registration & Email Code Verification
  - Passenger Profile Dashboard & Profile Editing
  - Flight Search by Departure / Arrival / Date
  - Interactive Airplane Seat Plan Grid & Booking
  - Instant Ticket / Boarding Pass Generation & Download (`Ticket.txt`)
- **Admin Management Portal**:
  - Admin Authentication with ID, Password, and Security Code
  - Employee Management (View, Edit Salary/Info, and Delete Records)
  - Live Plane Location Radar (`FIND_PLANE`)
  - Airport Directory & Flight Capacity Search
  - Financial Overview Dashboard (`TOTAL_DEBIT`, `TOTAL_CREDIT`, `TOTAL_PROFIT`)
- **Dual-Database Architecture**:
  - Unified query interface in `config/db.js` that seamlessly translates named parameters (`:param`) to PostgreSQL parameterized queries (`$1`) or native Oracle bindings.

---

## Getting Started

### 1. Installation

Clone the repository and install dependencies:
```bash
git clone https://github.com/takyshahriar/Airport-Management.git
cd Airport-Management
npm install
```

### 2. Configure Environment (`.env`)

Create `.env` based on `.env.example`:

```env
PORT=3000
DB_CLIENT=postgres

# PostgreSQL Configuration
PGHOST=localhost
PGPORT=5432
PGDATABASE=airport_db
PGUSER=postgres
PGPASSWORD=your_postgres_password

# Oracle Configuration (Optional)
ORACLE_USER=Airport_Management_System
ORACLE_PASSWORD=123
ORACLE_CONNECT_STRING=localhost:1522/orclpdb
```

---

### 3. Running with PostgreSQL (Local Development)

1. Start your PostgreSQL service.
2. Initialize database schema, functions, triggers, and mock dataset:
   ```bash
   npm run init:pg
   ```
3. Launch the server:
   ```bash
   npm start
   # or with nodemon live reload:
   npm run dev
   ```
4. Access the portal at [http://localhost:3000](http://localhost:3000).

---

### 4. Running with Oracle Database

1. Ensure your Oracle instance (e.g. Oracle XE / 19c / 21c) is running.
2. Execute SQL scripts located in `database/oracle/` (`Table.sql`, `Function.sql`, `PROCEDURE.sql`, `Trigger.sql`, `BasicQuery.sql`).
3. Set `DB_CLIENT=oracle` in `.env`.
4. Start the server:
   ```bash
   npm start
   ```

---

## Default Test Credentials

### Passenger Login
- **Login ID**: `801` to `815` (e.g. `812`, `813`)
- **Password**: `123456`

### Admin Login
- **ID**: `1001` (or `1002`, `1006`)
- **Password**: `admin123`
- **Security Code**: `SEC1001` (or `SEC1002`, `SEC1006`)
