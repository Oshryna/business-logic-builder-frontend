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
  useTheme,
  Breadcrumbs,
  Link,
  Badge,
  Card,
  CardContent
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Info as InfoIcon,
  FullscreenExit as CollapseAllIcon,
  Fullscreen as ExpandAllIcon,
  CompareArrows as CompareIcon,
  AccountTree as TreeIcon,
  Home as HomeIcon,
  ArrowForward as ArrowForwardIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  FilterList as FilterListIcon
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

// Function to get consistent colors based on group type and level
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

// Styled components for the modern tree
const TreeContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  maxHeight: "70vh",
  overflow: "auto",
  backgroundColor: alpha(theme.palette.background.paper, 0.92),
  backdropFilter: "blur(10px)",
  boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
  border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
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
  marginLeft: depth > 0 ? theme.spacing(3) : 0,
  paddingLeft: depth > 0 ? theme.spacing(2) : 0,
  paddingBottom: theme.spacing(1),
  transition: "all 0.2s ease-in-out",
  transform: depth > 2 ? `scale(${0.98 - depth * 0.02})` : "scale(1)",
  transformOrigin: "left top"
}));

const TreeNodeCard = styled(Paper)(
  ({ theme, isCondition, isExpanded, depth = 0, groupType }) => {
    // Get color based on depth level and group type
    const colorSet = getColorForDepth(
      theme,
      depth,
      groupType || (isCondition ? "CONDITION" : "AND")
    );
    const primaryColor = colorSet.main;
    const intensity = colorSet.intensity;

    return {
      padding: theme.spacing(1.5, 2),
      borderRadius: theme.shape.borderRadius,
      position: "relative",
      background: `linear-gradient(145deg, ${alpha(
        primaryColor,
        0.05 + depth * 0.01
      )}, ${alpha(theme.palette.background.paper, 0.9)})`,
      boxShadow: isExpanded ? theme.shadows[1] : "none",
      border: `1px solid ${alpha(primaryColor, 0.2 + depth * 0.05)}`,
      backdropFilter: "blur(4px)",
      transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
      "&:hover": {
        boxShadow: theme.shadows[2],
        transform: "translateY(-2px)",
        borderColor: alpha(primaryColor, 0.3 + depth * 0.05)
      },
      // Left border highlighting to indicate nesting level
      borderLeft: `${3 + Math.min(depth, 3)}px solid ${alpha(
        primaryColor,
        0.4 + depth * 0.1
      )}`,
      // Make conditions more compact based on depth
      ...(isCondition && {
        padding: theme.spacing(1, 1.5),
        marginBottom: theme.spacing(0.5)
      })
    };
  }
);

const NodeConnector = styled(Box)(
  ({ theme, isCondition, isFirst, isLast, depth = 0, groupType }) => {
    // Get color based on depth level and group type
    const colorSet = getColorForDepth(
      theme,
      depth,
      groupType || (isCondition ? "CONDITION" : "AND")
    );
    const primaryColor = colorSet.main;

    return {
      position: "absolute",
      left: 0,
      width: 0,
      borderLeft: `2px solid ${alpha(primaryColor, 0.3 + depth * 0.1)}`,
      opacity: 0.9,
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
            backgroundColor: alpha(primaryColor, 0.1 + depth * 0.05),
            border: `2px solid ${alpha(primaryColor, 0.4 + depth * 0.1)}`
          }
        : {},
      "&::after": {
        content: '""',
        position: "absolute",
        top: 24,
        left: 0,
        width: 16,
        height: 2,
        backgroundColor: alpha(primaryColor, 0.3 + depth * 0.1)
      }
    };
  }
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
    },
    // Make chips smaller and more compact
    height: 24,
    fontSize: "0.75rem"
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
  height: 24,
  fontSize: "0.75rem",
  "&:hover": {
    backgroundColor: alpha(theme.palette.secondary.main, 0.15)
  }
}));

const FieldChip = styled(Box)(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  fontFamily: "monospace",
  fontSize: "0.75rem",
  backgroundColor: alpha(theme.palette.background.default, 0.6),
  padding: theme.spacing(0.3, 1),
  borderRadius: theme.shape.borderRadius,
  marginRight: theme.spacing(1),
  borderLeft: `3px solid ${alpha(theme.palette.primary.main, 0.5)}`,
  transition: "all 0.2s ease",
  boxShadow: `0 1px 2px ${alpha(theme.palette.common.black, 0.05)}`,
  "&:hover": {
    backgroundColor: alpha(theme.palette.background.default, 0.8),
    boxShadow: `0 2px 3px ${alpha(theme.palette.common.black, 0.08)}`
  }
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  transition: "all 0.2s ease",
  backgroundColor: alpha(theme.palette.background.paper, 0.4),
  backdropFilter: "blur(4px)",
  padding: theme.spacing(0.5),
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
    fontSize: "0.75rem",
    color: getColor(),
    padding: theme.spacing(0.2, 0.8),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(getColor(), 0.1),
    transition: "all 0.2s ease"
  };
});

const RuleSummaryCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.background.paper, 0.7),
  backdropFilter: "blur(10px)",
  border: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
}));

const LogicTreeView = ({ businessLogic, logic }) => {
  const theme = useTheme();
  const [expandedNodes, setExpandedNodes] = useState({});
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [activePath, setActivePath] = useState([]);
  const [zoomLevel, setZoomLevel] = useState(100);

  // Calculate rule complexity metrics
  const [ruleMetrics, setRuleMetrics] = useState({
    totalConditions: 0,
    maxDepth: 0,
    groupCount: 0,
    complexityScore: 0
  });

  // Initialize all nodes to be expanded by default
  useEffect(() => {
    if (businessLogic || logic) {
      const dataToUse = businessLogic || logic;
      const initialExpanded = {};

      // Calculate metrics while traversing the tree
      let totalConditions = 0;
      let maxDepth = 0;
      let groupCount = 0;

      const traverse = (node, path = "", depth = 0) => {
        const nodeId = path || "root";
        initialExpanded[nodeId] = true;

        // Update max depth
        maxDepth = Math.max(maxDepth, depth);

        if (node && node.conditions) {
          // This is a group
          groupCount++;

          node.conditions.forEach((condition, index) => {
            const childPath = `${path ? path + "-" : ""}${index}`;

            if (condition.field !== undefined) {
              // This is a leaf condition
              totalConditions++;
            }

            traverse(condition, childPath, depth + 1);
          });
        }
      };

      traverse(dataToUse);
      setExpandedNodes(initialExpanded);

      // Update metrics
      const complexityScore =
        totalConditions * 1 + groupCount * 2 + maxDepth * 3;
      setRuleMetrics({
        totalConditions,
        maxDepth,
        groupCount,
        complexityScore
      });
    }
  }, [businessLogic, logic]);

  const toggleNodeExpansion = (nodeId) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [nodeId]: !prev[nodeId]
    }));
  };

  const expandAll = () => {
    const newExpandedNodes = { ...expandedNodes };

    const traverse = (condition, path = "") => {
      const nodeId = path || "root";
      newExpandedNodes[nodeId] = true;

      if (condition && condition.conditions) {
        condition.conditions.forEach((childCondition, index) => {
          const childPath = `${path ? path + "-" : ""}${index}`;
          traverse(childCondition, childPath);
        });
      }
    };

    traverse(businessLogic || logic);
    setExpandedNodes(newExpandedNodes);
  };

  const collapseAll = () => {
    const newExpandedNodes = { ...expandedNodes };

    const traverse = (condition, path = "") => {
      const nodeId = path || "root";
      if (path) newExpandedNodes[nodeId] = false;

      if (condition && condition.conditions) {
        condition.conditions.forEach((childCondition, index) => {
          const childPath = `${path ? path + "-" : ""}${index}`;
          traverse(childCondition, childPath);
        });
      }
    };

    traverse(businessLogic || logic);
    setExpandedNodes(newExpandedNodes);
  };

  // Update breadcrumb navigation when navigating through nodes
  const updateBreadcrumbPath = (nodeId, nodeName, isAdd = true) => {
    if (isAdd) {
      // Add node to breadcrumb path
      setActivePath((prev) => {
        const newPath = [...prev];
        newPath.push({ id: nodeId, name: nodeName });
        return newPath;
      });
    } else {
      // Navigate to a specific node in the breadcrumb
      setActivePath((prev) => {
        const index = prev.findIndex((item) => item.id === nodeId);
        if (index >= 0) {
          return prev.slice(0, index + 1);
        }
        return prev;
      });
    }
  };

  const handleZoomChange = (delta) => {
    setZoomLevel((prev) => {
      const newZoom = prev + delta;
      return Math.min(Math.max(newZoom, 50), 150); // Limit between 50% and 150%
    });
  };

  const clearActivePath = () => {
    setActivePath([]);
  };

  const renderBreadcrumbs = () => {
    return (
      <Breadcrumbs
        separator={
          <ArrowForwardIcon
            fontSize="small"
            sx={{ color: theme.palette.text.secondary }}
          />
        }
        sx={{
          mb: 2,
          p: 1,
          bgcolor: alpha(theme.palette.background.paper, 0.7),
          borderRadius: 1,
          border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
          display: "flex",
          alignItems: "center",
          overflowX: "auto",
          whiteSpace: "nowrap",
          minHeight: 36
        }}
      >
        <Link
          underline="hover"
          sx={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            color: alpha(theme.palette.text.primary, 0.8),
            fontWeight: activePath.length === 0 ? 600 : 400
          }}
          onClick={clearActivePath}
        >
          <HomeIcon fontSize="small" sx={{ mr: 0.5 }} />
          Root
        </Link>

        {activePath.map((node, index) => (
          <Link
            key={node.id}
            underline="hover"
            sx={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              color:
                index === activePath.length - 1
                  ? theme.palette.primary.main
                  : alpha(theme.palette.text.primary, 0.8),
              fontWeight: index === activePath.length - 1 ? 600 : 400
            }}
            onClick={() => updateBreadcrumbPath(node.id, node.name, false)}
          >
            <TreeIcon fontSize="small" sx={{ mr: 0.5 }} />
            {node.name}
          </Link>
        ))}
      </Breadcrumbs>
    );
  };

  const renderRuleSummary = () => {
    return (
      <RuleSummaryCard elevation={0}>
        <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            Rule Summary
          </Typography>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            <Chip
              label={`${ruleMetrics.totalConditions} Conditions`}
              size="small"
              color="primary"
              variant="outlined"
            />
            <Chip
              label={`${ruleMetrics.groupCount} Groups`}
              size="small"
              color="secondary"
              variant="outlined"
            />
            <Chip
              label={`Depth: ${ruleMetrics.maxDepth}`}
              size="small"
              color="info"
              variant="outlined"
            />
            <Tooltip title="Based on number of conditions, groups, and nesting depth">
              <Chip
                label={`Complexity: ${
                  ruleMetrics.complexityScore < 10
                    ? "Low"
                    : ruleMetrics.complexityScore < 25
                    ? "Medium"
                    : "High"
                }`}
                size="small"
                color={
                  ruleMetrics.complexityScore < 10
                    ? "success"
                    : ruleMetrics.complexityScore < 25
                    ? "warning"
                    : "error"
                }
              />
            </Tooltip>
          </Box>
        </CardContent>
      </RuleSummaryCard>
    );
  };

  const renderCondition = (
    condition,
    depth = 0,
    index = 0,
    isLast = true,
    totalSiblings = 1,
    path = ""
  ) => {
    const nodeId = path || "root";
    const isExpanded = expandedNodes[nodeId] !== false;
    const hasChildren = condition.conditions && condition.conditions.length > 0;
    const childrenCount = hasChildren ? condition.conditions.length : 0;

    // If we're filtering by path and this node is not in the active path, skip rendering
    if (activePath.length > 0 && depth > activePath.length) {
      const pathParts = path.split("-");
      const relevantPathParts = pathParts.slice(0, activePath.length);

      let isInActivePath = true;
      for (
        let i = 0;
        i < activePath.length && i < relevantPathParts.length;
        i++
      ) {
        if (activePath[i].id !== relevantPathParts[i]) {
          isInActivePath = false;
          break;
        }
      }

      if (!isInActivePath) return null;
    }

    // Simple condition leaf node
    if (condition.field !== undefined) {
      const getOperatorText = (op) => {
        switch (op) {
          case "eq":
            return "equals";
          case "ne":
            return "not equals";
          case "gt":
            return "greater than";
          case "lt":
            return "less than";
          case "ge":
            return "greater than or equal";
          case "le":
            return "less than or equal";
          case "contains":
            return "contains";
          case "startswith":
            return "starts with";
          case "endswith":
            return "ends with";
          case "matches":
            return "matches";
          case "any":
            return "any of";
          case "all":
            return "all of";
          default:
            return op;
        }
      };

      // Use the condition's name if available
      const conditionName = condition.name || `Condition ${index + 1}`;

      return (
        <NodeContainer depth={depth} key={`condition-${index}`}>
          {depth > 0 && (
            <NodeConnector
              isCondition={true}
              isFirst={index === 0}
              isLast={isLast}
              depth={depth}
            />
          )}
          <TreeNodeCard isCondition={true} isExpanded={true} depth={depth}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 1
              }}
            >
              <Tooltip title={conditionName}>
                <FieldChip>{condition.field}</FieldChip>
              </Tooltip>

              <OperatorLabel type={condition.operator}>
                {getOperatorText(condition.operator)}
              </OperatorLabel>

              <ValueChip
                label={
                  condition.value_prop?.type === "const"
                    ? condition.value_prop.value
                    : condition.value_prop?.type === "json-path"
                    ? condition.value_prop.path
                    : "undefined"
                }
                variant="outlined"
                size="small"
              />
            </Box>
          </TreeNodeCard>
        </NodeContainer>
      );
    }

    // For complex conditions (AND/OR/NOT)
    if (condition.type && condition.conditions) {
      // Generate a unique id for this node based on the condition type and path
      const conditionId = path || "root";

      // Use custom name if available, otherwise generate a descriptive one
      const groupName = condition.name || getGroupDescription(condition.type);

      function getGroupDescription(type) {
        switch (type) {
          case "AND":
            return "All conditions must be true";
          case "OR":
            return "Any condition may be true";
          case "NOT":
            return "The condition must not be true";
          default:
            return `Group (${type})`;
        }
      }

      // Show depth indicator only for deeper levels
      const showLevelIndicator = depth > 0;

      return (
        <NodeContainer depth={depth} key={`group-${index}`}>
          {depth > 0 && (
            <NodeConnector
              isCondition={false}
              isFirst={index === 0}
              isLast={isLast}
              depth={depth}
              groupType={condition.type}
            />
          )}

          <TreeNodeCard
            isCondition={false}
            isExpanded={isExpanded}
            depth={depth}
            groupType={condition.type}
            sx={{ position: "relative" }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: hasChildren && isExpanded ? 1.5 : 0
              }}
            >
              <Box display="flex" alignItems="center">
                <OperatorChip
                  label={condition.type}
                  type={condition.type}
                  size="small"
                />
                <Typography
                  variant="subtitle2"
                  fontWeight={600}
                  fontSize={depth > 1 ? "0.8rem" : "0.85rem"}
                >
                  {/* Simplified text without redundancy */}
                  {showLevelIndicator && (
                    <Chip
                      label={`L${depth}`}
                      size="small"
                      sx={{
                        height: 16,
                        fontSize: "0.65rem",
                        mr: 0.75,
                        fontWeight: 700,
                        borderRadius: 4,
                        backgroundColor: alpha(
                          condition.type === "AND"
                            ? theme.palette.primary.main
                            : condition.type === "OR"
                            ? theme.palette.secondary.main
                            : theme.palette.error.main,
                          0.1
                        ),
                        color:
                          condition.type === "AND"
                            ? theme.palette.primary.main
                            : condition.type === "OR"
                            ? theme.palette.secondary.main
                            : theme.palette.error.main,
                        px: 0.5
                      }}
                    />
                  )}
                </Typography>

                {condition.conditions.length > 0 && (
                  <Chip
                    size="small"
                    label={condition.conditions.length}
                    sx={{
                      ml: 1,
                      height: 18,
                      minWidth: 18,
                      fontSize: "0.7rem",
                      fontWeight: 600
                    }}
                  />
                )}
              </Box>

              <Box display="flex" gap={0.5}>
                {hasChildren && (
                  <Tooltip
                    title={isExpanded ? "Collapse" : "Expand"}
                    TransitionComponent={Zoom}
                    arrow
                  >
                    <StyledIconButton
                      size="small"
                      onClick={() => toggleNodeExpansion(conditionId)}
                    >
                      {isExpanded ? (
                        <ExpandLessIcon fontSize="small" />
                      ) : (
                        <ExpandMoreIcon fontSize="small" />
                      )}
                    </StyledIconButton>
                  </Tooltip>
                )}

                <Tooltip
                  title="Focus on this branch"
                  TransitionComponent={Zoom}
                  arrow
                >
                  <StyledIconButton
                    size="small"
                    onClick={() => updateBreadcrumbPath(conditionId, groupName)}
                  >
                    <ZoomInIcon fontSize="small" />
                  </StyledIconButton>
                </Tooltip>
              </Box>
            </Box>

            {hasChildren && isExpanded && (
              <Collapse in={isExpanded} timeout="auto">
                <Box
                  sx={{
                    pl: 2,
                    position: "relative"
                  }}
                >
                  {/* Render the connection lines between nodes */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      bottom: 0,
                      width: 2,
                      backgroundColor: alpha(
                        condition.type === "AND"
                          ? theme.palette.primary.main
                          : condition.type === "OR"
                          ? theme.palette.secondary.main
                          : theme.palette.error.main,
                        0.3
                      ),
                      ml: 1,
                      zIndex: 0
                    }}
                  />

                  {/* Group type label on the connector line */}
                  {condition.conditions.length > 1 && (
                    <Box
                      sx={{
                        position: "absolute",
                        left: -2,
                        top: -8,
                        zIndex: 2,
                        backgroundColor: alpha(
                          condition.type === "AND"
                            ? theme.palette.primary.main
                            : condition.type === "OR"
                            ? theme.palette.secondary.main
                            : theme.palette.error.main,
                          0.15
                        ),
                        border: `1px solid ${alpha(
                          condition.type === "AND"
                            ? theme.palette.primary.main
                            : condition.type === "OR"
                            ? theme.palette.secondary.main
                            : theme.palette.error.main,
                          0.3
                        )}`,
                        color:
                          condition.type === "AND"
                            ? theme.palette.primary.main
                            : condition.type === "OR"
                            ? theme.palette.secondary.main
                            : theme.palette.error.main,
                        fontSize: "0.65rem",
                        fontWeight: 700,
                        padding: "0px 4px",
                        borderRadius: 4,
                        lineHeight: 1.5
                      }}
                    >
                      {condition.type}
                    </Box>
                  )}

                  {condition.conditions.map((childCondition, childIndex) => {
                    // Create horizontal connection line for each child
                    const childPath = `${path ? path + "-" : ""}${childIndex}`;
                    const isLastChild =
                      childIndex === condition.conditions.length - 1;

                    return (
                      <Box key={childPath} sx={{ position: "relative" }}>
                        {/* Horizontal connection line */}
                        <Box
                          sx={{
                            position: "absolute",
                            top: 20,
                            left: 0,
                            width: 14,
                            height: 2,
                            backgroundColor: alpha(
                              condition.type === "AND"
                                ? theme.palette.primary.main
                                : condition.type === "OR"
                                ? theme.palette.secondary.main
                                : theme.palette.error.main,
                              0.3
                            ),
                            ml: 1,
                            zIndex: 1
                          }}
                        />

                        {/* Connection node */}
                        <Box
                          sx={{
                            position: "absolute",
                            top: 16,
                            left: 1,
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            backgroundColor: alpha(
                              condition.type === "AND"
                                ? theme.palette.primary.main
                                : condition.type === "OR"
                                ? theme.palette.secondary.main
                                : theme.palette.error.main,
                              0.6
                            ),
                            zIndex: 2
                          }}
                        />

                        {renderCondition(
                          childCondition,
                          depth + 1,
                          childIndex,
                          isLastChild,
                          condition.conditions.length,
                          childPath
                        )}
                      </Box>
                    );
                  })}
                </Box>
              </Collapse>
            )}
          </TreeNodeCard>
        </NodeContainer>
      );
    }

    return null;
  };

  return (
    <Box>
      {/* Header with controls */}
      <Box
        sx={{
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Logic Tree View
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Tooltip title="Zoom Out">
            <StyledIconButton
              size="small"
              onClick={() => handleZoomChange(-10)}
              disabled={zoomLevel <= 50}
            >
              <ZoomOutIcon fontSize="small" />
            </StyledIconButton>
          </Tooltip>
          <Typography variant="caption" sx={{ lineHeight: "24px", mx: 0.5 }}>
            {zoomLevel}%
          </Typography>
          <Tooltip title="Zoom In">
            <StyledIconButton
              size="small"
              onClick={() => handleZoomChange(10)}
              disabled={zoomLevel >= 150}
            >
              <ZoomInIcon fontSize="small" />
            </StyledIconButton>
          </Tooltip>
          <Tooltip title="Expand all nodes">
            <StyledIconButton size="small" onClick={expandAll}>
              <ExpandAllIcon fontSize="small" />
            </StyledIconButton>
          </Tooltip>
          <Tooltip title="Collapse all nodes">
            <StyledIconButton size="small" onClick={collapseAll}>
              <CollapseAllIcon fontSize="small" />
            </StyledIconButton>
          </Tooltip>
          <Tooltip title="Clear filters">
            <StyledIconButton
              size="small"
              onClick={clearActivePath}
              disabled={activePath.length === 0}
            >
              <FilterListIcon fontSize="small" />
            </StyledIconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Rule summary card */}
      {renderRuleSummary()}

      {/* Breadcrumb Navigation */}
      {renderBreadcrumbs()}

      {/* Tree View with zoom scaling */}
      <Box
        sx={{
          transform: `scale(${zoomLevel / 100})`,
          transformOrigin: "top left",
          transition: "transform 0.2s ease"
        }}
      >
        <TreeContainer>
          {businessLogic || logic ? (
            renderCondition(businessLogic || logic)
          ) : (
            <Box sx={{ p: 3, textAlign: "center" }}>
              <Typography color="text.secondary">
                No business logic to display
              </Typography>
            </Box>
          )}
        </TreeContainer>
      </Box>
    </Box>
  );
};

export default LogicTreeView;
