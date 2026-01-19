import React, { useState } from "react";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import HeroCard from "./components/HeroCard";

function App() {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f9fafb",
        padding: "20px"
      }}
    >
      <HeroCard />

      {showLogin ? (
        <LoginForm switchToSignup={() => setShowLogin(false)} />
      ) : (
        <SignupForm switchToLogin={() => setShowLogin(true)} />
      )}
    </div>
  );
}

export default App;
