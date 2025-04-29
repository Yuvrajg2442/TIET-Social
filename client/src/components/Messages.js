import {
  Divider,
  IconButton,
  Stack,
  Typography,
  Paper,
  useTheme,
} from "@mui/material";
import { Box, alpha } from "@mui/system";
import React, { useEffect, useRef, useState } from "react";
import { AiFillCaretLeft, AiFillMessage } from "react-icons/ai";
import { Link } from "react-router-dom";
import { getMessages, sendMessage } from "../api/messages";
import { isLoggedIn } from "../helpers/authHelper";
import { socket } from "../helpers/socketHelper";
import Loading from "./Loading";
import Message from "./Message";
import SendMessage from "./SendMessage";
import UserAvatar from "./UserAvatar";
import HorizontalStack from "./util/HorizontalStack";

const Messages = (props) => {
  const theme = useTheme();
  const messagesEndRef = useRef(null);
  const user = isLoggedIn();
  const [messages, setMessages] = useState(null);
  const [loading, setLoading] = useState(true);

  const conversationsRef = useRef(props.conversations);
  const conservantRef = useRef(props.conservant);
  const messagesRef = useRef(messages);
  
  // Custom colors for modern theme
  const primaryColor = "#6366f1"; // Indigo
  const secondaryColor = "#a855f7"; // Purple
  const accentColor = "#3b82f6"; // Blue
  const bgColor = "#f8fafc"; // Light background
  const darkBgColor = "#1e293b"; // Dark background for contrast
  const messageFromBg = alpha(primaryColor, 0.1);
  const messageToBg = alpha(secondaryColor, 0.1);

  useEffect(() => {
    conversationsRef.current = props.conversations;
    conservantRef.current = props.conservant;
    messagesRef.current = messages;
  });

  const conversation =
    props.conversations &&
    props.conservant &&
    props.getConversation(props.conversations, props.conservant._id);

  const setDirection = (messages) => {
    messages.forEach((message) => {
      if (message.sender._id === user.userId) {
        message.direction = "from";
      } else {
        message.direction = "to";
      }
    });
  };

  const fetchMessages = async () => {
    if (conversation) {
      if (conversation.new) {
        setLoading(false);
        setMessages(conversation.messages);
        return;
      }

      setLoading(true);

      const data = await getMessages(user, conversation._id);

      setDirection(data);

      if (data && !data.error) {
        setMessages(data);
      }

      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [props.conservant]);

  useEffect(() => {
    if (messages) {
      scrollToBottom();
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (content) => {
    const newMessage = { direction: "from", content };
    const newMessages = [newMessage, ...messages];

    if (conversation.new) {
      conversation.messages = [...conversation.messages, newMessage];
    }

    let newConversations = props.conversations.filter(
      (conversationCompare) => conversation._id !== conversationCompare._id
    );

    newConversations.unshift(conversation);

    props.setConversations(newConversations);

    setMessages(newMessages);

    await sendMessage(user, newMessage, conversation.recipient._id);

    socket.emit(
      "send-message",
      conversation.recipient._id,
      user.username,
      content
    );
  };

  const handleReceiveMessage = (senderId, username, content) => {
    const newMessage = { direction: "to", content };

    const conversation = props.getConversation(
      conversationsRef.current,
      senderId
    );

    console.log(username + " " + content);

    if (conversation) {
      let newMessages = [newMessage];
      if (messagesRef.current) {
        newMessages = [...newMessages, ...messagesRef.current];
      }

      setMessages(newMessages);

      if (conversation.new) {
        conversation.messages = newMessages;
      }
      conversation.lastMessageAt = Date.now();

      let newConversations = conversationsRef.current.filter(
        (conversationCompare) => conversation._id !== conversationCompare._id
      );

      newConversations.unshift(conversation);

      props.setConversations(newConversations);
    } else {
      const newConversation = {
        _id: senderId,
        recipient: { _id: senderId, username },
        new: true,
        messages: [newMessage],
        lastMessageAt: Date.now(),
      };
      props.setConversations([newConversation, ...conversationsRef.current]);
    }

    scrollToBottom();
  };

  useEffect(() => {
    socket.on("receive-message", handleReceiveMessage);
  }, []);

  // Custom styling for Message component
  // This would need to be passed to the Message component
  const messageStyles = {
    from: {
      backgroundColor: messageFromBg,
      borderRadius: "18px 18px 4px 18px",
      alignSelf: "flex-end",
      marginLeft: "20%",
    },
    to: {
      backgroundColor: messageToBg,
      borderRadius: "18px 18px 18px 4px",
      alignSelf: "flex-start",
      marginRight: "20%",
    },
  };

  return props.conservant ? (
    <Paper 
      elevation={3} 
      sx={{ 
        height: "100%", 
        display: "flex", 
        flexDirection: "column",
        borderRadius: 2,
        overflow: "hidden",
        bgcolor: bgColor
      }}
    >
      {messages && conversation && !loading ? (
        <>
          <HorizontalStack
            alignItems="center"
            spacing={2}
            sx={{ 
              px: 3, 
              py: 1.5, 
              height: "70px",
              bgcolor: alpha(accentColor, 0.05),
              borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
            }}
          >
            {props.mobile && (
              <IconButton
                onClick={() => props.setConservant(null)}
                sx={{ 
                  padding: 1,
                  color: primaryColor,
                  "&:hover": {
                    bgcolor: alpha(primaryColor, 0.1)
                  }
                }}
              >
                <AiFillCaretLeft />
              </IconButton>
            )}
            <UserAvatar
              username={props.conservant.username}
              height={40}
              width={40}
            />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              <Link 
                to={"/users/" + props.conservant.username}
                style={{ 
                  textDecoration: "none", 
                  color: primaryColor,
                  transition: "color 0.2s ease"
                }}
                onMouseOver={(e) => e.target.style.color = secondaryColor}
                onMouseOut={(e) => e.target.style.color = primaryColor}
              >
                {props.conservant.username}
              </Link>
            </Typography>
          </HorizontalStack>
          <Box 
            sx={{ 
              flexGrow: 1, 
              height: "calc(100vh - 240px)",
              background: `linear-gradient(to bottom, ${alpha(accentColor, 0.03)}, ${alpha(primaryColor, 0.02)})`,
            }}
          >
            <Box sx={{ height: "100%" }}>
              <Stack
                sx={{ 
                  padding: 3, 
                  overflowY: "auto", 
                  maxHeight: "100%",
                  "&::-webkit-scrollbar": {
                    width: "8px",
                  },
                  "&::-webkit-scrollbar-track": {
                    background: alpha(theme.palette.grey[200], 0.5),
                  },
                  "&::-webkit-scrollbar-thumb": {
                    background: alpha(primaryColor, 0.3),
                    borderRadius: "4px",
                    "&:hover": {
                      background: alpha(primaryColor, 0.5),
                    }
                  }
                }}
                direction="column-reverse"
                spacing={2}
              >
                <div ref={messagesEndRef} />
                {messages.map((message, i) => (
                  <Message
                    conservant={props.conservant}
                    message={message}
                    key={i}
                    styles={messageStyles}
                  />
                ))}
              </Stack>
            </Box>
          </Box>
          <Box sx={{ 
            borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            bgcolor: bgColor
          }}>
            <SendMessage 
              onSendMessage={handleSendMessage} 
              primaryColor={primaryColor}
              secondaryColor={secondaryColor}
            />
          </Box>
          {scrollToBottom()}
        </>
      ) : (
        <Stack sx={{ height: "100%" }} justifyContent="center">
          <Loading color={primaryColor} />
        </Stack>
      )}
    </Paper>
  ) : (
    <Paper
      elevation={3}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 2,
        padding: 4,
        background: `linear-gradient(135deg, ${alpha(primaryColor, 0.05)}, ${alpha(secondaryColor, 0.05)})`,
      }}
    >
      <Stack
        sx={{ height: "100%" }}
        justifyContent="center"
        alignItems="center"
        spacing={3}
      >
        <Box 
          sx={{ 
            borderRadius: "50%", 
            padding: 2, 
            bgcolor: alpha(primaryColor, 0.1),
            color: primaryColor,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 0 20px ${alpha(primaryColor, 0.2)}`
          }}
        >
          <AiFillMessage size={80} />
        </Box>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 700,
            background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}
        >
          TIET Social Messenger
        </Typography>
        <Typography 
          color="text.secondary" 
          variant="subtitle1"
          sx={{ textAlign: "center", maxWidth: "80%" }}
        >
          Privately message other users on TIET Social
        </Typography>
      </Stack>
    </Paper>
  );
};

export default Messages;