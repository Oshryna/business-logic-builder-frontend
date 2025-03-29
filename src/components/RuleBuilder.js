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
  Alert,
  Stack,
  Chip,
  alpha,
  Tooltip,
  useTheme,
  Tab,
  Tabs
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CodeIcon from "@mui/icons-material/Code";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import LogicTreeView from "./LogicTreeView";

// Styled components
const ConditionPaper = styled(Paper)(({ theme, conditiontype }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  borderLeft: `4px solid ${
    conditiontype === "and"
      ? theme.palette.primary.main
      : theme.palette.secondary.main
  }`,
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    boxShadow: theme.shadows[3],
    transform: "translateY(-2px)"
  }
}));

const GroupBox = styled(Box)(({ theme, grouptype, level }) => {
  const isAnd = grouptype === "AND";
  const primaryColor = isAnd
    ? theme.palette.primary.main
    : theme.palette.secondary.main;
  const bgGradient = isAnd
    ? `linear-gradient(135deg, ${alpha(
        theme.palette.primary.main,
        0.08
      )}, ${alpha(theme.palette.primary.light, 0.04)})`
    : `linear-gradient(135deg, ${alpha(
        theme.palette.secondary.main,
        0.08
      )}, ${alpha(theme.palette.secondary.light, 0.04)})`;

  return {
    padding: theme.spacing(3),
    marginBottom: theme.spacing(2),
    border: `1px solid ${alpha(primaryColor, 0.2)}`,
    borderLeft: `4px solid ${primaryColor}`,
    borderRadius: theme.shape.borderRadius,
    background: bgGradient,
    transition: "all 0.2s ease-in-out",
    "&:hover": {
      boxShadow: theme.shadows[2],
      borderLeftWidth: "5px"
    }
  };
});

const StyledSelect = styled(Select)(({ theme }) => ({
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: alpha(theme.palette.text.primary, 0.15)
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: alpha(theme.palette.text.primary, 0.3)
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.primary.main
  }
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  fontWeight: 600,
  textTransform: "none",
  boxShadow: "none"
}));

const OperatorChip = styled(Chip)(({ theme, operatortype }) => {
  const getColor = () => {
    switch (operatortype) {
      case "eq":
        return theme.palette.success.main;
      case "ne":
        return theme.palette.error.main;
      case "gt":
      case "lt":
        return theme.palette.info.main;
      case "ge":
      case "le":
        return theme.palette.info.dark;
      case "contains":
        return theme.palette.warning.main;
      case "startswith":
      case "endswith":
        return theme.palette.warning.dark;
      case "any":
      case "all":
        return theme.palette.primary.main;
      default:
        return theme.palette.grey[500];
    }
  };

  return {
    fontWeight: 600,
    backgroundColor: alpha(getColor(), 0.1),
    color: getColor(),
    border: `1px solid ${alpha(getColor(), 0.2)}`,
    "& .MuiChip-label": {
      padding: "0 8px"
    }
  };
});

// Component for a single condition
const Condition = ({ condition, onChange, onDelete, index }) => {
  const theme = useTheme();

  const handleChange = (field, value) => {
    const updatedCondition = { ...condition, [field]: value };
    onChange(index, updatedCondition);
  };

  const getOperatorLabel = (op) => {
    const labels = {
      eq: "equals",
      ne: "not equals",
      gt: "greater than",
      lt: "less than",
      ge: "greater than or equal",
      le: "less than or equal",
      contains: "contains",
      startswith: "starts with",
      endswith: "ends with",
      any: "any",
      all: "all"
    };
    return labels[op] || op;
  };

  return (
    <ConditionPaper elevation={1} conditiontype="condition">
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth size="small">
            <InputLabel>Field</InputLabel>
            <StyledSelect
              value={condition.field || "$.Transfer"}
              label="Field"
              onChange={(e) => handleChange("field", e.target.value)}
            >
              <MenuItem value="$.Transfer">$.Transfer</MenuItem>
              <MenuItem value="$.ID">$.ID</MenuItem>
              <MenuItem value="$.ID_Classic">$.ID_Classic</MenuItem>
              <MenuItem value="$.POA">$.POA</MenuItem>
              <MenuItem value="$.StudySavingFund">$.StudySavingFund</MenuItem>
            </StyledSelect>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={2}>
          <FormControl fullWidth size="small">
            <InputLabel>Operator</InputLabel>
            <StyledSelect
              value={condition.operator || "eq"}
              label="Operator"
              onChange={(e) => handleChange("operator", e.target.value)}
            >
              <MenuItem value="eq">equals</MenuItem>
              <MenuItem value="ne">not equals</MenuItem>
              <MenuItem value="gt">greater than</MenuItem>
              <MenuItem value="lt">less than</MenuItem>
              <MenuItem value="ge">greater than or equal</MenuItem>
              <MenuItem value="le">less than or equal</MenuItem>
              <MenuItem value="contains">contains</MenuItem>
              <MenuItem value="startswith">starts with</MenuItem>
              <MenuItem value="endswith">ends with</MenuItem>
              <MenuItem value="any">any</MenuItem>
              <MenuItem value="all">all</MenuItem>
            </StyledSelect>
          </FormControl>
          <Box sx={{ mt: 1, display: "flex", justifyContent: "center" }}>
            <OperatorChip
              label={getOperatorLabel(condition.operator || "eq")}
              size="small"
              operatortype={condition.operator || "eq"}
            />
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Stack spacing={2}>
            <FormControl fullWidth size="small">
              <InputLabel>ComparisonType</InputLabel>
              <StyledSelect
                value={condition.comparison_prop?.type || "simple"}
                label="ComparisonType"
                onChange={(e) => {
                  const comparisonType = e.target.value;
                  const comparisonProp = {
                    type: comparisonType,
                    name:
                      comparisonType !== "simple"
                        ? condition.comparison_prop?.name || ""
                        : ""
                  };
                  handleChange("comparison_prop", comparisonProp);
                }}
              >
                <MenuItem value="simple">simple</MenuItem>
                <MenuItem value="items">items</MenuItem>
                <MenuItem value="aggregation">aggregation</MenuItem>
                <MenuItem value="func">func</MenuItem>
                <MenuItem value="proc">proc</MenuItem>
              </StyledSelect>
            </FormControl>

            {condition.comparison_prop?.type &&
              condition.comparison_prop.type !== "simple" && (
                <TextField
                  fullWidth
                  label="ComparisonName"
                  value={condition.comparison_prop?.name || ""}
                  onChange={(e) => {
                    const updatedComparisonProp = {
                      ...condition.comparison_prop,
                      name: e.target.value
                    };
                    handleChange("comparison_prop", updatedComparisonProp);
                  }}
                  size="small"
                  placeholder="Enter comparison name"
                  InputProps={{
                    sx: {
                      borderRadius: theme.shape.borderRadius,
                      fontSize: "0.9rem"
                    }
                  }}
                />
              )}

            <FormControl fullWidth size="small">
              <InputLabel>Value Type</InputLabel>
              <StyledSelect
                value={condition.value_prop?.type || "const"}
                label="Value Type"
                onChange={(e) => {
                  const valueType = e.target.value;
                  const valueProp = {
                    type: valueType,
                    value: valueType === "const" ? "" : "$.fieldPath",
                    offset: condition.value_prop?.offset || null
                  };
                  handleChange("value_prop", valueProp);
                }}
              >
                <MenuItem value="const">Constant</MenuItem>
                <MenuItem value="json-path">JSON Path</MenuItem>
              </StyledSelect>
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
              InputProps={{
                sx: {
                  borderRadius: theme.shape.borderRadius,
                  fontSize: "0.9rem"
                }
              }}
            />
            <TextField
              fullWidth
              label="Offset"
              type="number"
              value={condition.value_prop?.offset || ""}
              onChange={(e) => {
                const offsetValue =
                  e.target.value === "" ? null : parseInt(e.target.value, 10);
                const updatedValueProp = {
                  ...condition.value_prop,
                  offset: offsetValue
                };
                handleChange("value_prop", updatedValueProp);
              }}
              size="small"
              placeholder="Enter offset value (optional)"
              InputProps={{
                sx: {
                  borderRadius: theme.shape.borderRadius,
                  fontSize: "0.9rem"
                }
              }}
            />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={1} sx={{ textAlign: "right" }}>
          <Tooltip title="Delete condition">
            <IconButton
              onClick={() => onDelete(index)}
              color="error"
              sx={{
                backgroundColor: alpha(theme.palette.error.main, 0.1),
                "&:hover": {
                  backgroundColor: alpha(theme.palette.error.main, 0.2)
                }
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>
    </ConditionPaper>
  );
};

// Component for a group of conditions (AND/OR)
const ConditionGroup = ({ group, onChange, onDelete, level = 0 }) => {
  const theme = useTheme();

  const addCondition = () => {
    const newCondition = {
      field: "$.Transfer", // Default value for field dropdown
      operator: "eq",
      comparison_prop: { type: "simple", name: "" },
      value_prop: { type: "const", value: "", offset: null }
    };

    // If this is a NOT group, replace any existing conditions with the new one
    if (group.type === "NOT") {
      onChange({ ...group, conditions: [newCondition] });
    } else {
      const updatedConditions = [...group.conditions, newCondition];
      onChange({ ...group, conditions: updatedConditions });
    }
  };

  const addGroup = () => {
    const newGroup = {
      type: "AND",
      conditions: []
    };

    // If this is a NOT group, replace any existing conditions with the new one
    if (group.type === "NOT") {
      onChange({ ...group, conditions: [newGroup] });
    } else {
      const updatedConditions = [...group.conditions, newGroup];
      onChange({ ...group, conditions: updatedConditions });
    }
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
    // If changing to NOT and we have multiple conditions, keep only the first one
    if (newType === "NOT" && group.conditions.length > 1) {
      onChange({
        ...group,
        type: newType,
        conditions: [group.conditions[0]]
      });
    } else {
      onChange({ ...group, type: newType });
    }
  };

  return (
    <GroupBox grouptype={group.type} level={level}>
      <Box display="flex" alignItems="center" mb={3}>
        <Chip
          label={group.type}
          color={
            group.type === "AND"
              ? "primary"
              : group.type === "NOT"
              ? "error"
              : "secondary"
          }
          sx={{
            mr: 2,
            fontWeight: 600,
            fontSize: "0.85rem",
            height: 28
          }}
        />

        <Typography
          variant="subtitle1"
          sx={{ mr: 3, fontWeight: 600, color: theme.palette.text.primary }}
        >
          {level === 0 ? "Root Group" : "Nested Group"}
        </Typography>

        <FormControl size="small" sx={{ minWidth: 120, mr: 2 }}>
          <InputLabel>Group Type</InputLabel>
          <StyledSelect
            value={group.type}
            label="Group Type"
            onChange={(e) => changeGroupType(e.target.value)}
          >
            <MenuItem value="AND">AND</MenuItem>
            <MenuItem value="OR">OR</MenuItem>
            <MenuItem value="NOT">NOT</MenuItem>
          </StyledSelect>
        </FormControl>

        {level > 0 && (
          <Tooltip title="Delete group">
            <IconButton
              onClick={onDelete}
              color="error"
              size="small"
              sx={{
                ml: "auto",
                backgroundColor: alpha(theme.palette.error.main, 0.1),
                "&:hover": {
                  backgroundColor: alpha(theme.palette.error.main, 0.2)
                }
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      <Divider sx={{ mb: 3 }} />

      {group.type === "NOT" && (
        <Alert
          severity="info"
          icon={<ErrorOutlineIcon />}
          sx={{
            mb: 3,
            alignItems: "center",
            borderRadius: theme.shape.borderRadius,
            backgroundColor: alpha(theme.palette.info.main, 0.1),
            color: theme.palette.info.dark,
            "& .MuiAlert-icon": {
              color: theme.palette.info.main
            }
          }}
        >
          The NOT group can only contain a single condition or group. Adding a
          new item will replace the current one.
        </Alert>
      )}

      {group.conditions.length === 0 ? (
        <Alert
          severity="info"
          icon={<ErrorOutlineIcon />}
          sx={{
            mb: 3,
            alignItems: "center",
            borderRadius: theme.shape.borderRadius,
            backgroundColor: alpha(theme.palette.info.main, 0.1),
            color: theme.palette.info.dark,
            "& .MuiAlert-icon": {
              color: theme.palette.info.main
            }
          }}
        >
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

      <Box mt={3} display="flex" gap={2} flexWrap="wrap">
        <ActionButton
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={addCondition}
          size="small"
          color="primary"
          sx={{
            borderWidth: "1.5px",
            px: 2
          }}
        >
          Add Condition
        </ActionButton>
        <ActionButton
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={addGroup}
          size="small"
          color="secondary"
          sx={{
            borderWidth: "1.5px",
            px: 2
          }}
        >
          Add Nested Group
        </ActionButton>
      </Box>
    </GroupBox>
  );
};

// Main Rule Builder component
const RuleBuilder = ({ onSave }) => {
  const theme = useTheme();
  const [businessLogic, setBusinessLogic] = useState({
    type: "AND",
    conditions: []
  });

  const [ruleName, setRuleName] = useState("");
  const [jsonOutput, setJsonOutput] = useState("");
  const [error, setError] = useState("");
  const [previewTab, setPreviewTab] = useState(0);
  const [showLivePreview, setShowLivePreview] = useState(true);

  const generateJson = () => {
    try {
      const output = JSON.stringify({ business_logic: businessLogic }, null, 2);
      setJsonOutput(output);
      setError("");
    } catch (err) {
      setError("Failed to generate JSON: " + err.message);
    }
  };

  const handlePreviewTabChange = (event, newValue) => {
    setPreviewTab(newValue);
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
      <Grid container spacing={3}>
        <Grid item xs={12} md={showLivePreview ? 8 : 12}>
          <Card
            elevation={0}
            sx={{
              mb: 4,
              overflow: "visible",
              borderRadius: 3
            }}
          >
            <CardHeader
              title={
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between"
                  }}
                >
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    Create New Business Rule
                  </Typography>
                  <Tooltip
                    title={
                      showLivePreview
                        ? "Hide live preview"
                        : "Show live preview"
                    }
                  >
                    <IconButton
                      color="primary"
                      onClick={() => setShowLivePreview(!showLivePreview)}
                      sx={{
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        "&:hover": {
                          backgroundColor: alpha(
                            theme.palette.primary.main,
                            0.2
                          )
                        }
                      }}
                    >
                      <AccountTreeIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              }
              subheader={
                <Typography variant="body2" color="text.secondary">
                  Define conditions and logic for your business rule
                </Typography>
              }
              sx={{
                pb: 1,
                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
                "& .MuiCardHeader-content": {
                  overflow: "visible",
                  width: "100%"
                }
              }}
            />
            <CardContent sx={{ pt: 3 }}>
              <TextField
                fullWidth
                label="Rule Name"
                value={ruleName}
                onChange={(e) => setRuleName(e.target.value)}
                sx={{ mb: 4 }}
                placeholder="Enter a descriptive name for this rule"
                required
                InputProps={{
                  sx: {
                    borderRadius: theme.shape.borderRadius,
                    fontSize: "1rem",
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: theme.palette.primary.main,
                      borderWidth: 2
                    }
                  }
                }}
              />

              <ConditionGroup
                group={businessLogic}
                onChange={setBusinessLogic}
                onDelete={() => {}}
              />

              {error && (
                <Alert
                  severity="error"
                  sx={{
                    mt: 3,
                    borderRadius: theme.shape.borderRadius,
                    backgroundColor: alpha(theme.palette.error.main, 0.1),
                    color: theme.palette.error.dark,
                    "& .MuiAlert-icon": {
                      color: theme.palette.error.main
                    }
                  }}
                >
                  {error}
                </Alert>
              )}
            </CardContent>
            <CardActions sx={{ justifyContent: "flex-end", p: 3, pt: 1 }}>
              <ActionButton
                variant="outlined"
                onClick={resetBuilder}
                sx={{ mr: 2 }}
                startIcon={<RestartAltIcon />}
              >
                Reset
              </ActionButton>
              <ActionButton
                variant="outlined"
                onClick={generateJson}
                sx={{ mr: 2 }}
                startIcon={<VisibilityIcon />}
              >
                Preview
              </ActionButton>
              <ActionButton
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                onClick={handleSave}
                sx={{
                  px: 3,
                  py: 1
                }}
              >
                Save Rule
              </ActionButton>
            </CardActions>
          </Card>

          {jsonOutput && (
            <Card
              elevation={0}
              sx={{
                borderRadius: 3,
                overflow: "hidden"
              }}
            >
              <CardHeader
                title={
                  <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <Tabs
                      value={previewTab}
                      onChange={handlePreviewTabChange}
                      textColor="primary"
                      indicatorColor="primary"
                    >
                      <Tab
                        icon={<CodeIcon />}
                        iconPosition="start"
                        label="JSON"
                        sx={{
                          fontWeight: 600,
                          textTransform: "none"
                        }}
                      />
                      <Tab
                        icon={<AccountTreeIcon />}
                        iconPosition="start"
                        label="Tree View"
                        sx={{
                          fontWeight: 600,
                          textTransform: "none"
                        }}
                      />
                    </Tabs>
                  </Box>
                }
                sx={{
                  p: 2,
                  "& .MuiCardHeader-content": {
                    width: "100%"
                  }
                }}
              />
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ display: previewTab === 0 ? "block" : "none" }}>
                  <Paper
                    sx={{
                      p: 3,
                      maxHeight: 400,
                      overflow: "auto",
                      backgroundColor: alpha(theme.palette.primary.main, 0.03),
                      borderRadius: 0,
                      fontFamily: '"Roboto Mono", monospace',
                      "& pre": {
                        margin: 0,
                        fontFamily: "inherit",
                        fontSize: "0.875rem",
                        color: theme.palette.text.primary
                      }
                    }}
                  >
                    <pre>{jsonOutput}</pre>
                  </Paper>
                </Box>
                <Box
                  sx={{
                    display: previewTab === 1 ? "block" : "none",
                    p: 2,
                    height: 400,
                    overflow: "auto",
                    backgroundColor: alpha(theme.palette.background.paper, 0.5)
                  }}
                >
                  <LogicTreeView businessLogic={businessLogic} />
                </Box>
              </CardContent>
            </Card>
          )}
        </Grid>

        {showLivePreview && (
          <Grid item xs={12} md={4}>
            <Card
              elevation={0}
              sx={{
                position: { md: "sticky" },
                top: { md: 24 },
                height: "fit-content",
                borderRadius: 3,
                overflow: "hidden",
                mb: 4
              }}
            >
              <CardHeader
                title={
                  <Typography variant="h6" fontWeight={600}>
                    Live Tree Visualization
                  </Typography>
                }
                sx={{
                  pb: 1,
                  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.8)}`
                }}
              />
              <CardContent sx={{ p: 0 }}>
                <Box
                  sx={{
                    p: 2,
                    minHeight: 400,
                    maxHeight: { xs: 400, md: 600 },
                    overflow: "auto",
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? alpha(theme.palette.background.default, 0.6)
                        : alpha(theme.palette.background.paper, 0.5)
                  }}
                >
                  {businessLogic.conditions.length === 0 ? (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        height: 300
                      }}
                    >
                      <AccountTreeIcon
                        sx={{
                          fontSize: 60,
                          color: alpha(theme.palette.primary.main, 0.3),
                          mb: 2
                        }}
                      />
                      <Typography
                        color="text.secondary"
                        variant="body2"
                        textAlign="center"
                        sx={{ maxWidth: 250 }}
                      >
                        Your rule visualization will appear here as you build
                        your business logic
                      </Typography>
                    </Box>
                  ) : (
                    <LogicTreeView businessLogic={businessLogic} />
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default RuleBuilder;
