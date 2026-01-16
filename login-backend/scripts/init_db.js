const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const db = require('../src/config/db');

const initDb = async () => {
    try {
        console.log('Starting database initialization...');

        // 1. Add columns to users table if they don't exist
        const alterUsersQueries = [
            "ADD COLUMN IF NOT EXISTS failed_attempts INT DEFAULT 0",
            "ADD COLUMN IF NOT EXISTS is_locked BOOLEAN DEFAULT FALSE",
            "ADD COLUMN IF NOT EXISTS profile_image VARCHAR(255)"
        ];

        for (const columnQuery of alterUsersQueries) {
            await new Promise((resolve, reject) => {
                db.query(`ALTER TABLE users ${columnQuery}`, (err) => {
                    if (err && err.code !== 'ER_DUP_FIELDNAME') {
                        // Ignore duplicate field error if generic SQL doesn't support IF NOT EXISTS for columns in all versions
                        // But standard MySQL 8.0+ syntax or just verify manually. 
                        // Actually 'ADD COLUMN IF NOT EXISTS' is MariaDB 10.2+. MySQL 8.0 uses simple ADD, assumes check.
                        // For safety in older MySQL, we often just try and fail silently on dup.
                        // Let's rely on the query specific logic or simple try/catch.
                        // To be safer/generic: try adding, catch error.

                        // Revised approach: simplified just catch error.
                        console.log(`Column might already exist or error: ${err.message}`);
                    }
                    resolve();
                });
            });
        }

        // A more robust way for MySQL (which often doesn't support IF NOT EXISTS in ALTER TABLE directly in all versions)
        // is to ignore the error if it says "Duplicate column name".

        const addColumnSafe = (colName, colDef) => {
            return new Promise((resolve) => {
                db.query(`ALTER TABLE users ADD COLUMN ${colName} ${colDef}`, (err) => {
                    if (err) {
                        if (err.code === 'ER_DUP_FIELDNAME') {
                            console.log(`Column ${colName} already exists.`);
                        } else {
                            console.error(`Error adding column ${colName}:`, err.message);
                        }
                    } else {
                        console.log(`Added column ${colName}.`);
                    }
                    resolve();
                });
            });
        };

        await addColumnSafe('failed_attempts', 'INT DEFAULT 0');
        await addColumnSafe('is_locked', 'BOOLEAN DEFAULT FALSE');
        await addColumnSafe('profile_image', 'VARCHAR(255)');


        // 2. Create login_attempts table
        const createLoginAttemptsTable = `
            CREATE TABLE IF NOT EXISTS login_attempts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                ip_address VARCHAR(45),
                status ENUM('SUCCESS', 'FAILED', 'LOCKED') NOT NULL,
                user_image VARCHAR(255),
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
            )
        `;

        await new Promise((resolve, reject) => {
            db.query(createLoginAttemptsTable, (err) => {
                if (err) return reject(err);
                console.log('login_attempts table created or already exists.');
                resolve();
            });
        });

        console.log('Database initialization completed.');
        process.exit(0);

    } catch (error) {
        console.error('Database initialization failed:', error);
        process.exit(1);
    }
};

initDb();
