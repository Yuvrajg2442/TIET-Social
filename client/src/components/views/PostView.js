import { Container, Stack, Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import GoBack from "../GoBack";
import GridLayout from "../GridLayout";
import Loading from "../Loading";
import Navbar from "../Navbar";
import PostCard from "../PostCard";
import Sidebar from "../Sidebar";
import { useParams } from "react-router-dom";
import { getPost } from "../../api/posts";
import Comments from "../Comments";
import ErrorAlert from "../ErrorAlert";
import { isLoggedIn } from "../../helpers/authHelper";

const PostView = () => {
 const params = useParams();

 const [post, setPost] = useState(null);
 const [error, setError] = useState("");
 const [loading, setLoading] = useState(true);
 const user = isLoggedIn();

 // Custom theme colors
 const purpleColor = "#a239ca";
 const pinkColor = "#e91e63";

 const fetchPost = async () => {
   setLoading(true);
   const data = await getPost(params.id, user && user.token);
   if (data.error) {
     setError(data.error);
   } else {
     setPost(data);
   }
   setLoading(false);
 };

 useEffect(() => {
   fetchPost();
 }, [params.id]);

 return (
   <Box sx={{ 
     background: 'linear-gradient(135deg, rgba(162, 57, 202, 0.02) 0%, rgba(233, 30, 99, 0.02) 100%)',
     minHeight: '100vh',
     pb: 4
   }}>
     <Navbar />
     <Container maxWidth="lg" sx={{ pt: 2 }}>
       <Box sx={{ mb: 2 }}>
         <GoBack />
       </Box>
       {!loading && post && (
         <Typography 
           variant="h5" 
           component="h1" 
           sx={{ 
             mb: 3, 
             fontWeight: 600,
             color: purpleColor,
             letterSpacing: '0.3px'
           }}
         >
           Discussion
         </Typography>
       )}
       <GridLayout
         left={
           loading ? (
             <Loading />
           ) : post ? (
             <Stack spacing={3}>
               <PostCard post={post} key={post._id} />
               <Box sx={{ 
                 position: 'relative',
                 '&:before': {
                   content: '""',
                   position: 'absolute',
                   left: '50%',
                   transform: 'translateX(-50%)',
                   top: -16,
                   width: '30%',
                   height: '2px',
                   background: `linear-gradient(90deg, ${purpleColor} 0%, ${pinkColor} 100%)`,
                   borderRadius: '1px'
                 }
               }}>
                 <Comments />
               </Box>
             </Stack>
           ) : (
             error && <ErrorAlert error={error} />
           )
         }
         right={<Sidebar />}
       />
     </Container>
   </Box>
 );
};

export default PostView;