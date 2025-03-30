import React from "react";
import { styled } from "@mui/material/styles";
import {
  ToggleButton,
  ToggleButtonGroup as MuiToggleButtonGroup
} from "@mui/material";
import { alpha } from "@mui/material/styles";

const StyledToggleButton = styled(ToggleButton)(({ theme }) => ({
  padding: theme.spacing(1, 2),
  border: `1px solid ${alpha(theme.palette.text.primary, 0.12)}`,
  borderRadius: 0,
  fontWeight: 500,
  textTransform: "none",
  color: theme.palette.text.secondary,
  "&.Mui-selected": {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    borderColor: alpha(theme.palette.primary.main, 0.5),
    color: theme.palette.primary.main,
    "&:hover": {
      backgroundColor: alpha(theme.palette.primary.main, 0.15),
      borderColor: alpha(theme.palette.primary.main, 0.7)
    }
  },
  "&:hover": {
    backgroundColor: alpha(theme.palette.text.primary, 0.04),
    borderColor: alpha(theme.palette.text.primary, 0.25)
  }
}));

const StyledToggleButtonGroup = styled(MuiToggleButtonGroup)(({ theme }) => ({
  borderRadius: 0
}));

const ToggleButtonGroup = ({ children, ...props }) => {
  return (
    <StyledToggleButtonGroup {...props}>{children}</StyledToggleButtonGroup>
  );
};

export default ToggleButtonGroup;
