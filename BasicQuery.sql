-- INSERT SAMPLE DATA

INSERT INTO Passenger (ID, First_Name, Last_Name, Age, Email, Address)
VALUES (812, 'UDOY', 'FUAD', 21, 'ududoy@gmail.com', 'Sher-e-Bangla Hall, BUET');

INSERT INTO Passenger (ID, First_Name, Last_Name, Age, Email, Address)
VALUES (813, 'ANTOR', 'MUSABBIR', 21, 'antoreee@gmail.com', 'Sher-e-Bangla Hall, BUET');

INSERT INTO LoginPsngr (ID, Password)
VALUES (812, '123456');

INSERT INTO LoginPsngr (ID, Password)
VALUES (813, '123456');

INSERT INTO Employees (ID, First_Name, Last_Name, Salary, Email, Address)
VALUES (1001, 'Taky', 'Shahriar', 50000, 'taky@gmail.com', 'Sher-e-Bangla Hall, BUET');

INSERT INTO Employees (ID, First_Name, Last_Name, Salary, Email, Address)
VALUES (1002, 'Shahriar', 'Ahmed', 60000, 'seam@gmail.com', 'Ahsanullah Hall, BUET');

INSERT INTO Admins (ID, First_Name, Last_Name, Salary, Email, Address)
VALUES (1001, 'Taky', 'Shahriar', 50000, 'taky@gmail.com', 'Sher-e-Bangla Hall, BUET');

INSERT INTO LoginAsAdmin (ID, Password, SecurityCode)
VALUES (1001, 'admin123', 'SEC1001');

INSERT INTO AirPort (Total_Flight, Name, ID, City, TotalCapacity, Country)
VALUES (14, 'DHAKA AIRPORT', 1, 'DHAKA', 500, 'BANGLADESH');

INSERT INTO AirPort (Total_Flight, Name, ID, City, TotalCapacity, Country)
VALUES (10, 'KORACHI AIRPORT', 2, 'KORACHI', 400, 'PAKISTAN');

INSERT INTO AirPlane (Flight_No, Name, Capacity, Source, Destination)
VALUES (15, 'BOEING 777', 150, 'DHAKA', 'NEWYORK');

INSERT INTO AirPlane (Flight_No, Name, Capacity, Source, Destination)
VALUES (21, 'AMERICAN AIRLINES', 40, 'DHAKA', 'WASHINGTON DC');

INSERT INTO Ticket (Flight_No, Source, Destination, Flight_Date, Flight_Time, Class, Capacity, Price)
VALUES (15, 'DHAKA', 'NEWYORK', TO_DATE('2026-09-01', 'YYYY-MM-DD'), '10:00 AM', 'BUSINESS', 20, 2500);

INSERT INTO Ticket (Flight_No, Source, Destination, Flight_Date, Flight_Time, Class, Capacity, Price)
VALUES (15, 'DHAKA', 'NEWYORK', TO_DATE('2026-09-01', 'YYYY-MM-DD'), '10:00 AM', 'ECONOMY', 100, 1200);

INSERT INTO Location (Flight_No, Start_Time, End_Time, Place)
VALUES (15, 5.0, 6.0, 'Over Bay of Bengal');

INSERT INTO Location (Flight_No, Start_Time, End_Time, Place)
VALUES (15, 6.0, 8.0, 'Over Arabian Sea');

-- UPDATE QUERIES
UPDATE Passenger SET Age = 30 WHERE ID = 812;
UPDATE Employees SET Salary = 120000 WHERE ID = 1001;
UPDATE Ticket SET Price = 3000 WHERE Destination = 'NEWYORK' AND Class = 'BUSINESS';

-- DELETE QUERIES
DELETE FROM Employees WHERE ID = 1002;
DELETE FROM AirPort WHERE ID = 2;
