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
  Person as PersonIcon,
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

const Signup = ({ onSignup, onToggleAuthMode }) => {
  const theme = useTheme();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (
      !name.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!agreeTerms) {
      setError("Please agree to the Terms & Conditions");
      return;
    }

    // In a real app, you would create the user account with your authentication service
    // For now, we'll just simulate success and call the onSignup callback
    onSignup({ name, email });
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
              Create Account
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Sign up to start building business logic
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
              id="name"
              label="Full Name"
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon fontSize="small" color="action" />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: 1
                }
              }}
            />

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

            <TextField
              fullWidth
              id="confirmPassword"
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              variant="outlined"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      onMouseDown={(e) => e.preventDefault()}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: 1
                }
              }}
            />

            <Box sx={{ mt: 2, mb: 3 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    size="small"
                    color="primary"
                  />
                }
                label={
                  <Typography variant="body2">
                    I agree to the{" "}
                    <Link href="#" underline="hover">
                      Terms & Conditions
                    </Link>{" "}
                    and{" "}
                    <Link href="#" underline="hover">
                      Privacy Policy
                    </Link>
                  </Typography>
                }
              />
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
              Create Account
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
              Already have an account?{" "}
              <Link
                component="button"
                variant="body2"
                onClick={onToggleAuthMode}
                underline="hover"
                sx={{ fontWeight: 600 }}
              >
                Sign In
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Signup;
