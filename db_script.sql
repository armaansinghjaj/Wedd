DROP SCHEMA IF EXISTS `wedddb`;
CREATE SCHEMA IF NOT EXISTS `wedddb` DEFAULT CHARACTER SET latin1;
USE `wedddb`;


-- -----------------------------------------------------
-- Table `wedddb`.`user_roles`
-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS `wedddb`.`user_roles` (
  `role_id` INT(10) NOT NULL AUTO_INCREMENT,
  `role_title` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`role_id`)
);

-- -----------------------------------------------------
-- Table `wedddb`.`customer_car`
-- -----------------------------------------------------
-- Deletes after every ride completion

CREATE TABLE IF NOT EXISTS `wedddb`.`customer_car` (
  `customer_car_id` INT(10) NOT NULL AUTO_INCREMENT,
  `model_number` VARCHAR(50) NOT NULL,
  `color` VARCHAR(20) NOT NULL,
  `licence_plate` VARCHAR(10) NOT NULL,
  `car_type` VARCHAR(1) NOT NULL,
  PRIMARY KEY (`customer_car_id`),
  CONSTRAINT CHK_Type CHECK (car_type IN ('A', 'M')) -- Automatic or manual
);


-- -----------------------------------------------------
-- Table `wedddb`.`customer`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `wedddb`.`customer` (
  `customer_id` INT(10) NOT NULL AUTO_INCREMENT,
  `customer_pp` VARCHAR(255), -- profile picture
  `car_id` INT(10), -- make it null after ride completion
  `email` VARCHAR(40) NOT NULL,
  `name` VARCHAR(50) NOT NULL,
  `password` VARCHAR(20) NOT NULL,
  `reset_password_uuid` VARCHAR(50),
  `register_account_uuid` VARCHAR(50),
  `authentication_uuid` VARCHAR(50),
  `tracking_uuid` VARCHAR(50),
  `role` INT(2) NOT NULL DEFAULT 3,
  PRIMARY KEY (`customer_id`),
  INDEX `fk_c_car_idx` (`car_id` ASC),
  CONSTRAINT `fk_c_car_id`
    FOREIGN KEY (`car_id`)
    REFERENCES `wedddb`.`customer_car` (`customer_car_id`),
  INDEX `fk_c_role` (`role` ASC),
  CONSTRAINT `fk_c_role`
    FOREIGN KEY (`role`)
    REFERENCES `wedddb`.`user_roles` (`role_id`)
);


-- -----------------------------------------------------
-- Table `wedddb`.`driver`
-- -----------------------------------------------------
/* CREATE TABLE IF NOT EXISTS `wedddb`.`driver` (
  `driver_id` INT(10) NOT NULL AUTO_INCREMENT,
  `driver_pp` VARCHAR(255),
  `email` VARCHAR(40) NOT NULL,
  `name` VARCHAR(50) NOT NULL,
  `password` VARCHAR(20) NOT NULL,
  `reset_password_uuid` VARCHAR(50),
  `register_account_uuid` VARCHAR(50),
  `authentication_uuid` VARCHAR(50),
  `tracking_uuid` VARCHAR(50),
  `role` INT(2) NOT NULL DEFAULT 2,
  PRIMARY KEY (`driver_id`),
  INDEX `fk_d_role` (`role` ASC),
  CONSTRAINT `fk_d_role`
    FOREIGN KEY (`role`)
    REFERENCES `wedddb`.`user_roles` (`role_id`)
); */

-- -----------------------------------------------------
-- Table `wedddb`.`employees`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `wedddb`.`employees` (
  `employee_id` INT(10) NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(40) NOT NULL,
  `name` VARCHAR(50) NOT NULL,
  `password` VARCHAR(20) NOT NULL,
  `reset_password_uuid` VARCHAR(50),
  `register_account_uuid` VARCHAR(50),
  `authentication_uuid` VARCHAR(50),
  `tracking_uuid` VARCHAR(50),
  `role` INT(2) NOT NULL,
  PRIMARY KEY (`employee_id`),
  INDEX `fk_a_role` (`role` ASC),
  CONSTRAINT `fk_a_role`
    FOREIGN KEY (`role`)
    REFERENCES `wedddb`.`user_roles` (`role_id`)
);


-- -----------------------------------------------------
-- Table `wedddb`.`driver_car`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `wedddb`.`driver_car` (
  `driver_car_id` INT(10) NOT NULL AUTO_INCREMENT,
  `model_number` VARCHAR(50) NOT NULL,
  `color` VARCHAR(20) NOT NULL,
  /* `car_type` VARCHAR(1) NOT NULL, */
  `licence_plate` VARCHAR(10) NOT NULL,
  PRIMARY KEY (`driver_car_id`)
  /* CONSTRAINT CHK_Type CHECK car_type IN ('A', 'M') -- Automatic or manual */
);


-- -----------------------------------------------------
-- Table `wedddb`.`admin`
-- -----------------------------------------------------
/* CREATE TABLE IF NOT EXISTS `wedddb`.`admin` (
  `admin_id` INT(10) NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(40) NOT NULL,
  `name` VARCHAR(50) NOT NULL,
  `password` VARCHAR(20) NOT NULL,
  `reset_password_uuid` VARCHAR(50),
  `register_account_uuid` VARCHAR(50),
  `authentication_uuid` VARCHAR(50),
  `role` INT(2) NOT NULL DEFAULT 1,
  PRIMARY KEY (`admin_id`),
  INDEX `fk_a_role` (`role` ASC),
  CONSTRAINT `fk_a_role`
    FOREIGN KEY (`role`)
    REFERENCES `wedddb`.`user_roles` (`role_id`)
); */


-- -----------------------------------------------------
-- Table `wedddb`.`active_driver`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `wedddb`.`active_driver` (
  `driver_1_id` INT(10) NOT NULL,
  `driver_2_id` INT(10),
  `car_id` INT(10) NOT NULL,
  INDEX `fk_driver_1_idx` (`driver_1_id` ASC),
  CONSTRAINT `fk_driver_1_id`
    FOREIGN KEY (`driver_1_id`)
    REFERENCES `wedddb`.`driver` (`driver_id`),
  INDEX `fk_driver_2_idx` (`driver_2_id` ASC),
  CONSTRAINT `fk_driver_2_id`
    FOREIGN KEY (`driver_2_id`)
    REFERENCES `wedddb`.`driver` (`driver_id`),
  INDEX `fk_d_car_idx` (`car_id` ASC),
  CONSTRAINT `fk_d_car_id`
    FOREIGN KEY (`car_id`)
    REFERENCES `wedddb`.`driver_car` (`driver_car_id`)
);

-- -----------------------------------------------------
-- Table `wedddb`.`current_rides`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `wedddb`.`current_rides` (
  `driver_1_id` INT(10) NOT NULL, -- driver 1 drives customer car
  `customer_id` INT(10) NOT NULL,
  `pickup_location` VARCHAR(255) NOT NULL, -- latitude;longitude
  `drop_location` VARCHAR(255) NOT NULL, -- latitude;longitude
  `distance` DECIMAL(10,2) NOT NULL,
  `time` INT(20) NOT NULL, -- speed from API to calculate time using distance
  `price` DECIMAL(10,2) NOT NULL,
  INDEX `fk_driver_id_idx` (`driver_1_id` ASC),
  CONSTRAINT `fk_driver_id`
    FOREIGN KEY (`driver_1_id`)
    REFERENCES `wedddb`.`active_driver` (`driver_1_id`),
  INDEX `fk_customer_idx` (`customer_id` ASC),
  CONSTRAINT `fk_customer_id`
    FOREIGN KEY (`customer_id`)
    REFERENCES `wedddb`.`customer` (`customer_id`)
);

-- -----------------------------------------------------
-- Table `wedddb`.`news`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `wedddb`.`news` (
  `news_id` INT(2) NOT NULL AUTO_INCREMENT,
  `start_date` DATE,
  `end_date` DATE,
  `headline` VARCHAR(500),
  `message` VARCHAR(1000),
  `color` VARCHAR(7),
  PRIMARY KEY (`news_id`)
);

-- -----------------------------------------------------
-- Table `wedddb`.`background`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `wedddb`.`background` (
  `home_page` VARCHAR(255),
  `about_page` VARCHAR(255),
  `contact_page` VARCHAR(255),
  `news_page` VARCHAR(255)
);

-- -----------------------------------------------------
-- Table `wedddb`.`services`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `wedddb`.`services` (
  `service_id` TINYINT(2) NOT NULL,
  `service_name` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`service_id`)
);

-- -----------------------------------------------------
-- Table `wedddb`.`requests`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `wedddb`.`requests` (
  `request_id` INT(10) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `address` VARCHAR(500) NOT NULL,
  `phone` VARCHAR(255) NOT NULL,
  `service_id` TINYINT(2) NOT NULL,
  `email` VARCHAR(50) NOT NULL,
  `comments` VARCHAR(1000),
  `updates` TINYINT(1) NOT NULL,
  PRIMARY KEY (`request_id`),
  INDEX `fk_service_idx` (`service_id` ASC),
  CONSTRAINT `fk_service_id`
    FOREIGN KEY (`service_id`)
    REFERENCES `wedddb`.`services` (`service_id`),
  CONSTRAINT CHK_service_id CHECK (service_id >= 1 AND service_id <= 4),
  CONSTRAINT CHK_updates CHECK (updates IN ('0', '1'))
);

-- -----------------------------------------------------
-- Table `wedddb`.`requests`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `wedddb`.`rideRequests` (
  `request_id` INT(10) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(50) NOT NULL,
  `phone` VARCHAR(255) NOT NULL,
  `pickup_address` VARCHAR(500) NOT NULL,
  `destination` VARCHAR(500) NOT NULL,
  PRIMARY KEY (`request_id`)
);

INSERT INTO services (service_id, service_name)
VALUES(1,"shuttle");
INSERT INTO services (service_id, service_name)
VALUES(2,"chauffeur");
INSERT INTO services (service_id, service_name)
VALUES(3,"drive");
INSERT INTO services (service_id, service_name)
VALUES(4,"own");

INSERT INTO user_roles (role_id, role_title)
VALUES (0,'Administrator');
INSERT INTO user_roles (role_id, role_title)
VALUES (0,'Driver');
INSERT INTO user_roles (role_id, role_title)
VALUES (0,'Customer');

INSERT INTO employees (driver_id, email, name, password, role)
VALUES(NULL,'admin1`@gmail.com','Admin 1','password', 1);
INSERT INTO employees (driver_id, email, name, password, role)
VALUES(NULL,'admin2@gmail.com','Admin 1','password', 1);
INSERT INTO employees (driver_id, email, name, password, role)
VALUES(NULL,'admin3@gmail.com','Admin 1','password', 1);
INSERT INTO employees (driver_id, email, name, password, role)
VALUES(NULL,'driver1@gmail.com','Driver 1','password', 2);
INSERT INTO employees (driver_id, email, name, password, role)
VALUES(NULL,'driver2@gmail.com','Driver 1','password', 2);
INSERT INTO employees (driver_id, email, name, password, role)
VALUES(NULL,'driver3@gmail.com','Driver 1','password', 2);

INSERT INTO background
VALUES ("image/homepage.jpg","image/aboutpage.jpg","image/contactpage.jpg","image/newspage.png");

INSERT INTO admin (admin_id, email , name, password)
VALUES(NULL,'armaan@gmail.com','armaan singh','munni');
INSERT INTO admin (admin_id, email , name, password)
VALUES(NULL,'prince@gmail.com','prince agam','basanti');
INSERT INTO admin (admin_id, email , name, password)
VALUES(NULL,'daniel@gmail.com','daniel wong','daniel');

INSERT INTO customer (customer_id, email, name, password)
VALUES(NULL,'armaan@gmail.com','armaan singh','munni');
INSERT INTO customer (customer_id, email, name, password)
VALUES(NULL,'prince@gmail.com','prince agam','basanti');
INSERT INTO customer (customer_id, email, name, password)
VALUES(NULL,'daniel@gmail.com','daniel wong','daniel');
