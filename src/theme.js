import { createTheme, alpha } from "@mui/material/styles";

// Define the Inter font face
const fontFamily = '"Inter", "Roboto", "Helvetica", "Arial", sans-serif';

// BASE44-inspired color palette
const primary = {
  main: "#6366F1", // Primary indigo color
  light: "#818CF8",
  dark: "#4F46E5",
  contrastText: "#ffffff"
};

const secondary = {
  main: "#10B981", // Green accent color
  light: "#34D399",
  dark: "#059669",
  contrastText: "#ffffff"
};

// Create a custom theme inspired by BASE44
const theme = createTheme({
  palette: {
    mode: "light",
    primary,
    secondary,
    info: {
      main: "#0EA5E9", // Sky blue
      light: "#38BDF8",
      dark: "#0284C7",
      contrastText: "#ffffff"
    },
    success: {
      main: "#10B981", // Emerald
      light: "#34D399",
      dark: "#059669",
      contrastText: "#ffffff"
    },
    warning: {
      main: "#F59E0B", // Amber
      light: "#FBBF24",
      dark: "#D97706",
      contrastText: "#ffffff"
    },
    error: {
      main: "#EF4444", // Red
      light: "#F87171",
      dark: "#DC2626",
      contrastText: "#ffffff"
    },
    background: {
      default: "#F9FAFB", // Very light gray
      paper: "#ffffff"
    },
    grey: {
      50: "#F9FAFB",
      100: "#F3F4F6",
      200: "#E5E7EB",
      300: "#D1D5DB",
      400: "#9CA3AF",
      500: "#6B7280",
      600: "#4B5563",
      700: "#374151",
      800: "#1F2937",
      900: "#111827"
    },
    text: {
      primary: "#111827",
      secondary: "#4B5563",
      disabled: alpha("#4B5563", 0.38)
    },
    divider: alpha("#E5E7EB", 0.9)
  },
  typography: {
    fontFamily,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    h1: {
      fontWeight: 800,
      lineHeight: 1.2,
      fontSize: "3.5rem",
      letterSpacing: "-0.02em"
    },
    h2: {
      fontWeight: 700,
      lineHeight: 1.3,
      fontSize: "2.25rem",
      letterSpacing: "-0.01em"
    },
    h3: {
      fontWeight: 700,
      lineHeight: 1.4,
      fontSize: "1.875rem",
      letterSpacing: "-0.01em"
    },
    h4: {
      fontWeight: 700,
      lineHeight: 1.4,
      fontSize: "1.5rem"
    },
    h5: {
      fontWeight: 600,
      lineHeight: 1.5,
      fontSize: "1.25rem"
    },
    h6: {
      fontWeight: 600,
      lineHeight: 1.6,
      fontSize: "1rem"
    },
    body1: {
      lineHeight: 1.6,
      fontSize: "1rem"
    },
    body2: {
      lineHeight: 1.6,
      fontSize: "0.875rem"
    },
    button: {
      fontWeight: 600,
      fontSize: "0.875rem",
      textTransform: "none"
    },
    caption: {
      fontSize: "0.75rem",
      lineHeight: 1.5
    }
  },
  shape: {
    borderRadius: 2
  },
  shadows: [
    "none",
    "0px 1px 2px rgba(0, 0, 0, 0.06), 0px 1px 3px rgba(0, 0, 0, 0.1)",
    "0px 2px 4px -1px rgba(0, 0, 0, 0.06), 0px 4px 6px -1px rgba(0, 0, 0, 0.1)",
    "0px 4px 6px -2px rgba(0, 0, 0, 0.05), 0px 10px 15px -3px rgba(0, 0, 0, 0.1)",
    "0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)",
    "0px 20px 25px -5px rgba(0, 0, 0, 0.1), 0px 10px 10px -5px rgba(0, 0, 0, 0.04)",
    "0px 25px 50px -12px rgba(0, 0, 0, 0.25)",
    "0px 25px 50px -12px rgba(0, 0, 0, 0.25)",
    "0px 25px 50px -12px rgba(0, 0, 0, 0.25)",
    "0px 25px 50px -12px rgba(0, 0, 0, 0.25)",
    "0px 25px 50px -12px rgba(0, 0, 0, 0.25)",
    "0px 25px 50px -12px rgba(0, 0, 0, 0.25)",
    "0px 25px 50px -12px rgba(0, 0, 0, 0.25)",
    "0px 25px 50px -12px rgba(0, 0, 0, 0.25)",
    "0px 25px 50px -12px rgba(0, 0, 0, 0.25)",
    "0px 25px 50px -12px rgba(0, 0, 0, 0.25)",
    "0px 25px 50px -12px rgba(0, 0, 0, 0.25)",
    "0px 25px 50px -12px rgba(0, 0, 0, 0.25)",
    "0px 25px 50px -12px rgba(0, 0, 0, 0.25)",
    "0px 25px 50px -12px rgba(0, 0, 0, 0.25)",
    "0px 25px 50px -12px rgba(0, 0, 0, 0.25)",
    "0px 25px 50px -12px rgba(0, 0, 0, 0.25)",
    "0px 25px 50px -12px rgba(0, 0, 0, 0.25)",
    "0px 25px 50px -12px rgba(0, 0, 0, 0.25)",
    "0px 25px 50px -12px rgba(0, 0, 0, 0.25)"
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        "*": {
          boxSizing: "border-box"
        },
        html: {
          MozOsxFontSmoothing: "grayscale",
          WebkitFontSmoothing: "antialiased",
          height: "100%",
          width: "100%"
        },
        body: {
          height: "100%",
          margin: 0,
          padding: 0
        },
        "#root": {
          height: "100%"
        },
        a: {
          textDecoration: "none",
          color: primary.main
        },
        "::-webkit-scrollbar": {
          width: "8px",
          height: "8px"
        },
        "::-webkit-scrollbar-track": {
          background: "#F3F4F6"
        },
        "::-webkit-scrollbar-thumb": {
          background: "#D1D5DB",
          borderRadius: "2px"
        },
        "::-webkit-scrollbar-thumb:hover": {
          background: "#9CA3AF"
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          borderBottom: "1px solid #E5E7EB"
        },
        colorPrimary: {
          backgroundColor: "#ffffff",
          color: "#111827"
        }
      },
      defaultProps: {
        elevation: 0
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 600,
          boxShadow: "none",
          padding: "10px 20px",
          "&:hover": {
            boxShadow:
              "0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)"
          }
        },
        sizeSmall: {
          padding: "8px 16px",
          fontSize: "0.8125rem"
        },
        sizeLarge: {
          padding: "12px 24px",
          fontSize: "1rem"
        },
        contained: {
          boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.05)",
          "&:hover": {
            boxShadow:
              "0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)"
          }
        },
        containedPrimary: {
          backgroundImage: "linear-gradient(to right, #6366F1, #818CF8)",
          "&:hover": {
            backgroundImage: "linear-gradient(to right, #4F46E5, #6366F1)"
          }
        },
        containedSecondary: {
          backgroundImage: "linear-gradient(to right, #10B981, #34D399)",
          "&:hover": {
            backgroundImage: "linear-gradient(to right, #059669, #10B981)"
          }
        },
        outlined: {
          borderWidth: "1.5px",
          "&:hover": {
            borderWidth: "1.5px"
          }
        },
        outlinedPrimary: {
          borderColor: alpha(primary.main, 0.5),
          "&:hover": {
            borderColor: primary.main,
            backgroundColor: alpha(primary.main, 0.04)
          }
        },
        text: {
          "&:hover": {
            backgroundColor: alpha(primary.main, 0.04)
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow:
            "0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)",
          "&:hover": {
            boxShadow:
              "0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)"
          },
          transition: "box-shadow 0.3s ease-in-out, transform 0.2s ease",
          overflow: "hidden"
        }
      },
      defaultProps: {
        elevation: 0
      }
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          padding: "24px 24px 16px"
        }
      }
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: "16px 24px 24px",
          "&:last-child": {
            paddingBottom: "24px"
          }
        }
      }
    },
    MuiCardActions: {
      styleOverrides: {
        root: {
          padding: "16px 24px 24px"
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 600
        },
        sizeSmall: {
          height: 24
        },
        colorPrimary: {
          backgroundColor: alpha(primary.main, 0.1),
          color: primary.dark,
          "&.MuiChip-outlined": {
            borderColor: alpha(primary.main, 0.3),
            backgroundColor: "transparent"
          }
        },
        colorSecondary: {
          backgroundColor: alpha(secondary.main, 0.1),
          color: secondary.dark,
          "&.MuiChip-outlined": {
            borderColor: alpha(secondary.main, 0.3),
            backgroundColor: "transparent"
          }
        }
      }
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontSize: "1.25rem",
          fontWeight: 700,
          padding: "24px 24px 16px"
        }
      }
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: "16px 24px"
        }
      }
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: "16px 24px 24px"
        }
      }
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: "#E5E7EB"
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none"
        },
        elevation1: {
          boxShadow:
            "0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)"
        }
      }
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: "#F9FAFB",
          ".MuiTableCell-root": {
            color: "#4B5563",
            fontSize: "0.75rem",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.05em"
          }
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: "16px 16px",
          borderBottom: "1px solid",
          borderColor: "#F3F4F6"
        }
      }
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          borderBottom: "1px solid #E5E7EB"
        },
        indicator: {
          height: 3,
          borderTopLeftRadius: 3,
          borderTopRightRadius: 3,
          backgroundColor: primary.main
        }
      }
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          fontSize: "0.875rem",
          minWidth: 120,
          padding: "12px 16px",
          "&.Mui-selected": {
            color: primary.main
          }
        }
      }
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 600,
          borderWidth: "1px",
          "&.Mui-selected": {
            backgroundColor: alpha(primary.main, 0.1),
            borderColor: alpha(primary.main, 0.5),
            color: primary.main,
            "&:hover": {
              backgroundColor: alpha(primary.main, 0.15),
              borderColor: primary.main
            }
          }
        }
      }
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: alpha("#111827", 0.9),
          backdropFilter: "blur(4px)",
          borderRadius: 6,
          padding: "8px 12px",
          fontSize: "0.75rem",
          fontWeight: 500
        },
        arrow: {
          color: alpha("#111827", 0.9)
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: primary.main,
              borderWidth: 2
            }
          }
        }
      }
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          "&::placeholder": {
            opacity: 0.7,
            color: "#9CA3AF"
          }
        }
      }
    }
  }
});

export default theme;
