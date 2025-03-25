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
  borderRadius: theme.spacing(2),
  maxHeight: "70vh",
  overflow: "auto",
  backgroundColor: alpha(theme.palette.background.paper, 0.92),
  backdropFilter: "blur(10px)",
  boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
  transition: "all 0.3s ease",
  scrollbarWidth: "thin",
  "&::-webkit-scrollbar": {
    width: "8px"
  },
  "&::-webkit-scrollbar-track": {
    background: alpha(theme.palette.background.default, 0.5),
    borderRadius: "10px"
  },
  "&::-webkit-scrollbar-thumb": {
    background: alpha(theme.palette.primary.main, 0.3),
    borderRadius: "10px",
    "&:hover": {
      background: alpha(theme.palette.primary.main, 0.5)
    }
  }
}));

const NodeContainer = styled(Box)(({ theme, depth = 0 }) => ({
  position: "relative",
  marginLeft: depth > 0 ? theme.spacing(4) : 0,
  paddingLeft: depth > 0 ? theme.spacing(2) : 0,
  paddingBottom: theme.spacing(1.5)
}));

const TreeNodeCard = styled(Paper)(({ theme, isCondition, isExpanded }) => ({
  padding: theme.spacing(1.5, 2),
  borderRadius: theme.spacing(1.5),
  position: "relative",
  backgroundColor: alpha(
    isCondition ? theme.palette.info.light : theme.palette.primary.light,
    0.12
  ),
  boxShadow: isExpanded
    ? `0 4px 12px ${alpha(
        isCondition ? theme.palette.info.main : theme.palette.primary.main,
        0.2
      )}`
    : "none",
  border: `1px solid ${alpha(
    isCondition ? theme.palette.info.main : theme.palette.primary.main,
    0.3
  )}`,
  backdropFilter: "blur(4px)",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    boxShadow: `0 5px 15px ${alpha(
      isCondition ? theme.palette.info.main : theme.palette.primary.main,
      0.25
    )}`,
    transform: "translateY(-2px)",
    borderColor: alpha(
      isCondition ? theme.palette.info.main : theme.palette.primary.main,
      0.5
    )
  },
  animation: "fadeIn 0.4s ease-out",
  "@keyframes fadeIn": {
    from: { opacity: 0, transform: "translateY(10px)" },
    to: { opacity: 1, transform: "translateY(0)" }
  }
}));

const NodeConnector = styled(Box)(
  ({ theme, isCondition, isFirst, isLast }) => ({
    position: "absolute",
    left: 0,
    width: 0,
    borderLeft: `2px dashed ${alpha(
      isCondition ? theme.palette.info.main : theme.palette.primary.main,
      0.5
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
          left: -5,
          width: 12,
          height: 12,
          borderRadius: "50%",
          backgroundColor: alpha(
            isCondition ? theme.palette.info.main : theme.palette.primary.main,
            0.2
          ),
          border: `2px solid ${alpha(
            isCondition ? theme.palette.info.main : theme.palette.primary.main,
            0.6
          )}`,
          boxShadow: `0 0 0 3px ${alpha(
            isCondition
              ? theme.palette.info.light
              : theme.palette.primary.light,
            0.1
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
        0.5
      )
    }
  })
);

const OperatorChip = styled(Chip)(({ theme, type }) => {
  const getColor = () => {
    switch (type) {
      case "AND":
        return theme.palette.success.main;
      case "OR":
        return theme.palette.warning.main;
      case "NOT":
        return theme.palette.error.main;
      default:
        return theme.palette.primary.main;
    }
  };

  return {
    backgroundColor: alpha(getColor(), 0.9),
    color: "#fff",
    fontWeight: "700",
    marginRight: theme.spacing(1),
    transition: "all 0.2s ease",
    boxShadow: `0 2px 4px ${alpha(getColor(), 0.3)}`,
    "&:hover": {
      transform: "scale(1.05)",
      boxShadow: `0 3px 6px ${alpha(getColor(), 0.4)}`
    }
  };
});

const ValueChip = styled(Chip)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.secondary.light, 0.15),
  color: theme.palette.secondary.dark,
  marginLeft: theme.spacing(1),
  borderRadius: theme.spacing(1),
  transition: "all 0.2s ease",
  border: `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`,
  backdropFilter: "blur(4px)",
  "&:hover": {
    backgroundColor: alpha(theme.palette.secondary.light, 0.25),
    boxShadow: `0 2px 4px ${alpha(theme.palette.secondary.main, 0.2)}`
  }
}));

const FieldChip = styled(Box)(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  fontFamily: "monospace",
  fontSize: "0.85rem",
  backgroundColor: alpha(theme.palette.background.default, 0.6),
  padding: theme.spacing(0.5, 1.5),
  borderRadius: theme.spacing(1),
  marginRight: theme.spacing(1.5),
  borderLeft: `3px solid ${alpha(theme.palette.primary.main, 0.5)}`,
  transition: "all 0.2s ease",
  boxShadow: `0 1px 3px ${alpha(theme.palette.common.black, 0.08)}`,
  "&:hover": {
    backgroundColor: alpha(theme.palette.background.default, 0.8),
    boxShadow: `0 2px 5px ${alpha(theme.palette.common.black, 0.12)}`
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
        return theme.palette.info.dark;
      case "lt":
        return theme.palette.info.dark;
      case "contains":
        return theme.palette.warning.dark;
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
    padding: theme.spacing(0.5, 1.5, 0.5, 1.5),
    borderRadius: theme.spacing(1),
    border: `1px solid ${alpha(getColor(), 0.4)}`,
    backgroundColor: alpha(getColor(), 0.1),
    "&::before": {
      content: '""',
      position: "absolute",
      top: "50%",
      left: -20,
      width: 16,
      height: 2,
      transform: "translateY(-50%)",
      backgroundColor: alpha(getColor(), 0.4)
    }
  };
});

const LogicTreeView = ({ businessLogic }) => {
  const theme = useTheme();
  // Map to store expanded state for each node
  const [expandedNodes, setExpandedNodes] = useState({});

  useEffect(() => {
    // Auto-expand the first level by default
    if (businessLogic && businessLogic.type) {
      const nodeId = `${businessLogic.type}-${
        JSON.stringify(businessLogic).length
      }`;
      setExpandedNodes((prev) => ({
        ...prev,
        [nodeId]: true
      }));
    }
  }, [businessLogic]);

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

    if (businessLogic) {
      traverse(businessLogic);
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

    if (businessLogic) {
      traverse(businessLogic);
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
                  <Typography variant="body2" fontWeight={500}>
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
          case "contains":
            return "contains";
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
    <TreeContainer elevation={3}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={3}
      >
        <Box display="flex" alignItems="center">
          <Typography
            variant="h6"
            color="primary"
            fontWeight="bold"
            sx={{
              display: "flex",
              alignItems: "center",
              "&::before": {
                content: '""',
                display: "inline-block",
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: theme.palette.primary.main,
                marginRight: "8px",
                boxShadow: `0 0 0 4px ${alpha(theme.palette.primary.main, 0.2)}`
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
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        <Box>
          <Tooltip title="Expand All" arrow>
            <Button
              startIcon={<ExpandAllIcon />}
              size="small"
              variant="outlined"
              color="primary"
              onClick={expandAll}
              sx={{
                mr: 1,
                borderRadius: 2,
                boxShadow: `0 2px 4px ${alpha(
                  theme.palette.primary.main,
                  0.2
                )}`,
                "&:hover": {
                  boxShadow: `0 3px 6px ${alpha(
                    theme.palette.primary.main,
                    0.3
                  )}`
                }
              }}
            >
              Expand All
            </Button>
          </Tooltip>
          <Tooltip title="Collapse All" arrow>
            <Button
              startIcon={<CollapseAllIcon />}
              size="small"
              variant="outlined"
              color="secondary"
              onClick={collapseAll}
              sx={{
                borderRadius: 2,
                boxShadow: `0 2px 4px ${alpha(
                  theme.palette.secondary.main,
                  0.2
                )}`,
                "&:hover": {
                  boxShadow: `0 3px 6px ${alpha(
                    theme.palette.secondary.main,
                    0.3
                  )}`
                }
              }}
            >
              Collapse All
            </Button>
          </Tooltip>
        </Box>
      </Box>

      <Box
        sx={{
          backgroundColor: alpha(theme.palette.background.default, 0.4),
          borderRadius: 2,
          p: 2,
          border: `1px dashed ${alpha(theme.palette.text.secondary, 0.2)}`,
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: "20px",
            right: 0,
            bottom: 0,
            background: `radial-gradient(${alpha(
              theme.palette.primary.main,
              0.05
            )} 1px, transparent 1px)`,
            backgroundSize: "16px 16px",
            zIndex: -1,
            opacity: 0.8,
            pointerEvents: "none"
          }
        }}
      >
        {businessLogic ? (
          renderCondition(businessLogic)
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
