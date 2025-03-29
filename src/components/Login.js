import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Divider,
  alpha,
  Alert,
  Checkbox,
  FormControlLabel,
  Link,
  useTheme
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Lock as LockIcon,
  Google as GoogleIcon,
  GitHub as GitHubIcon,
  Twitter as TwitterIcon
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

const SocialButton = styled(Button)(({ theme }) => ({
  borderRadius: 1,
  padding: theme.spacing(1.5),
  fontWeight: 600,
  textTransform: "none",
  flex: 1,
  boxShadow: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
  backgroundColor: alpha(theme.palette.background.paper, 0.8),
  gap: theme.spacing(1.5),
  color: theme.palette.text.primary,
  "&:hover": {
    backgroundColor: alpha(theme.palette.background.paper, 0.95),
    boxShadow: theme.shadows[1]
  }
}));

const Login = ({ onLogin, onToggleAuthMode }) => {
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password");
      return;
    }

    // In a real app, you would validate the credentials with your authentication service
    // For now, we'll just simulate success and call the onLogin callback
    onLogin({ email });
  };

  return (
    <Box
      sx={{
        maxWidth: 480,
        mx: "auto",
        p: { xs: 2, sm: 4 }
      }}
    >
      <Card
        elevation={0}
        sx={{
          borderRadius: 1,
          border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
          boxShadow: `0 10px 40px -20px ${alpha(
            theme.palette.primary.main,
            0.15
          )}`,
          overflow: "visible"
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Box sx={{ mb: 4, textAlign: "center" }}>
            <Typography
              variant="h4"
              component="h1"
              fontWeight={700}
              gutterBottom
            >
              Welcome Back
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Sign in to continue to Logic Builder
            </Typography>
          </Box>

          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                borderRadius: 1,
                backgroundColor: alpha(theme.palette.error.light, 0.1),
                "& .MuiAlert-icon": {
                  color: theme.palette.error.main
                }
              }}
            >
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
            <TextField
              fullWidth
              id="email"
              label="Email Address"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon fontSize="small" color="action" />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: 1
                }
              }}
            />

            <TextField
              fullWidth
              id="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon fontSize="small" color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      onMouseDown={(e) => e.preventDefault()}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: 1
                }
              }}
            />

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mt: 1,
                mb: 3
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    size="small"
                    color="primary"
                  />
                }
                label={<Typography variant="body2">Remember me</Typography>}
              />

              <Link href="#" variant="body2" underline="hover">
                Forgot password?
              </Link>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              sx={{
                borderRadius: 1,
                textTransform: "none",
                fontWeight: 600,
                py: 1.5,
                boxShadow: `0 8px 25px -8px ${alpha(
                  theme.palette.primary.main,
                  0.4
                )}`
              }}
            >
              Sign In
            </Button>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <Divider sx={{ flexGrow: 1 }} />
            <Typography variant="body2" color="text.secondary" sx={{ px: 2 }}>
              OR
            </Typography>
            <Divider sx={{ flexGrow: 1 }} />
          </Box>

          <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
            <SocialButton startIcon={<GoogleIcon />}>Google</SocialButton>
            <SocialButton startIcon={<GitHubIcon />}>GitHub</SocialButton>
            <SocialButton startIcon={<TwitterIcon />}>Twitter</SocialButton>
          </Box>

          <Box sx={{ textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{" "}
              <Link
                component="button"
                variant="body2"
                onClick={onToggleAuthMode}
                underline="hover"
                sx={{ fontWeight: 600 }}
              >
                Sign Up
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;
