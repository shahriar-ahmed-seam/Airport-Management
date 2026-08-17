-- PostgreSQL Functions & Triggers for Airport Management

-- 1. TOTAL_DEBIT function
CREATE OR REPLACE FUNCTION TOTAL_DEBIT(code INT DEFAULT NULL)
RETURNS NUMERIC AS $$
DECLARE
    debit NUMERIC(12, 2);
BEGIN
    IF code IS NOT NULL AND code > 0 THEN
        SELECT COALESCE(SUM(Salary), 0) INTO debit FROM Employees WHERE ID = code;
    ELSE
        SELECT COALESCE(SUM(Salary), 0) INTO debit FROM Employees;
    END IF;
    RETURN debit;
END;
$$ LANGUAGE plpgsql;

-- 2. TOTAL_CREDIT function
CREATE OR REPLACE FUNCTION TOTAL_CREDIT(code INT DEFAULT NULL)
RETURNS NUMERIC AS $$
DECLARE
    total_debit NUMERIC(12, 2);
    total_credit NUMERIC(12, 2);
BEGIN
    total_debit := TOTAL_DEBIT(code);
    total_credit := total_debit + 100000;
    RETURN total_credit;
END;
$$ LANGUAGE plpgsql;

-- 3. TOTAL_PROFIT function
CREATE OR REPLACE FUNCTION TOTAL_PROFIT(code INT DEFAULT NULL)
RETURNS NUMERIC AS $$
DECLARE
    debit NUMERIC(12, 2);
    credit NUMERIC(12, 2);
    profit NUMERIC(12, 2);
BEGIN
    debit := TOTAL_DEBIT(code);
    credit := TOTAL_CREDIT(code);
    profit := credit - debit;
    RETURN profit;
END;
$$ LANGUAGE plpgsql;

-- 4. FIND_PLANE function
CREATE OR REPLACE FUNCTION FIND_PLANE(flight INT, time_val NUMERIC)
RETURNS VARCHAR AS $$
DECLARE
    loc VARCHAR(50);
BEGIN
    SELECT Place INTO loc 
    FROM Location
    WHERE Flight_No = flight AND time_val >= Start_Time AND time_val <= End_Time
    LIMIT 1;

    IF loc IS NULL THEN
        RETURN 'Not Found';
    END IF;
    RETURN loc;
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        RETURN 'Not Found';
    WHEN OTHERS THEN
        RETURN 'Not Found';
END;
$$ LANGUAGE plpgsql;

-- 5. Trigger: ResignedEmployees
CREATE OR REPLACE FUNCTION func_resigned_employees()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO DeletedEmployees (ID, First_Name, Last_Name, Salary, Email, Address)
    VALUES (OLD.ID, OLD.First_Name, OLD.Last_Name, OLD.Salary, OLD.Email, OLD.Address);
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_resigned_employees ON Employees;
CREATE TRIGGER trigger_resigned_employees
BEFORE DELETE ON Employees
FOR EACH ROW
EXECUTE FUNCTION func_resigned_employees();

-- 6. Trigger: MAKE_ADMIN
CREATE OR REPLACE FUNCTION func_make_admin()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.Salary >= 1000000 THEN
        INSERT INTO Admins (ID, First_Name, Last_Name, Salary, Email, Address)
        VALUES (NEW.ID, NEW.First_Name, NEW.Last_Name, NEW.Salary, NEW.Email, NEW.Address)
        ON CONFLICT (ID) DO UPDATE
        SET First_Name = EXCLUDED.First_Name,
            Last_Name = EXCLUDED.Last_Name,
            Salary = EXCLUDED.Salary,
            Email = EXCLUDED.Email,
            Address = EXCLUDED.Address;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_make_admin ON Employees;
CREATE TRIGGER trigger_make_admin
AFTER UPDATE ON Employees
FOR EACH ROW
EXECUTE FUNCTION func_make_admin();
