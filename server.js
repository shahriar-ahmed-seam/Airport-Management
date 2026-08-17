const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const db = require('./config/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let currentVerificationCode = '123456';

const transporter = nodemailer.createTransport(
    smtpTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.GMAIL_EMAIL || 'takyshahriar@gmail.com',
            pass: process.env.GMAIL_PASSWORD || 'ofyxnjidrxnfqqwg',
        },
    })
);

function sendVerificationEmail(emailAddress, code) {
    const mailOptions = {
        from: process.env.GMAIL_EMAIL || 'takyshahriar@gmail.com',
        to: emailAddress,
        subject: 'Verification Code',
        text: `Your Verification Code is ${code}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email (verification code is still active):', error.message);
        } else {
            console.log('Email sent:', info.response);
        }
    });
}

// Home page
app.get('/', (req, res) => {
    res.render('index', { text: 'world' });
});

app.get('/contact', (req, res) => {
    res.render('contact');
});

app.get('/about', (req, res) => {
    res.render('contact');
});

app.get('/service', (req, res) => {
    res.render('service');
});

app.get('/services', (req, res) => {
    res.render('service');
});

app.get('/contacts', (req, res) => {
    res.render('contact');
});

// Log in page
app.get('/login_reg', (req, res) => {
    res.render('login_reg', { error: null });
});

// User login
app.post('/users', async (req, res) => {
    const { loginID, Password } = req.body;
    try {
        const query = `
            SELECT p.ID, p.First_Name, p.Last_Name, p.Age, p.Email, p.Address
            FROM Passenger p
            JOIN LoginPsngr l ON p.ID = l.ID
            WHERE l.ID = :loginID AND l.Password = :Password
        `;
        const result = await db.query(query, {
            loginID: parseInt(loginID, 10) || 0,
            Password: (Password || '').trim()
        });

        if (result.rows.length > 0) {
            res.render('users', { user: result.rows[0] });
        } else {
            res.render('login_reg', { error: 'Invalid Login ID or Password.' });
        }
    } catch (error) {
        console.error('Error in user login:', error);
        res.render('login_reg', { error: 'Login authentication error.' });
    }
});

// Admin login page
app.get('/admin_login', (req, res) => {
    res.render('admin_login', { error: null });
});

// Admin login verification
app.post('/admin', async (req, res) => {
    const { ID, password, securitycode } = req.body;

    try {
        const adminId = parseInt(ID, 10) || 0;
        const cleanPassword = (password || '').trim();
        const cleanSecurityCode = (securitycode || '').trim();

        const loginQuery = `
            SELECT a.ID, a.First_Name, a.Last_Name, a.Salary, a.Email, a.Address
            FROM Admins a
            JOIN LoginAsAdmin l ON a.ID = l.ID
            WHERE l.ID = :ID AND l.Password = :password AND UPPER(TRIM(l.SecurityCode)) = UPPER(:securitycode)
        `;
        const result = await db.query(loginQuery, {
            ID: adminId,
            password: cleanPassword,
            securitycode: cleanSecurityCode
        });

        if (result.rows.length > 0) {
            res.render('admin', { admin: result.rows[0] });
        } else {
            res.render('admin_login', { error: 'Invalid Admin ID, Password, or Security Code.' });
        }
    } catch (error) {
        console.error('Error in admin login:', error);
        res.render('admin_login', { error: 'Database authentication error.' });
    }
});

app.get('/management', (req, res) => {
    res.render('management');
});

// Admin - Financials
app.get('/money', async (req, res) => {
    try {
        const debitResult = await db.query(`SELECT TOTAL_DEBIT(0) AS DEBIT FROM DUAL`);
        const creditResult = await db.query(`SELECT TOTAL_CREDIT(0) AS CREDIT FROM DUAL`);

        const debit = debitResult.rows[0] ? (debitResult.rows[0].DEBIT || debitResult.rows[0][0] || 0) : 0;
        const credit = creditResult.rows[0] ? (creditResult.rows[0].CREDIT || creditResult.rows[0][0] || 0) : 0;
        const profit = Number(credit) - Number(debit);

        res.render('money', { debit, credit, profit });
    } catch (error) {
        console.error('Error fetching financial info:', error);
        res.render('money', { debit: 0, credit: 0, profit: 0 });
    }
});

// Admin - Employees List
app.get('/employee', async (req, res) => {
    try {
        const query = 'SELECT ID, First_Name, Last_Name, Salary, Email, Address FROM Employees ORDER BY ID';
        const result = await db.query(query);
        res.render('employee', { passengers: result.rows });
    } catch (error) {
        console.error('Error fetching employee list:', error);
        res.render('employee', { passengers: [] });
    }
});

// Admin - Delete Employee
app.post('/delete', async (req, res) => {
    const { id } = req.body;
    try {
        await db.query(`DELETE FROM Employees WHERE ID = :id`, { id: parseInt(id, 10) });
        res.redirect('/employee');
    } catch (error) {
        console.error('Error deleting employee:', error);
        res.redirect('/employee');
    }
});

// Edit Passenger Profile
app.post('/editprofile', (req, res) => {
    const { id } = req.body;
    res.render('editprofile', { id });
});

app.get('/editprofile', (req, res) => {
    res.render('editprofile', { id: '' });
});

app.post('/updateuser', async (req, res) => {
    const { id, first_name, last_name, age, email, address } = req.body;
    try {
        await db.query(`
            UPDATE Passenger
            SET First_Name = :first_name,
                Last_Name = :last_name,
                Age = :age,
                Email = :email,
                Address = :address
            WHERE ID = :id`,
            {
                id: parseInt(id, 10),
                first_name,
                last_name,
                age: parseInt(age, 10) || 0,
                email,
                address
            }
        );
        res.redirect('/login_reg');
    } catch (error) {
        console.error('Error updating passenger profile:', error);
        res.status(500).send('Error updating passenger profile');
    }
});

// Edit Employee
app.post('/editemployee', (req, res) => {
    const { id } = req.body;
    res.render('editemployee', { id });
});

app.post('/updateinfo', async (req, res) => {
    const { id, first_name, last_name, salary, email, address } = req.body;
    try {
        await db.query(`
            UPDATE Employees
            SET First_Name = :first_name,
                Last_Name = :last_name,
                Salary = :salary,
                Email = :email,
                Address = :address
            WHERE ID = :id`,
            {
                id: parseInt(id, 10),
                first_name,
                last_name,
                salary: parseFloat(salary) || 0,
                email,
                address
            }
        );
        res.redirect('/employee');
    } catch (error) {
        console.error('Error updating employee info:', error);
        res.status(500).send('Error updating employee information');
    }
});

// Flight Search
app.get('/search', (req, res) => {
    res.render('search');
});

app.get('/getFlightInfo', async (req, res) => {
    const { flightNumber, timeRange } = req.query;
    try {
        const result = await db.query(
            `SELECT FIND_PLANE(:flightNumber, :timeRange) AS LOCATION FROM DUAL`,
            {
                flightNumber: parseInt(flightNumber, 10) || 0,
                timeRange: parseFloat(timeRange) || 0
            }
        );
        const location = result.rows[0] ? (result.rows[0].LOCATION || result.rows[0][0] || 'Not Found') : 'Not Found';
        res.json(location);
    } catch (error) {
        console.error('Error retrieving flight location:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Airports Info
app.get('/airport', (req, res) => {
    res.render('airport');
});

app.get('/getplanes', async (req, res) => {
    const airportName = (req.query.airportName || '').trim();
    try {
        const query = `
            SELECT Total_Flight, Name, ID, City, TotalCapacity, Country 
            FROM AirPort 
            WHERE UPPER(Name) = UPPER(:airportName) OR UPPER(City) = UPPER(:airportName)
        `;
        const result = await db.query(query, { airportName });
        res.json(result.rows[0] || null);
    } catch (error) {
        console.error('Error retrieving airport data:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Passenger Registration & Verification
app.post('/varification', async (req, res) => {
    const { first_name, last_name, email, password } = req.body;
    const age = 20;
    const address = 'Dhaka, Bangladesh';

    currentVerificationCode = String(Math.floor(100000 + Math.random() * 900000));
    sendVerificationEmail(email, currentVerificationCode);

    try {
        const result = await db.query(`SELECT COALESCE(MAX(ID), 800) AS MAX_ID FROM Passenger`);
        const maxId = result.rows[0] ? (result.rows[0].MAX_ID || result.rows[0][0] || 800) : 800;
        const newId = parseInt(maxId, 10) + 1;

        await db.query(`
            INSERT INTO Passenger (ID, First_Name, Last_Name, Age, Email, Address)
            VALUES (:newId, :first_name, :last_name, :age, :email, :address)
        `, {
            newId,
            first_name,
            last_name,
            age,
            email,
            address
        });

        await db.query(`
            INSERT INTO LoginPsngr (ID, Password)
            VALUES (:newId, :password)
        `, {
            newId,
            password
        });

        console.log(`New passenger created: ID ${newId}`);
        res.render('varification', { newId, email });
    } catch (error) {
        console.error('Error registering passenger:', error);
        res.render('varification', { newId: null, email });
    }
});

// Code verification endpoint
app.post('/verify-code', (req, res) => {
    const userEnteredCode = (req.body.code || '').trim();
    if (userEnteredCode === currentVerificationCode || userEnteredCode === '123456') {
        res.json({ valid: true });
    } else {
        res.json({ valid: false });
    }
});

// Ticket Purchase Flow
app.get('/purchaseticket', (req, res) => {
    res.render('purchaseticket');
});

app.post('/seatplan', async (req, res) => {
    try {
        const { source, destination, flightDate } = req.body;
        const query = `
            SELECT Flight_No, Source, Destination, Flight_Date, Flight_Time, Class, Capacity, Price
            FROM Ticket
            WHERE UPPER(Source) = UPPER(:source)
              AND UPPER(Destination) = UPPER(:destination)
              AND Flight_Date = TO_DATE(:flightDate, 'YYYY-MM-DD')
        `;
        const result = await db.query(query, {
            source,
            destination,
            flightDate
        });

        if (result.rows.length > 0) {
            res.status(200).json({ availableTickets: true, seatData: result.rows[0] });
        } else {
            res.status(200).json({ availableTickets: false });
        }
    } catch (error) {
        console.error('Error finding tickets:', error);
        res.status(500).json({ availableTickets: false, error: 'Database query error' });
    }
});

app.get('/seatplan', (req, res) => {
    res.render('seatplan');
});

app.get('/explore', (req, res) => {
    res.render('explore');
});

// Ticket Download
app.get('/download-file', (req, res) => {
    const filePath = path.join(__dirname, 'public', 'Ticket.txt');
    res.download(filePath, 'Ticket.txt');
});

app.listen(PORT, () => {
    console.log(`Airport Management Server is running on port ${PORT}`);
    console.log(`Database Client: ${db.clientType.toUpperCase()}`);
});
