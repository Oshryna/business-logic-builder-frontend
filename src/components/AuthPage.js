import React, { useState } from "react";
import { Box, Paper, alpha, Typography, useTheme } from "@mui/material";
import Login from "./Login";
import Signup from "./Signup";
import { useAuth } from "../contexts/AuthContext";

const AuthPage = () => {
  const theme = useTheme();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { login, signup } = useAuth();

  const handleLogin = async ({ email, password }) => {
    const result = await login(email, password);
    if (!result.success) {
      // Handle login error
      console.error(result.error);
    }
  };

  const handleSignup = async ({ name, email, password }) => {
    const result = await signup(name, email, password);
    if (!result.success) {
      // Handle signup error
      console.error(result.error);
    }
  };

  const toggleAuthMode = () => {
    setIsLoginMode(!isLoginMode);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: `linear-gradient(135deg, ${alpha(
          theme.palette.primary.light,
          0.1
        )}, ${alpha(theme.palette.primary.main, 0.05)})`,
        position: "relative",
        overflow: "hidden",
        pt: 8,
        pb: 12
      }}
    >
      {/* Abstract background shapes */}
      <Box
        sx={{
          position: "absolute",
          top: -100,
          right: -100,
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: `linear-gradient(45deg, ${alpha(
            theme.palette.primary.main,
            0.08
          )}, ${alpha(theme.palette.primary.light, 0.05)})`,
          zIndex: 0
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: -150,
          left: -150,
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: `linear-gradient(45deg, ${alpha(
            theme.palette.secondary.main,
            0.08
          )}, ${alpha(theme.palette.secondary.light, 0.05)})`,
          zIndex: 0
        }}
      />

      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          mb: 4,
          textAlign: "center"
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          fontWeight={700}
          gutterBottom
          sx={{
            background: "linear-gradient(to right, #6366F1, #818CF8)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}
        >
          Business Logic Builder
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ maxWidth: 500, mx: "auto", px: 2 }}
        >
          Create, manage, and test complex business rules with our intuitive
          builder
        </Typography>
      </Box>

      {isLoginMode ? (
        <Login onLogin={handleLogin} onToggleAuthMode={toggleAuthMode} />
      ) : (
        <Signup onSignup={handleSignup} onToggleAuthMode={toggleAuthMode} />
      )}

      <Box
        component="footer"
        sx={{
          mt: "auto",
          py: 3,
          textAlign: "center",
          position: "relative",
          zIndex: 1
        }}
      >
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} Business Logic Builder. All rights
          reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default AuthPage;
