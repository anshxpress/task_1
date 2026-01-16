require('dotenv').config();
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

connection.query('DESCRIBE users', (err, results) => {
    if (err) {
        console.error(err);
    } else {
        console.log(results);
    }
    connection.end();
});
