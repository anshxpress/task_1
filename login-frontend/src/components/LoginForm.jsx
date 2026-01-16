import React, { useState } from "react";
import api from "../services/api";
import Modal from "./Modal";

const LoginForm = ({ switchToSignup }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [image, setImage] = useState(null);
    const [error, setError] = useState("");
    const [attemptsLeft, setAttemptsLeft] = useState(null);
    const [showLockModal, setShowLockModal] = useState(false);

    const validateForm = () => {
        // Email regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address.");
            return false;
        }

        // Password length
        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return false;
        }

        // Image type validation
        if (image) {
            const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
            if (!validTypes.includes(image.type)) {
                setError("Please upload a valid image (jpg, jpeg, png).");
                return false;
            }
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setAttemptsLeft(null);

        if (!validateForm()) return;

        const formData = new FormData();
        formData.append("email", email);
        formData.append("password", password);
        if (image) formData.append("user_image", image);

        try {
            await api.post("/auth/login", formData);
            alert("Login successful!"); // Or redirect
            setEmail("");
            setPassword("");
            setImage(null);
            setAttemptsLeft(null);
        } catch (err) {
            const status = err.response?.status;
            const msg = err.response?.data?.message || "Login failed";

            if (status === 403) {
                setShowLockModal(true);
            } else {
                setError(msg);
            }

            if (err.response?.data?.remainingAttempts !== undefined) {
                setAttemptsLeft(err.response.data.remainingAttempts);
            }
        }
    };

    return (
        <>
            <form
                onSubmit={handleSubmit}
                style={{
                    width: "100%",
                    maxWidth: "400px",
                    padding: "20px",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    backgroundColor: "#fff",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
                }}
            >
                <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Login</h2>

                {error && (
                    <div style={{
                        backgroundColor: '#fee2e2',
                        color: '#dc2626',
                        padding: '10px',
                        borderRadius: '4px',
                        marginBottom: '10px'
                    }}>
                        {error}
                    </div>
                )}

                {attemptsLeft !== null && attemptsLeft > 0 && (
                    <div style={{
                        backgroundColor: '#ffedd5',
                        color: '#c2410c',
                        padding: '10px',
                        borderRadius: '4px',
                        marginBottom: '10px'
                    }}>
                        Warning: {attemptsLeft} attempts remaining
                    </div>
                )}

                <div style={{ marginBottom: "15px" }}>
                    <label style={{ display: "block", marginBottom: "5px" }}>Email</label>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{
                            width: "100%",
                            padding: "10px",
                            borderRadius: "4px",
                            border: "1px solid #ddd",
                            boxSizing: "border-box"
                        }}
                    />
                </div>

                <div style={{ marginBottom: "15px" }}>
                    <label style={{ display: "block", marginBottom: "5px" }}>Password</label>
                    <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                        style={{
                            width: "100%",
                            padding: "10px",
                            borderRadius: "4px",
                            border: "1px solid #ddd",
                            boxSizing: "border-box"
                        }}
                    />
                </div>

                <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", marginBottom: "5px" }}>Profile Photo (Optional)</label>
                    <input
                        type="file"
                        accept="image/png, image/jpeg, image/jpg"
                        onChange={(e) => setImage(e.target.files[0])}
                        style={{ width: "100%" }}
                    />
                </div>

                <button
                    type="submit"
                    style={{
                        width: "100%",
                        padding: "12px",
                        backgroundColor: "#007bff",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "16px",
                        fontWeight: "bold"
                    }}
                >
                    Login
                </button>

                <p style={{ marginTop: "15px", textAlign: "center" }}>
                    Don’t have an account?{" "}
                    <span
                        onClick={switchToSignup}
                        style={{ color: "#007bff", cursor: "pointer", fontWeight: "bold" }}
                    >
                        Sign up
                    </span>
                </p>
            </form>

            <Modal
                isOpen={showLockModal}
                onClose={() => setShowLockModal(false)}
                title="Account Locked"
            >
                <p style={{ color: '#dc2626' }}>
                    Your account has been locked due to multiple failed login attempts.
                    Please contact support or try again later.
                </p>
            </Modal>
        </>
    );
};

export default LoginForm;
