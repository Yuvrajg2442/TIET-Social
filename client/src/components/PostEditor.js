import {
  Button,
  Card,
  Stack,
  TextField,
  Typography,
  Box,
  alpha
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../api/posts";
import ErrorAlert from "./ErrorAlert";
import { isLoggedIn } from "../helpers/authHelper";
import HorizontalStack from "./util/HorizontalStack";
import UserAvatar from "./UserAvatar";

const PostEditor = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  const [serverError, setServerError] = useState("");
  const [errors, setErrors] = useState({});
  const user = isLoggedIn();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    const errors = validate();
    setErrors(errors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    const data = await createPost(formData, isLoggedIn());
    setLoading(false);
    if (data && data.error) {
      setServerError(data.error);
    } else {
      navigate("/posts/" + data._id);
    }
  };

  const validate = () => {
    const errors = {};
    return errors;
  };

  return (
    <Card 
      sx={{
        borderRadius: 3,
        boxShadow: '0 8px 24px rgba(149, 38, 179, 0.12)',
        padding: 4,
        background: 'rgba(255, 255, 255, 0.95)',
      }}
    >
      <Stack spacing={2}>
        {user && (
          <HorizontalStack spacing={2} sx={{ mb: 1 }}>
            <UserAvatar width={56} height={56} username={user.username} />
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 600,
                background: 'linear-gradient(90deg, #9333ea 0%, #e11d48 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              What would you like to post today {user.username}?
            </Typography>
          </HorizontalStack>
        )}

        <Typography 
          variant="body2" 
          sx={{ 
            mb: 1,
            '& a': {
              color: '#9333ea',
              textDecoration: 'none',
              fontWeight: 500,
              '&:hover': {
                textDecoration: 'underline'
              }
            }
          }}
        >
          <a href="https://commonmark.org/help/" target="_blank" rel="noreferrer">
            Markdown Help
          </a>
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Title"
            required
            name="title"
            margin="normal"
            onChange={handleChange}
            error={errors.title !== undefined}
            helperText={errors.title}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#9333ea',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#9333ea',
                  borderWidth: 2,
                },
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#9333ea',
              },
            }}
            InputProps={{
              sx: { borderRadius: 2 }
            }}
          />
          <TextField
            fullWidth
            label="Content"
            multiline
            rows={10}
            name="content"
            margin="normal"
            onChange={handleChange}
            error={errors.content !== undefined}
            helperText={errors.content}
            required
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#9333ea',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#9333ea',
                  borderWidth: 2,
                },
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#9333ea',
              },
            }}
            InputProps={{
              sx: { borderRadius: 2 }
            }}
          />
          <ErrorAlert error={serverError} />
          <Button
            variant="contained"
            type="submit"
            fullWidth
            disabled={loading}
            sx={{
              mt: 3,
              py: 1.5,
              borderRadius: 6,
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 600,
              background: 'linear-gradient(90deg, #9333ea 0%, #e11d48 100%)',
              '&:hover': {
                background: 'linear-gradient(90deg, #8325d5 0%, #d31a42 100%)',
                boxShadow: '0 4px 12px rgba(149, 38, 179, 0.25)',
              },
              '&:disabled': {
                background: alpha('#9333ea', 0.4),
              }
            }}
          >
            {loading ? "Submitting..." : "Submit Post"}
          </Button>
        </Box>
      </Stack>
    </Card>
  );
};

export default PostEditor;