import React, { useState } from "react";
import axios from "axios"; // ✅ Import Axios
import "./LoginComponent.css";

const LogoIcon = () => (
  <svg width="24" height="16" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 6H4V14H2V6Z" fill="black" />
    <path d="M6 2H8V14H6V2Z" fill="black" />
    <path d="M10 6H12V14H10V6Z" fill="black" />
    <path d="M14 2H16V14H14V2Z" fill="black" />
    <path d="M18 6H20V14H18V6Z" fill="black" />
    <path d="M0 14H24V16H0V14Z" fill="black" />
  </svg>
);

const LoginComponent = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keepSignedIn, setKeepSignedIn] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });
      console.log(email,password)
      const data = response.data;

      // Store token
      localStorage.setItem("token", data.token);
      alert("Login successful!");
      window.location.href = "/supplier-dashboard";

    } catch (error) {
      console.error("Login error:", error);
      if (error.response) {
        alert(`Login failed: ${error.response.data.message}`);
      } else {
        alert("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="login-page-container-jsx">
      <div className="login-card-jsx">
        <div className="login-form-section-jsx">
          <header className="login-header-jsx">
            <div className="logo-jsx">
              <LogoIcon />
              <span>SupplySetu</span>
            </div>
          </header>

          <main className="login-main-jsx">
            <h1 className="welcome-heading-jsx">Welcome back</h1>
            <form onSubmit={handleSubmit}>
              <div className="input-field-jsx">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  required
                />
              </div>
              <div className="input-field-jsx">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                />
              </div>

              <div className="form-options-jsx">
                <div className="checkbox-field-jsx">
                  <input
                    type="checkbox"
                    id="keep-signed-in-jsx"
                    checked={keepSignedIn}
                    onChange={(e) => setKeepSignedIn(e.target.checked)}
                  />
                  <label htmlFor="keep-signed-in-jsx">keep me signed in</label>
                </div>
                <a href="#" className="forgot-password-link-jsx">Forgot password</a>
              </div>

              <button type="submit" className="sign-in-btn-jsx">Sign in</button>
            </form>

            <p className="register-prompt-jsx">
              Don't have an account ? <a href="/signup">Register now</a>
            </p>
          </main>

          <footer className="login-footer-jsx">
            <p>
              By creating an account, you agree to our{" "}
              <a href="#">term of use</a>
            </p>
          </footer>
        </div>

        <div className="login-image-section-jsx">
          <img src="shop.jpeg" alt="A vibrant, well-stocked spice shop" />
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;
