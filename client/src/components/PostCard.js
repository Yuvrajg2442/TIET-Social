import {
  Card,
  IconButton,
  Stack,
  Typography,
  useTheme,
  alpha,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import { AiFillCheckCircle, AiFillEdit, AiFillMessage } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { deletePost, likePost, unlikePost, updatePost } from "../api/posts";
import { isLoggedIn } from "../helpers/authHelper";
import ContentDetails from "./ContentDetails";

import LikeBox from "./LikeBox";
import PostContentBox from "./PostContentBox";
import HorizontalStack from "./util/HorizontalStack";

import ContentUpdateEditor from "./ContentUpdateEditor";
import Markdown from "./Markdown";

import "./postCard.css";
import { MdCancel } from "react-icons/md";
import { BiTrash } from "react-icons/bi";
import UserLikePreview from "./UserLikePreview";

const PostCard = (props) => {
  const { preview, removePost } = props;
  let postData = props.post;
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const user = isLoggedIn();
  const isAuthor = user && user.username === postData.poster.username;

  const theme = useTheme();
  const primaryColor = "#4f46e5"; // Indigo
  const accentColor = "#8b5cf6"; // Purple
  const dangerColor = "#ef4444"; // Red

  const [editing, setEditing] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [post, setPost] = useState(postData);
  const [likeCount, setLikeCount] = useState(post.likeCount);

  let maxHeight = null;
  if (preview === "primary") {
    maxHeight = 250;
  }

  const handleDeletePost = async (e) => {
    e.stopPropagation();

    if (!confirm) {
      setConfirm(true);
    } else {
      setLoading(true);
      await deletePost(post._id, isLoggedIn());
      setLoading(false);
      if (preview) {
        removePost(post);
      } else {
        navigate("/");
      }
    }
  };

  const handleEditPost = async (e) => {
    e.stopPropagation();
    setEditing(!editing);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const content = e.target.content.value;
    await updatePost(post._id, isLoggedIn(), { content });
    setPost({ ...post, content, edited: true });
    setEditing(false);
  };

  const handleLike = async (liked) => {
    if (liked) {
      setLikeCount(likeCount + 1);
      await likePost(post._id, user);
    } else {
      setLikeCount(likeCount - 1);
      await unlikePost(post._id, user);
    }
  };

  return (
    <Card 
      sx={{ 
        padding: 0,
        borderRadius: 3,
        overflow: "hidden",
        boxShadow: "0 5px 15px rgba(0, 0, 0, 0.08)",
        transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
        "&:hover": {
          boxShadow: "0 8px 25px rgba(79, 70, 229, 0.15)",
          transform: preview ? "translateY(-3px)" : "none"
        }
      }} 
      className="post-card"
    >
      <Box className={preview}>
        <HorizontalStack spacing={0} alignItems="initial">
          <Stack
            justifyContent="space-between"
            alignItems="center"
            spacing={1}
            sx={{
              background: `linear-gradient(to bottom, ${alpha(primaryColor, 0.1)}, ${alpha(accentColor, 0.05)})`,
              width: "60px",
              padding: theme.spacing(2, 1),
              borderRight: `1px solid ${alpha(primaryColor, 0.1)}`
            }}
          >
            <LikeBox
              likeCount={likeCount}
              liked={post.liked}
              onLike={handleLike}
            />
          </Stack>
          <PostContentBox clickable={preview} post={post} editing={editing}>
            <HorizontalStack justifyContent="space-between">
              <ContentDetails
                username={post.poster.username}
                createdAt={post.createdAt}
                edited={post.edited}
                preview={preview === "secondary"}
              />
              <Box>
                {user &&
                  (isAuthor || user.isAdmin) &&
                  preview !== "secondary" && (
                    <HorizontalStack>
                      <IconButton
                        disabled={loading}
                        size="small"
                        onClick={handleEditPost}
                        sx={{
                          color: primaryColor,
                          "&:hover": {
                            backgroundColor: alpha(primaryColor, 0.1),
                          }
                        }}
                      >
                        {editing ? (
                          <MdCancel />
                        ) : (
                          <AiFillEdit />
                        )}
                      </IconButton>
                      <IconButton
                        disabled={loading}
                        size="small"
                        onClick={handleDeletePost}
                        sx={{
                          color: dangerColor,
                          "&:hover": {
                            backgroundColor: alpha(dangerColor, 0.1),
                          }
                        }}
                      >
                        {confirm ? (
                          <AiFillCheckCircle />
                        ) : (
                          <BiTrash />
                        )}
                      </IconButton>
                    </HorizontalStack>
                  )}
              </Box>
            </HorizontalStack>

            <Typography
              variant="h5"
              gutterBottom
              sx={{ 
                overflow: "hidden", 
                mt: 1.5, 
                maxHeight: 125,
                fontWeight: 600,
                color: "#1e293b" // Slate 800
              }}
              className="title"
            >
              {post.title}
            </Typography>

            {preview !== "secondary" &&
              (editing ? (
                <ContentUpdateEditor
                  handleSubmit={handleSubmit}
                  originalContent={post.content}
                />
              ) : (
                <Box
                  maxHeight={maxHeight}
                  overflow="hidden"
                  className="content"
                  sx={{
                    color: "#475569", // Slate 600
                    lineHeight: 1.7
                  }}
                >
                  <Markdown content={post.content} />
                </Box>
              ))}

            <HorizontalStack 
              sx={{ 
                mt: 3,
                pt: 2,
                borderTop: `1px solid ${alpha(primaryColor, 0.1)}`
              }} 
              justifyContent="space-between"
            >
              <HorizontalStack>
                <AiFillMessage 
                  style={{ 
                    color: accentColor,
                    fontSize: "1.2rem"
                  }} 
                />
                <Typography
                  variant="subtitle2"
                  sx={{ 
                    fontWeight: "bold",
                    color: "#6b7280", // Gray 500
                    ml: 0.5
                  }}
                >
                  {post.commentCount}
                </Typography>
              </HorizontalStack>
              <Box>
                <UserLikePreview
                  postId={post._id}
                  userLikePreview={post.userLikePreview}
                />
              </Box>
            </HorizontalStack>
          </PostContentBox>
        </HorizontalStack>
      </Box>
    </Card>
  );
};

export default PostCard;