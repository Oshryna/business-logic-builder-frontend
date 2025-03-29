import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Collapse,
  Chip,
  Tooltip,
  alpha,
  Zoom,
  Button,
  useTheme
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Info as InfoIcon,
  FullscreenExit as CollapseAllIcon,
  Fullscreen as ExpandAllIcon,
  CompareArrows as CompareIcon
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

// Styled components for the modern tree
const TreeContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  maxHeight: "70vh",
  overflow: "auto",
  backgroundColor: alpha(theme.palette.background.paper, 0.92),
  backdropFilter: "blur(10px)",
  boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
  border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
  transition: "all 0.3s ease",
  scrollbarWidth: "thin",
  "&::-webkit-scrollbar": {
    width: "8px",
    height: "8px"
  },
  "&::-webkit-scrollbar-track": {
    background: theme.palette.grey[100],
    borderRadius: "10px"
  },
  "&::-webkit-scrollbar-thumb": {
    background: theme.palette.grey[300],
    borderRadius: "10px",
    "&:hover": {
      background: theme.palette.grey[400]
    }
  }
}));

const NodeContainer = styled(Box)(({ theme, depth = 0 }) => ({
  position: "relative",
  marginLeft: depth > 0 ? theme.spacing(4) : 0,
  paddingLeft: depth > 0 ? theme.spacing(2) : 0,
  paddingBottom: theme.spacing(1.5)
}));

const TreeNodeCard = styled(Paper)(({ theme, isCondition, isExpanded }) => {
  const getGradient = () => {
    if (isCondition) {
      return `linear-gradient(145deg, ${alpha(
        theme.palette.info.main,
        0.05
      )}, ${alpha(theme.palette.info.light, 0.02)})`;
    } else {
      return `linear-gradient(145deg, ${alpha(
        theme.palette.primary.main,
        0.05
      )}, ${alpha(theme.palette.primary.light, 0.02)})`;
    }
  };

  return {
    padding: theme.spacing(1.5, 2),
    borderRadius: theme.shape.borderRadius,
    position: "relative",
    background: getGradient(),
    boxShadow: isExpanded ? theme.shadows[1] : "none",
    border: `1px solid ${alpha(
      isCondition ? theme.palette.info.main : theme.palette.primary.main,
      0.15
    )}`,
    backdropFilter: "blur(4px)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    "&:hover": {
      boxShadow: theme.shadows[2],
      transform: "translateY(-2px)",
      borderColor: alpha(
        isCondition ? theme.palette.info.main : theme.palette.primary.main,
        0.3
      )
    },
    animation: "fadeIn 0.4s ease-out",
    "@keyframes fadeIn": {
      from: { opacity: 0, transform: "translateY(10px)" },
      to: { opacity: 1, transform: "translateY(0)" }
    }
  };
});

const NodeConnector = styled(Box)(
  ({ theme, isCondition, isFirst, isLast }) => ({
    position: "absolute",
    left: 0,
    width: 0,
    borderLeft: `2px dashed ${alpha(
      isCondition ? theme.palette.info.main : theme.palette.primary.main,
      0.3
    )}`,
    opacity: 0.8,
    top: isFirst ? 24 : 0,
    bottom: isLast ? 24 : 0,
    zIndex: 1,
    transition: "opacity 0.3s ease",
    "&::before": !isFirst
      ? {
          content: '""',
          position: "absolute",
          top: 0,
          left: -4,
          width: 8,
          height: 8,
          borderRadius: "50%",
          backgroundColor: alpha(
            isCondition ? theme.palette.info.main : theme.palette.primary.main,
            0.1
          ),
          border: `2px solid ${alpha(
            isCondition ? theme.palette.info.main : theme.palette.primary.main,
            0.4
          )}`
        }
      : {},
    "&::after": {
      content: '""',
      position: "absolute",
      top: 24,
      left: 0,
      width: 16,
      height: 2,
      backgroundColor: alpha(
        isCondition ? theme.palette.info.main : theme.palette.primary.main,
        0.3
      )
    }
  })
);

const OperatorChip = styled(Chip)(({ theme, type }) => {
  const getColor = () => {
    switch (type) {
      case "AND":
        return theme.palette.primary.main;
      case "OR":
        return theme.palette.secondary.main;
      case "NOT":
        return theme.palette.error.main;
      default:
        return theme.palette.primary.main;
    }
  };

  return {
    backgroundColor: alpha(getColor(), 0.1),
    color: getColor(),
    fontWeight: 600,
    marginRight: theme.spacing(1),
    transition: "all 0.2s ease",
    border: `1px solid ${alpha(getColor(), 0.2)}`,
    "&:hover": {
      backgroundColor: alpha(getColor(), 0.15)
    }
  };
});

const ValueChip = styled(Chip)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.secondary.main, 0.1),
  color: theme.palette.secondary.dark,
  marginLeft: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  fontWeight: 600,
  transition: "all 0.2s ease",
  border: `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`,
  backdropFilter: "blur(4px)",
  "&:hover": {
    backgroundColor: alpha(theme.palette.secondary.main, 0.15)
  }
}));

const FieldChip = styled(Box)(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  fontFamily: "monospace",
  fontSize: "0.85rem",
  backgroundColor: alpha(theme.palette.background.default, 0.6),
  padding: theme.spacing(0.5, 1.5),
  borderRadius: theme.shape.borderRadius,
  marginRight: theme.spacing(1.5),
  borderLeft: `3px solid ${alpha(theme.palette.primary.main, 0.5)}`,
  transition: "all 0.2s ease",
  boxShadow: `0 1px 3px ${alpha(theme.palette.common.black, 0.05)}`,
  "&:hover": {
    backgroundColor: alpha(theme.palette.background.default, 0.8),
    boxShadow: `0 2px 5px ${alpha(theme.palette.common.black, 0.08)}`
  }
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  transition: "all 0.2s ease",
  backgroundColor: alpha(theme.palette.background.paper, 0.4),
  backdropFilter: "blur(4px)",
  "&:hover": {
    transform: "scale(1.1)",
    backgroundColor: alpha(theme.palette.background.paper, 0.7)
  }
}));

const OperatorLabel = styled(Typography)(({ theme, type }) => {
  const getColor = () => {
    switch (type) {
      case "eq":
        return theme.palette.success.main;
      case "ne":
        return theme.palette.error.main;
      case "gt":
      case "lt":
        return theme.palette.info.dark;
      case "ge":
      case "le":
        return theme.palette.info.main;
      case "contains":
        return theme.palette.warning.dark;
      case "startswith":
      case "endswith":
        return theme.palette.warning.main;
      case "any":
      case "all":
        return theme.palette.primary.dark;
      default:
        return theme.palette.text.secondary;
    }
  };

  return {
    display: "inline-flex",
    alignItems: "center",
    fontWeight: 600,
    color: getColor(),
    marginRight: theme.spacing(1.5),
    position: "relative",
    padding: theme.spacing(0.5, 1.5),
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${alpha(getColor(), 0.3)}`,
    backgroundColor: alpha(getColor(), 0.05),
    "&::before": {
      content: '""',
      position: "absolute",
      top: "50%",
      left: -20,
      width: 16,
      height: 2,
      transform: "translateY(-50%)",
      backgroundColor: alpha(getColor(), 0.3)
    }
  };
});

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  fontWeight: 600,
  fontSize: "0.875rem",
  textTransform: "none",
  boxShadow: "none"
}));

const LogicTreeView = ({ businessLogic, logic }) => {
  const theme = useTheme();
  // Use businessLogic prop if provided, otherwise use logic prop
  const logicData = businessLogic || logic;

  // Map to store expanded state for each node
  const [expandedNodes, setExpandedNodes] = useState({});

  useEffect(() => {
    // Auto-expand the first level by default
    if (logicData && logicData.type) {
      const nodeId = `${logicData.type}-${JSON.stringify(logicData).length}`;
      setExpandedNodes((prev) => ({
        ...prev,
        [nodeId]: true
      }));
    }
  }, [logicData]);

  // Toggle expansion state for a node
  const toggleNodeExpansion = (nodeId) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [nodeId]: !prev[nodeId]
    }));
  };

  // Expand all nodes
  const expandAll = () => {
    const allExpanded = {};

    const traverse = (condition) => {
      if (condition.type && condition.conditions) {
        const nodeId = `${condition.type}-${JSON.stringify(condition).length}`;
        allExpanded[nodeId] = true;

        condition.conditions.forEach(traverse);
      }
    };

    if (logicData) {
      traverse(logicData);
    }

    setExpandedNodes(allExpanded);
  };

  // Collapse all nodes
  const collapseAll = () => {
    const allCollapsed = {};

    const traverse = (condition) => {
      if (condition.type && condition.conditions) {
        const nodeId = `${condition.type}-${JSON.stringify(condition).length}`;
        allCollapsed[nodeId] = false;

        condition.conditions.forEach(traverse);
      }
    };

    if (logicData) {
      traverse(logicData);
    }

    setExpandedNodes(allCollapsed);
  };

  // Function to render a condition node
  const renderCondition = (
    condition,
    depth = 0,
    index = 0,
    isLast = true,
    totalSiblings = 1
  ) => {
    // For complex conditions (AND/OR/NOT)
    if (condition.type && condition.conditions) {
      // Generate a unique ID for this node based on its content
      const nodeId = `${condition.type}-${JSON.stringify(condition).length}`;

      // Default to expanded if not set
      const isExpanded = expandedNodes[nodeId] !== false;

      return (
        <NodeContainer depth={depth} key={nodeId}>
          {depth > 0 && (
            <NodeConnector
              isCondition={false}
              isFirst={index === 0}
              isLast={isLast}
            />
          )}

          <Zoom in={true} style={{ transitionDelay: `${depth * 40}ms` }}>
            <TreeNodeCard isCondition={false} isExpanded={isExpanded}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box display="flex" alignItems="center">
                  <OperatorChip
                    type={condition.type}
                    label={condition.type}
                    size="small"
                  />
                  <Typography
                    variant="body2"
                    fontWeight={500}
                    color="text.secondary"
                  >
                    {condition.conditions.length} condition
                    {condition.conditions.length !== 1 ? "s" : ""}
                  </Typography>
                </Box>
                <StyledIconButton
                  size="small"
                  onClick={() => toggleNodeExpansion(nodeId)}
                >
                  {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </StyledIconButton>
              </Box>
            </TreeNodeCard>
          </Zoom>

          <Collapse in={isExpanded} timeout={300}>
            <Box mt={1.5} ml={depth > 0 ? 1 : 0}>
              {condition.conditions.map((childCondition, childIndex) =>
                renderCondition(
                  childCondition,
                  depth + 1,
                  childIndex,
                  childIndex === condition.conditions.length - 1,
                  condition.conditions.length
                )
              )}
            </Box>
          </Collapse>
        </NodeContainer>
      );
    }

    // For simple conditions (field, operator, value)
    if (condition.field && condition.operator) {
      // Generate a unique ID for this leaf node
      const nodeId = `${condition.field}-${condition.operator}-${depth}`;

      let valueDisplay = condition.value_prop?.value;

      // Handle different value types
      if (condition.value_prop?.type === "json-path") {
        valueDisplay = (
          <Tooltip title="JSON Path" arrow>
            <FieldChip>{condition.value_prop.value}</FieldChip>
          </Tooltip>
        );
      } else if (typeof valueDisplay === "string") {
        valueDisplay = `"${valueDisplay}"`;
      } else if (valueDisplay === null) {
        valueDisplay = "null";
      } else if (valueDisplay === undefined) {
        valueDisplay = "undefined";
      }

      const getOperatorText = (op) => {
        switch (op) {
          case "eq":
            return "=";
          case "ne":
            return "≠";
          case "gt":
            return ">";
          case "lt":
            return "<";
          case "ge":
            return "≥";
          case "le":
            return "≤";
          case "contains":
            return "contains";
          case "startswith":
            return "starts with";
          case "endswith":
            return "ends with";
          case "any":
            return "any";
          case "all":
            return "all";
          default:
            return op;
        }
      };

      return (
        <NodeContainer depth={depth} key={nodeId}>
          {depth > 0 && (
            <NodeConnector
              isCondition={true}
              isFirst={index === 0}
              isLast={isLast}
            />
          )}

          <Zoom in={true} style={{ transitionDelay: `${depth * 40}ms` }}>
            <TreeNodeCard isCondition={true} isExpanded={false}>
              <Box display="flex" alignItems="center" flexWrap="wrap">
                <Tooltip title="Field Path" arrow>
                  <FieldChip>{condition.field}</FieldChip>
                </Tooltip>

                <OperatorLabel type={condition.operator}>
                  {getOperatorText(condition.operator)}
                </OperatorLabel>

                {typeof valueDisplay === "string" ? (
                  <ValueChip label={valueDisplay} size="small" />
                ) : (
                  valueDisplay
                )}
              </Box>
            </TreeNodeCard>
          </Zoom>
        </NodeContainer>
      );
    }

    // Fallback for unknown condition types
    return (
      <NodeContainer
        depth={depth}
        key={`unknown-${depth}-${Math.random().toString(36)}`}
      >
        {depth > 0 && (
          <NodeConnector
            isCondition={false}
            isFirst={index === 0}
            isLast={isLast}
          />
        )}

        <Zoom in={true} style={{ transitionDelay: `${depth * 40}ms` }}>
          <TreeNodeCard isCondition={false} isExpanded={false}>
            <Typography color="text.secondary" variant="body2">
              Unknown condition type
            </Typography>
          </TreeNodeCard>
        </Zoom>
      </NodeContainer>
    );
  };

  return (
    <TreeContainer elevation={0}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={3}
      >
        <Box display="flex" alignItems="center">
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{
              display: "flex",
              alignItems: "center",
              background: "linear-gradient(to right, #111827, #4B5563)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              "&::before": {
                content: '""',
                display: "inline-block",
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundImage: "linear-gradient(135deg, #6366F1, #818CF8)",
                marginRight: "10px"
              }
            }}
          >
            Logic Tree Visualization
          </Typography>
          <Tooltip
            title="Visual representation of your business logic rule"
            arrow
          >
            <IconButton size="small" sx={{ ml: 1 }}>
              <InfoIcon fontSize="small" color="action" />
            </IconButton>
          </Tooltip>
        </Box>

        <Box>
          <ActionButton
            startIcon={<ExpandAllIcon />}
            size="small"
            variant="outlined"
            color="primary"
            onClick={expandAll}
            sx={{
              mr: 2,
              borderWidth: "1.5px",
              "&:hover": {
                borderWidth: "1.5px"
              }
            }}
          >
            Expand All
          </ActionButton>
          <ActionButton
            startIcon={<CollapseAllIcon />}
            size="small"
            variant="outlined"
            color="secondary"
            onClick={collapseAll}
            sx={{
              borderWidth: "1.5px",
              "&:hover": {
                borderWidth: "1.5px"
              }
            }}
          >
            Collapse All
          </ActionButton>
        </Box>
      </Box>

      <Box
        sx={{
          backgroundColor: alpha(theme.palette.background.default, 0.4),
          borderRadius: theme.shape.borderRadius,
          p: 3,
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          position: "relative"
        }}
      >
        {logicData ? (
          renderCondition(logicData)
        ) : (
          <Box textAlign="center" py={4}>
            <Typography
              color="text.secondary"
              sx={{
                fontStyle: "italic",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1
              }}
            >
              <CompareIcon fontSize="small" color="disabled" />
              No business logic to display
            </Typography>
          </Box>
        )}
      </Box>
    </TreeContainer>
  );
};

export default LogicTreeView;
