import React, { useState } from "react";
import { 
  Box, 
  Button, 
  Typography, 
  Stack, 
  LinearProgress, 
  IconButton,
  Card,
  alpha
} from "@mui/material";
import { AiOutlineUpload, AiOutlineFile, AiOutlineDelete, AiOutlineCheckCircle } from "react-icons/ai";
import { BsCardImage } from "react-icons/bs";
import { uploadFile } from "../api/uploads"; // You'll need to create this API function
import { isLoggedIn } from "../helpers/authHelper";

const UploadManager = ({ onFileUploaded }) => {
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const user = isLoggedIn();

  // Custom theme colors to match your project
  const purpleColor = "#9333ea";
  const pinkColor = "#e11d48";

  const handleDocumentUpload = () => {
    document.getElementById("document-input").click();
  };

  const handleImageUpload = () => {
    document.getElementById("image-input").click();
  };

  const handleFileSelection = async (e, fileType) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setLoading(true);
    setError("");
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileType', fileType);
      
      const data = await uploadFile(formData, user?.token);
      
      if (data.error) {
        setError(data.error);
      } else {
        // Add to uploads list
        const newUpload = {
          id: data._id || Date.now(),
          filename: data.originalName,
          fileType: fileType,
          url: data.url,
          size: formatFileSize(file.size)
        };
        
        setUploads([...uploads, newUpload]);
        
        // Notify parent component
        if (onFileUploaded) {
          onFileUploaded(newUpload);
        }
      }
    } catch (err) {
      setError("Failed to upload file. Please try again.");
      console.error("Upload error:", err);
    } finally {
      setLoading(false);
      // Reset the file input
      e.target.value = "";
    }
  };

  const removeUpload = (id) => {
    const updatedUploads = uploads.filter(upload => upload.id !== id);
    setUploads(updatedUploads);
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
    else return (bytes / 1048576).toFixed(2) + ' MB';
  };

  return (
    <Card 
      sx={{
        borderRadius: 3,
        padding: 3,
        boxShadow: '0 4px 16px rgba(149, 38, 179, 0.1)',
        background: 'rgba(255, 255, 255, 0.95)',
        mb: 2
      }}
    >
      <Stack spacing={2}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 600,
            color: purpleColor,
            mb: 1
          }}
        >
          Attachments
        </Typography>

        <Stack 
          direction="row" 
          spacing={2}
          sx={{ mb: 2 }}
        >
          <Button
            variant="outlined"
            onClick={handleDocumentUpload}
            startIcon={<AiOutlineFile />}
            disabled={loading}
            sx={{
              borderRadius: 2,
              py: 1,
              px: 2,
              textTransform: 'none',
              borderColor: purpleColor,
              color: purpleColor,
              '&:hover': {
                borderColor: purpleColor,
                backgroundColor: alpha(purpleColor, 0.1),
              }
            }}
          >
            Upload Document
          </Button>
          
          <Button
            variant="outlined"
            onClick={handleImageUpload}
            startIcon={<BsCardImage />}
            disabled={loading}
            sx={{
              borderRadius: 2,
              py: 1,
              px: 2,
              textTransform: 'none',
              borderColor: pinkColor,
              color: pinkColor,
              '&:hover': {
                borderColor: pinkColor,
                backgroundColor: alpha(pinkColor, 0.1),
              }
            }}
          >
            Upload Image
          </Button>

          <input
            type="file"
            id="document-input"
            style={{ display: 'none' }}
            accept=".pdf,.doc,.docx,.txt"
            onChange={(e) => handleFileSelection(e, 'document')}
          />
          
          <input
            type="file"
            id="image-input"
            style={{ display: 'none' }}
            accept="image/*"
            onChange={(e) => handleFileSelection(e, 'image')}
          />
        </Stack>

        {loading && (
          <Box sx={{ width: '100%', mb: 2 }}>
            <LinearProgress 
              sx={{ 
                height: 6, 
                borderRadius: 3,
                backgroundColor: alpha(purpleColor, 0.2),
                '& .MuiLinearProgress-bar': {
                  backgroundColor: purpleColor
                }
              }} 
            />
          </Box>
        )}

        {error && (
          <Typography 
            color="error" 
            variant="body2" 
            sx={{ mb: 2 }}
          >
            {error}
          </Typography>
        )}

        {uploads.length > 0 && (
          <Box 
            sx={{ 
              mt: 1, 
              p: 2, 
              border: `1px solid ${alpha(purpleColor, 0.2)}`,
              borderRadius: 2,
              backgroundColor: alpha(purpleColor, 0.05)
            }}
          >
            <Typography 
              variant="subtitle2" 
              sx={{ 
                mb: 1,
                fontWeight: 600,
                color: purpleColor
              }}
            >
              Uploaded Files
            </Typography>
            
            <Stack spacing={1}>
              {uploads.map((upload) => (
                <Box 
                  key={upload.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 1.5,
                    borderRadius: 2,
                    backgroundColor: 'white',
                    border: `1px solid ${alpha(purpleColor, 0.1)}`,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {upload.fileType === 'image' ? (
                      <BsCardImage size={20} style={{ color: pinkColor, marginRight: 10 }} />
                    ) : (
                      <AiOutlineFile size={20} style={{ color: purpleColor, marginRight: 10 }} />
                    )}
                    <Stack>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {upload.filename}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {upload.fileType} • {upload.size}
                      </Typography>
                    </Stack>
                  </Box>
                  <Box>
                    <IconButton 
                      size="small"
                      onClick={() => removeUpload(upload.id)}
                      sx={{ 
                        color: '#ef4444',
                        '&:hover': {
                          backgroundColor: alpha('#ef4444', 0.1)
                        }
                      }}
                    >
                      <AiOutlineDelete />
                    </IconButton>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Box>
        )}
      </Stack>
    </Card>
  );
};

export default UploadManager;