import { 
  Button, 
  Card, 
  Stack, 
  Typography, 
  useTheme, 
  alpha, 
  Paper,
  Fade
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getPosts, getUserLikedPosts } from "../api/posts";
import { isLoggedIn } from "../helpers/authHelper";
import CreatePost from "./CreatePost";
import Loading from "./Loading";
import PostCard from "./PostCard";
import SortBySelect from "./SortBySelect";
import HorizontalStack from "./util/HorizontalStack";

const PostBrowser = (props) => {
  const theme = useTheme();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [end, setEnd] = useState(false);
  const [sortBy, setSortBy] = useState("-createdAt");
  const [count, setCount] = useState(0);
  const user = isLoggedIn();
  
  // Custom colors for modern theme
  const primaryColor = "#6366f1"; // Indigo
  const secondaryColor = "#a855f7"; // Purple
  const accentColor = "#3b82f6"; // Blue
  const bgColor = "#f8fafc"; // Light background

  const [search] = useSearchParams();
  const [effect, setEffect] = useState(false);

  const searchExists =
    search && search.get("search") && search.get("search").length > 0;

  const fetchPosts = async () => {
    setLoading(true);
    const newPage = page + 1;
    setPage(newPage);

    let query = {
      page: newPage,
      sortBy,
    };

    let data;

    if (props.contentType === "posts") {
      if (props.profileUser) query.author = props.profileUser.username;
      if (searchExists) query.search = search.get("search");

      data = await getPosts(user && user.token, query);
    } else if (props.contentType === "liked") {
      data = await getUserLikedPosts(
        props.profileUser._id,
        user && user.token,
        query
      );
    }

    if (data.data.length < 10) {
      setEnd(true);
    }

    setLoading(false);
    if (!data.error) {
      setPosts([...posts, ...data.data]);
      setCount(data.count);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [sortBy, effect]);

  useEffect(() => {
    setPosts([]);
    setPage(0);
    setEnd(false);
    setEffect(!effect);
  }, [search]);

  const handleSortBy = (e) => {
    const newSortName = e.target.value;
    let newSortBy;

    Object.keys(sorts).forEach((sortName) => {
      if (sorts[sortName] === newSortName) newSortBy = sortName;
    });

    setPosts([]);
    setPage(0);
    setEnd(false);
    setSortBy(newSortBy);
  };

  const removePost = (removedPost) => {
    setPosts(posts.filter((post) => post._id !== removedPost._id));
  };

  const handleBackToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const contentTypeSorts = {
    posts: {
      "-createdAt": "Latest",
      "-likeCount": "Likes",
      "-commentCount": "Comments",
      createdAt: "Earliest",
    },
    liked: {
      "-createdAt": "Latest",
      createdAt: "Earliest",
    },
  };

  const sorts = contentTypeSorts[props.contentType];

  return (
    <Fade in={true} timeout={800}>
      <Stack spacing={2.5}>
        <Card 
          elevation={2}
          sx={{
            borderRadius: 2,
            overflow: "hidden",
            backgroundColor: bgColor,
            border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
          }}
        >
          <HorizontalStack 
            justifyContent="space-between" 
            sx={{ 
              p: 2,
              background: `linear-gradient(to right, ${alpha(primaryColor, 0.02)}, ${alpha(secondaryColor, 0.05)})` 
            }}
          >
            {props.createPost && <CreatePost primaryColor={primaryColor} secondaryColor={secondaryColor} />}
            <SortBySelect
              onSortBy={handleSortBy}
              sortBy={sortBy}
              sorts={sorts}
              sx={{
                "& .MuiSelect-select": {
                  color: primaryColor,
                  fontWeight: 500,
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: alpha(primaryColor, 0.2),
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: alpha(primaryColor, 0.5),
                },
              }}
            />
          </HorizontalStack>
        </Card>

        {searchExists && (
          <Box
            sx={{
              p: 2.5,
              borderRadius: 2,
              backgroundColor: alpha(accentColor, 0.05),
              border: `1px solid ${alpha(accentColor, 0.1)}`,
            }}
          >
            <Typography 
              variant="h5" 
              gutterBottom 
              sx={{ 
                fontWeight: 600,
                color: theme.palette.text.primary 
              }}
            >
              Showing results for "{search.get("search")}"
            </Typography>
            <Typography 
              color="text.secondary" 
              variant="body1" 
              sx={{ 
                display: "flex", 
                alignItems: "center" 
              }}
            >
              <Box 
                component="span" 
                sx={{ 
                  fontWeight: 600, 
                  color: primaryColor, 
                  mr: 1 
                }}
              >
                {count}
              </Box> 
              results found
            </Typography>
          </Box>
        )}

        {posts.map((post, i) => (
          <PostCard
            preview="primary"
            key={post._id}
            post={post}
            removePost={removePost}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
          />
        ))}

        {loading && (
          <Box sx={{ py: 4, display: "flex", justifyContent: "center" }}>
            <Loading color={primaryColor} />
          </Box>
        )}
        
        {end ? (
          <Paper
            elevation={0}
            sx={{
              py: 5,
              px: 3,
              mt: 2,
              borderRadius: 2,
              backgroundColor: alpha(theme.palette.background.paper, 0.7),
              backdropFilter: "blur(8px)",
              border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
            }}
          >
            <Stack alignItems="center">
              <Typography 
                variant="h5" 
                color="text.secondary" 
                gutterBottom 
                sx={{ fontWeight: 500 }}
              >
                {posts.length > 0 ? (
                  <>All posts have been viewed</>
                ) : (
                  <>No posts available</>
                )}
              </Typography>
              <Button 
                variant="outlined" 
                size="medium" 
                onClick={handleBackToTop}
                sx={{
                  mt: 1.5,
                  color: primaryColor,
                  borderColor: alpha(primaryColor, 0.3),
                  "&:hover": {
                    borderColor: primaryColor,
                    backgroundColor: alpha(primaryColor, 0.05),
                  },
                  borderRadius: "10px",
                  textTransform: "none",
                  fontWeight: 500,
                }}
              >
                Back to top
              </Button>
            </Stack>
          </Paper>
        ) : (
          !loading &&
          posts &&
          posts.length > 0 && (
            <Stack pt={2} pb={6} alignItems="center" spacing={2}>
              <Button 
                onClick={fetchPosts} 
                variant="contained"
                sx={{
                  px: 4,
                  py: 1,
                  backgroundColor: primaryColor,
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: alpha(primaryColor, 0.9),
                  },
                  borderRadius: "12px",
                  boxShadow: `0 4px 14px ${alpha(primaryColor, 0.3)}`,
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "1rem",
                }}
              >
                Load more
              </Button>
              <Button 
                variant="text" 
                size="small" 
                onClick={handleBackToTop}
                sx={{
                  color: alpha(theme.palette.text.primary, 0.7),
                  "&:hover": {
                    color: primaryColor,
                    backgroundColor: "transparent",
                  },
                  textTransform: "none",
                }}
              >
                Back to top
              </Button>
            </Stack>
          )
        )}
      </Stack>
    </Fade>
  );
};

export default PostBrowser;