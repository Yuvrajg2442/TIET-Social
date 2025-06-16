import {
  Button,
  Container,
  Stack,
  TextField,
  Typography,
  Link as MuiLink
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../../api/users";
import ErrorAlert from "../ErrorAlert";
import { loginUser } from "../../helpers/authHelper";
import Copyright from "../Copyright";

const LoginView = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [serverError, setServerError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  
    if (name === "email") {
      const isValid = /^[A-Za-z0-9._%+-]+@thapar\.edu$/.test(value);
      setEmailError(isValid ? "" : "Please use a valid @thapar.edu email");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (emailError) return;
    const data = await login(formData);
    if (data.error) {
      setServerError(data.error);
    } else {
      loginUser(data);
      navigate("/");
    }
  };

  // Gradient background style
  const backgroundStyle = {
    background: "linear-gradient(135deg, #c14cc4 0%, #fd4878 100%)",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  };

  // Card style
  const cardStyle = {
    backgroundColor: "#faf5f7",
    borderRadius: "10px",
    padding: "40px",
    boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "450px",
  };

  // Login button style with gradient
  const loginButtonStyle = {
    background: "linear-gradient(90deg, #9c42cc 0%, #fd4878 100%)",
    color: "white",
    padding: "12px",
    borderRadius: "30px",
    fontWeight: "bold",
    textTransform: "none",
    marginTop: "16px",
    marginBottom: "16px",
  };

  // Sign up button style
  const signupButtonStyle = {
    background: "#fd4878",
    color: "white",
    padding: "12px",
    borderRadius: "30px",
    fontWeight: "bold",
    textTransform: "none",
    marginTop: "8px",
  };

  // Text field style
  const textFieldStyle = {
    backgroundColor: "white",
    borderRadius: "5px",
    "& .MuiOutlinedInput-root": {
      borderRadius: "5px",
    }
  };

  // Purple text style
  const purpleTextStyle = {
    color: "#9c42cc",
    fontWeight: "bold",
  };

  const [emailError, setEmailError] = useState("");

  return (
    <Box sx={backgroundStyle}>
      <Box sx={cardStyle}>
        <Stack alignItems="center" spacing={2}>
          <Typography variant="h4" component="h1" sx={purpleTextStyle}>
            TIET Social
          </Typography>

          <Typography variant="body1" color="textSecondary" align="center" sx={{ mb: 2 }}>
            Connect with friends and the Thapar community
          </Typography>
          
          <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
            <TextField
              label="Email address"
              fullWidth
              margin="normal"
              autoComplete="email"
              autoFocus
              required
              id="email"
              name="email"
              onChange={handleChange}
              sx={textFieldStyle}
              error={!!emailError}
              helperText={emailError}
            />
            <TextField
              label="Password"
              fullWidth
              required
              margin="normal"
              id="password"
              name="password"
              onChange={handleChange}
              type="password"
              sx={textFieldStyle}
            />

            <ErrorAlert error={serverError} />
            
            <Button 
              type="submit" 
              fullWidth 
              variant="contained" 
              sx={loginButtonStyle}
            >
              Log In
            </Button>
          </Box>
          
          <Typography variant="body2" align="center">
            or
          </Typography>
          
          <Button 
            component={Link}
            to="/signup"
            fullWidth 
            variant="contained" 
            sx={signupButtonStyle}
          >
            Create New Account
          </Button>
          
          <Box sx={{ mt: 3, width: "100%", textAlign: "center" }}>
            <Copyright />
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default LoginView;