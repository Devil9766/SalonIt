import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button } from "react-bootstrap";
import "./Login.css";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const validateForm = () => {
    let valid = true;
    let emailError = "";
    let passwordError = "";

    if (!formData.email) {
      emailError = "Email is required";
      valid = false;
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(formData.email)) {
      emailError = "Invalid email format";
      valid = false;
    }

    if (!formData.password) {
      passwordError = "Password is required";
      valid = false;
    } else if (
      !/(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}/.test(formData.password)
    ) {
      passwordError =
        "Password must be at least 8 characters, include a number, a symbol, and an uppercase letter";
      valid = false;
    }

    setErrors({ email: emailError, password: passwordError });
    return valid;
  };

  const handleLogin = (role) => {
    if (validateForm()) {
      // Set login status in localStorage
      localStorage.setItem("userLoggedIn", true);

      // Redirect to appropriate role page
      if (role === "salon") {
        navigate("/"); // Adjust destination as needed
      } else if (role === "customer") {
        navigate("/"); // Adjust destination as needed
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  return (
    <Container className="login-container">
      <div className="login-box">
        <h1 className="text-center mb-4">Salon Appointment</h1>
        <p className="text-center">SIGN-IN</p>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label className="login-name">Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              isInvalid={!!errors.email}
              required
            />
            <Form.Control.Feedback type="invalid">
              {errors.email}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="login-name">Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              isInvalid={!!errors.password}
              required
            />
            <Form.Control.Feedback type="invalid">
              {errors.password}
            </Form.Control.Feedback>
          </Form.Group>
          <div className="d-flex justify-content-between">
            <Button
              variant="primary"
              className="role-button"
              onClick={() => handleLogin("customer")}
            >
              Customer Login
            </Button>
            <Button
              variant="success"
              className="role-button"
              onClick={() => handleLogin("salon")}
            >
              Salon Owner Login
            </Button>
          </div>
        </Form>
        <p className="text-center mt-4">
          <Button
            variant="link"
            className="p-0"
            onClick={() => navigate("/signup")}
          >
            Don't have an account? Sign Up
          </Button>
        </p>
      </div>
    </Container>
  );
};

export default Login;