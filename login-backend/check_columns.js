require('dotenv').config();
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

const query = "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users' AND COLUMN_NAME IN ('failed_attempts', 'is_locked')";

connection.query(query, [process.env.DB_NAME], (err, results) => {
    if (err) {
        console.error(err);
    } else {
        console.log("Found columns:", results.map(r => r.COLUMN_NAME));
    }
    connection.end();
});
