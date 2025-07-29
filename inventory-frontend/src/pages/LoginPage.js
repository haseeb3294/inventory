import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import authService from "../services/authService";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (formData) => {
    try {
      const { token } = await authService.login(formData);
      login(token);
      navigate("/products");
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <div style={{ width: "50%", margin: "auto" }}>
      <h1>Login</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <AuthForm onSubmit={handleSubmit} isRegister={false} />
      <Link to={"/register"}>Register Now</Link>
    </div>
  );
};

export default LoginPage;
