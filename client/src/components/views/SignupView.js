import {
  Button,
  Container,
  Stack,
  TextField,
  Typography,
  Link as MuiLink,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import { signup } from "../../api/users";
import { loginUser } from "../../helpers/authHelper";
import { useNavigate, Link } from "react-router-dom";
import Copyright from "../Copyright";
import ErrorAlert from "../ErrorAlert";
import { isLength, isEmail, contains } from "validator";
import { useTheme } from "@emotion/react";

const SignupView = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validate();
    if (Object.keys(errors).length !== 0) return;

    const data = await signup(formData);

    if (data.error) {
      setServerError(data.error);
    } else {
      loginUser(data);
      navigate("/");
    }
  };

  const validate = () => {
    const errors = {};

    if (!isLength(formData.username, { min: 6, max: 30 })) {
      errors.username = "Must be between 6 and 30 characters long";
    }

    if (contains(formData.username, " ")) {
      errors.username = "Must contain only valid characters";
    }

    if (!isLength(formData.password, { min: 8 })) {
      errors.password = "Must be at least 8 characters long";
    }

    if (!isEmail(formData.email)) {
      errors.email = "Must be a valid email address";
    }
    else if (!formData.email.toLowerCase().endsWith("@thapar.edu")) {
      errors.email = "Email must end with @thapar.edu";
    }
    setErrors(errors);

    return errors;
  };

  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, #9c27b0 0%, #e91e63 100%)",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 2,
      }}
    >
      <Container
        maxWidth="xs"
        sx={{
          bgcolor: "rgba(255, 255, 255, 0.9)",
          borderRadius: 2,
          padding: 4,
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Stack spacing={2} alignItems="center">
          <Typography
            variant="h3"
            component="h1"
            fontWeight="bold"
            sx={{
              background: "linear-gradient(90deg, #9c27b0 0%, #e91e63 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 2
            }}
          >
            TIET Social
          </Typography>
          
          <Typography
            variant="h4"
            component="h2"
            fontWeight="bold"
            color="primary"
            align="center"
          >
            Sign Up
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center">
            It's quick and easy.
          </Typography>

          <Box component="form" onSubmit={handleSubmit} width="100%" mt={2}>
            <TextField
              label="Username"
              fullWidth
              margin="normal"
              autoFocus
              required
              id="username"
              name="username"
              onChange={handleChange}
              error={errors.username !== undefined}
              helperText={errors.username}
              InputProps={{
                sx: { bgcolor: "white", borderRadius: 1 }
              }}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Email"
              fullWidth
              margin="normal"
              autoComplete="email"
              required
              id="email"
              name="email"
              onChange={handleChange}
              error={errors.email !== undefined}
              helperText={errors.email}
              InputProps={{
                sx: { bgcolor: "white", borderRadius: 1 }
              }}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Password"
              fullWidth
              required
              margin="normal"
              autoComplete="password"
              id="password"
              name="password"
              type="password"
              onChange={handleChange}
              error={errors.password !== undefined}
              helperText={errors.password}
              InputProps={{
                sx: { bgcolor: "white", borderRadius: 1 }
              }}
              sx={{ mb: 2 }}
            />

            <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1, mb: 3 }}>
              By clicking Sign Up, you agree to our Terms, Privacy Policy and Cookies Policy.
            </Typography>

            <ErrorAlert error={serverError} />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 1,
                mb: 2,
                py: 1.5,
                background: "linear-gradient(90deg, #9c27b0 0%, #e91e63 100%)",
                borderRadius: 6,
                fontWeight: "bold",
              }}
            >
              Sign Up
            </Button>
          </Box>

          <Typography variant="body2" align="center">
            Already have an account? <Link to="/login">Login</Link>
          </Typography>

          <Box sx={{ mt: 3 }}>
            <Copyright />
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default SignupView;