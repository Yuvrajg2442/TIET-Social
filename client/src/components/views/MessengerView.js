import { Card, Grid, Typography, IconButton, CircularProgress } from "@mui/material";
import { Box, Container } from "@mui/system";
import React, { useEffect, useState, useCallback } from "react";
import Messages from "../Messages";
import Navbar from "../Navbar";
import UserMessengerEntries from "../UserMessengerEntries";
import { getConversations } from "../../api/messages";
import { isLoggedIn } from "../../helpers/authHelper";
import { useLocation } from "react-router-dom";
import { AiOutlineArrowLeft } from "react-icons/ai";

const MessengerView = () => {
  const [conservant, setConservant] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [width, setWindowWidth] = useState(window.innerWidth);
  const mobile = width < 800;
  const user = isLoggedIn();
  const { state } = useLocation();
  const newConservant = state && state.user;
  
  // Custom theme colors to match the login page
  const purpleColor = "#a239ca";
  const pinkColor = "#e91e63";

  const getConversation = (conversations, conservantId) => {
    for (let i = 0; i < conversations.length; i++) {
      const conversation = conversations[i];
      if (conversation.recipient._id === conservantId) {
        return conversation;
      }
    }
    return null;
  };

  const fetchConversations = useCallback(async () => {
    let conversations = await getConversations(user);
    if (newConservant) {
      setConservant(newConservant);
      if (!getConversation(conversations, newConservant._id)) {
        const newConversation = {
          _id: newConservant._id,
          recipient: newConservant,
          new: true,
          messages: [],
        };
        conversations = [newConversation, ...conversations];
      }
    }
    setConversations(conversations);
    setLoading(false);
  }, [user, newConservant]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  useEffect(() => {
    const updateDimensions = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const handleBackToList = () => {
    setConservant(null);
  };

  return (
    <Container maxWidth="xl" sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", py: 2 }}>
        <Typography 
          variant="h5" 
          sx={{ 
            mb: 2,
            fontWeight: 600,
            background: `linear-gradient(90deg, ${purpleColor} 0%, ${pinkColor} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          Messages
        </Typography>
        
        <Card 
          sx={{ 
            padding: 0, 
            flexGrow: 1,
            borderRadius: 3,
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: '1px solid rgba(0,0,0,0.05)'
          }}
        >
          {loading ? (
            <Box 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}
            >
              <CircularProgress sx={{ color: purpleColor }} />
            </Box>
          ) : (
            <Grid
              container
              sx={{ height: "100%" }}
              alignItems="stretch"
            >
              {!mobile ? (
                <>
                  <Grid
                    item
                    xs={4}
                    sx={{
                      borderRight: '1px solid rgba(0,0,0,0.08)',
                      height: "100%",
                    }}
                  >
                    <UserMessengerEntries
                      conservant={conservant}
                      conversations={conversations}
                      setConservant={setConservant}
                      loading={loading}
                    />
                  </Grid>

                  <Grid item xs={8} sx={{ height: "100%" }}>
                    <Messages
                      conservant={conservant}
                      conversations={conversations}
                      setConservant={setConservant}
                      setConversations={setConversations}
                      getConversation={getConversation}
                      themeColors={{ purpleColor, pinkColor }}
                    />
                  </Grid>
                </>
              ) : !conservant ? (
                <Grid
                  item
                  xs={12}
                  sx={{
                    height: "100%",
                  }}
                >
                  <UserMessengerEntries
                    conservant={conservant}
                    conversations={conversations}
                    setConservant={setConservant}
                    loading={loading}
                    themeColors={{ purpleColor, pinkColor }}
                  />
                </Grid>
              ) : (
                <Grid item xs={12} sx={{ height: "100%" }}>
                  <Box 
                    sx={{ 
                      p: 1.5, 
                      borderBottom: '1px solid rgba(0,0,0,0.08)',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <IconButton 
                      onClick={handleBackToList}
                      sx={{ color: purpleColor, mr: 1 }}
                    >
                      <AiOutlineArrowLeft />
                    </IconButton>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {conservant && conservant.username}
                    </Typography>
                  </Box>
                  <Messages
                    conservant={conservant}
                    conversations={conversations}
                    setConservant={setConservant}
                    setConversations={setConversations}
                    getConversation={getConversation}
                    mobile
                    themeColors={{ purpleColor, pinkColor }}
                  />
                </Grid>
              )}
            </Grid>
          )}
        </Card>
      </Box>
    </Container>
  );
};

export default MessengerView;