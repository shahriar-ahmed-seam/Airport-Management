CREATE TABLE Passenger(
    ID NUMBER(5) NOT NULL,
    First_Name VARCHAR2(50),
    Last_Name VARCHAR2(50) NOT NULL,
    Age NUMBER(5) NOT NULL,
    Email VARCHAR2(50) NOT NULL,
    Address VARCHAR2(50) NOT NULL,
    PRIMARY KEY(ID)
);

CREATE TABLE LoginPsngr(
    ID NUMBER(5) PRIMARY KEY,
    Password VARCHAR2(50) NOT NULL,
    FOREIGN KEY(ID) REFERENCES Passenger(ID)
    ON DELETE CASCADE
);

CREATE TABLE Employees(
    ID NUMBER(5) NOT NULL,
    First_Name VARCHAR2(50),
    Last_Name VARCHAR2(50) NOT NULL,
    Salary NUMBER(10) NOT NULL,
    Email VARCHAR2(50) NOT NULL,
    Address VARCHAR2(50) NOT NULL,
    PRIMARY KEY(ID)
);

CREATE TABLE Admins(
    ID NUMBER(5) NOT NULL,
    First_Name VARCHAR2(50),
    Last_Name VARCHAR2(50) NOT NULL,
    Salary NUMBER(10) NOT NULL,
    Email VARCHAR2(50) NOT NULL,
    Address VARCHAR2(50) NOT NULL,
    PRIMARY KEY(ID),
    FOREIGN KEY(ID) REFERENCES Employees(ID)
    ON DELETE CASCADE
);

CREATE TABLE LoginAsAdmin(
    ID NUMBER(5),
    Password VARCHAR2(50) NOT NULL,
    SecurityCode VARCHAR2(50) NOT NULL,
    PRIMARY KEY(ID, SecurityCode),
    FOREIGN KEY(ID) REFERENCES Employees(ID)
    ON DELETE CASCADE
);

CREATE TABLE AirPort(
    Total_Flight NUMBER(5) NOT NULL,
    Name VARCHAR2(50) NOT NULL,
    ID NUMBER(5) NOT NULL,
    City VARCHAR2(50) NOT NULL,
    TotalCapacity NUMBER(5) NOT NULL,
    Country VARCHAR2(50) NOT NULL,
    PRIMARY KEY(ID)
);

CREATE TABLE AirPlane(
    Flight_No NUMBER(5) PRIMARY KEY,
    Name VARCHAR2(50) NOT NULL,
    Capacity NUMBER(5),
    Source VARCHAR2(50) NOT NULL,
    Destination VARCHAR2(50) NOT NULL
);

CREATE TABLE Ticket(
    Flight_No NUMBER(5),
    Source VARCHAR2(50) NOT NULL,
    Destination VARCHAR2(50) NOT NULL,
    Flight_Date DATE NOT NULL,
    Flight_Time VARCHAR2(50) NOT NULL,
    Class VARCHAR2(50) NOT NULL,
    Capacity NUMBER(5) NOT NULL,
    Price NUMBER(5) NOT NULL,
    PRIMARY KEY(Flight_No, Class),
    FOREIGN KEY(Flight_No) REFERENCES AirPlane(Flight_No)
    ON DELETE CASCADE
);

CREATE TABLE Location(
    Flight_No NUMBER(5),
    Start_Time NUMBER(5,2),
    End_Time NUMBER(5,2),
    Place VARCHAR2(50),
    PRIMARY KEY(Flight_No, Place),
    FOREIGN KEY(Flight_No) REFERENCES AirPlane(Flight_No)
    ON DELETE CASCADE
);

CREATE TABLE DeletedEmployees(
    ID NUMBER(5) NOT NULL,
    First_Name VARCHAR2(50) NOT NULL,
    Last_Name VARCHAR2(50) NOT NULL,
    Salary NUMBER(10) NOT NULL,
    Email VARCHAR2(50) NOT NULL,
    Address VARCHAR2(50) NOT NULL
);

CREATE TABLE BookedSeats(
    Flight_No NUMBER(5) NOT NULL,
    Flight_Date DATE NOT NULL,
    Seat_No VARCHAR2(20) NOT NULL,
    Passenger_ID NUMBER(5),
    Booking_Time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(Flight_No, Flight_Date, Seat_No)
);
