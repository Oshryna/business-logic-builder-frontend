import React from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Stack,
  Divider,
  Avatar,
  Paper,
  useTheme,
  alpha
} from "@mui/material";
import {
  Timeline as TimelineIcon,
  Psychology as PsychologyIcon,
  BusinessCenter as BusinessCenterIcon,
  PlayArrow as PlayArrowIcon,
  Build as BuildIcon,
  TouchApp as TouchAppIcon,
  Security as SecurityIcon,
  Loop as LoopIcon
} from "@mui/icons-material";

// Mini interactive demo component
const MiniDemo = () => {
  const theme = useTheme();

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        borderRadius: theme.shape.borderRadius,
        height: 200,
        overflow: "hidden",
        position: "relative",
        border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
        backdropFilter: "blur(8px)",
        bgcolor: alpha(theme.palette.background.paper, 0.9)
      }}
    >
      <Box
        sx={{
          pb: 1,
          mb: 1,
          borderBottom: `1px dashed ${alpha(theme.palette.divider, 0.8)}`
        }}
      >
        <Typography variant="subtitle2" fontWeight={600}>
          Try it out:
        </Typography>
      </Box>

      {/* Simplified demo UI with some interactive elements */}
      <Stack spacing={1}>
        <Box
          sx={{
            p: 1,
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            borderRadius: 1,
            display: "flex",
            alignItems: "center",
            gap: 1
          }}
        >
          <Box
            sx={{
              width: 20,
              height: 20,
              borderRadius: "50%",
              bgcolor: theme.palette.primary.main
            }}
          />
          <Typography variant="caption">
            IF [Transfer Amount] {">"} 1000
          </Typography>
        </Box>

        <Box
          sx={{
            p: 1,
            bgcolor: alpha(theme.palette.secondary.main, 0.1),
            borderRadius: 1,
            display: "flex",
            alignItems: "center",
            gap: 1,
            ml: 2
          }}
        >
          <Box
            sx={{
              width: 20,
              height: 20,
              borderRadius: "50%",
              bgcolor: theme.palette.secondary.main
            }}
          />
          <Typography variant="caption">
            THEN "Apply special handling"
          </Typography>
        </Box>
      </Stack>

      <Button
        variant="contained"
        size="small"
        sx={{ position: "absolute", bottom: 12, right: 12 }}
      >
        Try More
      </Button>
    </Paper>
  );
};

// Testimonial component
const Testimonial = ({ name, role, company, content, avatar }) => {
  const theme = useTheme();

  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: theme.shape.borderRadius,
        border: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: theme.shadows[4],
          borderColor: theme.palette.primary.light
        }
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography
          sx={{
            mb: 2,
            fontStyle: "italic",
            color: alpha(theme.palette.text.primary, 0.85)
          }}
        >
          "{content}"
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", mt: "auto", pt: 2 }}>
          <Avatar src={avatar} sx={{ mr: 2 }} />
          <Box>
            <Typography variant="subtitle2" fontWeight={600}>
              {name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {role}, {company}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

// Feature card component
const FeatureCard = ({ title, description, icon, color }) => {
  const theme = useTheme();
  const Icon = icon;

  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: theme.shape.borderRadius,
        border: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: theme.shadows[3]
        }
      }}
    >
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.6)}`
        }}
      >
        <Box
          sx={{
            p: 1.5,
            bgcolor: alpha(color, 0.1),
            borderRadius: 2,
            mr: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Icon sx={{ color: color }} />
        </Box>
        <Typography variant="h6">{title}</Typography>
      </Box>
      <CardContent sx={{ flexGrow: 1, pt: 2 }}>
        <Typography color="text.secondary">{description}</Typography>
      </CardContent>
    </Card>
  );
};

const HomePage = ({ onStartBuilding }) => {
  const theme = useTheme();

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          background: `linear-gradient(135deg, ${alpha(
            theme.palette.primary.light,
            0.05
          )} 0%, ${alpha(theme.palette.secondary.light, 0.1)} 100%)`,
          position: "relative",
          overflow: "hidden"
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box>
                <Typography
                  variant="h1"
                  sx={{
                    mb: 2,
                    fontWeight: 800,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent"
                  }}
                >
                  Build Business Logic Without Code
                </Typography>

                <Typography
                  variant="h5"
                  color="text.secondary"
                  sx={{ mb: 4, fontWeight: 400 }}
                >
                  Create, manage, and deploy powerful business rules with our
                  intuitive visual builder — no coding required.
                </Typography>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <Button
                    variant="contained"
                    size="large"
                    color="primary"
                    onClick={onStartBuilding}
                    sx={{
                      borderRadius: 2,
                      px: 4,
                      py: 1.5,
                      fontSize: "1rem",
                      boxShadow: theme.shadows[4]
                    }}
                  >
                    Start Building
                  </Button>

                  <Button
                    variant="outlined"
                    size="large"
                    color="primary"
                    startIcon={<PlayArrowIcon />}
                    sx={{
                      borderRadius: 2,
                      px: 3,
                      py: 1.5,
                      fontSize: "1rem",
                      borderWidth: 2
                    }}
                  >
                    Watch Tutorial
                  </Button>
                </Stack>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  position: "relative",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    height: { xs: 300, md: 400 },
                    borderRadius: theme.shape.borderRadius,
                    overflow: "hidden",
                    boxShadow: theme.shadows[6],
                    position: "relative",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundImage:
                        "url(https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070)",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      filter: "brightness(0.8)",
                      zIndex: 1
                    }
                  }}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      bgcolor: alpha(theme.palette.primary.dark, 0.85),
                      zIndex: 2
                    }}
                  />

                  <Box
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      width: "80%",
                      zIndex: 3
                    }}
                  >
                    <MiniDemo />
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Value Proposition Section */}
      <Container maxWidth="lg">
        <Box sx={{ py: { xs: 6, md: 10 } }}>
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Typography
              variant="h2"
              sx={{
                mb: 2,
                fontWeight: 700
              }}
            >
              Why Use Our Logic Builder
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: 700, mx: "auto" }}
            >
              Our platform simplifies the process of creating complex business
              rules, making them accessible to everyone.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <FeatureCard
                title="Intuitive Visual Builder"
                description="Drag and drop interface that makes building complex logic as easy as creating a flowchart. No programming experience required."
                icon={TouchAppIcon}
                color={theme.palette.primary.main}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FeatureCard
                title="No Coding Required"
                description="Create sophisticated business rules without writing a single line of code. Our visual interface handles all the complexity for you."
                icon={PsychologyIcon}
                color={theme.palette.secondary.main}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FeatureCard
                title="Enterprise Ready"
                description="Secure, scalable, and reliable. Our platform is built to meet the demands of enterprise-level applications and workflows."
                icon={SecurityIcon}
                color={theme.palette.success.main}
              />
            </Grid>
          </Grid>
        </Box>
      </Container>

      {/* Testimonials Section */}
      <Box
        sx={{
          py: { xs: 6, md: 10 },
          background: `linear-gradient(135deg, ${alpha(
            theme.palette.primary.dark,
            0.05
          )} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Typography
              variant="h2"
              sx={{
                mb: 2,
                fontWeight: 700
              }}
            >
              Success Stories
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: 700, mx: "auto" }}
            >
              See how companies are transforming their operations with our
              business logic builder.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Testimonial
                name="Alex Johnson"
                role="CTO"
                company="TechInnovate"
                content="We reduced our rule development time by 70% and eliminated countless errors by using this visual builder. It's revolutionized how we implement business policies."
                avatar="https://randomuser.me/api/portraits/men/32.jpg"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Testimonial
                name="Sarah Chen"
                role="Business Analyst"
                company="FinanceFlow"
                content="As someone without coding experience, I can now create and modify complex business rules without relying on our development team. The empowerment is amazing!"
                avatar="https://randomuser.me/api/portraits/women/44.jpg"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Testimonial
                name="Michael Rodriguez"
                role="Operations Director"
                company="LogisticsPlus"
                content="The visual nature of the builder helps us see and understand our business logic in ways we never could before. It's improved our accuracy dramatically."
                avatar="https://randomuser.me/api/portraits/men/67.jpg"
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Container maxWidth="md">
        <Box
          sx={{
            py: { xs: 8, md: 12 },
            textAlign: "center"
          }}
        >
          <Typography variant="h2" fontWeight={700} gutterBottom>
            Ready to Transform Your Business Logic?
          </Typography>
          <Typography
            variant="h5"
            color="text.secondary"
            sx={{
              mb: 4,
              maxWidth: 700,
              mx: "auto"
            }}
          >
            Join thousands of businesses that have simplified their operations
            with our visual business logic builder.
          </Typography>

          <Button
            variant="contained"
            size="large"
            color="primary"
            onClick={onStartBuilding}
            sx={{
              borderRadius: 2,
              px: 6,
              py: 1.5,
              fontSize: "1.1rem",
              boxShadow: theme.shadows[5]
            }}
          >
            Start Building Now
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;
