import GridLayout from "../GridLayout";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";
import PostBrowser from "../PostBrowser";
import { Container, Box, Typography } from "@mui/material";

const ExploreView = () => {
  // Custom theme colors
  const purpleColor = "#a239ca";
  const pinkColor = "#e91e63";

  return (
    <Box sx={{ 
      background: 'linear-gradient(135deg, rgba(162, 57, 202, 0.02) 0%, rgba(233, 30, 99, 0.02) 100%)',
      minHeight: '100vh',
      pb: 4
    }}>
      <Navbar />
      <Container maxWidth="lg" sx={{ pt: 3 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            mb: 3, 
            fontWeight: 700,
            background: `linear-gradient(90deg, ${purpleColor} 0%, ${pinkColor} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '0.5px'
          }}
        >
          Explore
        </Typography>
        <GridLayout
          left={<PostBrowser createPost contentType="posts" />}
          right={<Sidebar />}
        />
      </Container>
    </Box>
  );
};

export default ExploreView;