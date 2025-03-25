// src/App.js
import React, { useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
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
  Snackbar
} from "@mui/material";
import RuleBuilder from "./components/RuleBuilder";
import RuleList from "./components/RuleList";
import RuleTester from "./components/RuleTester";

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2"
    },
    secondary: {
      main: "#dc004e"
    }
  }
});

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function App() {
  const [tabValue, setTabValue] = useState(0);
  const [rules, setRules] = useState([]);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleRuleSave = async (rule) => {
    try {
      // In a real app, you would send this to your backend
      const response = await fetch("http://localhost:5000/api/rules", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ businessLogic: rule })
      });

      const data = await response.json();

      if (data.success) {
        // Add rule to local state
        const newRule = {
          id: Date.now().toString(),
          name: `Rule ${rules.length + 1}`,
          businessLogic: rule,
          createdAt: new Date().toISOString()
        };

        setRules([...rules, newRule]);
        setNotification({
          open: true,
          message: "Rule saved successfully",
          severity: "success"
        });
      }
    } catch (error) {
      console.error("Error saving rule:", error);
      setNotification({
        open: true,
        message: "Error saving rule",
        severity: "error"
      });
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Business Logic Builder
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="business logic tabs"
        >
          <Tab label="Rule Builder" />
          <Tab label="Rule List" />
          <Tab label="Rule Tester" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <RuleBuilder onSave={handleRuleSave} />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <RuleList rules={rules} />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <RuleTester rules={rules} />
        </TabPanel>
      </Container>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}

export default App;
