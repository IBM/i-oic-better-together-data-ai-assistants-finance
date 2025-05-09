import React, { useState } from "react";
import { useAuth } from "../AuthProvider";
import './Login.css';

export default function () {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
    const auth = useAuth();
    const handleSubmit = (e) => {
      e.preventDefault();
      if (username !== "" && password !== "") {
        const input = {
            username: username,
            password: password
        }
        auth.loginAuth(input);
        return;
      }
      alert("please provide a valid input");
    };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title font-bold">Oceanic Bank</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-btn">Login</button>
        </form>
        <div className="footer-links">
          <a href="#">Forgot password?</a>
          <a href="/signup">Sign Up</a>
        </div>
      </div>
    </div>
  );
};

