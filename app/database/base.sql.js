'use strict';
module.exports = [

    `CREATE TABLE users (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(30),
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        password_salt VARCHAR(255) NOT NULL,
        active boolean NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`,

];
