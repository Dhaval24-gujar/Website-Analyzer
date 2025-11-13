import React, { useState } from "react";
import { Container, Box, Typography, CircularProgress } from "@mui/material";
import URLInput from "./components/URLInput";
import ResultsTabs from "./components/ResultsTabs";
import { analyzeWebsites, getAnalysisStatus } from "./services/api";
import "./App.css";

const App = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [total, setTotal] = useState(0);

  const handleAnalyze = async (urls, options) => {
    setLoading(true);
    setResults([]);
    setProgress(0);

    try {
      const { task_id } = await analyzeWebsites(urls, options);
      const poll = setInterval(async () => {
        const status = await getAnalysisStatus(task_id);
        setProgress(status.progress);
        setTotal(status.total);

        if (status.status === "completed") {
          clearInterval(poll);
          setResults(status.results);
          setLoading(false);
        }
      }, 1000);
    } catch (err) {
      console.error("Error:", err);
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <Container maxWidth="xl">
        <Box sx={{ my: 6 }}>
          {/* Header Section */}
          <Box sx={{
            textAlign: 'center',
            mb: 6,
            animation: 'fadeIn 0.8s ease-in-out'
          }}>
            <Typography
              variant="h3"
              component="h1"
              align="center"
              gutterBottom
              sx={{
                fontWeight: 800,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                mb: 2,
                color: '#ffffff',
                textShadow: '0 4px 20px rgba(255, 255, 255, 0.1)',
              }}
            >
              🚀 Advanced Website Performance Analyzer
            </Typography>
            <Typography
              align="center"
              sx={{
                mb: 4,
                fontSize: { xs: '1rem', sm: '1.1rem' },
                color: 'rgba(255, 255, 255, 0.7)',
                fontWeight: 400,
                maxWidth: '700px',
                margin: '0 auto',
                lineHeight: 1.6,
              }}
            >
              Comprehensive network, security, and performance analysis for websites
            </Typography>
          </Box>

          <URLInput onAnalyze={handleAnalyze} loading={loading} />

          {loading && (
            <Box
              className="loading-pulse"
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                my: 6,
                p: 4,
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <CircularProgress
                size={60}
                thickness={4}
                sx={{
                  color: '#ffffff',
                  mb: 3,
                }}
              />
              <Typography
                sx={{
                  fontSize: '1.2rem',
                  fontWeight: 600,
                  color: '#e5e5e5',
                  mb: 1,
                }}
              >
                Analyzing {progress}/{total} sites...
              </Typography>
              <Typography
                sx={{
                  fontSize: '0.9rem',
                  color: 'rgba(255, 255, 255, 0.6)',
                }}
              >
                This may take a few moments
              </Typography>
            </Box>
          )}

          {results.length > 0 && <ResultsTabs results={results} />}
        </Box>
      </Container>
    </div>
  );
};

export default App;
