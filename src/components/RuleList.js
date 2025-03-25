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
  Box
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";

const RuleList = ({ rules }) => {
  const [selectedRule, setSelectedRule] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleViewRule = (rule) => {
    setSelectedRule(rule);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
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

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Rule Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Conditions</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rules.map((rule) => (
              <TableRow key={rule.id}>
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
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton color="error" size="small">
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
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Rule Details: {selectedRule?.name}</DialogTitle>
        <DialogContent>
          <Paper
            sx={{
              p: 2,
              maxHeight: 400,
              overflow: "auto",
              backgroundColor: "#f5f5f5",
              mt: 2
            }}
          >
            <pre>
              {selectedRule &&
                JSON.stringify(selectedRule.businessLogic, null, 2)}
            </pre>
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default RuleList;
