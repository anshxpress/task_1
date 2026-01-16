import React, { useState } from "react";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";

function App() {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {showLogin ? (
        <LoginForm switchToSignup={() => setShowLogin(false)} />
      ) : (
        <SignupForm switchToLogin={() => setShowLogin(true)} />
      )}
    </div>
  );
}

export default App;
