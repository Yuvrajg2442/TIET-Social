import {
  Button,
  Stack,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import React, { useState } from "react";
import HorizontalStack from "./util/HorizontalStack";
import { IoSend } from "react-icons/io5"; // You'll need to install react-icons if not already installed

const SendMessage = (props) => {
  const [content, setContent] = useState("");

  const handleSendMessage = () => {
    if (content.trim().length > 0) {
      props.onSendMessage(content);
      setContent("");
    }
  };

  // Custom theme colors to match the login page
  const purpleColor = "#a239ca";
  const pinkColor = "#e91e63";

  // Gradient styles
  const gradientBackground = {
    background: `linear-gradient(90deg, ${purpleColor} 0%, ${pinkColor} 100%)`,
  };

  return (
    <Stack
      sx={{
        m: 2,
        height: "50px", // Slightly increased height
      }}
      justifyContent="center"
    >
      <HorizontalStack spacing={1} alignItems="center">
        <TextField
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type a message..."
          fullWidth
          value={content}
          autoComplete="off"
          size="small"
          onKeyPress={(e) => {
            if (e.key === "Enter" && content.trim().length > 0) {
              handleSendMessage();
            }
          }}
          InputProps={{
            sx: { 
              borderRadius: 28,
              backgroundColor: 'white',
              '& fieldset': {
                borderColor: 'rgba(162, 57, 202, 0.2)',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(162, 57, 202, 0.4)',
              },
              '&.Mui-focused fieldset': {
                borderColor: purpleColor,
              }
            },
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleSendMessage}
                  disabled={content.trim().length === 0}
                  sx={{
                    ...gradientBackground,
                    color: 'white',
                    '&.Mui-disabled': {
                      background: '#e0e0e0',
                      color: '#a0a0a0',
                    },
                    width: 32,
                    height: 32,
                  }}
                >
                  <IoSend size={16} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </HorizontalStack>
    </Stack>
  );
};

export default SendMessage;