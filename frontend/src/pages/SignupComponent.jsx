import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./SignupComponent.css";

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

const SignupComponent = () => {
  const [role, setRole] = useState("vendor");
  const [formData, setFormData] = useState({
    name: "",
    businessName: "",
    email: "",
    phoneNumber: "",
    password: "",
    location: "",
    landmark: "",
    pincode: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      businessName: formData.businessName,
      email: formData.email,
      phone: formData.phoneNumber,
      password: formData.password,
      businessLocation: formData.location,
      landMark: formData.landmark,
      pincode: formData.pincode,
      role,
    };

    try {
      const { data } = await axios.post("http://localhost:5000/api/auth/register", payload);
      alert("Registration successful!");
      console.log("Response:", data);
      // redirect or clear form here
    } catch (error) {
      if (error.response) {
        alert(`Registration failed: ${error.response.data.message}`);
        console.error("Server responded with error:", error.response.data);
      } else if (error.request) {
        alert("No response from server. Please try again.");
        console.error("No response:", error.request);
      } else {
        alert("Something went wrong.");
        console.error("Error:", error.message);
      }
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        {/* Left Form */}
        <div className="signup-form-wrapper">
          <header className="signup-header">
            <div className="logo">
              <LogoIcon />
              <span>SupplySetu</span>
            </div>
            <h1 className="welcome-text">Welcome</h1>
          </header>

          <main>
            <form onSubmit={handleSubmit}>
              <div className="user-type-selection">
                <label>
                  <input
                    type="radio"
                    value="vendor"
                    checked={role === "vendor"}
                    onChange={(e) => setRole(e.target.value)}
                  />
                  Vendor
                </label>
                <label>
                  <input
                    type="radio"
                    value="supplier"
                    checked={role === "supplier"}
                    onChange={(e) => setRole(e.target.value)}
                  />
                  Supplier
                </label>
              </div>

              <div className="form-row">
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="businessName"
                  placeholder="Business name"
                  value={formData.businessName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-row">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <input
                  type="tel"
                  name="phoneNumber"
                  placeholder="Phone number"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                />
              </div>

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />

              <fieldset className="address-fieldset">
                <legend>Business Address</legend>
                <div className="form-row">
                  <input
                    type="text"
                    name="location"
                    placeholder="Business Location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                  <input
                    type="text"
                    name="landmark"
                    placeholder="Landmark"
                    value={formData.landmark}
                    onChange={handleChange}
                  />
                </div>
                <input
                  type="text"
                  name="pincode"
                  placeholder="Pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  required
                />
              </fieldset>

              <button type="submit" className="register-btn">
                Register
              </button>
            </form>
          </main>

          <footer className="signup-footer">
            <p className="signin-link">
              Already have an account? <Link to="/signin">Sign in</Link>
            </p>
            <p className="terms-link">
              By creating an account, you agree to our <a href="/terms">terms of use</a>
            </p>
          </footer>
        </div>

        {/* Right Illustration */}
        <div className="signup-image-wrapper">
          {role === "vendor" ? (
            <img src="vendor.png" alt="Street food vendor illustration" />
          ) : (
            <img src="suppiler.png" alt="Supplier illustration" />
          )}
        </div>
      </div>
    </div>
  );
};

export default SignupComponent;
