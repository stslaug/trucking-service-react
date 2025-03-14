-- Author: Kevin Blinn

USE team12DBFinal;
SET FOREIGN_KEY_CHECKS = 0;

-- Drop all the tables if they exist
DROP TABLE IF EXISTS AUDIT_LOG;
DROP TABLE IF EXISTS POINT_CHANGE;
DROP TABLE IF EXISTS SPONSOR_DRIVERS;
DROP TABLE IF EXISTS ORDERS;
DROP TABLE IF EXISTS PRODUCT;
DROP TABLE IF EXISTS DEVS;
DROP TABLE IF EXISTS ADMIN;
DROP TABLE IF EXISTS SPONSOR;
DROP TABLE IF EXISTS DRIVERS;
DROP TABLE IF EXISTS USERS;
DROP TABLE IF EXISTS ADDRESS;


SET FOREIGN_KEY_CHECKS = 1;
