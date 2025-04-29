import { useTheme } from "@emotion/react";
import { Box } from "@mui/material";
import React from "react";
import "react-router-dom";
import { useNavigate } from "react-router-dom";

const PostContentBox = (props) => {
  const { clickable, post, editing } = props;
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <>
      {clickable && !editing ? (
        <Box
          sx={{
            padding: theme.spacing(3),
            width: "92%",
            borderRadius: 3,
            transition: "all 0.3s ease",
            background: "rgba(255, 255, 255, 0.95)",
            borderLeft: "4px solid #4f46e5",
            boxShadow: "0 4px 15px rgba(79, 70, 229, 0.1)",
            "&:hover": { 
              background: "linear-gradient(to right, rgba(255, 255, 255, 0.98), rgba(238, 242, 255, 0.9))",
              cursor: "pointer",
              transform: "translateY(-3px)",
              boxShadow: "0 10px 20px rgba(79, 70, 229, 0.15)",
              borderLeft: "4px solid #6366f1"
            },
          }}
          onClick={() => navigate("/posts/" + post._id)}
        >
          {props.children}
        </Box>
      ) : (
        <Box 
          sx={{ 
            padding: theme.spacing(3), 
            width: "90%",
            borderRadius: 3,
            background: editing 
              ? "linear-gradient(to right, rgba(238, 242, 255, 0.7), rgba(255, 255, 255, 0.95))"
              : "rgba(255, 255, 255, 0.95)",
            borderLeft: editing ? "4px solid #6366f1" : "4px solid #e2e8f0",
            boxShadow: editing 
              ? "0 4px 15px rgba(79, 70, 229, 0.15)" 
              : "0 2px 10px rgba(0, 0, 0, 0.05)",
          }}
        >
          {props.children}
        </Box>
      )}
    </>
  );
};

export default PostContentBox;