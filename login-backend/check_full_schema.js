require('dotenv').config();
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

function checkSchema() {
    connection.query('DESCRIBE users', (err, usersRes) => {
        if (err) console.error("Error users:", err.message);
        else {
            console.log("\n--- USERS TABLE ---");
            usersRes.forEach(col => console.log(`${col.Field} (${col.Type})`));
        }

        connection.query('DESCRIBE login_attempts', (err, attemptsRes) => {
            if (err) console.error("Error login_attempts:", err.message);
            else {
                console.log("\n--- LOGIN_ATTEMPTS TABLE ---");
                attemptsRes.forEach(col => console.log(`${col.Field} (${col.Type})`));
            }
            connection.end();
        });
    });
}

checkSchema();
