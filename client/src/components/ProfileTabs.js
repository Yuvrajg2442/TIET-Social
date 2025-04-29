import { Card, Tab, Tabs, Box } from "@mui/material";
import React from "react";

const ProfileTabs = (props) => {
  const handleChange = (e, newValue) => {
    props.setTab(newValue);
  };

  // Custom theme colors to match the login page
  const purpleColor = "#a239ca";
  const pinkColor = "#e91e63";

  return (
    <Card 
      elevation={0}
      sx={{ 
        padding: 0,
        borderRadius: 2,
        overflow: 'hidden',
        border: '1px solid rgba(0, 0, 0, 0.05)'
      }}
    >
      <Tabs 
        value={props.tab} 
        onChange={handleChange} 
        variant="scrollable"
        sx={{
          '& .MuiTabs-indicator': {
            backgroundColor: pinkColor,
            height: 3,
          },
          '& .MuiTab-root': {
            textTransform: 'none',
            fontWeight: 500,
            fontSize: '0.95rem',
            minWidth: 100,
            transition: 'all 0.2s',
            '&:hover': {
              color: purpleColor,
            },
            '&.Mui-selected': {
              color: purpleColor,
              fontWeight: 600,
            },
          }
        }}
      >
        <Tab label="Posts" value="posts" />
        <Tab label="Liked" value="liked" />
        <Tab label="Comments" value="comments" />
      </Tabs>
    </Card>
  );
};

export default ProfileTabs;