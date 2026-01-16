const axios = require('axios');
require('dotenv').config();

const BASE_URL = `http://localhost:${process.env.PORT || 5000}/api/auth`;
const TEST_EMAIL = "test@example.com"; // Ensure this user exists or create it
const WRONG_PASSWORD = "wrongpassword";

async function testLockout() {
    console.log("Starting Lockout Test...");

    // Note: This script assumes the user exists. 
    // In a real test we might want to create a temp user or reset an existing one first.
    // For now, we'll try to trigger the lockout on a user.

    try {
        for (let i = 1; i <= 6; i++) {
            console.log(`\nAttempt ${i}: Sending login request...`);
            try {
                const response = await axios.post(`${BASE_URL}/login`, {
                    email: TEST_EMAIL,
                    password: WRONG_PASSWORD
                });
                console.log(`Response: ${response.status} - ${response.data.message}`);
            } catch (error) {
                if (error.response) {
                    console.log(`Error: ${error.response.status} - ${error.response.data.message}`);
                    if (error.response.data.remainingAttempts !== undefined) {
                        console.log(`Remaining Attempts: ${error.response.data.remainingAttempts}`);
                    }
                } else {
                    console.log("Network Error or Server Down:", error.message);
                }
            }
        }
    } catch (err) {
        console.error("Unexpected error:", err);
    }
}

testLockout();
