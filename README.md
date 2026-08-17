# Airport Management System

A web application developed for the CSE 216 (Database Sessional) course at BUET.

This project is built using Oracle Database as the core DBMS, along with Node.js and Express for the backend web interface. It also includes PostgreSQL support for testing and local development.

---

## Academic Information

- Course: CSE 216 (Database Sessional)
- Project: Airport Management System
- Database: Oracle Database (PL/SQL)

---

## Features

### Passenger Module
- User registration with email verification code
- Login using assigned Login ID or Email
- Passenger profile page with personal info and booked tickets history
- Search available flights by source, destination, and flight date
- Interactive seat selection plan (shows booked vs available seats)
- Boarding pass / ticket download

### Admin Module
- Admin authentication with Admin ID/Email, password, and security code
- Employee management (view, update salary/information, delete records)
- Search flight/plane location using PL/SQL function (FIND_PLANE)
- View airport list and capacity
- Financial overview showing total debits, credits, and net profit

---

## Database Details (Oracle)

The database schema and business logic are written for Oracle Database:

- Table.sql: Schema definitions for Passenger, Admins, Employees, AirPlane, AirPort, Ticket, BookedSeats, and login tables.
- Function.sql: PL/SQL functions including FIND_PLANE, TOTAL_DEBIT, and TOTAL_CREDIT.
- PROCEDURE.sql: Stored procedures for flight and plane tracking.
- Trigger.sql: Triggers for logging deleted employees into ResignedEmployees table and managing admin roles.
- BasicQuery.sql: Sample queries and insert statements for initial data.
- join.sql: Relational join queries.

Note: PostgreSQL scripts are also included in the `database/postgres/` folder for running and testing the application locally without an Oracle instance.

---

## Project Structure

```
Airport-Management/
├── config/
│   └── db.js                 # Database connection abstraction (Oracle / PostgreSQL)
├── database/
│   ├── oracle/               # Oracle SQL files (Primary)
│   │   ├── Table.sql
│   │   ├── Function.sql
│   │   ├── PROCEDURE.sql
│   │   ├── Trigger.sql
│   │   ├── BasicQuery.sql
│   │   └── join.sql
│   └── postgres/             # PostgreSQL files (for testing)
│       ├── 01_tables.sql
│       ├── 02_functions_and_triggers.sql
│       └── 03_seed.sql
├── public/                   # CSS, client JS, images, ticket download
├── scripts/
│   └── init_postgres.js      # Script to initialize PostgreSQL database
├── views/                    # EJS views
├── .env.example
├── package.json
├── server.js                 # Main server file
├── Table.sql
├── Function.sql
├── PROCEDURE.sql
├── Trigger.sql
├── BasicQuery.sql
└── join.sql
```

---

## How to Run

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Create a `.env` file in the root directory (refer to `.env.example`):

```env
PORT=3000

# Set DB_CLIENT to 'oracle' or 'postgres'
DB_CLIENT=oracle

# Oracle Database Configuration
ORACLE_USER=Airport_Management_System
ORACLE_PASSWORD=your_oracle_password
ORACLE_CONNECT_STRING=localhost:1521/XEPDB1

# PostgreSQL Configuration (if running on PostgreSQL)
PGHOST=localhost
PGPORT=5432
PGDATABASE=airport_db
PGUSER=postgres
PGPASSWORD=your_postgres_password

# Email configuration
GMAIL_EMAIL=your_email@gmail.com
GMAIL_PASSWORD=your_app_password
```

### 3. Running with Oracle Database

1. Open SQL Developer, SQL*Plus, or any Oracle client.
2. Run the SQL scripts in this order:
   - Table.sql
   - Function.sql
   - PROCEDURE.sql
   - Trigger.sql
   - BasicQuery.sql
3. Set `DB_CLIENT=oracle` in `.env`.
4. Start the server:
   ```bash
   npm start
   ```

### 4. Running with PostgreSQL (Testing)

If Oracle is not installed locally:
1. Run the database initialization script:
   ```bash
   npm run init:pg
   ```
2. Set `DB_CLIENT=postgres` in `.env`.
3. Start the server:
   ```bash
   npm run dev
   ```
4. Open `http://localhost:3000` in your browser.

---

## Sample Credentials

### Passenger Login
- Login ID or Email: `812` or `shahriarseam@gmail.com`
- Password: `123456`

### Admin Login
- Admin ID or Email: `1001`
- Password: `admin123`
- Security Code: `SEC1001`
