// src/App.js
import React, { useState, useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  Tabs,
  Tab,
  Box,
  Button,
  Alert,
  Snackbar,
  Avatar,
  IconButton,
  Tooltip,
  useMediaQuery,
  Divider,
  Paper,
  Chip,
  Link,
  alpha,
  Stack,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton
} from "@mui/material";
import {
  Code as CodeIcon,
  GitHub as GitHubIcon,
  SettingsSuggest as SettingsIcon,
  LightMode as LightModeIcon,
  Dashboard as DashboardIcon,
  ViewList as ViewListIcon,
  PlayArrow as PlayArrowIcon,
  Menu as MenuIcon,
  Logout as LogoutIcon,
  AccountCircle as AccountCircleIcon,
  Home as HomeIcon,
  Close as CloseIcon,
  Help as HelpIcon,
  Article as ArticleIcon
} from "@mui/icons-material";
import RuleBuilder from "./components/RuleBuilder";
import RuleList from "./components/RuleList";
import RuleTester from "./components/RuleTester";
import HomePage from "./components/HomePage";
import AuthPage from "./components/AuthPage";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import theme from "./theme";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tab-panel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
      style={{ height: "100%" }}
    >
      {value === index && (
        <Box
          sx={{
            p: { xs: value === 0 ? 0 : 2, md: value === 0 ? 0 : 3 },
            height: "100%"
          }}
        >
          {children}
        </Box>
      )}
    </div>
  );
}

function AppContent() {
  const [tabValue, setTabValue] = useState(0);
  const [rules, setRules] = useState([]);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success"
  });
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));
  const { currentUser, logout } = useAuth();

  useEffect(() => {
    // Load existing rules from local storage if any
    const savedRules = localStorage.getItem("businessRules");
    if (savedRules) {
      try {
        setRules(JSON.parse(savedRules));
      } catch (e) {
        console.error("Error loading saved rules", e);
      }
    }
  }, []);

  // Save rules to localStorage whenever they change
  useEffect(() => {
    if (rules.length > 0) {
      localStorage.setItem("businessRules", JSON.stringify(rules));
    }
  }, [rules]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleStartBuilding = () => {
    setTabValue(1); // Switch to the Rule Builder tab
  };

  const handleRuleSave = async (rule) => {
    try {
      // In a real app, you would send this to your backend
      // For now, just add to local state
      const newRule = {
        id: Date.now().toString(),
        name: rule.name || `Rule ${rules.length + 1}`,
        businessLogic: rule,
        createdAt: new Date().toISOString()
      };

      setRules([...rules, newRule]);
      setNotification({
        open: true,
        message: "Rule saved successfully",
        severity: "success"
      });

      // Switch to the Rules List tab
      setTabValue(2);
    } catch (error) {
      console.error("Error saving rule:", error);
      setNotification({
        open: true,
        message: "Error saving rule",
        severity: "error"
      });
    }
  };

  const handleRuleDelete = (ruleId) => {
    setRules(rules.filter((rule) => rule.id !== ruleId));
    setNotification({
      open: true,
      message: "Rule deleted",
      severity: "success"
    });
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchorEl(null);
  };

  const handleLogout = () => {
    handleUserMenuClose();
    logout();
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const mobileMenu = (
    <Drawer
      anchor="right"
      open={mobileMenuOpen}
      onClose={closeMobileMenu}
      PaperProps={{
        sx: {
          width: 280,
          borderRadius: "0 0 0 16px",
          boxShadow: theme.shadows[8]
        }
      }}
    >
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.8)}`
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          Menu
        </Typography>
        <IconButton onClick={closeMobileMenu}>
          <CloseIcon />
        </IconButton>
      </Box>

      <List sx={{ py: 2 }}>
        <ListItem
          disablePadding
          onClick={() => {
            setTabValue(0);
            closeMobileMenu();
          }}
        >
          <ListItemButton selected={tabValue === 0}>
            <ListItemIcon>
              <HomeIcon color={tabValue === 0 ? "primary" : "inherit"} />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItemButton>
        </ListItem>

        <ListItem
          disablePadding
          onClick={() => {
            setTabValue(1);
            closeMobileMenu();
          }}
        >
          <ListItemButton selected={tabValue === 1}>
            <ListItemIcon>
              <DashboardIcon color={tabValue === 1 ? "primary" : "inherit"} />
            </ListItemIcon>
            <ListItemText primary="Rule Builder" />
          </ListItemButton>
        </ListItem>

        <ListItem
          disablePadding
          onClick={() => {
            setTabValue(2);
            closeMobileMenu();
          }}
        >
          <ListItemButton selected={tabValue === 2}>
            <ListItemIcon>
              <ViewListIcon color={tabValue === 2 ? "primary" : "inherit"} />
            </ListItemIcon>
            <ListItemText primary="Rule List" />
          </ListItemButton>
        </ListItem>

        <ListItem
          disablePadding
          onClick={() => {
            setTabValue(3);
            closeMobileMenu();
          }}
        >
          <ListItemButton selected={tabValue === 3}>
            <ListItemIcon>
              <PlayArrowIcon color={tabValue === 3 ? "primary" : "inherit"} />
            </ListItemIcon>
            <ListItemText primary="Rule Tester" />
          </ListItemButton>
        </ListItem>

        <Divider sx={{ my: 2 }} />

        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <HelpIcon />
            </ListItemIcon>
            <ListItemText primary="Help & Documentation" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <ArticleIcon />
            </ListItemIcon>
            <ListItemText primary="Tutorials" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding onClick={handleLogout}>
          <ListItemButton>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        background: "linear-gradient(145deg, #F9FAFB 0%, #F3F4F6 100%)",
        position: "relative"
      }}
    >
      {/* Header */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: "background.paper",
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
          color: "text.primary"
        }}
      >
        <Toolbar sx={{ px: { xs: 2, sm: 4 } }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                color: "white",
                fontWeight: "bold",
                width: 36,
                height: 36
              }}
            >
              BL
            </Avatar>
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 700,
                display: { xs: "none", sm: "block" },
                background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}
            >
              Logic Builder
            </Typography>
          </Stack>

          <Box sx={{ flexGrow: 1 }} />

          <Stack direction="row" spacing={1}>
            {isMediumScreen ? (
              <IconButton color="inherit" edge="end" onClick={toggleMobileMenu}>
                <MenuIcon />
              </IconButton>
            ) : (
              <>
                <Button
                  color="inherit"
                  sx={{
                    fontWeight: 600,
                    color:
                      tabValue === 0
                        ? theme.palette.primary.main
                        : "text.secondary",
                    "&:hover": {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1)
                    }
                  }}
                  onClick={() => setTabValue(0)}
                >
                  Home
                </Button>

                <Button
                  color="inherit"
                  sx={{
                    fontWeight: 600,
                    color:
                      tabValue === 1
                        ? theme.palette.primary.main
                        : "text.secondary",
                    "&:hover": {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1)
                    }
                  }}
                  onClick={() => setTabValue(1)}
                >
                  Build Rules
                </Button>

                <Button
                  color="inherit"
                  sx={{
                    fontWeight: 600,
                    color:
                      tabValue === 2
                        ? theme.palette.primary.main
                        : "text.secondary",
                    "&:hover": {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1)
                    }
                  }}
                  onClick={() => setTabValue(2)}
                >
                  My Rules
                </Button>

                <Button
                  color="inherit"
                  sx={{
                    fontWeight: 600,
                    color:
                      tabValue === 3
                        ? theme.palette.primary.main
                        : "text.secondary",
                    "&:hover": {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1)
                    }
                  }}
                  onClick={() => setTabValue(3)}
                >
                  Test Rules
                </Button>

                <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

                <Button
                  color="inherit"
                  sx={{
                    fontWeight: 600,
                    color: "#4B5563",
                    "&:hover": {
                      backgroundColor: alpha("#F3F4F6", 0.8)
                    }
                  }}
                >
                  Docs
                </Button>
                <Tooltip title="Account">
                  <IconButton
                    onClick={handleUserMenuOpen}
                    sx={{
                      p: 0.5,
                      ml: 1,
                      border: `2px solid ${alpha(
                        theme.palette.primary.main,
                        0.2
                      )}`,
                      "&:hover": {
                        backgroundColor: alpha(theme.palette.primary.main, 0.1)
                      }
                    }}
                  >
                    {currentUser?.avatar ? (
                      <Avatar
                        alt={currentUser.name}
                        src={currentUser.avatar}
                        sx={{ width: 32, height: 32 }}
                      />
                    ) : (
                      <AccountCircleIcon />
                    )}
                  </IconButton>
                </Tooltip>
                <Menu
                  anchorEl={userMenuAnchorEl}
                  open={Boolean(userMenuAnchorEl)}
                  onClose={handleUserMenuClose}
                  PaperProps={{
                    elevation: 3,
                    sx: {
                      width: 220,
                      maxWidth: "100%",
                      borderRadius: theme.shape.borderRadius,
                      mt: 1.5,
                      boxShadow: `0 10px 30px -15px ${alpha("#000", 0.15)}`
                    }
                  }}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                >
                  <Box sx={{ px: 2, py: 1.5 }}>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {currentUser?.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {currentUser?.email}
                    </Typography>
                  </Box>
                  <Divider />
                  <MenuItem onClick={handleUserMenuClose}>
                    <AccountCircleIcon fontSize="small" sx={{ mr: 1.5 }} />
                    Profile
                  </MenuItem>
                  <MenuItem onClick={handleUserMenuClose}>
                    <SettingsIcon fontSize="small" sx={{ mr: 1.5 }} />
                    Settings
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout}>
                    <LogoutIcon fontSize="small" sx={{ mr: 1.5 }} />
                    Logout
                  </MenuItem>
                </Menu>
              </>
            )}
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Mobile menu drawer */}
      {mobileMenu}

      {/* Main content */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <TabPanel value={tabValue} index={0}>
          <HomePage onStartBuilding={handleStartBuilding} />
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <RuleBuilder onSave={handleRuleSave} />
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          <RuleList rules={rules} onDelete={handleRuleDelete} />
        </TabPanel>
        <TabPanel value={tabValue} index={3}>
          <RuleTester rules={rules} />
        </TabPanel>
      </Box>

      {/* Footer - Only show on home page */}
      {tabValue === 0 && (
        <Box
          component="footer"
          sx={{
            py: 3,
            px: 2,
            mt: "auto",
            textAlign: "center",
            bgcolor: "background.paper",
            borderTop: `1px solid ${alpha(theme.palette.divider, 0.6)}`
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            <Link href="#" underline="hover" color="inherit" sx={{ mx: 2 }}>
              Documentation
            </Link>
            <Link href="#" underline="hover" color="inherit" sx={{ mx: 2 }}>
              Privacy
            </Link>
            <Link href="#" underline="hover" color="inherit" sx={{ mx: 2 }}>
              Terms
            </Link>
          </Box>
          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{ mt: 1 }}
          >
            © {new Date().getFullYear()} Logic Builder. All rights reserved.
          </Typography>
        </Box>
      )}

      {/* Notifications */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{
            width: "100%",
            borderRadius: theme.shape.borderRadius,
            boxShadow: theme.shadows[3]
          }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AppWithAuth />
      </AuthProvider>
    </ThemeProvider>
  );
}

function AppWithAuth() {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <AppContent /> : <AuthPage />;
}

export default App;
