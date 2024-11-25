USE team12DBFinal;

/* -------------- DEVS -------------- */  
/* Insert Kevin (DEV) */
-- Insert into ADDRESS table
INSERT INTO ADDRESS (STREET, CITY, STATE, ZIP_CODE, COUNTRY)
VALUES ('21 Junction Way', 'Bluffton', 'SC', '29910', 'USA');
-- Insert into USERS table
INSERT INTO USERS (USERNAME, EMAIL, TIME_CREATED, USER_TYPE, F_NAME, L_NAME, ADDRESS_ID, PHONENUM)
VALUES ('kblinn', 'kblinn@clemson.edu', '2024-11-13 15:23:24', 'DEV', 'Kevin', 'Blinn', LAST_INSERT_ID(), '6316269577');
-- Insert into DEVS table
INSERT INTO DEVS (DEV_ID, FirstName, LastName, Description)
VALUES (LAST_INSERT_ID(), 'Kevin', 'Blinn', 'Kevin is a software developer with expertise in web development, passionate about creating engaging user experiences and enhancing projects through innovative ideas.');

/* Insert Tyler (DEV) */
-- Insert into ADDRESS table
INSERT INTO ADDRESS (STREET, CITY, STATE, ZIP_CODE, COUNTRY)
VALUES ('123 Tiger Blvd', 'Clemson', 'SC', '29671', 'USA');
-- Insert into USERS table
INSERT INTO USERS (USERNAME, EMAIL, TIME_CREATED, USER_TYPE, F_NAME, L_NAME, ADDRESS_ID, PHONENUM)
VALUES ('stslaug', 'stslaug@gmail.com', '2024-11-12 03:41:44', 'DEV', 'Sean', 'Slaughter', LAST_INSERT_ID(), '1234567891');
-- Insert into DEVS table
INSERT INTO DEVS (DEV_ID, FirstName, LastName, Description)
VALUES (LAST_INSERT_ID(), 'Sean', 'Slaughter', 'I am a software engineer at Clemson. I enjoy creating software, with my experience has been heavily focuses on back-end development working with multi-service communication utilizing REST and SOAP. My goal is to learn more about AWS and cloud services, and how to leverage this toolstack to my future careers.');

/* Insert Chase (DEV) */
-- Insert into ADDRESS table
INSERT INTO ADDRESS (STREET, CITY, STATE, ZIP_CODE, COUNTRY)
VALUES ('208 Pine Tree Dr', 'Simpsonville', 'SC', '29680', 'USA');
-- Insert into USERS table
INSERT INTO USERS (USERNAME, EMAIL, TIME_CREATED, USER_TYPE, F_NAME, L_NAME, ADDRESS_ID, PHONENUM)
VALUES ('dunlap7', 'dunlap7@clemson.edu', '2024-11-13 18:55:08', 'DEV', 'Chase', 'Dunlap', LAST_INSERT_ID(), '555-555-5556');
-- Insert into DEVS table
INSERT INTO DEVS (DEV_ID, FirstName, LastName, Description)
VALUES (LAST_INSERT_ID(), 'Chase', 'Dunlap', 'Chase is a software developer with an emphasis in networking. My goal is to provide the best application possible, and to focus on concrete and open collaboration and communication.');

/* Insert Grayson (DEV) */
-- Insert into ADDRESS table
INSERT INTO ADDRESS (STREET, CITY, STATE, ZIP_CODE, COUNTRY)
VALUES ('123 Test Road', 'Clemson', 'SC', '29678', 'USA');
-- Insert into USERS table
INSERT INTO USERS (USERNAME, EMAIL, TIME_CREATED, USER_TYPE, F_NAME, L_NAME, ADDRESS_ID, PHONENUM)
VALUES ('glwhitaker', 'glwhita@clemson.edu', '2024-11-07 19:57:43', 'DEV', 'test2', 'update2', LAST_INSERT_ID(), '1234567890');
-- Insert into DEVS table
INSERT INTO DEVS (DEV_ID, FirstName, LastName, Description)
VALUES (LAST_INSERT_ID(), 'Grayson', 'Whitaker', 'I am a software developer at Clemson University. My goal as a developer is to create meaningful apps that are both creative and innovative. I have a strong passion for technology, and a desire to learn and grow as a developer. I am excited to work with my team to create amazing projects.');
/* ------------------------------------------------ */


/* -------------- DRIVERS -------------- */

/* Insert John Doe */
-- Insert into ADDRESS table
INSERT INTO ADDRESS (STREET, CITY, STATE, ZIP_CODE, COUNTRY)
VALUES ('456 Driver Lane', 'Greenville', 'SC', '29605', 'USA');
-- Insert into USERS table
INSERT INTO USERS (USERNAME, EMAIL, TIME_CREATED, USER_TYPE, F_NAME, L_NAME, ADDRESS_ID, PHONENUM)
VALUES ('jdoe', 'jdoe@gmail.com', '2024-11-15 10:30:00', 'DRIVER', 'John', 'Doe', LAST_INSERT_ID(), '9876543210');
-- Insert into DRIVERS table
INSERT INTO DRIVERS (DRIVER_ID, POINT_TOTAL)
VALUES (LAST_INSERT_ID(), 100); -- Example point total

/* ------------------------------------------------ */


/* -------------- SPONSOR -------------- */

/* Insert Example Sponsor */
-- Insert into ADDRESS table
INSERT INTO ADDRESS (STREET, CITY, STATE, ZIP_CODE, COUNTRY)
VALUES ('789 Sponsor Blvd', 'Charleston', 'SC', '29401', 'USA');
-- Insert into USERS table
INSERT INTO USERS (USERNAME, EMAIL, TIME_CREATED, USER_TYPE, F_NAME, L_NAME, ADDRESS_ID, PHONENUM)
VALUES ('sponsor101', 'sponsor101@gmail.com', '2024-11-16 14:45:00', 'SPONSOR', 'Jane', 'Smith', LAST_INSERT_ID(), '6543210987');
-- Insert into SPONSOR table
INSERT INTO SPONSOR (SPONSOR_ID, COMPANY_NAME)
VALUES (LAST_INSERT_ID(), 'Jane Tech Solutions');

/* ------------------------------------------------ */


/* -------------- ADMIN -------------- */

/* Insert Example Admin */
-- Insert into ADDRESS table
INSERT INTO ADDRESS (STREET, CITY, STATE, ZIP_CODE, COUNTRY)
VALUES ('101 Admin St', 'Columbia', 'SC', '29201', 'USA');
-- Insert into USERS table
INSERT INTO USERS (USERNAME, EMAIL, TIME_CREATED, USER_TYPE, F_NAME, L_NAME, ADDRESS_ID, PHONENUM)
VALUES ('adminuser', 'adminuser@gmail.com', '2024-11-17 09:00:00', 'ADMIN', 'Alice', 'Johnson', LAST_INSERT_ID(), '3216549870');
-- Insert into ADMIN table
INSERT INTO ADMIN (ADMIN_ID)
VALUES (LAST_INSERT_ID());

/* ------------------------------------------------ */


  
