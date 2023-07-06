CREATE SCHEMA IF NOT EXISTS cinema;
USE cinema;

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS seats;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE seats (
    seat_id INT AUTO_INCREMENT PRIMARY KEY,
    status VARCHAR(10) NOT NULL,
    user_email VARCHAR(50)
);


INSERT INTO users(email)
    VALUES ('megaseves@gmail.com');



DROP PROCEDURE IF EXISTS insertData;

DELIMITER $$
CREATE PROCEDURE insertData(maxSeat INT, freeSeat INT)
BEGIN
    SET @i = 1;
    SET @free = 1;

    WHILE @i <= (maxSeat-freeSeat) DO
            INSERT INTO `seats` (status, user_email) VALUES ('sold', 'megaseves@gmail.com');
            SET @i = @i + 1;
        END WHILE;
    WHILE @free <= freeSeat DO
            INSERT INTO `seats` (status) VALUES ('free');
            SET @free = @free + 1;
        END WHILE;

END $$
DELIMITER ;

CALL insertData(30, 2);