import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const url = isLogin
      ? "http://localhost:5000/api/auth/login"
      : "http://localhost:5000/api/auth/signup";

    const payload = isLogin ? { email, password } : { username, email, password };

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (res.ok) {
      if (isLogin) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.user.username);
        navigate("/quiz");
      } else {
        alert("Signup successful! You can now log in.");
        setIsLogin(true);
      }
    } else {
      alert(data.msg || "Something went wrong");
    }
  };

  const styles = {
    container: {
      backgroundColor: "#1f1f1f",
      color: "#f0f0f0",
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontFamily: "sans-serif",
    },
    formBox: {
      backgroundColor: "#2a2a2a",
      padding: "30px",
      borderRadius: "12px",
      boxShadow: "0 0 20px rgba(0,0,0,0.5)",
      width: "100%",
      maxWidth: "400px",
    },
    input: {
      width: "100%",
      padding: "10px",
      margin: "10px 0",
      borderRadius: "6px",
      border: "1px solid #444",
      backgroundColor: "#333",
      color: "#fff",
    },
    button: {
      width: "100%",
      padding: "10px",
      marginTop: "15px",
      borderRadius: "6px",
      border: "none",
      backgroundColor: "#007bff",
      color: "#fff",
      fontWeight: "bold",
      cursor: "pointer",
    },
    toggleText: {
      marginTop: "15px",
      textAlign: "center",
    },
    toggleButton: {
      background: "none",
      border: "none",
      color: "#00bfff",
      cursor: "pointer",
      fontWeight: "bold",
      textDecoration: "underline",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.formBox}>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          {isLogin ? "Login" : "Signup"}
        </h2>

        {!isLogin && (
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
          />
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        <button onClick={handleSubmit} style={styles.button}>
          {isLogin ? "Login" : "Signup"}
        </button>

        <div style={styles.toggleText}>
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button onClick={() => setIsLogin(!isLogin)} style={styles.toggleButton}>
            {isLogin ? "Signup" : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;

