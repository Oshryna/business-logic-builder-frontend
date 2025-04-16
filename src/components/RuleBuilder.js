// src/components/RuleBuilder.js
import React, { useState, useRef } from "react";
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
  Tabs,
  Zoom,
  Fade,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Collapse,
  InputAdornment
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CodeIcon from "@mui/icons-material/Code";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import EditIcon from "@mui/icons-material/Edit";
import DescriptionIcon from "@mui/icons-material/Description";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import LogicTreeView from "./LogicTreeView";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import InfoIcon from "@mui/icons-material/Info";
import CloseIcon from "@mui/icons-material/Close";
import Condition from "./Condition";
import ConditionGroup from "./ConditionGroup";

// New consistent color system
const getColorForDepth = (theme, level, groupType) => {
  // Base colors for different types
  let baseColor;

  switch (groupType) {
    case "AND":
      baseColor = theme.palette.primary;
      break;
    case "OR":
      baseColor = theme.palette.secondary;
      break;
    case "NOT":
      baseColor = theme.palette.error;
      break;
    default:
      baseColor = theme.palette.primary;
  }

  // Adjust intensity based on nesting level
  const intensity = Math.min(0.3 + level * 0.15, 0.9);

  return {
    main: baseColor.main,
    light: baseColor.light,
    dark: baseColor.dark,
    intensity: intensity
  };
};

// Styled components with modern design
const ConditionPaper = styled(Paper)(({ theme, conditiontype, level = 0 }) => {
  const isCompact = level > 1; // Use more compact style for deeper levels

  return {
    padding: theme.spacing(isCompact ? 2 : 3),
    marginBottom: theme.spacing(2),
    borderRadius: 8,
    border: `1px solid ${alpha(
      conditiontype === "and"
        ? theme.palette.primary.main
        : theme.palette.secondary.main,
      0.3
    )}`,
    position: "relative",
    transition: "all 0.3s ease-in-out",
    transform: "scale(0.98)",
    boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.05)}`,
    "&:hover": {
      boxShadow: theme.shadows[3],
      transform: "scale(1.0) translateY(-2px)"
    },
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: `linear-gradient(135deg, ${alpha(
        conditiontype === "and"
          ? theme.palette.primary.main
          : theme.palette.secondary.main,
        0.05
      )}, ${alpha(
        conditiontype === "and"
          ? theme.palette.primary.light
          : theme.palette.secondary.light,
        0.02
      )})`,
      borderRadius: 8,
      zIndex: -1
    }
  };
});

const GroupBox = styled(Box)(({ theme, grouptype, level = 0 }) => {
  // Use the consistent color system
  const colorSet = getColorForDepth(theme, level, grouptype);
  const primaryColor = colorSet.main;
  const intensity = colorSet.intensity;

  return {
    padding: theme.spacing(level > 1 ? 2 : 3),
    marginBottom: theme.spacing(2),
    border: `1px solid ${alpha(primaryColor, 0.3 + level * 0.1)}`,
    borderRadius: 8,
    position: "relative",
    background: alpha(theme.palette.background.paper, 0.7),
    backdropFilter: "blur(8px)",
    transition: "all 0.3s ease-in-out",
    "&:hover": {
      boxShadow: theme.shadows[2],
      transform: "translateY(-2px)"
    },
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: `linear-gradient(135deg, ${alpha(
        primaryColor,
        0.08 + level * 0.02
      )}, ${alpha(primaryColor, 0.02 + level * 0.01)})`,
      borderRadius: 8,
      zIndex: -1
    },
    // Left border to indicate nesting level
    borderLeft: `${3 + level}px solid ${alpha(primaryColor, 0.3 + level * 0.1)}`
  };
});

const StyledSelect = styled(Select)(({ theme }) => ({
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: alpha(theme.palette.text.primary, 0.15),
    borderRadius: 0
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: alpha(theme.palette.text.primary, 0.3)
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.primary.main,
    borderWidth: 2
  },
  "& .MuiSelect-select": {
    paddingTop: 10,
    paddingBottom: 10
  }
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 0,
    transition: "all 0.2s ease",
    "& fieldset": {
      borderColor: alpha(theme.palette.text.primary, 0.15)
    },
    "&:hover fieldset": {
      borderColor: alpha(theme.palette.text.primary, 0.3)
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.palette.primary.main,
      borderWidth: 2
    }
  },
  "& .MuiInputBase-input": {
    paddingTop: 10,
    paddingBottom: 10
  }
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: 0,
  fontWeight: 600,
  textTransform: "none",
  padding: theme.spacing(1, 2),
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    transform: "translateY(-2px)"
  }
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
    borderRadius: 0,
    "& .MuiChip-label": {
      padding: "0 8px"
    }
  };
});

// Function to generate a color based on level
const getNestedColorByLevel = (level, theme) => {
  const colors = [
    theme.palette.primary,
    theme.palette.secondary,
    theme.palette.info,
    theme.palette.success,
    theme.palette.warning
  ];

  return colors[level % colors.length];
};

// Main Rule Builder component
const RuleBuilder = ({ onSave }) => {
  const theme = useTheme();
  const [ruleName, setRuleName] = useState("");
  const [ruleDescription, setRuleDescription] = useState("");
  const [rootGroup, setRootGroup] = useState({
    type: "AND",
    name: "All Conditions",
    conditions: []
  });
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [previewTab, setPreviewTab] = useState(0);
  const [splitView, setSplitView] = useState(true); // Default to split view for better UX
  const [sidebarWidth, setSidebarWidth] = useState(50); // Percentage
  const [showValidationWarnings, setShowValidationWarnings] = useState(false);

  // Generate JSON representation of the rule
  const generateJson = () => {
    return {
      name: ruleName,
      description: ruleDescription,
      businessLogic: rootGroup
    };
  };

  const handlePreviewTabChange = (event, newValue) => {
    setPreviewTab(newValue);
  };

  const handleClosePreviewDialog = () => {
    setPreviewDialogOpen(false);
  };

  // Validation function to check if the rule is complete
  const validateRule = () => {
    const issues = [];

    if (!ruleName.trim()) {
      issues.push("Rule name is required");
    }

    if (rootGroup.conditions.length === 0) {
      issues.push("At least one condition is required");
    }

    // Check for empty conditions
    const checkEmptyConditions = (group) => {
      if (!group || !group.conditions) return;

      group.conditions.forEach((item) => {
        if (item.type) {
          // This is a group
          if (item.conditions.length === 0) {
            issues.push(`Empty ${item.type} group found`);
          }
          checkEmptyConditions(item);
        } else {
          // This is a condition
          if (!item.field || !item.operator || !item.value_prop?.value) {
            issues.push("Incomplete condition found");
          }

          // Check if ComparisonName is provided when ComparisonType is not 'simple'
          if (
            item.comparison_prop?.type &&
            item.comparison_prop.type !== "simple" &&
            !item.comparison_prop.name
          ) {
            issues.push(
              "Comparison Name is required when Comparison Type is not 'simple'"
            );
          }
        }
      });
    };

    checkEmptyConditions(rootGroup);

    return {
      isValid: issues.length === 0,
      issues
    };
  };

  const handleSave = () => {
    const { isValid, issues } = validateRule();

    if (!isValid) {
      setShowValidationWarnings(true);
      return;
    }

    onSave(generateJson());

    // Show success feedback
    // This could be replaced with a snackbar component for better UX
    alert("Rule saved successfully!");
  };

  const toggleSplitView = () => {
    setSplitView(!splitView);
  };

  const handleResizeMouseDown = (e) => {
    e.preventDefault();
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e) => {
    const container = document.getElementById("rule-builder-container");
    if (container) {
      const containerRect = container.getBoundingClientRect();
      const newWidth =
        ((e.clientX - containerRect.left) / containerRect.width) * 100;
      // Limit the width between 30% and 70%
      if (newWidth >= 30 && newWidth <= 70) {
        setSidebarWidth(newWidth);
      }
    }
  };

  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const resetBuilder = () => {
    if (
      window.confirm(
        "Are you sure you want to reset the rule builder? This will clear all your conditions."
      )
    ) {
      setRuleName("");
      setRuleDescription("");
      setRootGroup({
        type: "AND",
        name: "All Conditions",
        conditions: []
      });
      setShowValidationWarnings(false);
    }
  };

  // Get validation for display
  const validationResult = validateRule();

  return (
    <Card
      elevation={0}
      sx={{
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        borderRadius: theme.shape.borderRadius,
        height: "100%",
        display: "flex",
        flexDirection: "column"
      }}
    >
      <CardHeader
        title={
          <Box display="flex" alignItems="center">
            <Typography variant="h5" fontWeight={700} sx={{ mr: 2 }}>
              Business Rule Builder
            </Typography>
            {showValidationWarnings && !validationResult.isValid && (
              <Chip
                label={`${validationResult.issues.length} issue${
                  validationResult.issues.length !== 1 ? "s" : ""
                }`}
                color="error"
                size="small"
                icon={<ErrorOutlineIcon />}
              />
            )}
          </Box>
        }
        subheader="Create complex business logic rules with conditions and groups"
        action={
          <Box>
            <Tooltip
              title={splitView ? "Hide visualization" : "Show visualization"}
            >
              <IconButton
                onClick={toggleSplitView}
                color={splitView ? "primary" : "default"}
                sx={{
                  mr: 1,
                  bgcolor: splitView
                    ? alpha(theme.palette.primary.main, 0.1)
                    : "transparent"
                }}
              >
                <AccountTreeIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Preview rule">
              <IconButton onClick={() => setPreviewDialogOpen(true)}>
                <VisibilityIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Reset builder">
              <IconButton color="error" onClick={resetBuilder}>
                <RestartAltIcon />
              </IconButton>
            </Tooltip>
          </Box>
        }
        sx={{
          pb: 0,
          "& .MuiCardHeader-action": {
            margin: 0
          }
        }}
      />

      <CardContent
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          p: 3,
          height: "100%",
          display: "flex",
          flexDirection: "column"
        }}
      >
        <Box
          id="rule-builder-container"
          sx={{
            display: "flex",
            height: "100%",
            gap: 2,
            flexDirection: splitView ? "row" : "column",
            position: "relative"
          }}
        >
          <Box
            sx={{
              width: splitView ? `${sidebarWidth}%` : "100%",
              height: "100%",
              overflowY: "auto",
              pr: splitView ? 2 : 0
            }}
          >
            <Box mb={3}>
              <StyledTextField
                label="Rule Name"
                variant="outlined"
                fullWidth
                value={ruleName}
                onChange={(e) => setRuleName(e.target.value)}
                placeholder="Enter a descriptive name for this rule"
                error={showValidationWarnings && !ruleName.trim()}
                helperText={
                  showValidationWarnings && !ruleName.trim()
                    ? "Rule name is required"
                    : ""
                }
                InputProps={{
                  sx: {
                    borderRadius: 8,
                    backgroundColor: alpha(theme.palette.background.paper, 0.6)
                  }
                }}
              />
            </Box>

            <Box mb={3}>
              <StyledTextField
                label="Rule Description (Optional)"
                variant="outlined"
                fullWidth
                multiline
                rows={2}
                value={ruleDescription}
                onChange={(e) => setRuleDescription(e.target.value)}
                placeholder="Briefly describe the purpose of this rule"
                InputProps={{
                  sx: {
                    borderRadius: 8,
                    backgroundColor: alpha(theme.palette.background.paper, 0.6)
                  }
                }}
              />
            </Box>

            {showValidationWarnings && validationResult.issues.length > 0 && (
              <Alert
                severity="warning"
                sx={{ mb: 2, borderRadius: 2 }}
                action={
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => setShowValidationWarnings(false)}
                  >
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                }
              >
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 600, mb: 0.5 }}
                >
                  Please fix the following issues:
                </Typography>
                <ul style={{ margin: 0, paddingLeft: 20 }}>
                  {validationResult.issues.map((issue, index) => (
                    <li key={index}>
                      <Typography variant="body2">{issue}</Typography>
                    </li>
                  ))}
                </ul>
              </Alert>
            )}

            <ConditionGroup
              group={rootGroup}
              onChange={setRootGroup}
              level={0}
            />
          </Box>

          {splitView && (
            <>
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  left: `${sidebarWidth}%`,
                  width: 12,
                  transform: "translateX(-50%)",
                  cursor: "col-resize",
                  zIndex: 10,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  "&:hover": {
                    "&::after": {
                      backgroundColor: theme.palette.primary.main
                    }
                  },
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    top: "30%",
                    bottom: "30%",
                    left: "50%",
                    width: 4,
                    backgroundColor: alpha(theme.palette.divider, 0.5),
                    borderRadius: 2,
                    transform: "translateX(-50%)",
                    transition: "background-color 0.2s"
                  }
                }}
                onMouseDown={handleResizeMouseDown}
              >
                <DragHandleIcon
                  sx={{
                    color: alpha(theme.palette.text.secondary, 0.4),
                    position: "absolute",
                    zIndex: 1,
                    fontSize: "1.2rem",
                    transform: "rotate(90deg)",
                    transition: "color 0.2s",
                    "&:hover": {
                      color: theme.palette.primary.main
                    }
                  }}
                />
              </Box>

              <Box
                sx={{
                  width: `${100 - sidebarWidth}%`,
                  height: "100%",
                  overflowY: "auto",
                  pl: 2,
                  borderLeft: `1px dashed ${alpha(theme.palette.divider, 0.3)}`
                }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    height: "100%",
                    backgroundColor: alpha(theme.palette.background.paper, 0.5),
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    borderRadius: theme.shape.borderRadius
                  }}
                >
                  <LogicTreeView businessLogic={rootGroup} />
                </Paper>
              </Box>
            </>
          )}
        </Box>
      </CardContent>

      <CardActions
        sx={{
          p: 3,
          pt: 2,
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          justifyContent: "flex-end"
        }}
      >
        <Button
          variant="outlined"
          onClick={resetBuilder}
          startIcon={<RestartAltIcon />}
          sx={{
            borderRadius: 8,
            textTransform: "none",
            borderWidth: "1.5px",
            "&:hover": {
              borderWidth: "1.5px"
            }
          }}
        >
          Reset
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          startIcon={<SaveIcon />}
          disableElevation
          sx={{
            ml: 2,
            borderRadius: 8,
            textTransform: "none",
            backgroundColor: theme.palette.primary.main,
            "&:hover": {
              backgroundColor: theme.palette.primary.dark
            }
          }}
        >
          Save Rule
        </Button>
      </CardActions>

      <Dialog
        open={previewDialogOpen}
        onClose={handleClosePreviewDialog}
        fullWidth
        maxWidth="md"
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: theme.shape.borderRadius
          }
        }}
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight={600}>
            Rule Preview
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          <Tabs
            value={previewTab}
            onChange={handlePreviewTabChange}
            sx={{ mb: 2 }}
          >
            <Tab
              label="Visualization"
              icon={<AccountTreeIcon />}
              iconPosition="start"
            />
            <Tab label="JSON" icon={<CodeIcon />} iconPosition="start" />
          </Tabs>

          <Box sx={{ p: 1 }}>
            {previewTab === 0 ? (
              <LogicTreeView businessLogic={rootGroup} />
            ) : (
              <Box
                component="pre"
                sx={{
                  p: 2,
                  borderRadius: theme.shape.borderRadius,
                  backgroundColor: alpha(theme.palette.common.black, 0.03),
                  fontFamily: "monospace",
                  fontSize: "0.875rem",
                  overflowX: "auto",
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
                }}
              >
                {JSON.stringify(generateJson(), null, 2)}
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClosePreviewDialog}
            sx={{ textTransform: "none" }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default RuleBuilder;
