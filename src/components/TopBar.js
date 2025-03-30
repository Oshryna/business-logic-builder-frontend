import React from "react";
import styled from "@emotion/styled";
import { alpha } from "@mui/material/styles";
import { InputBase, IconButton, Popover } from "@mui/material";

const StyledSearch = styled("div")(({ theme }) => ({
  position: "relative",
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25)
  },
  marginRight: theme.spacing(2),
  marginLeft: theme.spacing(3),
  width: "auto",
  [theme.breakpoints.up("md")]: {
    width: "auto"
  },
  borderRadius: 0,
  border: `1px solid ${alpha(theme.palette.grey[300], 0.8)}`,
  boxShadow: `0 2px 4px ${alpha(theme.palette.common.black, 0.05)}`
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: alpha(theme.palette.text.secondary, 0.7)
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: theme.palette.text.primary,
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1.5, 1, 1.5, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "40ch"
    },
    "&::placeholder": {
      color: alpha(theme.palette.text.secondary, 0.6),
      opacity: 1
    }
  }
}));

const UserMenuButton = styled(IconButton)(({ theme }) => ({
  borderRadius: 0,
  border: `1px solid ${alpha(theme.palette.grey[300], 0.5)}`,
  padding: theme.spacing(1),
  marginLeft: theme.spacing(1),
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
    borderColor: alpha(theme.palette.primary.main, 0.2)
  }
}));

const SettingsPopover = styled(Popover)(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 0,
    boxShadow:
      "0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)",
    border: `1px solid ${theme.palette.divider}`,
    width: 280
  }
}));

const SearchPopover = styled(Popover)(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 0,
    boxShadow:
      "0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)",
    border: `1px solid ${theme.palette.divider}`,
    width: 320,
    padding: theme.spacing(2)
  }
}));

const TopBar = () => {
  return <div>{/* Rest of the component code */}</div>;
};

export default TopBar;
