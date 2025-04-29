import { useTheme } from "@emotion/react";
import {
  IconButton,
  Stack,
  TextField,
  Typography,
  Button,
  AppBar,
  Toolbar,
  InputAdornment,
  Menu,
  MenuItem,
  Drawer,
  Divider,
  alpha,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import {
  AiFillHome,
  AiFillMessage,
  AiOutlineSearch,
  AiOutlineUser,
  AiOutlineLogout,
  AiOutlineMenu,
} from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { isLoggedIn, logoutUser } from "../helpers/authHelper";
import UserAvatar from "./UserAvatar";
import HorizontalStack from "./util/HorizontalStack";
import logo from "../logo tiet.png";


const Navbar = () => {
  const navigate = useNavigate();
  const user = isLoggedIn();
  const theme = useTheme();
  const username = user && isLoggedIn().username;
  const [search, setSearch] = useState("");
  const [width, setWindowWidth] = useState(window.innerWidth);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  
  // Custom theme colors to match the login page
  const purpleColor = "#a239ca";
  const pinkColor = "#e91e63";
  
  useEffect(() => {
    const updateDimensions = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const mobile = width < 500;
  const navbarWidth = width < 600;

  const handleLogout = async () => {
    logoutUser();
    navigate("/login");
    handleCloseMenu();
  };

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/search?" + new URLSearchParams({ search }));
  };
  
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  
  const menuOpen = Boolean(anchorEl);

  // Gradient styles
  const gradientBackground = {
    background: `linear-gradient(90deg, ${purpleColor} 0%, ${pinkColor} 100%)`,
  };

  const drawer = (
    <Box sx={{ width: 250, p: 2 }}>
      

      <Typography variant="h6" sx={{ mb: 2, color: purpleColor, fontWeight: 600 }}>
        TIET Social
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Stack spacing={2}>
        <Button 
          component={Link} 
          to="/" 
          startIcon={<AiFillHome />} 
          fullWidth 
          sx={{ justifyContent: "flex-start", color: purpleColor }}
        >
          Home
        </Button>
        {user && (
          <>
            <Button 
              component={Link} 
              to="/messenger" 
              startIcon={<AiFillMessage />} 
              fullWidth 
              sx={{ justifyContent: "flex-start", color: purpleColor }}
            >
              Messages
            </Button>
            <Button 
              component={Link} 
              to={"/users/" + username} 
              startIcon={<AiOutlineUser />} 
              fullWidth 
              sx={{ justifyContent: "flex-start", color: purpleColor }}
            >
              Profile
            </Button>
            <Button 
              onClick={handleLogout} 
              startIcon={<AiOutlineLogout />} 
              fullWidth 
              sx={{ justifyContent: "flex-start", color: purpleColor }}
            >
              Logout
            </Button>
          </>
        )}
        {!user && (
          <>
            <Button 
              component={Link} 
              to="/signup" 
              variant="contained" 
              fullWidth
              sx={{ 
                ...gradientBackground,
                borderRadius: 28,
                textTransform: 'none',
                boxShadow: 'none',
                '&:hover': {
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                }
              }}
            >
              Sign Up
            </Button>
            <Button 
              component={Link} 
              to="/login" 
              variant="outlined" 
              fullWidth
              sx={{
                borderColor: purpleColor,
                color: purpleColor,
                borderRadius: 28,
                textTransform: 'none',
                '&:hover': {
                  borderColor: pinkColor,
                  backgroundColor: alpha(pinkColor, 0.04)
                }
              }}
            >
              Login
            </Button>
          </>
        )}
      </Stack>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={0} 
        sx={{ 
          backgroundColor: 'white',
          borderBottom: '1px solid rgba(0, 0, 0, 0.05)'
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* Logo and Brand */}
          <HorizontalStack spacing={1} alignItems="center">
            {mobile && (
              <IconButton
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 1, color: purpleColor }}
              >
                <AiOutlineMenu />
              </IconButton>
            )}
            <img src={logo} alt="logo" width={mobile ? 20 : 35} style={{ marginRight: 8 }} />
            {!mobile && (
              <Typography
                variant="h6"
                component={Link}
                to="/"
                sx={{
                  textDecoration: 'none',
                  background: `linear-gradient(90deg, ${purpleColor} 0%, ${pinkColor} 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 700,
                  letterSpacing: 0.5,
                }}
              >
                TIET Social
              </Typography>
            )}
          </HorizontalStack>

          {/* Search */}
          {!navbarWidth && (
            <Box 
              component="form" 
              onSubmit={handleSubmit} 
              sx={{ 
                width: '100%', 
                maxWidth: 400, 
                mx: 2,
                display: 'flex',
                justifyContent: 'center'
              }}
            >
              <TextField
                size="small"
                placeholder="Search for posts..."
                fullWidth
                onChange={handleChange}
                value={search}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AiOutlineSearch style={{ color: purpleColor }} />
                    </InputAdornment>
                  ),
                  sx: { 
                    borderRadius: 28,
                    '& fieldset': {
                      borderColor: alpha(purpleColor, 0.2),
                    },
                    '&:hover fieldset': {
                      borderColor: alpha(purpleColor, 0.4),
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: purpleColor,
                    }
                  }
                }}
              />
            </Box>
          )}

          {/* Actions */}
          <HorizontalStack spacing={1}>
            {mobile && (
              <IconButton color="primary" onClick={handleSubmit} sx={{ color: purpleColor }}>
                <AiOutlineSearch />
              </IconButton>
            )}

            {!mobile && (
              <IconButton 
                component={Link} 
                to="/" 
                sx={{ 
                  color: purpleColor,
                  transition: 'all 0.2s',
                  '&:hover': { transform: 'scale(1.1)' } 
                }}
              >
                <AiFillHome />
              </IconButton>
            )}

            {user ? (
              <>
                {!mobile && (
                  <IconButton 
                    component={Link} 
                    to="/messenger" 
                    sx={{ 
                      color: purpleColor,
                      transition: 'all 0.2s',
                      '&:hover': { transform: 'scale(1.1)' } 
                    }}
                  >
                    <AiFillMessage />
                  </IconButton>
                )}
                <IconButton 
                  onClick={handleMenuOpen}
                  sx={{ 
                    transition: 'all 0.2s',
                    '&:hover': { transform: 'scale(1.1)' },
                    border: `2px solid ${purpleColor}`,
                    p: 0.2
                  }}
                >
                  <UserAvatar width={28} height={28} username={user.username} />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={menuOpen}
                  onClose={handleCloseMenu}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  PaperProps={{
                    sx: {
                      mt: 1.5,
                      boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                      borderRadius: 2
                    }
                  }}
                >
                  <MenuItem 
                    component={Link} 
                    to={"/users/" + username}
                    onClick={handleCloseMenu}
                    sx={{ color: purpleColor }}
                  >
                    <AiOutlineUser style={{ marginRight: 8 }} /> Profile
                  </MenuItem>
                  <MenuItem onClick={handleLogout} sx={{ color: pinkColor }}>
                    <AiOutlineLogout style={{ marginRight: 8 }} /> Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              !mobile && (
                <>
                  <Button 
                    variant="outlined" 
                    component={Link} 
                    to="/login"
                    sx={{ 
                      borderRadius: 28,
                      textTransform: 'none',
                      borderColor: purpleColor,
                      color: purpleColor,
                      px: 3,
                      '&:hover': {
                        borderColor: pinkColor,
                        backgroundColor: alpha(pinkColor, 0.04)
                      }
                    }}
                  >
                    Login
                  </Button>
                  <Button 
                    variant="contained" 
                    component={Link} 
                    to="/signup"
                    sx={{ 
                      borderRadius: 28,
                      textTransform: 'none',
                      boxShadow: 'none',
                      px: 3,
                      ...gradientBackground,
                      '&:hover': {
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                        ...gradientBackground
                      }
                    }}
                  >
                    Sign Up
                  </Button>
                </>
              )
            )}
          </HorizontalStack>
        </Toolbar>
        
        {/* Mobile Search */}
        {navbarWidth && (
          <Box component="form" onSubmit={handleSubmit} sx={{ p: 1.5 }}>
            <TextField
              size="small"
              placeholder="Search for posts..."
              fullWidth
              onChange={handleChange}
              value={search}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AiOutlineSearch style={{ color: purpleColor }} />
                  </InputAdornment>
                ),
                sx: { 
                  borderRadius: 28,
                  '& fieldset': {
                    borderColor: alpha(purpleColor, 0.2),
                  },
                  '&:hover fieldset': {
                    borderColor: alpha(purpleColor, 0.4),
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: purpleColor,
                  }
                }
              }}
            />
          </Box>
        )}
      </AppBar>
      
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar;