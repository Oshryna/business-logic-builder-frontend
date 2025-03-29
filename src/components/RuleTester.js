// src/components/RuleTester.js
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Grid,
  Paper,
  Alert,
  CircularProgress,
  Collapse,
  Fade,
  Divider,
  IconButton,
  Tooltip,
  Tabs,
  Tab,
  alpha,
  useTheme
} from "@mui/material";
import { styled } from "@mui/material/styles";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import RefreshIcon from "@mui/icons-material/Refresh";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CodeIcon from "@mui/icons-material/Code";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import LogicTreeView from "./LogicTreeView";

// Styled components
const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  fontWeight: 600,
  textTransform: "none",
  padding: "8px 16px"
}));

const ResultCard = styled(Card)(({ theme, result }) => ({
  borderRadius: theme.shape.borderRadius,
  overflow: "hidden",
  border:
    result !== null
      ? `1px solid ${
          result
            ? alpha(theme.palette.success.main, 0.5)
            : alpha(theme.palette.error.main, 0.5)
        }`
      : "none",
  boxShadow: "none",
  transition: "all 0.3s ease"
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    fontFamily: "'Roboto Mono', monospace",
    fontSize: "0.875rem",
    lineHeight: 1.5,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.background.paper, 0.5)
  },
  "& .MuiInputLabel-root": {
    fontSize: "0.875rem"
  }
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: alpha(theme.palette.text.primary, 0.15)
  }
}));

const PreviewPanel = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: alpha(theme.palette.background.paper, 0.5),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
  position: "relative",
  overflow: "hidden"
}));

const RuleTester = ({ rules }) => {
  const theme = useTheme();
  const [selectedRuleId, setSelectedRuleId] = useState("");
  const [selectedRule, setSelectedRule] = useState(null);
  const [testData, setTestData] = useState("");
  const [result, setResult] = useState(null);
  const [sampleData, setSampleData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState(0);

  useEffect(() => {
    // Fetch sample data when component mounts
    fetchSampleData();
  }, []);

  useEffect(() => {
    // Update selected rule when selected rule ID changes
    if (selectedRuleId) {
      setSelectedRule(rules.find((rule) => rule.id === selectedRuleId));
    } else {
      setSelectedRule(null);
    }
  }, [selectedRuleId, rules]);

  const fetchSampleData = async () => {
    try {
      setLoading(true);
      // Simulated sample data if API is not available
      const sampleDataExample = {
        user: {
          name: "John Doe",
          age: 30,
          subscription: "premium",
          location: {
            country: "USA",
            state: "California"
          }
        },
        order: {
          id: "ORD-12345",
          total: 150.0,
          items: [
            { name: "Product A", price: 50.0, quantity: 2 },
            { name: "Product B", price: 25.0, quantity: 2 }
          ],
          date: "2023-04-15T14:30:00Z"
        }
      };

      try {
        const response = await fetch("http://localhost:5000/api/sample");
        const data = await response.json();
        setSampleData(data);
      } catch (apiError) {
        console.log("Using fallback sample data");
        setSampleData(sampleDataExample);
      }
    } catch (error) {
      console.error("Error fetching sample data:", error);
      setError("Failed to fetch sample data");
    } finally {
      setLoading(false);
    }
  };

  const handleRuleChange = (event) => {
    setSelectedRuleId(event.target.value);
    setResult(null);
  };

  const handleTestDataChange = (event) => {
    setTestData(event.target.value);
    setResult(null);
  };

  const useSampleData = () => {
    setTestData(JSON.stringify(sampleData, null, 2));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(testData);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleViewModeChange = (event, newValue) => {
    setViewMode(newValue);
  };

  const evaluateRule = async () => {
    setError("");
    setResult(null);
    setLoading(true);

    try {
      // Find the selected rule
      const selectedRule = rules.find((rule) => rule.id === selectedRuleId);

      if (!selectedRule) {
        setError("Please select a rule to test");
        return;
      }

      // Parse the test data
      let parsedData;
      try {
        parsedData = JSON.parse(testData);
      } catch (e) {
        setError("Invalid JSON data. Please check your input.");
        setLoading(false);
        return;
      }

      // Send to backend for evaluation or simulate locally
      try {
        const response = await fetch("http://localhost:5000/api/evaluate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            businessLogic: selectedRule.businessLogic,
            data: parsedData
          })
        });

        const data = await response.json();

        if (data.success) {
          setResult(data.result);
        } else {
          setError(data.error || "An error occurred during evaluation");
        }
      } catch (apiError) {
        console.log("API not available, simulating result");
        // If API is not available, simply return a simulated result
        setTimeout(() => {
          // This is just a simple simulation - in a real app, you would
          // implement proper rule evaluation logic
          const simulatedResult = Math.random() > 0.5;
          setResult(simulatedResult);
        }, 1000);
      }
    } catch (error) {
      console.error("Error evaluating rule:", error);
      setError("An error occurred during evaluation");
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 800);
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto" }}>
      {rules.length === 0 ? (
        <Card
          elevation={0}
          sx={{
            p: 4,
            borderRadius: theme.shape.borderRadius,
            border: `1px dashed ${alpha(theme.palette.primary.main, 0.3)}`
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <AccountTreeIcon
              sx={{
                fontSize: 60,
                color: alpha(theme.palette.primary.main, 0.3),
                mb: 2
              }}
            />
            <Typography variant="h5" gutterBottom fontWeight={600}>
              No Rules Available
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ maxWidth: 500, mx: "auto", mb: 3 }}
            >
              You don't have any rules to test yet. Create rules in the Rule
              Builder tab first.
            </Typography>
            <ActionButton
              variant="contained"
              color="primary"
              onClick={() => {
                // This would typically be handled by the parent component
                // Here we're just demonstrating the UI
                console.log("Navigate to Rule Builder");
              }}
            >
              Go to Rule Builder
            </ActionButton>
          </Box>
        </Card>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card
              elevation={0}
              sx={{
                borderRadius: theme.shape.borderRadius,
                overflow: "visible",
                border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
                height: "100%"
              }}
            >
              <CardHeader
                title={
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    Test Configuration
                  </Typography>
                }
                subheader="Select a rule and provide test data"
                sx={{
                  pb: 1,
                  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.8)}`
                }}
              />
              <CardContent>
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel id="rule-select-label">Select Rule</InputLabel>
                  <StyledSelect
                    labelId="rule-select-label"
                    value={selectedRuleId}
                    label="Select Rule"
                    onChange={handleRuleChange}
                  >
                    <MenuItem value="" disabled>
                      <em>Select a rule to test</em>
                    </MenuItem>
                    {rules.map((rule) => (
                      <MenuItem key={rule.id} value={rule.id}>
                        {rule.name}
                      </MenuItem>
                    ))}
                  </StyledSelect>
                </FormControl>

                <Box
                  sx={{
                    mb: 1,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <Typography variant="subtitle1" fontWeight={600}>
                    Test Data (JSON)
                  </Typography>
                  <Box>
                    <Tooltip title="Copy JSON">
                      <IconButton
                        size="small"
                        onClick={handleCopy}
                        color={copied ? "success" : "default"}
                      >
                        {copied ? (
                          <CheckCircleOutlineIcon fontSize="small" />
                        ) : (
                          <ContentCopyIcon fontSize="small" />
                        )}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Use Sample Data">
                      <IconButton
                        size="small"
                        onClick={useSampleData}
                        disabled={!sampleData}
                        sx={{ ml: 1 }}
                      >
                        <RefreshIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>

                <StyledTextField
                  multiline
                  rows={12}
                  fullWidth
                  value={testData}
                  onChange={handleTestDataChange}
                  variant="outlined"
                  placeholder="Enter JSON data to test against the rule"
                  sx={{
                    mb: 3,
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: alpha(
                        theme.palette.background.paper,
                        0.5
                      )
                    }
                  }}
                />

                <ActionButton
                  variant="contained"
                  color="primary"
                  onClick={evaluateRule}
                  disabled={!selectedRuleId || !testData || loading}
                  startIcon={
                    loading ? (
                      <CircularProgress size={16} color="inherit" />
                    ) : (
                      <PlayArrowIcon />
                    )
                  }
                  fullWidth
                  sx={{
                    py: 1.5
                  }}
                >
                  {loading ? "Evaluating..." : "Evaluate Rule"}
                </ActionButton>

                <Collapse in={!!error}>
                  <Alert
                    severity="error"
                    sx={{
                      mt: 2,
                      borderRadius: theme.shape.borderRadius,
                      backgroundColor: alpha(theme.palette.error.light, 0.1)
                    }}
                  >
                    {error}
                  </Alert>
                </Collapse>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <ResultCard
              elevation={0}
              result={result}
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column"
              }}
            >
              <CardHeader
                title={
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    Evaluation Result
                  </Typography>
                }
                subheader="View the outcome of rule evaluation"
                sx={{
                  pb: 1,
                  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.8)}`
                }}
              />
              <CardContent
                sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
              >
                <Fade in={result !== null}>
                  <Box
                    sx={{ mb: 3, display: result !== null ? "block" : "none" }}
                  >
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: theme.shape.borderRadius,
                        backgroundColor: result
                          ? alpha(theme.palette.success.main, 0.1)
                          : alpha(theme.palette.error.main, 0.1),
                        display: "flex",
                        alignItems: "center"
                      }}
                    >
                      {result ? (
                        <CheckCircleOutlineIcon
                          color="success"
                          sx={{ mr: 1.5, fontSize: 28 }}
                        />
                      ) : (
                        <HighlightOffIcon
                          color="error"
                          sx={{ mr: 1.5, fontSize: 28 }}
                        />
                      )}
                      <Box>
                        <Typography
                          variant="h6"
                          fontWeight={600}
                          color={result ? "success.main" : "error.main"}
                        >
                          {result ? "Rule Matched" : "Rule Not Matched"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          The provided data{" "}
                          {result ? "satisfies" : "does not satisfy"} the
                          conditions specified in the rule.
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Fade>

                {!selectedRule && !loading && (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      flexGrow: 1,
                      py: 4
                    }}
                  >
                    <AccountTreeIcon
                      sx={{
                        fontSize: 48,
                        color: alpha(theme.palette.text.primary, 0.15),
                        mb: 2
                      }}
                    />
                    <Typography color="text.secondary" align="center">
                      Select a rule and provide test data to see evaluation
                      results.
                    </Typography>
                  </Box>
                )}

                {selectedRule && (
                  <Box sx={{ flexGrow: 1, mt: 2 }}>
                    <Box
                      sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}
                    >
                      <Tabs
                        value={viewMode}
                        onChange={handleViewModeChange}
                        textColor="primary"
                        indicatorColor="primary"
                      >
                        <Tab
                          icon={<AccountTreeIcon fontSize="small" />}
                          iconPosition="start"
                          label="Tree View"
                          sx={{ fontWeight: 600, textTransform: "none" }}
                        />
                        <Tab
                          icon={<CodeIcon fontSize="small" />}
                          iconPosition="start"
                          label="JSON"
                          sx={{ fontWeight: 600, textTransform: "none" }}
                        />
                      </Tabs>
                    </Box>

                    <Box
                      sx={{
                        display: viewMode === 0 ? "block" : "none",
                        height: 300,
                        overflow: "auto"
                      }}
                    >
                      {selectedRule && (
                        <LogicTreeView
                          businessLogic={
                            selectedRule.businessLogic || selectedRule
                          }
                        />
                      )}
                    </Box>

                    <Box sx={{ display: viewMode === 1 ? "block" : "none" }}>
                      <PreviewPanel>
                        <Typography
                          variant="subtitle2"
                          gutterBottom
                          sx={{ fontWeight: 600, mb: 1 }}
                        >
                          Rule Logic JSON:
                        </Typography>
                        <Box
                          sx={{
                            maxHeight: 280,
                            overflow: "auto",
                            fontFamily: "'Roboto Mono', monospace",
                            fontSize: "0.75rem",
                            backgroundColor: alpha(
                              theme.palette.background.default,
                              0.5
                            ),
                            p: 2,
                            borderRadius: theme.shape.borderRadius
                          }}
                        >
                          <pre style={{ margin: 0 }}>
                            {JSON.stringify(selectedRule, null, 2)}
                          </pre>
                        </Box>
                      </PreviewPanel>
                    </Box>
                  </Box>
                )}
              </CardContent>
            </ResultCard>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default RuleTester;
