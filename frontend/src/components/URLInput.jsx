import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Paper,
  Slider,
  Typography,
} from "@mui/material";

const URLInput = ({ onAnalyze, loading }) => {
  const [urls, setUrls] = useState(
    "https://www.google.com\nhttps://github.com\nhttps://stackoverflow.com"
  );
  const [fetchResources, setFetchResources] = useState(true);
  const [resourceLimit, setResourceLimit] = useState(10);
  const [checkAdvanced, setCheckAdvanced] = useState(true);

  const handleSubmit = () => {
    const urlList = urls.split("\n").filter((u) => u.trim());
    onAnalyze(urlList, { fetchResources, resourceLimit, checkAdvanced });
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 4,
        mb: 4,
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 40px rgba(255, 255, 255, 0.1)',
        }
      }}
    >
      <Typography
        variant="h6"
        sx={{
          mb: 3,
          fontWeight: 700,
          color: '#ffffff',
        }}
      >
        🎯 Configure Analysis
      </Typography>

      <TextField
        fullWidth
        multiline
        rows={4}
        label="Enter URLs (one per line)"
        value={urls}
        onChange={(e) => setUrls(e.target.value)}
        disabled={loading}
        sx={{
          mb: 3,
          '& .MuiOutlinedInput-root': {
            fontSize: '15px',
          }
        }}
      />

      <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={fetchResources}
              onChange={(e) => setFetchResources(e.target.checked)}
              disabled={loading}
            />
          }
          label="Analyze Resources (images/scripts/css)"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={checkAdvanced}
              onChange={(e) => setCheckAdvanced(e.target.checked)}
              disabled={loading}
            />
          }
          label="Advanced Network Features"
        />
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography
          gutterBottom
          sx={{
            fontWeight: 600,
            color: 'rgba(255, 255, 255, 0.9)',
            mb: 2
          }}
        >
          Resource Limit: <span style={{
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '18px'
          }}>{resourceLimit}</span>
        </Typography>
        <Slider
          value={resourceLimit}
          min={5}
          max={30}
          onChange={(e, val) => setResourceLimit(val)}
          disabled={loading}
          marks={[
            { value: 5, label: '5' },
            { value: 15, label: '15' },
            { value: 30, label: '30' }
          ]}
          sx={{
            '& .MuiSlider-markLabel': {
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: '12px',
            }
          }}
        />
      </Box>

      <Button
        variant="contained"
        size="large"
        fullWidth
        disabled={loading}
        onClick={handleSubmit}
        sx={{
          py: 1.5,
          fontSize: '16px',
          fontWeight: 700,
          textTransform: 'none',
          background: loading
            ? 'rgba(255, 255, 255, 0.1)'
            : '#1a1a1a',
          color: '#ffffff',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          '&:hover': {
            background: '#2a2a2a',
            border: '1px solid rgba(255, 255, 255, 0.3)',
          },
          '&:disabled': {
            background: 'rgba(255, 255, 255, 0.05)',
            color: 'rgba(255, 255, 255, 0.5)',
          }
        }}
      >
        {loading ? '⏳ Analyzing...' : '🔍 Analyze Websites'}
      </Button>
    </Paper>
  );
};

export default URLInput;
