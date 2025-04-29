import { Card, useTheme, Typography, Box, alpha } from "@mui/material";
import React from "react";
import UserAvatar from "./UserAvatar";
import HorizontalStack from "./util/HorizontalStack";

const Message = (props) => {
  const username = props.conservant.username;
  const message = props.message;
  const theme = useTheme();
  
  // Custom colors for modern theme
  const primaryColor = "#6366f1"; // Indigo
  const secondaryColor = "#a855f7"; // Purple
  const messageFromBg = alpha(primaryColor, 0.1);
  const messageToBg = alpha(secondaryColor, 0.1);

  let styles = {};
  if (message.direction === "to") {
    styles = {
      justifyContent: "flex-start",
      backgroundColor: messageToBg,
      borderRadius: "18px 18px 18px 4px",
      borderColor: alpha(secondaryColor, 0.2),
      textColor: theme.palette.text.primary,
    };
  } else if (message.direction === "from") {
    styles = {
      justifyContent: "flex-end",
      backgroundColor: messageFromBg,
      borderRadius: "18px 18px 4px 18px",
      borderColor: alpha(primaryColor, 0.2),
      textColor: theme.palette.text.primary,
    };
  }

  return (
    <HorizontalStack
      sx={{ 
        paddingY: 0.5, 
        width: "100%",
        marginBottom: 0.5
      }}
      spacing={1.5}
      justifyContent={styles.justifyContent}
      alignItems="flex-end"
    >
      {message.direction === "to" && (
        <Box sx={{ marginBottom: "4px" }}>
          <UserAvatar 
            username={username} 
            height={32} 
            width={32} 
            sx={{ 
              border: `2px solid ${alpha(secondaryColor, 0.3)}`,
              boxShadow: `0 2px 4px ${alpha(theme.palette.common.black, 0.1)}`
            }}
          />
        </Box>
      )}

      <Card
        elevation={0}
        sx={{
          borderRadius: styles.borderRadius,
          backgroundColor: styles.backgroundColor,
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor: styles.borderColor,
          paddingY: "10px",
          paddingX: 2,
          maxWidth: "70%",
          boxShadow: `0 1px 2px ${alpha(theme.palette.common.black, 0.05)}`,
          position: "relative",
          "&::after": message.direction === "from" ? {
            content: '""',
            position: "absolute",
            bottom: 0,
            right: "-8px",
            width: "10px",
            height: "10px",
            backgroundColor: styles.backgroundColor,
            borderRight: `1px solid ${styles.borderColor}`,
            borderBottom: `1px solid ${styles.borderColor}`,
            transform: "rotate(-45deg)",
            borderBottomRightRadius: "2px",
            display: { xs: "none", sm: "block" }
          } : message.direction === "to" ? {
            content: '""',
            position: "absolute",
            bottom: 0,
            left: "-8px",
            width: "10px",
            height: "10px",
            backgroundColor: styles.backgroundColor,
            borderLeft: `1px solid ${styles.borderColor}`,
            borderBottom: `1px solid ${styles.borderColor}`,
            transform: "rotate(45deg)",
            borderBottomLeftRadius: "2px",
            display: { xs: "none", sm: "block" }
          } : {}
        }}
      >
        <Typography
          variant="body1"
          sx={{
            color: styles.textColor,
            wordBreak: "break-word",
            fontWeight: 400,
            fontSize: "0.95rem",
            lineHeight: 1.5,
          }}
        >
          {message.content}
        </Typography>
      </Card>
    </HorizontalStack>
  );
};

export default Message;