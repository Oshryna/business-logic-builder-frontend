// src/components/RuleBuilder.js
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Button,
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  IconButton,
  Divider,
  Paper,
  Alert
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import Grid from "@mui/material/Grid";

// Component for a single condition
const Condition = ({ condition, onChange, onDelete, index }) => {
  const handleChange = (field, value) => {
    const updatedCondition = { ...condition, [field]: value };
    onChange(index, updatedCondition);
  };

  return (
    <Paper elevation={2} sx={{ p: 2, my: 2, borderLeft: "4px solid #3f51b5" }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="Field"
            value={condition.field || ""}
            onChange={(e) => handleChange("field", e.target.value)}
            size="small"
            placeholder="$.fieldName"
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <FormControl fullWidth size="small">
            <InputLabel>Operator</InputLabel>
            <Select
              value={condition.operator || "eq"}
              label="Operator"
              onChange={(e) => handleChange("operator", e.target.value)}
            >
              <MenuItem value="eq">equals</MenuItem>
              <MenuItem value="ne">not equals</MenuItem>
              <MenuItem value="gt">greater than</MenuItem>
              <MenuItem value="lt">less than</MenuItem>
              <MenuItem value="contains">contains</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={5}>
          <FormControl fullWidth size="small" sx={{ mb: 1 }}>
            <InputLabel>Value Type</InputLabel>
            <Select
              value={condition.value_prop?.type || "const"}
              label="Value Type"
              onChange={(e) => {
                const valueType = e.target.value;
                const valueProp = {
                  type: valueType,
                  value: valueType === "const" ? "" : "$.fieldPath",
                  offset: null
                };
                handleChange("value_prop", valueProp);
              }}
            >
              <MenuItem value="const">Constant</MenuItem>
              <MenuItem value="json-path">JSON Path</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Value"
            value={condition.value_prop?.value || ""}
            onChange={(e) => {
              const updatedValueProp = {
                ...condition.value_prop,
                value: e.target.value
              };
              handleChange("value_prop", updatedValueProp);
            }}
            size="small"
            placeholder={
              condition.value_prop?.type === "json-path"
                ? "$.fieldPath"
                : "value"
            }
          />
        </Grid>
        <Grid item xs={12} sm={2} sx={{ textAlign: "right" }}>
          <IconButton onClick={() => onDelete(index)} color="error">
            <DeleteIcon />
          </IconButton>
        </Grid>
      </Grid>
    </Paper>
  );
};

// Component for a group of conditions (AND/OR)
const ConditionGroup = ({ group, onChange, onDelete, level = 0 }) => {
  const addCondition = () => {
    const newCondition = {
      field: "",
      operator: "eq",
      comparison_prop: { type: "simple", name: "" },
      value_prop: { type: "const", value: "", offset: null }
    };

    const updatedConditions = [...group.conditions, newCondition];
    onChange({ ...group, conditions: updatedConditions });
  };

  const addGroup = () => {
    const newGroup = {
      type: "AND",
      conditions: []
    };

    const updatedConditions = [...group.conditions, newGroup];
    onChange({ ...group, conditions: updatedConditions });
  };

  const updateCondition = (index, updatedItem) => {
    const updatedConditions = [...group.conditions];
    updatedConditions[index] = updatedItem;
    onChange({ ...group, conditions: updatedConditions });
  };

  const deleteCondition = (index) => {
    const updatedConditions = group.conditions.filter((_, i) => i !== index);
    onChange({ ...group, conditions: updatedConditions });
  };

  const changeGroupType = (newType) => {
    onChange({ ...group, type: newType });
  };

  // Determine border color based on group type
  const getBorderColor = () => {
    return group.type === "AND" ? "#4caf50" : "#ff9800";
  };

  // Determine background color based on nesting level
  const getBgColor = () => {
    const colors = ["#fafafa", "#f5f5f5", "#f0f0f0", "#e8e8e8"];
    return colors[level % colors.length];
  };

  return (
    <Box
      sx={{
        p: 2,
        my: 2,
        border: "1px solid #ccc",
        borderLeft: `5px solid ${getBorderColor()}`,
        borderRadius: 1,
        backgroundColor: getBgColor()
      }}
    >
      <Box display="flex" alignItems="center" mb={2}>
        <Typography variant="subtitle1" sx={{ mr: 2, fontWeight: "bold" }}>
          {level === 0 ? "Root Condition Group:" : "Nested Group:"}
        </Typography>

        <FormControl size="small" sx={{ minWidth: 120, mr: 2 }}>
          <InputLabel>Group Type</InputLabel>
          <Select
            value={group.type}
            label="Group Type"
            onChange={(e) => changeGroupType(e.target.value)}
          >
            <MenuItem value="AND">AND</MenuItem>
            <MenuItem value="OR">OR</MenuItem>
          </Select>
        </FormControl>

        {level > 0 && (
          <IconButton onClick={onDelete} color="error" size="small">
            <DeleteIcon />
          </IconButton>
        )}
      </Box>

      <Divider sx={{ mb: 2 }} />

      {group.conditions.length === 0 ? (
        <Alert severity="info" sx={{ mb: 2 }}>
          This group is empty. Add conditions or nested groups using the buttons
          below.
        </Alert>
      ) : (
        group.conditions.map((condition, index) => (
          <Box key={index}>
            {condition.type ? (
              <ConditionGroup
                group={condition}
                onChange={(updatedGroup) =>
                  updateCondition(index, updatedGroup)
                }
                onDelete={() => deleteCondition(index)}
                level={level + 1}
              />
            ) : (
              <Condition
                condition={condition}
                onChange={updateCondition}
                onDelete={deleteCondition}
                index={index}
              />
            )}
          </Box>
        ))
      )}

      <Box mt={2} display="flex" gap={2} flexWrap="wrap">
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={addCondition}
          size="small"
          color="primary"
        >
          Add Condition
        </Button>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={addGroup}
          size="small"
          color="secondary"
        >
          Add Nested Group
        </Button>
      </Box>
    </Box>
  );
};

// Main Rule Builder component
const RuleBuilder = ({ onSave }) => {
  const [businessLogic, setBusinessLogic] = useState({
    type: "AND",
    conditions: []
  });

  const [ruleName, setRuleName] = useState("");
  const [jsonOutput, setJsonOutput] = useState("");
  const [error, setError] = useState("");

  const generateJson = () => {
    try {
      const output = JSON.stringify({ business_logic: businessLogic }, null, 2);
      setJsonOutput(output);
      setError("");
    } catch (err) {
      setError("Failed to generate JSON: " + err.message);
    }
  };

  const handleSave = () => {
    if (!ruleName.trim()) {
      setError("Please provide a rule name before saving");
      return;
    }

    if (businessLogic.conditions.length === 0) {
      setError("Cannot save an empty rule. Please add at least one condition.");
      return;
    }

    // Call the onSave callback from parent component
    if (onSave) {
      onSave({
        ...businessLogic,
        name: ruleName
      });

      // Clear form or reset to initial state
      setRuleName("");
      setJsonOutput("");
      setBusinessLogic({
        type: "AND",
        conditions: []
      });
      setError("");
    }
  };

  const resetBuilder = () => {
    setBusinessLogic({
      type: "AND",
      conditions: []
    });
    setJsonOutput("");
    setRuleName("");
    setError("");
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto" }}>
      <Card sx={{ mb: 4 }}>
        <CardHeader
          title="Create New Business Rule"
          subheader="Define conditions and logic for your business rule"
        />
        <CardContent>
          <TextField
            fullWidth
            label="Rule Name"
            value={ruleName}
            onChange={(e) => setRuleName(e.target.value)}
            sx={{ mb: 3 }}
            placeholder="Enter a descriptive name for this rule"
            required
          />

          <ConditionGroup
            group={businessLogic}
            onChange={setBusinessLogic}
            onDelete={() => {}}
          />

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </CardContent>
        <CardActions sx={{ justifyContent: "flex-end", p: 2 }}>
          <Button variant="outlined" onClick={resetBuilder} sx={{ mr: 1 }}>
            Reset
          </Button>
          <Button variant="outlined" onClick={generateJson} sx={{ mr: 1 }}>
            Preview JSON
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={handleSave}
          >
            Save Rule
          </Button>
        </CardActions>
      </Card>

      {jsonOutput && (
        <Card>
          <CardHeader
            title="Generated JSON Preview"
            subheader="This is how your rule will be stored and processed"
          />
          <CardContent>
            <Paper
              sx={{
                p: 2,
                maxHeight: 400,
                overflow: "auto",
                backgroundColor: "#f5f5f5"
              }}
            >
              <pre>{jsonOutput}</pre>
            </Paper>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default RuleBuilder;
