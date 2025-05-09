import React, { useState } from "react";
import "./Signup.css"; // Import the CSS for styling
import { useAuth } from "../AuthProvider";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const auth = useAuth();
  const [message, setMessage] = useState("");
  const [signedUpStatus, setSignedUpStatus] = useState(false);
  

  async function handleSubmit(e)  {
    e.preventDefault();
    if (password !== confirmPassword) {
        alert("Passwords do not match!");
    } else {
        const input = {
            username: username,
            password: password,
            email: email
        }
        //const result = await auth.signup(input);

        let response = await fetch("/api/auth/signup", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(input),
        });
        if (!response.ok) {
            const message = `An error has occurred: ${response.statusText}`;
            setMessage(response.statusText);
            setSignedUpStatus(false);
            console.error(message);
            return;
        }
        setSignedUpStatus(true);
    }
  };

  return (
    <div className="signup-container">
      
      {!signedUpStatus ? (
        <div className="signup-card">
            <h2 className="signup-title">Create an Account</h2>
            <div className="error">{message}</div>
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
                <label htmlFor="email">Email</label>
                <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
            <div className="input-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                />
            </div>
            <button type="submit" className="signup-btn">Sign Up</button>
            </form>
            <div className="footer-links">
                <a href="/login">Already have an account? Login</a>
            </div>
        </div>
        ) : (

                <div className="footer-links">
                    You have successfully signed-up. Click to <a href="/login">Login</a>
                </div>

        )}
      
    </div>
  );
};

export default Signup;