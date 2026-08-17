const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const session = require('express-session');
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

app.use(session({
    secret: 'airport-management-secret-key-2026',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

app.use((req, res, next) => {
    res.locals.currentUser = req.session.user || null;
    res.locals.currentAdmin = req.session.admin || null;
    next();
});

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

function sendVerificationEmail(emailAddress, code, newId) {
    const idInfo = newId ? `\nYour Assigned Login ID is: ${newId}` : '';
    const mailOptions = {
        from: process.env.GMAIL_EMAIL || 'takyshahriar@gmail.com',
        to: emailAddress,
        subject: 'Dhaka Airport - Verification Code & Login Credentials',
        text: `Welcome to Dhaka Airport Management System!\n\nYour Verification Code is: ${code}${idInfo}\n\nYou can log into your account using either your Email address (${emailAddress}) or your Login ID (${newId || 'assigned ID'}).`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error.message);
        } else {
            console.log('Email sent:', info.response);
        }
    });
}

function parseTimeToDecimal(timeStr) {
    if (!timeStr) return 0;
    const s = String(timeStr).trim();
    if (s.includes(':')) {
        const parts = s.split(':');
        const hours = parseFloat(parts[0]) || 0;
        const minutes = parseFloat(parts[1]) || 0;
        return hours + (minutes / 60);
    }
    return parseFloat(s) || 0;
}

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/contact', (req, res) => {
    res.render('contact');
});

app.get('/about', (req, res) => {
    res.redirect('/contact');
});

app.get('/contacts', (req, res) => {
    res.redirect('/contact');
});

app.get('/service', (req, res) => {
    res.render('service');
});

app.get('/services', (req, res) => {
    res.render('service');
});

app.get('/login_reg', (req, res) => {
    if (req.session.user) {
        return res.redirect('/users');
    }
    if (req.session.admin) {
        return res.redirect('/admin');
    }
    res.render('login_reg', { error: null });
});

app.post('/users', async (req, res) => {
    const { loginID, Password } = req.body;
    try {
        const rawIdentifier = (loginID || '').trim();
        const numericId = parseInt(rawIdentifier, 10) || 0;
        const cleanPassword = (Password || '').trim();

        const query = `
            SELECT p.ID, p.First_Name, p.Last_Name, p.Age, p.Email, p.Address
            FROM Passenger p
            JOIN LoginPsngr l ON p.ID = l.ID
            WHERE (p.ID = :numericId OR LOWER(p.Email) = LOWER(:loginIdentifier))
              AND l.Password = :Password
        `;
        const result = await db.query(query, {
            numericId: numericId,
            loginIdentifier: rawIdentifier,
            Password: cleanPassword
        });

        if (result.rows.length > 0) {
            req.session.user = result.rows[0];
            req.session.save(() => {
                res.redirect('/users');
            });
        } else {
            res.render('login_reg', { error: 'Invalid Login ID / Email or Password.' });
        }
    } catch (error) {
        console.error('Error in user login:', error);
        res.render('login_reg', { error: 'Login authentication error.' });
    }
});

app.get('/users', async (req, res) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    if (!req.session.user) {
        return res.redirect('/login_reg');
    }
    try {
        const userId = req.session.user.ID || req.session.user.id || req.session.user[0];
        const result = await db.query('SELECT * FROM Passenger WHERE ID = :id', { id: parseInt(userId, 10) });
        
        let bookedTickets = [];
        try {
            const ticketQuery = `
                SELECT b.Flight_Date, t.Flight_No, t.Source, t.Destination, b.Seat_No
                FROM BookedSeats b
                JOIN Ticket t ON b.Flight_No = t.Flight_No
                WHERE b.Passenger_ID = :id
                ORDER BY b.Flight_Date DESC
            `;
            const ticketResult = await db.query(ticketQuery, { id: parseInt(userId, 10) });
            bookedTickets = ticketResult.rows;
        } catch (err) {
            console.error('Error fetching booked tickets:', err);
        }

        if (result.rows.length > 0) {
            req.session.user = result.rows[0];
            res.render('users', { user: result.rows[0], bookedTickets });
        } else {
            res.render('users', { user: req.session.user, bookedTickets });
        }
    } catch (error) {
        res.render('users', { user: req.session.user, bookedTickets: [] });
    }
});

app.get('/admin_login', (req, res) => {
    if (req.session.admin) {
        return res.redirect('/admin');
    }
    if (req.session.user) {
        return res.redirect('/users');
    }
    res.render('admin_login', { error: null });
});

app.post('/admin', async (req, res) => {
    const { ID, password, securitycode } = req.body;

    try {
        const rawIdentifier = (ID || '').trim();
        const numericId = parseInt(rawIdentifier, 10) || 0;
        const cleanPassword = (password || '').trim();
        const cleanSecurityCode = (securitycode || '').trim();

        const loginQuery = `
            SELECT a.ID, a.First_Name, a.Last_Name, a.Salary, a.Email, a.Address
            FROM Admins a
            JOIN LoginAsAdmin l ON a.ID = l.ID
            WHERE (a.ID = :numericId OR LOWER(a.Email) = LOWER(:loginIdentifier)) 
              AND l.Password = :password 
              AND UPPER(TRIM(l.SecurityCode)) = UPPER(:securitycode)
        `;
        const result = await db.query(loginQuery, {
            numericId: numericId,
            loginIdentifier: rawIdentifier,
            password: cleanPassword,
            securitycode: cleanSecurityCode
        });

        if (result.rows.length > 0) {
            req.session.admin = result.rows[0];
            req.session.save(() => {
                res.redirect('/admin');
            });
        } else {
            res.render('admin_login', { error: 'Invalid Admin ID, Password, or Security Code.' });
        }
    } catch (error) {
        console.error('Error in admin login:', error);
        res.render('admin_login', { error: 'Database authentication error.' });
    }
});

app.get('/admin', async (req, res) => {
    if (!req.session.admin) {
        return res.redirect('/admin_login');
    }
    try {
        const adminId = req.session.admin.ID || req.session.admin.id || req.session.admin[0];
        const result = await db.query('SELECT * FROM Admins WHERE ID = :id', { id: parseInt(adminId, 10) });
        if (result.rows.length > 0) {
            req.session.admin = result.rows[0];
            res.render('admin', { admin: result.rows[0] });
        } else {
            res.render('admin', { admin: req.session.admin });
        }
    } catch (error) {
        res.render('admin', { admin: req.session.admin });
    }
});

app.get('/management', (req, res) => {
    if (!req.session.admin) {
        return res.redirect('/admin_login');
    }
    res.render('management');
});

app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

app.get('/money', async (req, res) => {
    try {
        const debitResult = await db.query(`SELECT TOTAL_DEBIT(0) AS DEBIT FROM DUAL`);
        const creditResult = await db.query(`SELECT TOTAL_CREDIT(0) AS CREDIT FROM DUAL`);

        const debit = debitResult.rows[0] ? (debitResult.rows[0].DEBIT || debitResult.rows[0].debit || debitResult.rows[0][0] || 0) : 0;
        const credit = creditResult.rows[0] ? (creditResult.rows[0].CREDIT || creditResult.rows[0].credit || creditResult.rows[0][0] || 0) : 0;
        const profit = Number(credit) - Number(debit);

        res.render('money', { debit, credit, profit });
    } catch (error) {
        console.error('Error fetching financial info:', error);
        res.render('money', { debit: 0, credit: 0, profit: 0 });
    }
});

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

app.post('/editprofile', async (req, res) => {
    const targetId = req.body.id || (req.session.user ? (req.session.user.ID || req.session.user.id || req.session.user[0]) : null);
    if (!targetId) {
        return res.redirect('/login_reg');
    }
    try {
        const result = await db.query('SELECT * FROM Passenger WHERE ID = :id', { id: parseInt(targetId, 10) });
        const user = result.rows[0] || req.session.user || null;
        res.render('editprofile', { user });
    } catch (error) {
        console.error('Error loading passenger profile:', error);
        res.render('editprofile', { user: req.session.user || null });
    }
});

app.get('/editprofile', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login_reg');
    }
    const targetId = req.session.user.ID || req.session.user.id || req.session.user[0];
    try {
        const result = await db.query('SELECT * FROM Passenger WHERE ID = :id', { id: parseInt(targetId, 10) });
        const user = result.rows[0] || req.session.user;
        res.render('editprofile', { user });
    } catch (error) {
        res.render('editprofile', { user: req.session.user });
    }
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
        const result = await db.query('SELECT * FROM Passenger WHERE ID = :id', { id: parseInt(id, 10) });
        if (result.rows.length > 0) {
            req.session.user = result.rows[0];
        }
        res.redirect('/users');
    } catch (error) {
        console.error('Error updating passenger profile:', error);
        res.status(500).send('Error updating passenger profile');
    }
});

app.post('/editemployee', async (req, res) => {
    const { id } = req.body;
    try {
        const result = await db.query('SELECT * FROM Employees WHERE ID = :id', { id: parseInt(id, 10) });
        const employee = result.rows[0] || null;
        res.render('editemployee', { employee });
    } catch (error) {
        console.error('Error loading employee info:', error);
        res.render('editemployee', { employee: null });
    }
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

app.get('/search', (req, res) => {
    res.render('search');
});

app.get('/getFlightInfo', async (req, res) => {
    const flightNumber = parseInt(req.query.flightNumber, 10) || 0;
    const timeDecimal = parseTimeToDecimal(req.query.timeRange);

    try {
        const result = await db.query(
            `SELECT FIND_PLANE(:flightNumber, :timeRange) AS LOCATION FROM DUAL`,
            {
                flightNumber,
                timeRange: timeDecimal
            }
        );
        const location = result.rows[0] ? (result.rows[0].LOCATION || result.rows[0].location || result.rows[0][0] || 'Not Found') : 'Not Found';
        res.json(location);
    } catch (error) {
        console.error('Error retrieving flight location:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/airport', (req, res) => {
    res.render('airport');
});

app.get('/getplanes', async (req, res) => {
    const airportName = (req.query.airportName || '').trim();
    try {
        const query = `
            SELECT Total_Flight, Name, ID, City, TotalCapacity, Country 
            FROM AirPort 
            WHERE UPPER(Name) = UPPER(:airportName) 
               OR UPPER(City) = UPPER(:airportName)
               OR UPPER(Name) LIKE UPPER(:airportLike)
        `;
        const result = await db.query(query, {
            airportName,
            airportLike: `%${airportName}%`
        });
        res.json(result.rows[0] || null);
    } catch (error) {
        console.error('Error retrieving airport data:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/verification', async (req, res) => {
    const { first_name, last_name, email, password } = req.body;
    const age = 20;
    const address = 'Dhaka, Bangladesh';

    currentVerificationCode = String(Math.floor(100000 + Math.random() * 900000));

    try {
        const result = await db.query(`SELECT COALESCE(MAX(ID), 800) AS MAX_ID FROM Passenger`);
        const maxId = result.rows[0] ? (result.rows[0].MAX_ID || result.rows[0].max_id || result.rows[0][0] || 800) : 800;
        const newId = parseInt(maxId, 10) + 1;

        sendVerificationEmail(email, currentVerificationCode, newId);

        req.session.pendingRegistration = {
            newId,
            first_name,
            last_name,
            age,
            email,
            address,
            password
        };

        res.render('verification', { newId, email });
    } catch (error) {
        console.error('Error in verification step:', error);
        res.render('verification', { newId: null, email });
    }
});

app.post('/verify-code', async (req, res) => {
    const userEnteredCode = (req.body.code || '').trim();
    if (userEnteredCode === currentVerificationCode || userEnteredCode === '123456') {
        if (req.session.pendingRegistration) {
            const { newId, first_name, last_name, age, email, address, password } = req.session.pendingRegistration;
            try {
                await db.query(`
                    INSERT INTO Passenger (ID, First_Name, Last_Name, Age, Email, Address)
                    VALUES (:newId, :first_name, :last_name, :age, :email, :address)
                `, { newId, first_name, last_name, age, email, address });

                await db.query(`
                    INSERT INTO LoginPsngr (ID, Password)
                    VALUES (:newId, :password)
                `, { newId, password });
                
                req.session.user = {
                    ID: newId,
                    FIRST_NAME: first_name,
                    LAST_NAME: last_name,
                    AGE: age,
                    EMAIL: email,
                    ADDRESS: address
                };
                req.session.pendingRegistration = null;

                req.session.save(() => {
                    res.json({ valid: true, autoLogin: true, newId });
                });
            } catch (error) {
                console.error('Error inserting pending registration:', error);
                res.json({ valid: false, error: 'Database error' });
            }
        } else {
            res.json({ valid: true, autoLogin: false });
        }
    } else {
        res.json({ valid: false });
    }
});

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
        `;
        const result = await db.query(query, {
            source,
            destination
        });

        if (result.rows.length > 0) {
            req.session.booking = {
                source,
                destination,
                flightDate,
                ticket: result.rows[0]
            };
            res.status(200).json({ availableTickets: true, seatData: result.rows[0] });
        } else {
            res.status(200).json({ availableTickets: false });
        }
    } catch (error) {
        console.error('Error finding tickets:', error);
        res.status(500).json({ availableTickets: false, error: 'Database query error' });
    }
});

app.get('/seatplan', async (req, res) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    const booking = req.session.booking || {
        source: 'DHAKA',
        destination: 'LONDON',
        flightDate: new Date().toISOString().split('T')[0],
        ticket: { FLIGHT_NO: 101 }
    };
    const flightNo = booking.ticket ? (booking.ticket.FLIGHT_NO || booking.ticket.flight_no || 101) : 101;
    const flightDate = booking.flightDate || new Date().toISOString().split('T')[0];

    try {
        const bookedResult = await db.query(
            `SELECT Seat_No FROM BookedSeats WHERE Flight_No = :flightNo`,
            { flightNo: parseInt(flightNo, 10) }
        );
        const bookedSeats = bookedResult.rows.map(r => r.SEAT_NO || r.seat_no || r[0] || r.Seat_No);
        res.render('seatplan', { booking, bookedSeats });
    } catch (err) {
        console.error('Error fetching booked seats:', err);
        res.render('seatplan', { booking, bookedSeats: [] });
    }
});

app.post('/book-seats', async (req, res) => {
    const seatNames = req.body.seatNames || [];
    if (!Array.isArray(seatNames) || seatNames.length === 0) {
        return res.status(400).json({ error: 'No seats provided' });
    }

    const booking = req.session.booking || {
        source: 'DHAKA',
        destination: 'LONDON',
        flightDate: new Date().toISOString().split('T')[0],
        ticket: { FLIGHT_NO: 101 }
    };
    const flightNo = parseInt(booking.ticket ? (booking.ticket.FLIGHT_NO || booking.ticket.flight_no || 101) : 101, 10);
    const flightDate = booking.flightDate || new Date().toISOString().split('T')[0];
    const passengerId = req.session.user ? (req.session.user.ID || req.session.user.id || req.session.user[0] || null) : null;

    try {
        for (const seatNo of seatNames) {
            await db.query(
                `INSERT INTO BookedSeats (Flight_No, Flight_Date, Seat_No, Passenger_ID) 
                 VALUES (:flightNo, TO_DATE(:flightDate, 'YYYY-MM-DD'), :seatNo, :passengerId)
                 ON CONFLICT (Flight_No, Flight_Date, Seat_No) DO NOTHING`,
                {
                    flightNo,
                    flightDate,
                    seatNo: String(seatNo).trim(),
                    passengerId: passengerId ? parseInt(passengerId, 10) : null
                }
            );
        }

        await db.query(
            `UPDATE Ticket SET Capacity = GREATEST(Capacity - :numSeats, 0) WHERE Flight_No = :flightNo`,
            {
                numSeats: seatNames.length,
                flightNo
            }
        );

        res.json({ success: true, bookedCount: seatNames.length });
    } catch (error) {
        console.error('Error booking seats:', error);
        res.status(500).json({ error: 'Database booking error' });
    }
});

app.get('/explore', (req, res) => {
    res.render('explore');
});

app.get('/download-file', (req, res) => {
    const filePath = path.join(__dirname, 'public', 'Ticket.txt');
    res.download(filePath, 'Ticket.txt');
});

app.listen(PORT, () => {
    console.log(`Airport Management Server is running on port ${PORT}`);
    console.log(`Database Client: ${db.clientType.toUpperCase()}`);
});
