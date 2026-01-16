import React, { useState } from "react";
import api from "../services/api";

const SignupForm = ({ switchToLogin }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!fullName || !email || !password) {
      setError("All fields are required");
      return;
    }

    try {
      const res = await api.post("/auth/signup", {
        full_name: fullName,
        email,
        password,
      });

      setSuccess(res.data.message);
      setFullName("");
      setEmail("");
      setPassword("");

      setTimeout(() => {
        switchToLogin();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        width: "100%",
        maxWidth: "400px",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
      }}
    >
      <h2 style={{ textAlign: "center" }}>Sign Up</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <input
        type="text"
        placeholder="Full Name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        required
        style={{ width: "100%", padding: "8px" }}
      />

      <br /><br />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        style={{ width: "100%", padding: "8px" }}
      />

      <br /><br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        minLength={6}
        onChange={(e) => setPassword(e.target.value)}
        required
        style={{ width: "100%", padding: "8px" }}
      />

      <br /><br />

      <button
        type="submit"
        style={{
          width: "100%",
          padding: "10px",
          backgroundColor: "#28a745",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Register
      </button>

      <p style={{ marginTop: "10px", textAlign: "center" }}>
        Already have an account?{" "}
        <span
          onClick={switchToLogin}
          style={{ color: "blue", cursor: "pointer" }}
        >
          Login
        </span>
      </p>
    </form>
  );
};

export default SignupForm;
