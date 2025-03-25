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
  Alert
} from "@mui/material";

const RuleTester = ({ rules }) => {
  const [selectedRuleId, setSelectedRuleId] = useState("");
  const [testData, setTestData] = useState("");
  const [result, setResult] = useState(null);
  const [sampleData, setSampleData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch sample data when component mounts
    fetchSampleData();
  }, []);

  const fetchSampleData = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/sample");
      const data = await response.json();
      setSampleData(data);
    } catch (error) {
      console.error("Error fetching sample data:", error);
      setError("Failed to fetch sample data");
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

  const evaluateRule = async () => {
    setError("");
    setResult(null);

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
        return;
      }

      // Send to backend for evaluation
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
    } catch (error) {
      console.error("Error evaluating rule:", error);
      setError("An error occurred during evaluation");
    }
  };

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Test Your Rules
      </Typography>

      {rules.length === 0 ? (
        <Alert severity="info" sx={{ my: 2 }}>
          No rules available for testing. Create rules in the Rule Builder tab
          first.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Test Configuration" />
              <CardContent>
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel id="rule-select-label">Select Rule</InputLabel>
                  <Select
                    labelId="rule-select-label"
                    value={selectedRuleId}
                    label="Select Rule"
                    onChange={handleRuleChange}
                  >
                    {rules.map((rule) => (
                      <MenuItem key={rule.id} value={rule.id}>
                        {rule.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Typography variant="subtitle1" gutterBottom>
                  Test Data (JSON)
                </Typography>
                <TextField
                  multiline
                  rows={10}
                  fullWidth
                  value={testData}
                  onChange={handleTestDataChange}
                  variant="outlined"
                  sx={{ mb: 2 }}
                  placeholder="Enter JSON data to test against the rule"
                />

                <Box display="flex" gap={2}>
                  <Button
                    variant="outlined"
                    onClick={useSampleData}
                    disabled={!sampleData}
                  >
                    Use Sample Data
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={evaluateRule}
                    disabled={!selectedRuleId || !testData}
                  >
                    Evaluate Rule
                  </Button>
                </Box>

                {error && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                  </Alert>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Evaluation Result" />
              <CardContent>
                {result !== null ? (
                  <>
                    <Alert
                      severity={result ? "success" : "warning"}
                      sx={{ mb: 2 }}
                    >
                      The rule evaluation {result ? "passed" : "failed"}
                    </Alert>
                    <Typography variant="body1">
                      The provided data{" "}
                      {result ? "satisfies" : "does not satisfy"} the conditions
                      specified in the rule.
                    </Typography>
                  </>
                ) : (
                  <Typography color="textSecondary">
                    Select a rule and provide test data to see evaluation
                    results.
                  </Typography>
                )}

                {selectedRuleId && (
                  <Box mt={3}>
                    <Typography variant="subtitle1" gutterBottom>
                      Selected Rule Logic:
                    </Typography>
                    <Paper sx={{ p: 2, backgroundColor: "#f5f5f5" }}>
                      <pre>
                        {JSON.stringify(
                          rules.find((r) => r.id === selectedRuleId)
                            ?.businessLogic,
                          null,
                          2
                        )}
                      </pre>
                    </Paper>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </div>
  );
};

export default RuleTester;
