CREATE TABLE IF NOT EXISTS states (
    id   INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(10)  NOT NULL
    );

CREATE TABLE IF NOT EXISTS districts (
    id         INT PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    state_code VARCHAR(10)  NOT NULL
    );

CREATE TABLE IF NOT EXISTS talukas (
    id          INT PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    district_id INT NOT NULL,
    CONSTRAINT fk_taluka_district FOREIGN KEY (district_id) REFERENCES districts(id)
    );