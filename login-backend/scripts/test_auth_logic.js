const BASE_URL = 'http://localhost:5000/api/auth';
const TEST_EMAIL = 'test_lock_logic@example.com';
const TEST_PASSWORD = 'password123';
const WRONG_PASSWORD = 'wrongpassword';

async function testAuthLogic() {
    try {
        console.log('Starting Auth Logic Verifier...');

        // Helper for fetch post
        const post = async (url, data) => {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const text = await response.text();
            let json;
            try {
                json = JSON.parse(text);
            } catch (e) {
                json = { message: text };
            }
            return { status: response.status, data: json };
        };

        // 1. Signup a test user
        console.log('\n--- Step 1: Register Test User ---');
        try {
            const res = await post(`${BASE_URL}/signup`, {
                full_name: 'Test Lock Logic',
                email: TEST_EMAIL,
                password: TEST_PASSWORD
            });
            if (res.status === 201) console.log('User registered.');
            else if (res.status === 409) console.log('User already exists, proceeding.');
            else throw new Error(`Signup failed: ${res.data.message}`);
        } catch (err) {
            console.log(`Signup check error: ${err.message}`);
        }

        // 2. Perform 5 failed login attempts
        console.log('\n--- Step 2: Simulate 5 Failed Attempts ---');
        for (let i = 1; i <= 5; i++) {
            process.stdout.write(`Attempt ${i}: `);
            const res = await post(`${BASE_URL}/login`, {
                email: TEST_EMAIL,
                password: WRONG_PASSWORD
            });

            if (res.status === 200) {
                console.log('Unexpected Success! (Should fail)');
            } else {
                console.log(`Failed as expected. Status: ${res.status}, Message: ${res.data.message}`);
                if (i === 5 && res.status === 403) {
                    console.log('SUCCESS: Account locked on 5th attempt (after 4 failures).');
                } else if (i < 5 && res.status === 401) {
                    // correct
                } else if (i === 5 && res.status !== 403) {
                    console.error('FAILURE: Account SHOULD be locked on 5th attempt.');
                }
            }
        }

        // 3. Try correct password (should fail if locked)
        console.log('\n--- Step 3: Try Correct Password (Should be Locked) ---');
        const resLocked = await post(`${BASE_URL}/login`, {
            email: TEST_EMAIL,
            password: TEST_PASSWORD
        });

        if (resLocked.status === 403) {
            console.log('SUCCESS: Correct password blocked by lock.');
        } else if (resLocked.status === 200) {
            console.log('FAILURE: Login with correct password succeeded, but account should be locked.');
        } else {
            console.log(`Unexpected result: ${resLocked.status} ${resLocked.data.message}`);
        }

        console.log('\n--- Test Complete ---');

    } catch (error) {
        console.error('Test failed:', error);
    }
}

testAuthLogic();
