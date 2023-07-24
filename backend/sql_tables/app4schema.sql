CREATE DATABASE app4;
USE app4;

CREATE TABLE profesori (
idprofesor INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
username_profesor VARCHAR(45),
email_profesor VARCHAR(80),
password_profesor VARCHAR(40)
);

CREATE TABLE reservationsP (
idReservationP INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
idUser INT NOT NULL,
idlotP INT NOT NULL,
dateReservation DATE
);

CREATE TABLE reservationsS (
idReservation INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
idUser INT NOT NULL,
idlotS INT NOT NULL,
dateReservation DATE
);

CREATE TABLE lotP (
idLotP INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
valueLotP VARCHAR(10),
zona VARCHAR(10)
);

CREATE TABLE lotS (
idlotS INT PRIMARY KEY NOT NULL AUTO_INCREMENT
);

ALTER TABLE `app4`.`reservationsP`
	ADD CONSTRAINT `FK1` FOREIGN KEY(idUser) REFERENCES
		`app4`.`users`(idUser) ON DELETE CASCADE;
ALTER TABLE `app4`.`reservationsP`
	ADD CONSTRAINT `FK2` FOREIGN KEY(idLotP) REFERENCES
		`app4`.`lotP`(idLotP) ON DELETE CASCADE;
ALTER TABLE `app4`.`reservationsS`
	ADD CONSTRAINT `FK3` FOREIGN KEY(idUser) REFERENCES
		`app4`.`users`(idUser) ON DELETE CASCADE;
ALTER TABLE `app4`.`reservationsS`
	ADD CONSTRAINT `FK4` FOREIGN KEY(idLotS) REFERENCES
		`app4`.`lotS`(idLotS) ON DELETE CASCADE;


select * from users;
select * from reservationsP;
select * from reservationsS;
select * from lotP;
select * from lotS;

DELETE FROM reservationsS WHERE idUser = 2 AND idLotS = 3;

-- 
ALTER TABLE reservations MODIFY idLotS INT NULL;
INSERT INTO `app4`.`reservationsP` (`idUser`, `idLotP`, `dateReservation`) VALUES ('10', '1', '2023/6/13');
INSERT INTO `app4`.`reservationsS` (`idUser`, `idLotS`, `dateReservation`) VALUES ('6', '1', '2023/6/16');

-- schimbare tip variabila a coloanei
ALTER TABLE profesori MODIFY password_profesor LONGTEXT;
ALTER TABLE lotP MODIFY zona VARCHAR(10);

ALTER TABLE users
MODIFY userType VARCHAR(10);

-- adaugare coloana noua
ALTER TABLE reservations
ADD dateReservation DATE;

ALTER TABLE lottable
ADD zonaPLot ENUM('A','B');

ALTER TABLE profesori
ADD userType ENUM('student','profesor');

ALTER TABLE lotP ADD valueLotP VARCHAR(10);
ALTER TABLE lotS ADD valueLotS VARCHAR(10);

-- schimbare denumire coloane
ALTER TABLE reservationsS RENAME COLUMN idReservation TO idReservationS;
ALTER TABLE profesori RENAME COLUMN username TO usernameUser;
ALTER TABLE profesori RENAME COLUMN email TO emailUser;
ALTER TABLE profesori RENAME COLUMN password_profesor TO passwordUser;

ALTER TABLE lot RENAME COLUMN idlot TO idLot;
ALTER TABLE lot RENAME COLUMN nrLot TO valueLot;

ALTER TABLE lotP RENAME COLUMN idLot TO idLotP;
ALTER TABLE lotS RENAME COLUMN idlotS TO idLotS;

ALTER TABLE reservations RENAME COLUMN idlotP TO idLotP;
ALTER TABLE reservations RENAME COLUMN idlotS TO idLotS;


-- stergere coloane

ALTER TABLE reservations DROP FOREIGN KEY FK2;
ALTER TABLE reservations DROP COLUMN idLotP;
ALTER TABLE reservations DROP COLUMN idLotS;
ALTER TABLE reservations DROP COLUMN dateReservation;


-- schimbare nume tabel
ALTER TABLE profesori RENAME users; 
ALTER TABLE lottable RENAME lotP; 

-- stergere tabel
DROP TABLE reservations;

-- delete user
DELETE FROM users
WHERE idUser = 8;

-- populare tabela locuri parcare profesori
INSERT INTO `app4`.`lotS`(valueLotS) VALUES ('111');
INSERT INTO `app4`.`lotS`(valueLotS) VALUES ('122');
INSERT INTO `app4`.`lotS`(valueLotS) VALUES ('123');
INSERT INTO `app4`.`lotS`(valueLotS) VALUES ('124');
INSERT INTO `app4`.`lotS`(valueLotS) VALUES ('125');
INSERT INTO `app4`.`lotS`(valueLotS) VALUES ('126');
INSERT INTO `app4`.`lotS`(valueLotS) VALUES ('117');
INSERT INTO `app4`.`lotS`(valueLotS) VALUES ('118');
INSERT INTO `app4`.`lotS`(valueLotS) VALUES ('119');
INSERT INTO `app4`.`lotS`(valueLotS) VALUES ('120');
INSERT INTO `app4`.`lotS`(valueLotS) VALUES ('91');
INSERT INTO `app4`.`lotS`(valueLotS) VALUES ('92');
INSERT INTO `app4`.`lotS`(valueLotS) VALUES ('93');
INSERT INTO `app4`.`lotS`(valueLotS) VALUES ('94');
INSERT INTO `app4`.`lotS`(valueLotS) VALUES ('95');
INSERT INTO `app4`.`lotS`(valueLotS) VALUES ('96');
INSERT INTO `app4`.`lotS`(valueLotS) VALUES ('97');
INSERT INTO `app4`.`lotS`(valueLotS) VALUES ('98');
INSERT INTO `app4`.`lotS`(valueLotS) VALUES ('99');
INSERT INTO `app4`.`lotS`(valueLotS) VALUES ('100');

select * from lotS;

-- 
SELECT * FROM lotP 
LEFT JOIN reservations ON 
	lotP.idLotP = reservations.idLotP 
    WHERE reservations.idReservation IS NULL 
    AND
    lotP.zona = "LEU A" LIMIT 1;
    
SELECT * FROM lotP 
LEFT JOIN reservations ON 
	lotP.idLotP = reservations.idLotP 
    WHERE reservations.idReservation IS NULL 
    AND lotP.zona = "LEU A" 
    AND reservations.dateReservation = "2023-06-13" LIMIT 1;

SELECT * FROM lotP 
LEFT JOIN reservations ON 
	lotP.idLotP = reservations.idLotP 
    WHERE reservations.idLotP IS NULL;

SELECT * FROM lotP
LEFT JOIN reservations 
	ON lotP.idLotP = reservations.idLotP 
	WHERE reservations.idReservation IS NULL 
    AND lotP.zona = "LEU A" 
    AND reservations.dateReservation = "2023-06-13" LIMIT 1;