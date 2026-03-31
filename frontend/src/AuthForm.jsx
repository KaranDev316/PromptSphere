import { useState } from "react";
import { login, register } from "./api";
import "./AuthForm.css";

function AuthForm({ onAuth }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Trim and validate inputs before sending
    const u = username.trim();
    const em = email.trim();
    const pw = password;

    console.log("AuthForm submit:", { isLogin, username: u, email: em, passwordPresent: !!pw });

    if (!isLogin) {
      if (!u || !em || !pw) {
        setError("Please fill username, email and password.");
        setLoading(false);
        return;
      }
    } else {
      if (!em || !pw) {
        setError("Please fill email and password.");
        setLoading(false);
        return;
      }
    }

    try {
      let data;
      if (isLogin) {
        data = await login(em, pw);
      } else {
        data = await register(u, em, pw);
      }

      console.log("Auth response:", data);

      if (data && data.token) {
        localStorage.setItem("token", data.token);
      }
      onAuth(data.user);
    } catch (err) {
      console.error("Auth error:", err);
      setError(err.message || "Authentication error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-wrapper">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>{isLogin ? "Login" : "Register"}</h2>

        {error && <p className="auth-error">{error}</p>}

        {!isLogin && (
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Please wait…" : isLogin ? "Login" : "Register"}
        </button>

        <p className="toggle">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
            }}
          >
            {isLogin ? "Register" : "Login"}
          </span>
        </p>
      </form>
    </div>
  );
}

export default AuthForm;
