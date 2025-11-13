import React from "react";
import Plot from "react-plotly.js";
import { Typography, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

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

      {/* SSL breakdowns */}
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
        🔍 Detailed SSL Breakdown
      </Typography>
      {results.map((r, i) =>
        r.ssl_score_breakdown ? (
          <Accordion key={i}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography sx={{ fontWeight: 600 }}>
                {r.url} — Score: <span style={{ color: '#ffffff', fontWeight: 700 }}>{r.ssl_score}/100</span>
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {Object.entries(r.ssl_score_breakdown).map(([k, v]) => (
                <Typography key={k} sx={{ mb: 1, color: 'rgba(255, 255, 255, 0.8)' }}>
                  • <strong>{k}:</strong> {v}
                </Typography>
              ))}
            </AccordionDetails>
          </Accordion>
        ) : null
      )}

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
    </div>
  );
};

export default Security;
