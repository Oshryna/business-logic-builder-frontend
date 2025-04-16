import React, { useState } from "react";
import {
  Box,
  TextField,
  IconButton,
  Typography,
  Tooltip,
  Collapse,
  Divider,
  Alert
} from "@mui/material";
import { styled, alpha, useTheme } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import DeleteIcon from "@mui/icons-material/Delete";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import EditIcon from "@mui/icons-material/Edit";
import Condition from "./Condition";

const GroupBox = styled(Box)(({ theme, grouptype, level = 0 }) => {
  const colorSet = getColorForDepth(theme, level, grouptype);
  const primaryColor = colorSet.main;
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
    }
  };
});

function getColorForDepth(theme, level, groupType) {
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
  const intensity = Math.min(0.3 + level * 0.15, 0.9);
  return {
    main: baseColor.main,
    light: baseColor.light,
    dark: baseColor.dark,
    intensity: intensity
  };
}

const ConditionGroup = ({ group, onChange, onDelete, level = 0 }) => {
  const theme = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [groupName, setGroupName] = useState(
    group.name || getDefaultGroupName(group.type, level)
  );
  const [isEditingName, setIsEditingName] = useState(false);

  function getDefaultGroupName(type, level) {
    switch (type) {
      case "AND":
        return level === 0
          ? "All Conditions"
          : `All Conditions (Level ${level})`;
      case "OR":
        return level === 0 ? "Any Condition" : `Any Condition (Level ${level})`;
      case "NOT":
        return level === 0 ? "None True" : `None True (Level ${level})`;
      default:
        return `Group (Level ${level})`;
    }
  }

  const addCondition = () => {
    const newCondition = {
      field: "$.Transfer",
      operator: "eq",
      comparison_prop: { type: "simple", name: "" },
      value_prop: { type: "const", value: "", offset: null }
    };
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
    if (newType === "NOT" && group.conditions.length > 1) {
      onChange({
        ...group,
        type: newType,
        conditions: [group.conditions[0]],
        name: getDefaultGroupName(newType, level)
      });
      setGroupName(getDefaultGroupName(newType, level));
    } else {
      onChange({
        ...group,
        type: newType,
        name: getDefaultGroupName(newType, level)
      });
      setGroupName(getDefaultGroupName(newType, level));
    }
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const saveGroupName = () => {
    onChange({ ...group, name: groupName });
    setIsEditingName(false);
  };

  const getGroupColor = () => {
    return getColorForDepth(theme, level, group.type).main;
  };

  return (
    <GroupBox
      grouptype={group.type}
      level={level}
      sx={{
        borderColor: alpha(getGroupColor(), 0.5),
        boxShadow: `0 2px 8px ${alpha(getGroupColor(), 0.1)}`
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
          <DragHandleIcon
            sx={{
              color: alpha(getGroupColor(), 0.6),
              cursor: "grab",
              mr: 1,
              fontSize: "1.2rem"
            }}
          />
          {isEditingName ? (
            <Box display="flex" alignItems="center">
              <TextField
                size="small"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                onBlur={saveGroupName}
                onKeyPress={(e) => e.key === "Enter" && saveGroupName()}
                autoFocus
                sx={{
                  width: 200,
                  "& .MuiInputBase-input": {
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    p: "4px 8px",
                    color: getGroupColor()
                  }
                }}
              />
              <IconButton
                size="small"
                onClick={saveGroupName}
                sx={{ color: getGroupColor(), p: 0.5 }}
              >
                <CheckCircleIcon fontSize="small" />
              </IconButton>
            </Box>
          ) : (
            <Box display="flex" alignItems="center">
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  color: getGroupColor(),
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5
                }}
              >
                <Box
                  component="span"
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    bgcolor: getGroupColor(),
                    display: "inline-block",
                    mr: 0.5
                  }}
                />
                {groupName}
              </Typography>
              <IconButton
                size="small"
                onClick={() => setIsEditingName(true)}
                sx={{ color: getGroupColor(), p: 0.2 }}
              >
                <EditIcon fontSize="small" sx={{ fontSize: "0.8rem" }} />
              </IconButton>
            </Box>
          )}
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <TextField
            select
            value={group.type}
            onChange={(e) => changeGroupType(e.target.value)}
            size="small"
            sx={{ minWidth: 80 }}
            SelectProps={{ native: true }}
          >
            <option value="AND">AND</option>
            <option value="OR">OR</option>
            <option value="NOT">NOT</option>
          </TextField>
          <Tooltip title={isCollapsed ? "Expand group" : "Collapse group"}>
            <IconButton
              onClick={toggleCollapse}
              size="small"
              sx={{
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                "&:hover": {
                  backgroundColor: alpha(theme.palette.primary.main, 0.2)
                }
              }}
            >
              {isCollapsed ? <ExpandMoreIcon /> : <ExpandLessIcon />}
            </IconButton>
          </Tooltip>
          {level > 0 && (
            <Tooltip title="Delete group">
              <IconButton
                onClick={onDelete}
                color="error"
                size="small"
                sx={{
                  ml: 1,
                  backgroundColor: alpha(theme.palette.error.main, 0.1),
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.error.main, 0.2)
                  }
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>
      <Collapse in={!isCollapsed} timeout="auto">
        {group.type === "NOT" && (
          <Alert
            severity="info"
            icon={<ErrorOutlineIcon />}
            sx={{
              mb: 2,
              alignItems: "center",
              borderRadius: 4,
              backgroundColor: alpha(theme.palette.info.main, 0.1),
              color: theme.palette.info.dark,
              "& .MuiAlert-icon": { color: theme.palette.info.main }
            }}
          >
            The NOT group can only contain a single condition or group.
          </Alert>
        )}
        {group.conditions.length === 0 ? (
          <Alert
            severity="info"
            icon={<LightbulbIcon />}
            sx={{
              mb: 2,
              alignItems: "center",
              borderRadius: 4,
              backgroundColor: alpha(theme.palette.info.main, 0.1),
              color: theme.palette.info.dark,
              "& .MuiAlert-icon": { color: theme.palette.info.main }
            }}
          >
            This group is empty. Add conditions or nested groups using the
            buttons below.
          </Alert>
        ) : (
          <Box
            sx={{
              position: "relative",
              pl: group.conditions.length > 1 ? 4 : 0
            }}
          >
            {group.conditions.map((condition, index) => (
              <Box key={index} sx={{ position: "relative" }}>
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
                    level={level + 1}
                  />
                )}
              </Box>
            ))}
          </Box>
        )}
      </Collapse>
      <Box
        mt={2}
        display="flex"
        flexWrap="wrap"
        gap={2}
        sx={{
          opacity: isCollapsed ? 0 : 1,
          height: isCollapsed ? 0 : "auto",
          overflow: "hidden",
          transition: "opacity 0.3s ease",
          mt: isCollapsed ? 0 : 2
        }}
      >
        <Divider sx={{ width: "100%", mb: 1.5 }} />
        <IconButton
          variant="outlined"
          onClick={addCondition}
          color="primary"
          size="small"
          disabled={group.type === "NOT" && group.conditions.length > 0}
          sx={{ py: 0.5, px: 1.5 }}
        >
          <AddIcon /> Add Condition
        </IconButton>
        <IconButton
          variant="outlined"
          onClick={addGroup}
          color="secondary"
          size="small"
          disabled={group.type === "NOT" && group.conditions.length > 0}
          sx={{ py: 0.5, px: 1.5 }}
        >
          <AccountTreeIcon /> Add Nested Group
        </IconButton>
      </Box>
    </GroupBox>
  );
};

export default ConditionGroup;
