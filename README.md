# Airport Management System

[![Oracle Database](https://img.shields.io/badge/Oracle-Database%2019c%20%2F%2021c%20%2F%20XE-red.svg)](https://www.oracle.com/database/)
[![Course](https://img.shields.io/badge/BUET%20CSE-CSE%20216%20Database%20Sessional-blue.svg)](https://cse.buet.ac.bd/)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-lightgrey.svg)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16%2B%20(Testing)-336791.svg)](https://www.postgresql.org/)

A full-stack Airport Management web application developed for **CSE 216: Database Sessional** at **Bangladesh University of Engineering and Technology (BUET)**.

The system is built on **Oracle Database**, utilizing advanced **PL/SQL** routines, triggers, stored procedures, sequences, and relational constraints. It features a modern **Node.js / Express / EJS** web interface with a dual-database abstraction layer (Oracle Database as primary, with PostgreSQL support for lightweight local development and testing).

---

## 🏛️ Academic Context
- **Course**: CSE 216 — Database Sessional
- **Department**: Department of Computer Science and Engineering (CSE)
- **Institution**: Bangladesh University of Engineering and Technology (BUET)
- **Core DBMS**: **Oracle Database** (PL/SQL, Triggers, Functions, Procedures, Views)

---

## 🚀 Key Features

### ✈️ Passenger Portal
- **User Registration & Email Verification**: Secure registration workflow with SMTP verification codes.
- **Flexible Sign-In**: Login with either **Assigned Login ID** or **Email Address**.
- **User Profile Dashboard**: View personal details and a live list of booked tickets.
- **Flight Discovery**: Search flights by source, destination, and departure date.
- **Interactive Seat Plan**: Real-time visual seat map showing available vs. occupied seats with row/aisle layouts.
- **Boarding Pass / Ticket Download**: Direct formatted ticket download (`Ticket.txt`).

### 🛡️ Admin & Operational Management
- **Multi-Factor Admin Authentication**: Login using Admin ID / Email, Password, and unique Security Code.
- **Live Plane Location Radar (`FIND_PLANE`)**: PL/SQL function determining in-flight vs. grounded status based on departure timestamps.
- **Airport Capacity Directory**: Monitor total flights, terminal capacity, and country hubs.
- **Employee Management**: Manage personnel details, salaries, and trigger-managed administrative records.
- **Financial Analytics (`TOTAL_DEBIT`, `TOTAL_CREDIT`, `TOTAL_PROFIT`)**: Aggregates employee payroll debits vs. flight ticket revenues.

---

## 🗄️ Database Architecture (Oracle PL/SQL)

The database schema and business logic are implemented in native Oracle SQL / PL/SQL:

| File | Description |
| :--- | :--- |
| [`database/oracle/Table.sql`](database/oracle/Table.sql) | DDL schema definitions for `Passenger`, `Admins`, `Employees`, `AirPlane`, `AirPort`, `Ticket`, `BookedSeats`, and login tables with foreign keys and cascade rules. |
| [`database/oracle/Function.sql`](database/oracle/Function.sql) | PL/SQL functions: `FIND_PLANE(flightNo, timeRange)`, `TOTAL_DEBIT(dummy)`, `TOTAL_CREDIT(dummy)`. |
| [`database/oracle/PROCEDURE.sql`](database/oracle/PROCEDURE.sql) | PL/SQL Stored Procedures for plane tracking and location resolution with `OUT` parameters. |
| [`database/oracle/Trigger.sql`](database/oracle/Trigger.sql) | Triggers for audit logging (`ResignedEmployees` archive on employee deletion), automated admin provisioning (`MAKE_ADMIN`), and default credential synchronization. |
| [`database/oracle/BasicQuery.sql`](database/oracle/BasicQuery.sql) | Core DML statements and sample dataset queries. |
| [`database/oracle/join.sql`](database/oracle/join.sql) | Multi-table relational join queries for reports. |

> **Note**: For convenience and local evaluation without a running Oracle instance, equivalent PostgreSQL scripts and automated seeder scripts are provided in `database/postgres/`.

---

## 📁 Repository Structure

```
Airport-Management/
├── config/
│   └── db.js                 # Dual-database abstraction driver (Oracle & PostgreSQL)
├── database/
│   ├── oracle/               # Oracle SQL & PL/SQL Source Files (Primary)
│   │   ├── Table.sql
│   │   ├── Function.sql
│   │   ├── PROCEDURE.sql
│   │   ├── Trigger.sql
│   │   ├── BasicQuery.sql
│   │   └── join.sql
│   └── postgres/             # PostgreSQL DDL & Seed (for temporary local testing)
│       ├── 01_tables.sql
│       ├── 02_functions_and_triggers.sql
│       └── 03_seed.sql
├── public/                   # Static assets (CSS, JS, Images, Boarding pass)
│   ├── css/
│   ├── images/
│   ├── js/
│   └── Ticket.txt
├── scripts/
│   └── init_postgres.js      # Automated test database initializer
├── views/                    # EJS dynamic UI templates
├── .env.example              # Environment configuration template
├── package.json
├── server.js                 # Express application & API routing
├── Table.sql                 # Oracle root submission copies
├── Function.sql
├── PROCEDURE.sql
├── Trigger.sql
├── BasicQuery.sql
└── join.sql
```

---

## ⚙️ Setup & Execution

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/shahriar-ahmed-seam/Airport-Management.git
cd Airport-Management
npm install
```

### 2. Configure Environment (`.env`)
Create a `.env` file in the project root:

```env
PORT=3000

# Set Database Client: 'oracle' (Primary) or 'postgres' (Testing)
DB_CLIENT=oracle

# ------------------------------------
# Oracle Database Configuration (Primary)
# ------------------------------------
ORACLE_USER=Airport_Management_System
ORACLE_PASSWORD=your_oracle_password
ORACLE_CONNECT_STRING=localhost:1521/XEPDB1

# ------------------------------------
# PostgreSQL Configuration (Testing)
# ------------------------------------
PGHOST=localhost
PGPORT=5432
PGDATABASE=airport_db
PGUSER=postgres
PGPASSWORD=your_postgres_password

# Email Verification (Gmail SMTP)
GMAIL_EMAIL=your_email@gmail.com
GMAIL_PASSWORD=your_app_password
```

---

### 3. Running with Oracle Database (Primary)

1. Connect to your Oracle Database instance (Oracle XE, 19c, or 21c) using **SQL*Plus**, **SQL Developer**, or **DBeaver**.
2. Run the Oracle scripts in order:
   ```sql
   @database/oracle/Table.sql
   @database/oracle/Function.sql
   @database/oracle/PROCEDURE.sql
   @database/oracle/Trigger.sql
   @database/oracle/BasicQuery.sql
   ```
3. Set `DB_CLIENT=oracle` in `.env`.
4. Start the application:
   ```bash
   npm start
   # or for live reload:
   npm run dev
   ```

---

### 4. Running with PostgreSQL (Local Testing Option)

If Oracle Database is not installed on your current machine, you can run on PostgreSQL:

1. Initialize the PostgreSQL schema and seed dataset with one command:
   ```bash
   npm run init:pg
   ```
2. Set `DB_CLIENT=postgres` in `.env`.
3. Start the application:
   ```bash
   npm run dev
   ```
4. Access the web app at `http://localhost:3000`.

---

## 🔑 Default Test Credentials

### Passenger Login
- **Login ID / Email**: `812` (or `shahriarseam@gmail.com` / `801`-`815`)
- **Password**: `123456`

### Admin Login
- **Admin ID / Email**: `1001` (or `1002`, `1006`)
- **Password**: `admin123`
- **Security Code**: `SEC1001` (or `SEC1002`, `SEC1006`)

---

## 👥 Authors
Developed as part of the **CSE 216: Database Sessional** course curriculum at **BUET**.
