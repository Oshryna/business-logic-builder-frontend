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
  useMediaQuery
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import CodeIcon from "@mui/icons-material/Code";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import LogicTreeView from "./LogicTreeView";

const RuleList = ({ rules }) => {
  const [selectedRule, setSelectedRule] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState("tree");
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

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

  if (rules.length === 0) {
    return (
      <Box my={3}>
        <Typography variant="h6">No rules created yet.</Typography>
        <Typography variant="body1" color="textSecondary">
          Use the Rule Builder tab to create new business logic rules.
        </Typography>
      </Box>
    );
  }

  return (
    <div>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Saved Rules
      </Typography>

      <TableContainer
        component={Paper}
        elevation={2}
        sx={{
          borderRadius: 2,
          overflow: "hidden",
          transition: "all 0.3s ease"
        }}
      >
        <Table>
          <TableHead
            sx={{ backgroundColor: (theme) => theme.palette.primary.light }}
          >
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Rule Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Type</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Created At</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Conditions</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rules.map((rule, index) => (
              <TableRow
                key={rule.id}
                sx={{
                  "&:nth-of-type(odd)": {
                    backgroundColor: (theme) => theme.palette.action.hover
                  },
                  "&:hover": {
                    backgroundColor: (theme) => theme.palette.action.selected
                  },
                  animation: "fadeIn 0.5s ease-in-out",
                  animationDelay: `${index * 0.1}s`,
                  "@keyframes fadeIn": {
                    from: { opacity: 0, transform: "translateY(10px)" },
                    to: { opacity: 1, transform: "translateY(0)" }
                  }
                }}
              >
                <TableCell>{rule.name}</TableCell>
                <TableCell>{rule.businessLogic.type}</TableCell>
                <TableCell>
                  {new Date(rule.createdAt).toLocaleString()}
                </TableCell>
                <TableCell>{rule.businessLogic.conditions.length}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleViewRule(rule)}
                    size="small"
                    sx={{
                      transition: "transform 0.2s",
                      "&:hover": { transform: "scale(1.1)" }
                    }}
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    size="small"
                    sx={{
                      transition: "transform 0.2s",
                      "&:hover": { transform: "scale(1.1)" }
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

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
            borderRadius: 2,
            overflow: "hidden"
          }
        }}
      >
        <DialogTitle sx={{ padding: 2 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6">
              Rule Details: {selectedRule?.name}
            </Typography>
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={handleViewModeChange}
              size="small"
              aria-label="view mode"
              sx={{
                "& .MuiToggleButton-root": {
                  transition: "all 0.2s ease",
                  "&.Mui-selected": {
                    backgroundColor: (theme) => theme.palette.primary.main,
                    color: "white",
                    "&:hover": {
                      backgroundColor: (theme) => theme.palette.primary.dark,
                      color: "white"
                    }
                  }
                }
              }}
            >
              <ToggleButton value="tree" aria-label="tree view">
                <AccountTreeIcon fontSize="small" />
              </ToggleButton>
              <ToggleButton value="json" aria-label="json view">
                <CodeIcon fontSize="small" />
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
                      backgroundColor: (theme) => theme.palette.grey[100],
                      mt: 2,
                      borderRadius: 2,
                      fontFamily: "monospace",
                      "& pre": {
                        margin: 0
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
        <DialogActions sx={{ padding: 2 }}>
          <Button
            onClick={handleCloseDialog}
            variant="contained"
            color="primary"
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1,
              transition: "all 0.2s ease",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: 4
              }
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default RuleList;
