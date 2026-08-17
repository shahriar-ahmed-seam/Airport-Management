-- TRIGGER 1: Archive Deleted Employees
CREATE OR REPLACE TRIGGER ResignedEmployees
BEFORE DELETE
ON Employees
FOR EACH ROW 
BEGIN 
    INSERT INTO DeletedEmployees (ID, First_Name, Last_Name, Salary, Email, Address)
    VALUES (:OLD.ID, :OLD.First_Name, :OLD.Last_Name, :OLD.Salary, :OLD.Email, :OLD.Address);
END;
/

-- TRIGGER 2: Promote Employee to Admin when Salary exceeds threshold
CREATE OR REPLACE TRIGGER MAKE_ADMIN
AFTER UPDATE 
ON Employees
FOR EACH ROW
WHEN (NEW.Salary >= 1000000)
BEGIN
    INSERT INTO Admins (ID, First_Name, Last_Name, Salary, Email, Address)
    VALUES (:NEW.ID, :NEW.First_Name, :NEW.Last_Name, :NEW.Salary, :NEW.Email, :NEW.Address);
END;
/

-- TRIGGER 3: Initialize default password for newly registered passenger if not present
CREATE OR REPLACE TRIGGER Registration_Default_Login
AFTER INSERT
ON Passenger
FOR EACH ROW 
BEGIN
    INSERT INTO LoginPsngr (ID, Password)
    VALUES (:NEW.ID, '123456');
EXCEPTION
    WHEN DUP_VAL_ON_INDEX THEN
        NULL;
END;
/
