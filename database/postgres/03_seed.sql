INSERT INTO Passenger (ID, First_Name, Last_Name, Age, Email, Address)
VALUES 
    (801, 'UDOY', 'FUAD', 21, 'ududoy@gmail.com', 'Sher-e-Bangla Hall, BUET'),
    (802, 'ANTOR', 'MUSABBIR', 21, 'antoreee@gmail.com', 'Sher-e-Bangla Hall, BUET'),
    (803, 'SAKIB', 'AL HASAN', 28, 'sakib75@gmail.com', 'Mirpur DOHS, Dhaka'),
    (804, 'TAMIM', 'IQBAL', 32, 'tamim28@gmail.com', 'Nasirabad, Chittagong'),
    (805, 'MUSHFIQUR', 'RAHIM', 33, 'mushi15@gmail.com', 'Bogura, Bangladesh'),
    (806, 'MAHMUDULLAH', 'RIYAD', 34, 'riyad30@gmail.com', 'Mymensingh, Bangladesh'),
    (807, 'TASKIN', 'AHMED', 26, 'taskin12@gmail.com', 'Mohammadpur, Dhaka'),
    (808, 'MUSTAFIZUR', 'RAHMAN', 25, 'mustafiz90@gmail.com', 'Satkhira, Khulna'),
    (809, 'LITON', 'DAS', 27, 'liton16@gmail.com', 'Dinajpur, Rangpur'),
    (810, 'NAZMUL', 'SHANTO', 24, 'shanto99@gmail.com', 'Rajshahi, Bangladesh'),
    (811, 'MEHIDY', 'MIRAZ', 23, 'miraz53@gmail.com', 'Khulna, Bangladesh'),
    (812, 'SHAHRIAR', 'SEAM', 22, 'shahriarseam@gmail.com', 'Ahsanullah Hall, BUET'),
    (813, 'TAKY', 'SHAHRIAR', 22, 'takyshahriar@gmail.com', 'Sher-e-Bangla Hall, BUET'),
    (814, 'HASAN', 'MAHMUD', 22, 'hasan91@gmail.com', 'Laxmipur, Chittagong'),
    (815, 'SOUROV', 'GANGULY', 45, 'sourov@gmail.com', 'Kolkata, India')
ON CONFLICT (ID) DO NOTHING;

INSERT INTO LoginPsngr (ID, Password)
VALUES 
    (801, '123456'),
    (802, '123456'),
    (803, '123456'),
    (804, '123456'),
    (805, '123456'),
    (806, '123456'),
    (807, '123456'),
    (808, '123456'),
    (809, '123456'),
    (810, '123456'),
    (811, '123456'),
    (812, '123456'),
    (813, '123456'),
    (814, '123456'),
    (815, '123456')
ON CONFLICT (ID) DO NOTHING;

INSERT INTO Employees (ID, First_Name, Last_Name, Salary, Email, Address)
VALUES 
    (1001, 'Taky', 'Shahriar', 120000, 'taky@gmail.com', 'Sher-e-Bangla Hall, BUET'),
    (1002, 'Shahriar', 'Ahmed', 115000, 'seam@gmail.com', 'Ahsanullah Hall, BUET'),
    (1003, 'Rahim', 'Uddin', 45000, 'rahim@gmail.com', 'Uttara, Dhaka'),
    (1004, 'Karim', 'Chowdhury', 52000, 'karim@gmail.com', 'Gulshan-2, Dhaka'),
    (1005, 'Tanvir', 'Hasan', 48000, 'tanvir@gmail.com', 'Banani, Dhaka'),
    (1006, 'Nafis', 'Sadik', 65000, 'nafis@gmail.com', 'Dhanmondi, Dhaka'),
    (1007, 'Jubayer', 'Al-Mamun', 70000, 'jubayer@gmail.com', 'Mirpur-10, Dhaka'),
    (1008, 'Sabbir', 'Rahman', 42000, 'sabbir@gmail.com', 'Baridhara, Dhaka'),
    (1009, 'Fahim', 'Faysal', 55000, 'fahim@gmail.com', 'Bashundhara R/A, Dhaka'),
    (1010, 'Rifat', 'Hossain', 60000, 'rifat@gmail.com', 'Niketan, Dhaka'),
    (1011, 'Anik', 'Saha', 51000, 'anik@gmail.com', 'Chittagong GEC, Chittagong'),
    (1012, 'Imran', 'Nazir', 47000, 'imran@gmail.com', 'Zindabazar, Sylhet')
ON CONFLICT (ID) DO NOTHING;

INSERT INTO Admins (ID, First_Name, Last_Name, Salary, Email, Address)
VALUES 
    (1001, 'Taky', 'Shahriar', 120000, 'taky@gmail.com', 'Sher-e-Bangla Hall, BUET'),
    (1002, 'Shahriar', 'Ahmed', 115000, 'seam@gmail.com', 'Ahsanullah Hall, BUET'),
    (1006, 'Nafis', 'Sadik', 65000, 'nafis@gmail.com', 'Dhanmondi, Dhaka')
ON CONFLICT (ID) DO NOTHING;

INSERT INTO LoginAsAdmin (ID, Password, SecurityCode)
VALUES 
    (1001, 'admin123', 'SEC1001'),
    (1002, 'admin123', 'SEC1002'),
    (1006, 'admin123', 'SEC1006')
ON CONFLICT (ID, SecurityCode) DO NOTHING;

INSERT INTO AirPort (Total_Flight, Name, ID, City, TotalCapacity, Country)
VALUES 
    (85, 'DHAKA AIRPORT', 1, 'DHAKA', 1500, 'BANGLADESH'),
    (40, 'OSMANI AIRPORT', 2, 'SYLHET', 600, 'BANGLADESH'),
    (50, 'SHAH AMANAT AIRPORT', 3, 'CHITTAGONG', 800, 'BANGLADESH'),
    (220, 'DUBAI INTERNATIONAL', 4, 'DUBAI', 5000, 'UNITED ARAB EMIRATES'),
    (310, 'HEATHROW AIRPORT', 5, 'LONDON', 6500, 'UNITED KINGDOM'),
    (280, 'JFK INTERNATIONAL', 6, 'NEWYORK', 6000, 'UNITED STATES'),
    (250, 'CHANGI AIRPORT', 7, 'SINGAPORE', 5500, 'SINGAPORE'),
    (190, 'HAMAD INTERNATIONAL', 8, 'DOHA', 4500, 'QATAR'),
    (130, 'KING KHALID AIRPORT', 9, 'RIYAD', 3500, 'SAUDI ARABIA'),
    (175, 'MADRID BARAJAS', 10, 'MADRID', 4000, 'SPAIN'),
    (210, 'LOS ANGELES INTL', 11, 'LOS ANGELES', 5200, 'UNITED STATES'),
    (160, 'INDIRA GANDHI INTL', 12, 'DELLE', 4200, 'INDIA')
ON CONFLICT (ID) DO NOTHING;

INSERT INTO AirPlane (Flight_No, Name, Capacity, Source, Destination)
VALUES 
    (101, 'BIMAN BG-001 (Dreamliner)', 271, 'DHAKA', 'LONDON'),
    (102, 'BIMAN BG-049', 162, 'DHAKA', 'DUBAI'),
    (103, 'BIMAN BG-021', 180, 'DHAKA', 'RIYAD'),
    (104, 'BIMAN BG-077', 150, 'DHAKA', 'NEWYORK'),
    (201, 'EMIRATES EK-583', 354, 'DHAKA', 'DUBAI'),
    (202, 'EMIRATES EK-001', 489, 'DUBAI', 'LONDON'),
    (203, 'EMIRATES EK-201', 350, 'DUBAI', 'NEWYORK'),
    (301, 'QATAR QR-639', 280, 'DHAKA', 'DOHA'),
    (302, 'QATAR QR-005', 310, 'DOHA', 'LONDON'),
    (401, 'SINGAPORE SQ-447', 253, 'DHAKA', 'SINGAPORE'),
    (501, 'BRITISH AIRWAYS BA-178', 214, 'LONDON', 'NEWYORK'),
    (601, 'US BANGLA BS-101', 164, 'DHAKA', 'SYLHET'),
    (602, 'NOVOAIR VQ-901', 72, 'DHAKA', 'CHITTAGONG'),
    (701, 'IBERIA IB-3160', 180, 'MADRID', 'LONDON'),
    (801, 'AMERICAN AA-100', 273, 'NEWYORK', 'LONDON')
ON CONFLICT (Flight_No) DO NOTHING;

INSERT INTO Ticket (Flight_No, Source, Destination, Flight_Date, Flight_Time, Class, Capacity, Price)
VALUES 
    (101, 'DHAKA', 'LONDON', CURRENT_DATE, '10:00 AM', 'BUSINESS', 24, 2200),
    (101, 'DHAKA', 'LONDON', CURRENT_DATE, '10:00 AM', 'ECONOMY', 247, 950),
    (102, 'DHAKA', 'DUBAI', CURRENT_DATE, '08:30 PM', 'BUSINESS', 12, 1400),
    (102, 'DHAKA', 'DUBAI', CURRENT_DATE, '08:30 PM', 'ECONOMY', 150, 620),
    (103, 'DHAKA', 'RIYAD', CURRENT_DATE, '11:15 PM', 'BUSINESS', 16, 1600),
    (103, 'DHAKA', 'RIYAD', CURRENT_DATE, '11:15 PM', 'ECONOMY', 164, 750),
    (104, 'DHAKA', 'NEWYORK', CURRENT_DATE, '02:00 AM', 'BUSINESS', 30, 2600),
    (104, 'DHAKA', 'NEWYORK', CURRENT_DATE, '02:00 AM', 'ECONOMY', 120, 1300),
    (201, 'DHAKA', 'DUBAI', CURRENT_DATE, '01:40 PM', 'BUSINESS', 42, 1800),
    (201, 'DHAKA', 'DUBAI', CURRENT_DATE, '01:40 PM', 'ECONOMY', 312, 700),
    (301, 'DHAKA', 'DOHA', CURRENT_DATE, '06:20 PM', 'BUSINESS', 36, 1750),
    (301, 'DHAKA', 'DOHA', CURRENT_DATE, '06:20 PM', 'ECONOMY', 244, 680),
    (401, 'DHAKA', 'SINGAPORE', CURRENT_DATE, '11:55 PM', 'BUSINESS', 28, 1500),
    (401, 'DHAKA', 'SINGAPORE', CURRENT_DATE, '11:55 PM', 'ECONOMY', 225, 590),
    (601, 'DHAKA', 'SYLHET', CURRENT_DATE, '07:30 AM', 'ECONOMY', 164, 65),
    (602, 'DHAKA', 'CHITTAGONG', CURRENT_DATE, '09:00 AM', 'ECONOMY', 72, 70)
ON CONFLICT (Flight_No, Class) DO NOTHING;

INSERT INTO Location (Flight_No, Start_Time, End_Time, Place)
VALUES 
    (101, 10.0, 12.0, 'Cruising over Central India (FL360)'),
    (101, 12.0, 14.5, 'Over Arabian Sea airspace (FL380)'),
    (101, 14.5, 17.0, 'Over Eastern Europe Airspace (FL390)'),
    (101, 17.0, 19.5, 'Approaching London Heathrow Approach (FL100)'),
    (102, 20.5, 22.0, 'Cruising over Bay of Bengal (FL340)'),
    (102, 22.0, 24.0, 'Approaching Dubai International Airspace (FL120)'),
    (103, 23.25, 26.0, 'Cruising over Arabian Peninsula (FL370)'),
    (104, 2.0, 6.0, 'Transatlantic Northern Route (FL400)'),
    (104, 6.0, 10.0, 'Approaching JFK Terminal Control Area (FL150)'),
    (201, 13.6, 15.0, 'Cruising over Indian Subcontinent (FL380)'),
    (201, 15.0, 17.5, 'Gulf Air Corridor approaching UAE (FL280)'),
    (301, 18.3, 20.0, 'Over Southern India Airspace (FL360)'),
    (301, 20.0, 22.5, 'Doha Terminal Approach Control (FL100)'),
    (401, 23.9, 26.0, 'Over Andaman Sea (FL350)'),
    (401, 26.0, 28.0, 'Malacca Strait approaching Singapore Changi (FL140)'),
    (601, 7.5, 8.2, 'Final descent towards Sylhet Osmani Airport (FL060)')
ON CONFLICT (Flight_No, Place) DO NOTHING;
