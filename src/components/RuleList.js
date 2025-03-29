// src/components/RuleList.js
import React, { useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  ToggleButtonGroup,
  ToggleButton,
  Divider,
  Zoom,
  Fade,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Grid,
  Chip,
  TextField,
  InputAdornment,
  alpha,
  DialogContentText,
  Stack,
  MenuItem,
  Select,
  Menu,
  Tooltip,
  Checkbox
} from "@mui/material";
import {
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
  Code as CodeIcon,
  AccountTree as AccountTreeIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  MoreVert as MoreVertIcon,
  Add as AddIcon,
  CalendarToday as CalendarIcon,
  LabelOutlined as LabelIcon,
  Rule as RuleIcon,
  ViewList as ViewListIcon,
  DeleteSweep as DeleteSweepIcon
} from "@mui/icons-material";
import { formatDistanceToNow } from "date-fns";
import LogicTreeView from "./LogicTreeView";

const RuleList = ({ rules, onDelete }) => {
  const [selectedRule, setSelectedRule] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState("tree");
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [anchorEl, setAnchorEl] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [activeFilters, setActiveFilters] = useState([]);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  // Override theme borderRadius for this component
  const borderRadius = 1;

  const handleViewRule = (rule) => {
    setSelectedRule(rule);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleViewModeChange = (event, newMode) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };

  const handleDeleteClick = (rule, event) => {
    event.stopPropagation();
    setSelectedRule(rule);
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedRule && onDelete) {
      onDelete(selectedRule.id);
    }
    setConfirmDeleteOpen(false);
  };

  const handleCancelDelete = () => {
    setConfirmDeleteOpen(false);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSortMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSortMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSortChange = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
    handleSortMenuClose();
  };

  const handleFilterChange = (event) => {
    setFilterType(event.target.value);
  };

  const handleFilterMenuOpen = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterMenuClose = () => {
    setFilterAnchorEl(null);
  };

  const handleFilterToggle = (filter) => {
    if (activeFilters.includes(filter)) {
      setActiveFilters(activeFilters.filter((f) => f !== filter));
    } else {
      setActiveFilters([...activeFilters, filter]);
    }
  };

  const handleClearFilters = () => {
    setActiveFilters([]);
  };

  // Filter and sort rules
  const filteredAndSortedRules = [...rules]
    .filter((rule) => {
      // Filter by search term
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        rule.name.toLowerCase().includes(searchLower) ||
        (rule.description &&
          rule.description.toLowerCase().includes(searchLower));

      // Filter by type
      let matchesType = true;
      if (activeFilters.length > 0) {
        if (
          activeFilters.includes("simple") &&
          !activeFilters.includes("complex")
        ) {
          matchesType = !isComplexRule(rule);
        } else if (
          !activeFilters.includes("simple") &&
          activeFilters.includes("complex")
        ) {
          matchesType = isComplexRule(rule);
        }
      }

      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      // Dynamic sort based on selected field and direction
      if (sortField === "name") {
        return sortDirection === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortField === "createdAt") {
        return sortDirection === "asc"
          ? new Date(a.createdAt) - new Date(b.createdAt)
          : new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortField === "type") {
        const aIsComplex = isComplexRule(a);
        const bIsComplex = isComplexRule(b);
        return sortDirection === "asc"
          ? aIsComplex === bIsComplex
            ? 0
            : aIsComplex
            ? 1
            : -1
          : aIsComplex === bIsComplex
          ? 0
          : aIsComplex
          ? -1
          : 1;
      } else if (sortField === "conditions") {
        const aCount = countConditions(a);
        const bCount = countConditions(b);
        return sortDirection === "asc" ? aCount - bCount : bCount - aCount;
      }
      return 0;
    });

  // Helper function to determine if a rule is complex
  const isComplexRule = (rule) => {
    return (
      rule.conditions &&
      ((Array.isArray(rule.conditions) && rule.conditions.length > 1) ||
        (rule.conditions.operator && rule.conditions.conditions))
    );
  };

  // Helper function to count conditions in a rule
  const countConditions = (rule) => {
    if (!rule.conditions) return 0;

    if (Array.isArray(rule.conditions)) {
      return rule.conditions.length;
    }

    if (rule.conditions.operator && rule.conditions.conditions) {
      const countNestedConditions = (condGroup) => {
        if (!condGroup || !condGroup.conditions) return 0;

        return condGroup.conditions.reduce((total, cond) => {
          if (cond.operator && cond.conditions) {
            return total + countNestedConditions(cond);
          }
          return total + 1;
        }, 0);
      };

      return countNestedConditions(rule.conditions);
    }

    return 1;
  };

  if (rules.length === 0) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        my={5}
        height="calc(100vh - 300px)"
      >
        <Card
          elevation={0}
          sx={{
            maxWidth: 500,
            textAlign: "center",
            py: 5,
            px: 5,
            boxShadow: "0 10px 30px -10px rgba(99, 102, 241, 0.15)",
            border: `1px dashed ${alpha(theme.palette.primary.main, 0.3)}`,
            borderRadius: 3,
            backgroundColor: alpha(theme.palette.background.paper, 0.8),
            backdropFilter: "blur(10px)",
            transition:
              "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
            "&:hover": {
              transform: "translateY(-5px)",
              boxShadow: "0 20px 40px -15px rgba(99, 102, 241, 0.2)"
            }
          }}
        >
          <Avatar
            sx={{
              height: 80,
              mb: 4,
              mx: "auto",
              width: 80,
              background: "linear-gradient(135deg, #6366F1 0%, #818CF8 100%)",
              color: "white"
            }}
          >
            <RuleIcon sx={{ fontSize: 40 }} />
          </Avatar>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
            No rules created yet
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            paragraph
            sx={{ mb: 3 }}
          >
            Start by creating your first business logic rule using the Builder
            tab.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<AddIcon />}
            onClick={() => (window.location.hash = "#Rule Builder")}
            sx={{
              mt: 2,
              px: 3,
              py: 1.5,
              borderRadius: 2,
              fontWeight: 600,
              boxShadow: "0 4px 14px 0 rgba(99, 102, 241, 0.3)",
              backgroundImage: "linear-gradient(to right, #6366F1, #818CF8)",
              "&:hover": {
                boxShadow: "0 6px 20px 0 rgba(99, 102, 241, 0.4)",
                backgroundImage: "linear-gradient(to right, #4F46E5, #6366F1)"
              }
            }}
          >
            Create New Rule
          </Button>
        </Card>
      </Box>
    );
  }

  return (
    <Box>
      <Card
        elevation={0}
        sx={{
          mb: 4,
          pb: 2,
          background: `linear-gradient(145deg, ${alpha(
            theme.palette.background.paper,
            0.9
          )}, ${alpha(theme.palette.background.paper, 0.95)})`,
          backdropFilter: "blur(8px)",
          borderRadius: 1,
          boxShadow: theme.shadows[1],
          overflow: "visible"
        }}
      >
        <CardHeader
          title={
            <Box display="flex" alignItems="center">
              <Avatar
                sx={{
                  background:
                    "linear-gradient(135deg, #6366F1 0%, #818CF8 100%)",
                  color: "white",
                  mr: 2
                }}
              >
                <ViewListIcon />
              </Avatar>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                Business Logic Rules
              </Typography>
              <Chip
                label={`${filteredAndSortedRules.length} rules`}
                size="small"
                color="primary"
                sx={{ ml: 2, fontWeight: 600, height: 24, borderRadius: 0.5 }}
              />
            </Box>
          }
          sx={{
            pb: 1,
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.8)}`
          }}
        />

        <CardContent sx={{ pt: 3 }}>
          <Grid container spacing={2} alignItems="center" mb={3}>
            <Grid item xs={12} md={6}>
              <TextField
                placeholder="Search rules..."
                variant="outlined"
                fullWidth
                size="small"
                value={searchTerm}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: 1,
                    backgroundColor: alpha(theme.palette.background.paper, 0.5),
                    "&.Mui-focused": {
                      boxShadow: `0 0 0 2px ${alpha(
                        theme.palette.primary.main,
                        0.2
                      )}`
                    },
                    transition: "box-shadow 0.2s ease-in-out"
                  }
                }}
              />
            </Grid>

            <Grid item xs={6} md={3}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ display: { xs: "none", sm: "block" }, fontWeight: 500 }}
                >
                  Type:
                </Typography>
                <Select
                  value={filterType}
                  onChange={handleFilterChange}
                  displayEmpty
                  size="small"
                  variant="outlined"
                  fullWidth
                  sx={{
                    borderRadius: 1,
                    backgroundColor: alpha(theme.palette.background.paper, 0.5),
                    ".MuiSelect-select": {
                      display: "flex",
                      alignItems: "center"
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: theme.palette.primary.main,
                      borderWidth: 2
                    }
                  }}
                  startAdornment={
                    <FilterIcon
                      fontSize="small"
                      color="action"
                      sx={{ mr: 1, display: { sm: "none" } }}
                    />
                  }
                >
                  <MenuItem value="all">All Types</MenuItem>
                  <MenuItem value="AND">
                    <Chip
                      label="AND"
                      size="small"
                      sx={{
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.dark,
                        height: 24,
                        fontWeight: 600,
                        mr: 1,
                        borderRadius: 0.5
                      }}
                    />
                    AND Rules
                  </MenuItem>
                  <MenuItem value="OR">
                    <Chip
                      label="OR"
                      size="small"
                      sx={{
                        backgroundColor: alpha(
                          theme.palette.secondary.main,
                          0.1
                        ),
                        color: theme.palette.secondary.dark,
                        height: 24,
                        fontWeight: 600,
                        mr: 1,
                        borderRadius: 0.5
                      }}
                    />
                    OR Rules
                  </MenuItem>
                </Select>
              </Stack>
            </Grid>

            <Grid item xs={6} md={3}>
              <Button
                onClick={handleSortMenuOpen}
                variant="outlined"
                size="small"
                fullWidth
                startIcon={<SortIcon />}
                endIcon={<MoreVertIcon />}
                sx={{
                  borderRadius: 1,
                  borderWidth: "1.5px",
                  fontWeight: 600,
                  "&:hover": {
                    borderWidth: "1.5px"
                  }
                }}
              >
                {isSmallScreen ? (
                  "Sort"
                ) : (
                  <Box
                    component="span"
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    Sort by:&nbsp;
                    <strong>
                      {sortField.charAt(0).toUpperCase() + sortField.slice(1)}
                    </strong>
                    &nbsp;
                    <Box
                      component="span"
                      sx={{
                        color: theme.palette.primary.main,
                        fontWeight: "bold"
                      }}
                    >
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </Box>
                  </Box>
                )}
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleSortMenuClose}
                PaperProps={{
                  elevation: 3,
                  sx: {
                    width: 220,
                    maxWidth: "100%",
                    borderRadius: 1,
                    mt: 0.5,
                    boxShadow: `0 10px 30px -15px ${alpha("#000", 0.15)}`
                  }
                }}
              >
                <MenuItem
                  onClick={() => handleSortChange("name")}
                  selected={sortField === "name"}
                  sx={{
                    borderLeft:
                      sortField === "name"
                        ? `3px solid ${theme.palette.primary.main}`
                        : "none",
                    pl: sortField === "name" ? 1.5 : 2
                  }}
                >
                  <LabelIcon
                    sx={{
                      mr: 1,
                      color:
                        sortField === "name" ? "primary.main" : "text.secondary"
                    }}
                    fontSize="small"
                  />
                  <Typography
                    variant="body2"
                    fontWeight={sortField === "name" ? 600 : 400}
                  >
                    Name
                  </Typography>
                  {sortField === "name" && (
                    <Typography
                      variant="body2"
                      color="primary"
                      sx={{ ml: "auto", fontWeight: 600 }}
                    >
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </Typography>
                  )}
                </MenuItem>
                <MenuItem
                  onClick={() => handleSortChange("createdAt")}
                  selected={sortField === "createdAt"}
                  sx={{
                    borderLeft:
                      sortField === "createdAt"
                        ? `3px solid ${theme.palette.primary.main}`
                        : "none",
                    pl: sortField === "createdAt" ? 1.5 : 2
                  }}
                >
                  <CalendarIcon
                    sx={{
                      mr: 1,
                      color:
                        sortField === "createdAt"
                          ? "primary.main"
                          : "text.secondary"
                    }}
                    fontSize="small"
                  />
                  <Typography
                    variant="body2"
                    fontWeight={sortField === "createdAt" ? 600 : 400}
                  >
                    Creation Date
                  </Typography>
                  {sortField === "createdAt" && (
                    <Typography
                      variant="body2"
                      color="primary"
                      sx={{ ml: "auto", fontWeight: 600 }}
                    >
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </Typography>
                  )}
                </MenuItem>
                <MenuItem
                  onClick={() => handleSortChange("type")}
                  selected={sortField === "type"}
                  sx={{
                    borderLeft:
                      sortField === "type"
                        ? `3px solid ${theme.palette.primary.main}`
                        : "none",
                    pl: sortField === "type" ? 1.5 : 2
                  }}
                >
                  <RuleIcon
                    sx={{
                      mr: 1,
                      color:
                        sortField === "type" ? "primary.main" : "text.secondary"
                    }}
                    fontSize="small"
                  />
                  <Typography
                    variant="body2"
                    fontWeight={sortField === "type" ? 600 : 400}
                  >
                    Type
                  </Typography>
                  {sortField === "type" && (
                    <Typography
                      variant="body2"
                      color="primary"
                      sx={{ ml: "auto", fontWeight: 600 }}
                    >
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </Typography>
                  )}
                </MenuItem>
                <MenuItem
                  onClick={() => handleSortChange("conditions")}
                  selected={sortField === "conditions"}
                  sx={{
                    borderLeft:
                      sortField === "conditions"
                        ? `3px solid ${theme.palette.primary.main}`
                        : "none",
                    pl: sortField === "conditions" ? 1.5 : 2
                  }}
                >
                  <FilterIcon
                    sx={{
                      mr: 1,
                      color:
                        sortField === "conditions"
                          ? "primary.main"
                          : "text.secondary"
                    }}
                    fontSize="small"
                  />
                  <Typography
                    variant="body2"
                    fontWeight={sortField === "conditions" ? 600 : 400}
                  >
                    Conditions
                  </Typography>
                  {sortField === "conditions" && (
                    <Typography
                      variant="body2"
                      color="primary"
                      sx={{ ml: "auto", fontWeight: 600 }}
                    >
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </Typography>
                  )}
                </MenuItem>
              </Menu>
            </Grid>

            <Grid item xs={6} md={3}>
              <Button
                onClick={handleFilterMenuOpen}
                variant="outlined"
                size="small"
                fullWidth
                startIcon={<FilterIcon />}
                endIcon={<MoreVertIcon />}
                sx={{
                  borderRadius: 1,
                  borderWidth: "1.5px",
                  fontWeight: 600,
                  "&:hover": {
                    borderWidth: "1.5px"
                  }
                }}
              >
                {isSmallScreen ? (
                  "Filter"
                ) : (
                  <Box
                    component="span"
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    Filter:{" "}
                    {activeFilters.length ? (
                      <Chip
                        size="small"
                        label={activeFilters.length}
                        color="primary"
                        sx={{
                          ml: 1,
                          height: 20,
                          fontSize: "0.75rem",
                          borderRadius: 0.5
                        }}
                      />
                    ) : (
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.secondary"
                        sx={{ ml: 0.5 }}
                      >
                        None
                      </Typography>
                    )}
                  </Box>
                )}
              </Button>
              <Menu
                anchorEl={filterAnchorEl}
                open={Boolean(filterAnchorEl)}
                onClose={handleFilterMenuClose}
                PaperProps={{
                  elevation: 3,
                  sx: {
                    width: 220,
                    maxWidth: "100%",
                    borderRadius: 1,
                    mt: 0.5,
                    boxShadow: `0 10px 30px -15px ${alpha("#000", 0.15)}`
                  }
                }}
              >
                <MenuItem>
                  <Typography
                    variant="subtitle2"
                    sx={{ width: "100%", fontWeight: 600 }}
                  >
                    Rule Type
                  </Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => handleFilterToggle("simple")}
                  sx={{
                    borderLeft: activeFilters.includes("simple")
                      ? `3px solid ${theme.palette.primary.main}`
                      : "none",
                    pl: activeFilters.includes("simple") ? 1.5 : 2
                  }}
                >
                  <Checkbox
                    checked={activeFilters.includes("simple")}
                    size="small"
                    sx={{ p: 0.5, mr: 1 }}
                    color="primary"
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: activeFilters.includes("simple") ? 600 : 400,
                      color: activeFilters.includes("simple")
                        ? "primary.main"
                        : "text.primary"
                    }}
                  >
                    Simple
                  </Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => handleFilterToggle("complex")}
                  sx={{
                    borderLeft: activeFilters.includes("complex")
                      ? `3px solid ${theme.palette.primary.main}`
                      : "none",
                    pl: activeFilters.includes("complex") ? 1.5 : 2
                  }}
                >
                  <Checkbox
                    checked={activeFilters.includes("complex")}
                    size="small"
                    sx={{ p: 0.5, mr: 1 }}
                    color="primary"
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: activeFilters.includes("complex") ? 600 : 400,
                      color: activeFilters.includes("complex")
                        ? "primary.main"
                        : "text.primary"
                    }}
                  >
                    Complex
                  </Typography>
                </MenuItem>
                <Divider sx={{ my: 1 }} />
                <MenuItem
                  onClick={handleClearFilters}
                  disabled={activeFilters.length === 0}
                  sx={{
                    color: "error.main",
                    opacity: activeFilters.length === 0 ? 0.5 : 1
                  }}
                >
                  <DeleteSweepIcon fontSize="small" sx={{ mr: 1 }} />
                  <Typography variant="body2">Clear All Filters</Typography>
                </MenuItem>
              </Menu>
            </Grid>
          </Grid>

          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              borderRadius: 1,
              overflow: "hidden",
              border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
              "& .MuiTableCell-root": {
                borderColor: alpha(theme.palette.divider, 0.5)
              }
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Rule Name</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Conditions</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAndSortedRules.map((rule, index) => (
                  <TableRow
                    key={rule.id}
                    hover
                    onClick={() => handleViewRule(rule)}
                    sx={{
                      cursor: "pointer",
                      animation: "fadeIn 0.5s ease-out",
                      animationDelay: `${index * 0.1}s`,
                      opacity: 0,
                      animationFillMode: "forwards",
                      "@keyframes fadeIn": {
                        from: { opacity: 0, transform: "translateY(10px)" },
                        to: { opacity: 1, transform: "translateY(0)" }
                      }
                    }}
                  >
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            fontSize: "0.875rem",
                            background: `linear-gradient(135deg, ${alpha(
                              theme.palette.primary.main,
                              0.9
                            )}, ${alpha(theme.palette.primary.light, 0.9)})`,
                            color: "white",
                            mr: 1.5
                          }}
                        >
                          {rule.name.charAt(0)}
                        </Avatar>
                        <Typography variant="body2" fontWeight={600}>
                          {rule.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={rule.businessLogic.type}
                        size="small"
                        sx={{
                          backgroundColor: (theme) => {
                            switch (rule.businessLogic.type) {
                              case "AND":
                                return alpha(theme.palette.primary.main, 0.1);
                              case "OR":
                                return alpha(theme.palette.secondary.main, 0.1);
                              default:
                                return alpha(theme.palette.info.main, 0.1);
                            }
                          },
                          color: (theme) => {
                            switch (rule.businessLogic.type) {
                              case "AND":
                                return theme.palette.primary.dark;
                              case "OR":
                                return theme.palette.secondary.dark;
                              default:
                                return theme.palette.info.dark;
                            }
                          },
                          fontWeight: 600,
                          borderRadius: 0.5,
                          border: (theme) => {
                            switch (rule.businessLogic.type) {
                              case "AND":
                                return `1px solid ${alpha(
                                  theme.palette.primary.main,
                                  0.3
                                )}`;
                              case "OR":
                                return `1px solid ${alpha(
                                  theme.palette.secondary.main,
                                  0.3
                                )}`;
                              default:
                                return `1px solid ${alpha(
                                  theme.palette.info.main,
                                  0.3
                                )}`;
                            }
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Tooltip
                        title={new Date(rule.createdAt).toLocaleString()}
                        arrow
                      >
                        <Box display="flex" alignItems="center">
                          <CalendarIcon
                            fontSize="small"
                            color="action"
                            sx={{ mr: 1, opacity: 0.6 }}
                          />
                          <Typography variant="body2">
                            {formatDistanceToNow(new Date(rule.createdAt), {
                              addSuffix: true
                            })}
                          </Typography>
                        </Box>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={rule.businessLogic.conditions.length}
                        size="small"
                        sx={{
                          backgroundColor: alpha(theme.palette.info.main, 0.1),
                          color: theme.palette.info.dark,
                          fontWeight: 600,
                          borderRadius: 0.5,
                          border: `1px solid ${alpha(
                            theme.palette.info.main,
                            0.3
                          )}`
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        color="primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewRule(rule);
                        }}
                        size="small"
                        sx={{
                          transition: "transform 0.2s, background-color 0.2s",
                          borderRadius: 0.5,
                          "&:hover": {
                            transform: "scale(1.1)",
                            backgroundColor: alpha(
                              theme.palette.primary.main,
                              0.1
                            )
                          }
                        }}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        color="error"
                        size="small"
                        onClick={(e) => handleDeleteClick(rule, e)}
                        sx={{
                          ml: 1,
                          borderRadius: 0.5,
                          transition: "transform 0.2s, background-color 0.2s",
                          "&:hover": {
                            transform: "scale(1.1)",
                            backgroundColor: alpha(
                              theme.palette.error.main,
                              0.1
                            )
                          }
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredAndSortedRules.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                      <Box sx={{ textAlign: "center" }}>
                        <SearchIcon
                          sx={{
                            fontSize: 36,
                            color: "text.secondary",
                            opacity: 0.5,
                            mb: 1
                          }}
                        />
                        <Typography variant="body1" color="text.secondary">
                          No rules found matching your search criteria
                        </Typography>
                        <Button
                          variant="text"
                          color="primary"
                          onClick={() => {
                            setSearchTerm("");
                            setFilterType("all");
                          }}
                          sx={{ mt: 1, fontWeight: 600 }}
                        >
                          Clear filters
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* View Rule Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="lg"
        fullWidth
        fullScreen={fullScreen}
        TransitionComponent={Fade}
        transitionDuration={400}
        PaperProps={{
          elevation: 24,
          sx: {
            borderRadius: 1,
            overflow: "hidden",
            backgroundImage: `linear-gradient(135deg, ${alpha(
              theme.palette.background.paper,
              0.96
            )}, ${alpha(theme.palette.background.paper, 0.99)})`,
            backdropFilter: "blur(10px)"
          }
        }}
      >
        <DialogTitle sx={{ padding: 3 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box display="flex" alignItems="center">
              <Avatar
                sx={{
                  background: `linear-gradient(135deg, ${alpha(
                    theme.palette.primary.main,
                    0.9
                  )}, ${alpha(theme.palette.primary.light, 0.9)})`,
                  color: "white",
                  mr: 2
                }}
              >
                {selectedRule?.name.charAt(0)}
              </Avatar>
              <Box>
                <Typography variant="h6" component="span" fontWeight={700}>
                  {selectedRule?.name}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block" }}
                >
                  Created{" "}
                  {selectedRule &&
                    formatDistanceToNow(new Date(selectedRule.createdAt), {
                      addSuffix: true
                    })}
                </Typography>
              </Box>
            </Box>

            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={handleViewModeChange}
              size="small"
              aria-label="view mode"
              sx={{
                "& .MuiToggleButton-root": {
                  borderRadius: 0.5,
                  fontWeight: 600,
                  px: 2,
                  transition: "all 0.2s ease",
                  "&.Mui-selected": {
                    backgroundColor: theme.palette.primary.main,
                    color: "white",
                    "&:hover": {
                      backgroundColor: theme.palette.primary.dark,
                      color: "white"
                    }
                  }
                }
              }}
            >
              <ToggleButton value="tree" aria-label="tree view">
                <AccountTreeIcon fontSize="small" sx={{ mr: 0.5 }} /> Tree
              </ToggleButton>
              <ToggleButton value="json" aria-label="json view">
                <CodeIcon fontSize="small" sx={{ mr: 0.5 }} /> JSON
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ padding: 3 }}>
          {selectedRule && (
            <Zoom in={true} timeout={300}>
              <Box>
                {viewMode === "tree" ? (
                  <LogicTreeView businessLogic={selectedRule.businessLogic} />
                ) : (
                  <Paper
                    sx={{
                      p: 3,
                      maxHeight: 500,
                      overflow: "auto",
                      backgroundColor: alpha(theme.palette.primary.main, 0.03),
                      borderRadius: 1,
                      fontFamily: '"Roboto Mono", monospace',
                      border: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
                      "& pre": {
                        margin: 0,
                        fontFamily: "inherit",
                        fontSize: "0.875rem",
                        color: theme.palette.text.primary
                      }
                    }}
                  >
                    <pre>
                      {JSON.stringify(selectedRule.businessLogic, null, 2)}
                    </pre>
                  </Paper>
                )}
              </Box>
            </Zoom>
          )}
        </DialogContent>
        <DialogActions sx={{ padding: "16px 24px 24px" }}>
          <Button
            onClick={handleCloseDialog}
            variant="contained"
            color="primary"
            sx={{
              borderRadius: 1,
              px: 3,
              py: 1,
              fontWeight: 600,
              backgroundImage: "linear-gradient(to right, #6366F1, #818CF8)",
              transition: "all 0.2s ease",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: 4,
                backgroundImage: "linear-gradient(to right, #4F46E5, #6366F1)"
              }
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog
        open={confirmDeleteOpen}
        onClose={handleCancelDelete}
        PaperProps={{
          elevation: 24,
          sx: {
            borderRadius: 1,
            px: 1
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the rule "{selectedRule?.name}"?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ pb: 3, px: 3 }}>
          <Button
            onClick={handleCancelDelete}
            color="primary"
            variant="outlined"
            sx={{
              borderRadius: 1,
              borderWidth: "1.5px",
              fontWeight: 600,
              px: 2,
              "&:hover": {
                borderWidth: "1.5px"
              }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            sx={{
              ml: 1.5,
              borderRadius: 1,
              fontWeight: 600,
              px: 2
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RuleList;
