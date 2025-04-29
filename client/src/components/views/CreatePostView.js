import { Container, Box } from "@mui/material";
import React from "react";
import GoBack from "../GoBack";
import GridLayout from "../GridLayout";
import Navbar from "../Navbar";
import PostEditor from "../PostEditor";
import Sidebar from "../Sidebar";

const CreatePostView = () => {
  // Custom theme colors to match the login page
  const purpleColor = "#a239ca";
  const pinkColor = "#e91e63";

  return (
    <Box sx={{ 
      background: 'linear-gradient(135deg, rgba(162, 57, 202, 0.03) 0%, rgba(233, 30, 99, 0.03) 100%)',
      minHeight: '100vh',
      pb: 4
    }}>
      <Navbar />
      <Container maxWidth="lg" sx={{ pt: 2 }}>
        <Box sx={{ mb: 2 }}>
          <GoBack />
        </Box>
        <GridLayout left={<PostEditor />} right={<Sidebar />} />
      </Container>
    </Box>
  );
};

export default CreatePostView;