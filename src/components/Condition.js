import React, { useState } from "react";
import {
  Box,
  TextField,
  IconButton,
  Chip,
  Tooltip,
  Collapse,
  Grid
} from "@mui/material";
import { styled, alpha, useTheme } from "@mui/material/styles";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EditIcon from "@mui/icons-material/Edit";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

const ConditionPaper = styled(Box)(({ theme, level = 0 }) => {
  const isCompact = level > 1;
  return {
    padding: theme.spacing(isCompact ? 2 : 3),
    marginBottom: theme.spacing(2),
    borderRadius: 8,
    border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
    position: "relative",
    transition: "all 0.3s ease-in-out",
    transform: "scale(0.98)",
    boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.05)}`,
    "&:hover": {
      boxShadow: theme.shadows[3],
      transform: "scale(1.0) translateY(-2px)"
    }
  };
});

const Condition = ({ condition, onChange, onDelete, index, level = 0 }) => {
  const theme = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const [conditionName, setConditionName] = useState(
    condition.name || `Condition ${index + 1}`
  );
  const [isEditingName, setIsEditingName] = useState(false);

  const handleChange = (field, value) => {
    const updatedCondition = { ...condition, [field]: value };
    onChange(index, updatedCondition);
  };

  const saveConditionName = () => {
    handleChange("name", conditionName);
    setIsEditingName(false);
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
    <ConditionPaper level={level}>
      <Box
        sx={{
          position: "absolute",
          top: -10,
          left: 16,
          bgcolor: alpha(theme.palette.info.main, 0.9),
          px: 1.5,
          py: 0.5,
          borderRadius: 12,
          boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
          zIndex: 2,
          display: "flex",
          alignItems: "center",
          gap: 1
        }}
      >
        {isEditingName ? (
          <Box display="flex" alignItems="center">
            <TextField
              size="small"
              value={conditionName}
              onChange={(e) => setConditionName(e.target.value)}
              onBlur={saveConditionName}
              onKeyPress={(e) => e.key === "Enter" && saveConditionName()}
              autoFocus
              sx={{
                width: 150,
                "& .MuiInputBase-input": {
                  color: "white",
                  fontSize: "0.8rem",
                  p: "2px 4px"
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(255,255,255,0.5)"
                }
              }}
            />
            <IconButton
              size="small"
              onClick={saveConditionName}
              sx={{ color: "white", p: 0.5 }}
            >
              <CheckCircleIcon fontSize="small" />
            </IconButton>
          </Box>
        ) : (
          <>
            <span style={{ fontWeight: 600, color: "white", fontSize: 12 }}>
              {conditionName}
            </span>
            <IconButton
              size="small"
              onClick={() => setIsEditingName(true)}
              sx={{ color: "white", p: 0.2 }}
            >
              <EditIcon fontSize="small" sx={{ fontSize: "0.8rem" }} />
            </IconButton>
          </>
        )}
      </Box>
      <Box
        sx={{
          p: 1.5,
          mb: isExpanded ? 2 : 0,
          borderRadius: 6,
          bgcolor: alpha(theme.palette.background.default, 0.5),
          border: `1px dashed ${alpha(theme.palette.divider, 0.6)}`,
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1,
          boxShadow: "inset 0 1px 3px rgba(0,0,0,0.05)",
          cursor: "pointer"
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span style={{ fontWeight: 700, fontSize: "0.9rem" }}>IF</span>
        <Chip
          label={condition.field || "$.Transfer"}
          size="small"
          color="primary"
          sx={{
            fontWeight: 600,
            borderRadius: 4,
            fontSize: "0.8rem",
            height: 24
          }}
        />
        <Chip
          label={getOperatorLabel(condition.operator || "eq")}
          size="small"
          variant="outlined"
          sx={{
            fontWeight: 600,
            borderRadius: 4,
            borderColor: alpha(theme.palette.info.main, 0.3),
            color: theme.palette.info.main,
            bgcolor: alpha(theme.palette.info.main, 0.05),
            fontSize: "0.8rem",
            height: 24
          }}
        />
        <Chip
          label={condition.value_prop?.value || "(Value)"}
          size="small"
          sx={{
            fontWeight: 600,
            borderRadius: 4,
            bgcolor: alpha(theme.palette.secondary.main, 0.1),
            color: theme.palette.secondary.main,
            fontSize: "0.8rem",
            height: 24
          }}
        />
        <Box sx={{ ml: "auto", display: "flex", gap: 0.5 }}>
          <Tooltip title={isExpanded ? "Collapse" : "Expand"}>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              sx={{ p: 0.5 }}
            >
              {isExpanded ? (
                <ExpandLessIcon fontSize="small" />
              ) : (
                <ExpandMoreIcon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete condition">
            <IconButton
              size="small"
              onClick={() => onDelete(index)}
              color="error"
              sx={{ p: 0.5 }}
            >
              <span className="material-icons">delete</span>
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      <Collapse in={isExpanded} timeout="auto">
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                required
                label="Field"
                value={condition.field || ""}
                onChange={(e) => handleChange("field", e.target.value)}
                size="small"
                placeholder="Enter field (JSONPath)"
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                required
                label="Operator"
                value={condition.operator || ""}
                onChange={(e) => handleChange("operator", e.target.value)}
                size="small"
                placeholder="Operator (eq, ne, gt, lt, etc.)"
              />
            </Grid>
            <Grid item xs={12} sm={5}>
              <TextField
                fullWidth
                required
                label="Value"
                value={condition.value_prop?.value || ""}
                onChange={(e) =>
                  handleChange("value_prop", {
                    ...condition.value_prop,
                    value: e.target.value
                  })
                }
                size="small"
                placeholder="Enter value"
              />
            </Grid>
          </Grid>
        </Box>
      </Collapse>
    </ConditionPaper>
  );
};

export default Condition;
