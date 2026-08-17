-- BASIC SELECT QUERIES
SELECT * FROM Employees WHERE Salary < 100000 ORDER BY ID;

SELECT Price FROM Ticket WHERE Source = 'DHAKA' AND Destination = 'NEWYORK' AND Class = 'BUSINESS';

SELECT * FROM DeletedEmployees ORDER BY ID;

SELECT * FROM Admins ORDER BY ID;

SELECT * FROM AirPlane;

-- JOIN QUERIES: FIND PLANE PATH / LOCATION
SELECT l.Place, a.Name, a.Source, a.Destination 
FROM Location l 
JOIN AirPlane a ON (l.Flight_No = a.Flight_No)
WHERE a.Source = 'DHAKA';

-- JOIN QUERIES: PASSENGER WITH LOGIN
SELECT p.ID, p.First_Name, p.Last_Name, p.Email, l.Password
FROM Passenger p
JOIN LoginPsngr l ON (p.ID = l.ID);

-- JOIN QUERIES: ADMIN LOGIN VALIDATION
SELECT a.ID, a.First_Name, a.Last_Name, a.Salary, a.Email, a.Address
FROM Admins a
JOIN LoginAsAdmin la ON (a.ID = la.ID);
