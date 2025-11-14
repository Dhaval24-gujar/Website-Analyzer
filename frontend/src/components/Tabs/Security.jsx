import React from "react";
import Plot from "react-plotly.js";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Box
} from "@mui/material";

const Security = ({ results }) => {
  if (!results?.length) return <p>No data available.</p>;

  const urls = results.map((r) => r.url);

  return (
    <div className="results-container">
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          fontWeight: 700,
          mb: 4,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        🔒 Security Analysis
      </Typography>

      {/* SSL Scores */}
      <div id="security-chart">
        <Typography
          variant="h6"
          sx={{
            mt: 2,
            mb: 3,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          SSL/TLS Security Scores
        </Typography>
        <Plot
        data={[
          {
            x: urls,
            y: results.map((r) => r.ssl_score || 0),
            type: "bar",
            marker: {
              color: results.map((r) => (r.ssl_score >= 80 ? "#10b981" : r.ssl_score >= 60 ? "#f59e0b" : "#ef4444")),
              line: {
                color: 'rgba(255, 255, 255, 0.2)',
                width: 1
              }
            },
          },
        ]}
        layout={{
          title: {
            text: "SSL Security Scores (0–100)",
            font: { color: '#e5e5e5', size: 16, family: 'Inter' }
          },
          xaxis: {
            title: "Website",
            color: '#cccccc',
            gridcolor: 'rgba(255, 255, 255, 0.1)',
          },
          yaxis: {
            title: "Score",
            color: '#cccccc',
            gridcolor: 'rgba(255, 255, 255, 0.1)',
            range: [0, 105],
          },
          height: 350,
          paper_bgcolor: 'rgba(255, 255, 255, 0.03)',
          plot_bgcolor: 'rgba(0, 0, 0, 0.2)',
          font: { color: '#cccccc', family: 'Inter' },
        }}
        style={{ width: "100%" }}
        config={{ displayModeBar: false }}
      />
      </div>

      {/* SSL Score Breakdown Table */}
      <Typography
        variant="h6"
        sx={{
          mt: 5,
          mb: 3,
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        🔍 SSL Score Breakdown
      </Typography>
      <TableContainer
        component={Paper}
        sx={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          overflow: 'hidden',
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ background: 'rgba(255, 255, 255, 0.08)' }}>
              <TableCell sx={{ color: '#e5e5e5', fontWeight: 700, fontSize: '14px' }}>Website</TableCell>
              <TableCell align="center" sx={{ color: '#e5e5e5', fontWeight: 700, fontSize: '14px' }}>Total Score</TableCell>
              <TableCell align="center" sx={{ color: '#e5e5e5', fontWeight: 700, fontSize: '14px' }}>Valid Certificate</TableCell>
              <TableCell align="center" sx={{ color: '#e5e5e5', fontWeight: 700, fontSize: '14px' }}>Certificate Expiry</TableCell>
              <TableCell align="center" sx={{ color: '#e5e5e5', fontWeight: 700, fontSize: '14px' }}>TLS Version</TableCell>
              <TableCell align="center" sx={{ color: '#e5e5e5', fontWeight: 700, fontSize: '14px' }}>Cipher Strength</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {results.map((r, i) => {
              const breakdown = r.ssl_score_breakdown || {};
              const totalScore = r.ssl_score || 0;

              // Extract individual scores
              const validCert = breakdown["Valid Certificate"] || 0;
              const certExpiry = Object.entries(breakdown).find(([k]) => k.includes("Certificate Expiry"))?.[1] || 0;
              const tlsVersion = Object.entries(breakdown).find(([k]) => k.includes("TLS Version"))?.[1] || 0;
              const cipherStrength = Object.entries(breakdown).find(([k]) => k.includes("Cipher Strength"))?.[1] || 0;

              // Get score color
              const getScoreColor = (score, max) => {
                const percentage = (score / max) * 100;
                if (percentage >= 80) return '#10b981';
                if (percentage >= 60) return '#f59e0b';
                return '#ef4444';
              };

              return (
                <TableRow
                  key={i}
                  sx={{
                    '&:hover': { background: 'rgba(255, 255, 255, 0.05)' },
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                  }}
                >
                  <TableCell sx={{ color: '#cccccc', fontSize: '13px', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {r.url.replace('https://', '').replace('http://', '').replace('www.', '')}
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={`${totalScore}/100`}
                      sx={{
                        background: getScoreColor(totalScore, 100),
                        color: '#ffffff',
                        fontWeight: 700,
                        fontSize: '13px',
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={`${validCert}/40`}
                      size="small"
                      sx={{
                        background: getScoreColor(validCert, 40),
                        color: '#ffffff',
                        fontWeight: 600,
                        fontSize: '12px',
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={`${certExpiry}/30`}
                      size="small"
                      sx={{
                        background: getScoreColor(certExpiry, 30),
                        color: '#ffffff',
                        fontWeight: 600,
                        fontSize: '12px',
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={`${tlsVersion}/20`}
                      size="small"
                      sx={{
                        background: getScoreColor(tlsVersion, 20),
                        color: '#ffffff',
                        fontWeight: 600,
                        fontSize: '12px',
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={`${cipherStrength}/10`}
                      size="small"
                      sx={{
                        background: getScoreColor(cipherStrength, 10),
                        color: '#ffffff',
                        fontWeight: 600,
                        fontSize: '12px',
                      }}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Security Headers */}
      <Typography
        variant="h6"
        sx={{
          mt: 5,
          mb: 3,
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        🛡️ Security Headers Scores
      </Typography>
      <Plot
        data={[
          {
            x: urls,
            y: results.map((r) => r.security_headers_score || 0),
            type: "bar",
            marker: {
              color: results.map((v) => (v.security_headers_score >= 70 ? "#10b981" : "#f59e0b")),
              line: {
                color: 'rgba(255, 255, 255, 0.2)',
                width: 1
              }
            },
          },
        ]}
        layout={{
          title: {
            text: "Security Headers (0–100)",
            font: { color: '#e5e5e5', size: 16, family: 'Inter' }
          },
          xaxis: {
            title: "Website",
            color: '#cccccc',
            gridcolor: 'rgba(255, 255, 255, 0.1)',
          },
          yaxis: {
            title: "Score",
            color: '#cccccc',
            gridcolor: 'rgba(255, 255, 255, 0.1)',
          },
          height: 350,
          paper_bgcolor: 'rgba(255, 255, 255, 0.03)',
          plot_bgcolor: 'rgba(0, 0, 0, 0.2)',
          font: { color: '#cccccc', family: 'Inter' },
        }}
        style={{ width: "100%" }}
        config={{ displayModeBar: false }}
      />

      {/* Security Headers Breakdown Table */}
      <Typography
        variant="h6"
        sx={{
          mt: 5,
          mb: 3,
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        🛡️ Security Headers Breakdown
      </Typography>
      <TableContainer
        component={Paper}
        sx={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          overflow: 'hidden',
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ background: 'rgba(255, 255, 255, 0.08)' }}>
              <TableCell sx={{ color: '#e5e5e5', fontWeight: 700, fontSize: '14px' }}>Website</TableCell>
              <TableCell align="center" sx={{ color: '#e5e5e5', fontWeight: 700, fontSize: '14px' }}>Total Score</TableCell>
              <TableCell sx={{ color: '#e5e5e5', fontWeight: 700, fontSize: '14px' }}>Present Headers</TableCell>
              <TableCell sx={{ color: '#e5e5e5', fontWeight: 700, fontSize: '14px' }}>Missing Headers</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {results.map((r, i) => {
              const presentHeaders = r.security_headers_present || {};
              const missingHeaders = r.security_headers_missing || [];
              const totalScore = r.security_headers_score || 0;

              const getScoreColor = (score) => {
                if (score >= 70) return '#10b981';
                if (score >= 50) return '#f59e0b';
                return '#ef4444';
              };

              return (
                <TableRow
                  key={i}
                  sx={{
                    '&:hover': { background: 'rgba(255, 255, 255, 0.05)' },
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                  }}
                >
                  <TableCell sx={{ color: '#cccccc', fontSize: '13px', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {r.url.replace('https://', '').replace('http://', '').replace('www.', '')}
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={`${totalScore}/100`}
                      sx={{
                        background: getScoreColor(totalScore),
                        color: '#ffffff',
                        fontWeight: 700,
                        fontSize: '13px',
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {Object.keys(presentHeaders).length > 0 ? (
                        Object.keys(presentHeaders).map((header, idx) => (
                          <Chip
                            key={idx}
                            label={header}
                            size="small"
                            sx={{
                              background: '#10b981',
                              color: '#ffffff',
                              fontSize: '11px',
                              height: '24px',
                            }}
                          />
                        ))
                      ) : (
                        <Typography sx={{ color: '#999999', fontSize: '12px', fontStyle: 'italic' }}>
                          None
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {missingHeaders.length > 0 ? (
                        missingHeaders.map((header, idx) => (
                          <Chip
                            key={idx}
                            label={header}
                            size="small"
                            sx={{
                              background: '#ef4444',
                              color: '#ffffff',
                              fontSize: '11px',
                              height: '24px',
                            }}
                          />
                        ))
                      ) : (
                        <Typography sx={{ color: '#10b981', fontSize: '12px', fontStyle: 'italic' }}>
                          All present!
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Security;
