-- Author: Kevin Blinn

DROP SCHEMA IF EXISTS team12DBFinal;
CREATE SCHEMA team12DBFinal;
USE team12DBFinal;

DROP USER IF EXISTS 'dbtester';
CREATE USER 'dbtester' IDENTIFIED BY 'CPSC4910'; 
GRANT ALL ON team12DBFinal.* TO 'dbtester';

-- Table: ADDRESS
CREATE TABLE ADDRESS (
    ADDRESS_ID INT AUTO_INCREMENT PRIMARY KEY,
    STREET VARCHAR(100) NOT NULL,
    CITY VARCHAR(50) NOT NULL,
    STATE VARCHAR(50) NOT NULL,
    ZIP_CODE VARCHAR(10) NOT NULL,
    COUNTRY VARCHAR(50) DEFAULT 'USA'
);

-- Supertype: USERS
CREATE TABLE USERS (
    USER_ID INT AUTO_INCREMENT PRIMARY KEY,
    USERNAME VARCHAR(50) NOT NULL,
    EMAIL VARCHAR(100) NOT NULL,
    TIME_CREATED TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    F_NAME VARCHAR(50) NOT NULL,
    L_NAME VARCHAR(50) NOT NULL,
    ADDRESS_ID INT,
    PHONENUM VARCHAR(15),
    PAYMENT VARCHAR(50),
    USER_TYPE ENUM('DRIVER', 'SPONSOR', 'ADMIN', 'DEV') NOT NULL,
    FOREIGN KEY (ADDRESS_ID) REFERENCES ADDRESS(ADDRESS_ID) ON DELETE CASCADE
);

-- Subtype: DRIVERS
CREATE TABLE DRIVERS (
    DRIVER_ID INT AUTO_INCREMENT PRIMARY KEY,
    POINT_TOTAL INT DEFAULT 0,
    FOREIGN KEY (DRIVER_ID) REFERENCES USERS(USER_ID) ON DELETE CASCADE
);

-- Subtype: SPONSOR
CREATE TABLE SPONSOR (
    SPONSOR_ID INT PRIMARY KEY,
    COMPANY_NAME VARCHAR(100),
    FOREIGN KEY (SPONSOR_ID) REFERENCES USERS(USER_ID) ON DELETE CASCADE
);

-- Subtype: ADMIN
CREATE TABLE ADMIN (
    ADMIN_ID INT PRIMARY KEY,
    FOREIGN KEY (ADMIN_ID) REFERENCES USERS(USER_ID) ON DELETE CASCADE
);

-- Subtype: DEVS
CREATE TABLE DEVS (
    DEV_ID INT PRIMARY KEY,
    FirstName VARCHAR(50),
    LastName VARCHAR(50),
    Description TEXT,
    FOREIGN KEY (DEV_ID) REFERENCES USERS(USER_ID) ON DELETE CASCADE
);

-- Table: PRODUCT
CREATE TABLE PRODUCT (
    PRODUCT_ID INT AUTO_INCREMENT PRIMARY KEY,
    SPONSOR_ID INT NOT NULL,
    NAME VARCHAR(100) NOT NULL,
    DESCRIPTION TEXT,
    COST DECIMAL(10, 2) NOT NULL,
    IS_AVAILABLE BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (SPONSOR_ID) REFERENCES SPONSOR(SPONSOR_ID) ON DELETE CASCADE
);

-- Table: ORDERS
CREATE TABLE ORDERS (
    ORDER_ID INT AUTO_INCREMENT PRIMARY KEY,      
    DRIVER_ID INT NOT NULL,                        
    ORDER_STATUS ENUM('PENDING', 'COMPLETED', 'CANCELLED') DEFAULT 'PENDING', 
    ORDER_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    POINTS_USED INT NOT NULL,                     
    FOREIGN KEY (DRIVER_ID) REFERENCES DRIVERS(DRIVER_ID) ON DELETE CASCADE
);

-- Table: ORDERS_ITEMS
CREATE TABLE ORDER_ITEMS (
    ITEM_ID VARCHAR(255) NOT NULL,
    ORDER_ID INT NOT NULL,
    TITLE VARCHAR(255) NOT NULL,
    PRICE DECIMAL(10, 2) NOT NULL,
    PRIMARY KEY (ITEM_ID, ORDER_ID),
    FOREIGN KEY (ORDER_ID) REFERENCES ORDERS(ORDER_ID) ON DELETE CASCADE
);


-- Table: SPONSOR_DRIVERS
CREATE TABLE SPONSOR_DRIVERS (
    SP_DR_ID INT AUTO_INCREMENT PRIMARY KEY,
    SPONSOR_ID INT NOT NULL,
    DRIVER_ID INT NOT NULL,
    ASSOCIATE_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ASSOCIATE_STATUS ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE',
    FOREIGN KEY (SPONSOR_ID) REFERENCES SPONSOR(SPONSOR_ID) ON DELETE CASCADE,
    FOREIGN KEY (DRIVER_ID) REFERENCES DRIVERS(DRIVER_ID) ON DELETE CASCADE
);

-- Table: POINT_CHANGE
CREATE TABLE POINT_CHANGE (
    CHANGE_ID INT AUTO_INCREMENT PRIMARY KEY,
    DRIVER_ID INT NOT NULL,
    SPONSOR_ID INT NOT NULL,
    ORDER_ID INT,
    POINTS_CHANGED INT NOT NULL,
    REASON TEXT NOT NULL,
    TIMESTAMP TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (DRIVER_ID) REFERENCES DRIVERS(DRIVER_ID) ON DELETE CASCADE,
    FOREIGN KEY (SPONSOR_ID) REFERENCES SPONSOR(SPONSOR_ID) ON DELETE CASCADE,
    FOREIGN KEY (ORDER_ID) REFERENCES ORDERS(ORDER_ID) ON DELETE SET NULL
);

-- Table: AUDIT_LOG
CREATE TABLE AUDIT_LOG (
    LOG_ID INT AUTO_INCREMENT PRIMARY KEY,
    ADMIN_ID INT NOT NULL,
    TIMESTAMP TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ACTION_TYPE VARCHAR(50) NOT NULL,
    ACTION_DESCRIPTION TEXT,
    STATUS ENUM('SUCCESS', 'FAILURE') NOT NULL,
    ENTITY_AFFECTED VARCHAR(50),
    FOREIGN KEY (ADMIN_ID) REFERENCES ADMIN(ADMIN_ID) ON DELETE CASCADE
);

