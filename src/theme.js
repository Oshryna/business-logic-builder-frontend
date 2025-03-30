import { createTheme, alpha } from "@mui/material/styles";

// Define font families
const headingFontFamily =
  '"Inter", "Outfit", "Roboto", "Helvetica", "Arial", sans-serif';
const bodyFontFamily =
  '"Source Sans Pro", "Roboto", "Helvetica", "Arial", sans-serif';
const monoFontFamily = '"JetBrains Mono", "Roboto Mono", monospace';

// Modern color palette
const primary = {
  main: "#3f51b5", // Deep indigo
  light: "#757de8",
  dark: "#002984",
  contrastText: "#ffffff"
};

const secondary = {
  main: "#00bcd4", // Teal
  light: "#62efff",
  dark: "#008ba3",
  contrastText: "#ffffff"
};

// Create the updated theme
const theme = createTheme({
  palette: {
    mode: "light",
    primary,
    secondary,
    info: {
      main: "#2196f3", // Blue
      light: "#64b5f6",
      dark: "#1976d2",
      contrastText: "#ffffff"
    },
    success: {
      main: "#4caf50", // Green
      light: "#81c784",
      dark: "#388e3c",
      contrastText: "#ffffff"
    },
    warning: {
      main: "#ffc107", // Amber
      light: "#ffecb3",
      dark: "#ffa000",
      contrastText: "#ffffff"
    },
    error: {
      main: "#f44336", // Red
      light: "#e57373",
      dark: "#d32f2f",
      contrastText: "#ffffff"
    },
    background: {
      default: "#f8f9fa",
      paper: "#ffffff"
    },
    grey: {
      50: "#f8f9fa",
      100: "#f1f3f5",
      200: "#e9ecef",
      300: "#dee2e6",
      400: "#ced4da",
      500: "#adb5bd",
      600: "#6c757d",
      700: "#495057",
      800: "#343a40",
      900: "#212529"
    },
    text: {
      primary: "#212529",
      secondary: "#495057",
      disabled: alpha("#495057", 0.38)
    },
    divider: alpha("#dee2e6", 0.9)
  },
  typography: {
    fontFamily: bodyFontFamily,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    h1: {
      fontFamily: headingFontFamily,
      fontWeight: 800,
      lineHeight: 1.2,
      fontSize: "3.5rem",
      letterSpacing: "-0.02em"
    },
    h2: {
      fontFamily: headingFontFamily,
      fontWeight: 700,
      lineHeight: 1.3,
      fontSize: "2.25rem",
      letterSpacing: "-0.01em"
    },
    h3: {
      fontFamily: headingFontFamily,
      fontWeight: 700,
      lineHeight: 1.4,
      fontSize: "1.875rem",
      letterSpacing: "-0.01em"
    },
    h4: {
      fontFamily: headingFontFamily,
      fontWeight: 700,
      lineHeight: 1.4,
      fontSize: "1.5rem"
    },
    h5: {
      fontFamily: headingFontFamily,
      fontWeight: 600,
      lineHeight: 1.5,
      fontSize: "1.25rem"
    },
    h6: {
      fontFamily: headingFontFamily,
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
    },
    overline: {
      fontSize: "0.75rem",
      fontWeight: 600,
      textTransform: "uppercase",
      letterSpacing: "0.06em"
    },
    subtitle1: {
      fontSize: "1rem",
      fontWeight: 500,
      lineHeight: 1.75
    },
    subtitle2: {
      fontSize: "0.875rem",
      fontWeight: 500,
      lineHeight: 1.75
    },
    // Add specialized font styles
    monospace: {
      fontFamily: monoFontFamily,
      fontSize: "0.875rem",
      letterSpacing: "-0.025em"
    }
  },
  shape: {
    borderRadius: 0
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
          borderRadius: 0
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
          borderRadius: 0,
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
          borderRadius: 0,
          boxShadow: "0 6px 16px -4px rgba(0, 0, 0, 0.05)",
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
          borderRadius: 0,
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
          borderRadius: 0,
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
          borderRadius: 0,
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
            borderRadius: 0,
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
