import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import authService from "../services/authService";
import { useAuth } from "../context/AuthContext";

const RegisterPage = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (formData) => {
    try {
      const { token } = await authService.signup(formData);
      login(token);
      navigate("/products");
    } catch (err) {
      setError("Registration failed");
    }
  };

  return (
    <div style={{ width: "50%", margin: "auto" }}>
      <h1>Register</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <AuthForm onSubmit={handleSubmit} isRegister={true} />
      <Link to={"/login"}>Login</Link>
    </div>
  );
};

export default RegisterPage;
