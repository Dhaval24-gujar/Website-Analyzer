import React from "react";
import Plot from "react-plotly.js";
import { Card, CardContent, Typography, Grid, Box } from "@mui/material";

const Overview = ({ results }) => {
  if (!results?.length) return <p>No data available.</p>;

  const avg = (key) => {
    const vals = results.map((r) => r[key]).filter((v) => v != null);
    return vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1) : 0;
  };

  const cdnCount = results.filter(
    (r) => r.cdn_provider && r.cdn_provider !== "None detected"
  ).length;

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
        📈 Overview
      </Typography>

      {/* Top metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)',
            position: 'relative',
            overflow: 'visible',
          }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Box sx={{
                width: 56,
                height: 56,
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                fontSize: '28px',
                boxShadow: '0 4px 16px rgba(99, 102, 241, 0.4)',
              }}>
                ⚡
              </Box>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1, fontWeight: 600 }}>
                Avg Total Time
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#fff' }}>
                {avg("total")} <span style={{ fontSize: '18px', color: 'rgba(255, 255, 255, 0.7)' }}>ms</span>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.15) 100%)',
            position: 'relative',
            overflow: 'visible',
          }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Box sx={{
                width: 56,
                height: 56,
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                fontSize: '28px',
                boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)',
              }}>
                🔒
              </Box>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1, fontWeight: 600 }}>
                Avg SSL Score
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#fff' }}>
                {avg("ssl_score")}<span style={{ fontSize: '18px', color: 'rgba(255, 255, 255, 0.7)' }}>/100</span>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(217, 119, 6, 0.15) 100%)',
            position: 'relative',
            overflow: 'visible',
          }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Box sx={{
                width: 56,
                height: 56,
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                fontSize: '28px',
                boxShadow: '0 4px 16px rgba(245, 158, 11, 0.4)',
              }}>
                🛡️
              </Box>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1, fontWeight: 600 }}>
                Avg Security Headers
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#fff' }}>
                {avg("security_headers_score")}<span style={{ fontSize: '18px', color: 'rgba(255, 255, 255, 0.7)' }}>/100</span>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{
            background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.15) 0%, rgba(219, 39, 119, 0.15) 100%)',
            position: 'relative',
            overflow: 'visible',
          }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Box sx={{
                width: 56,
                height: 56,
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #ec4899, #db2777)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                fontSize: '28px',
                boxShadow: '0 4px 16px rgba(236, 72, 153, 0.4)',
              }}>
                🚀
              </Box>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1, fontWeight: 600 }}>
                Sites with CDN
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#fff' }}>
                {cdnCount}<span style={{ fontSize: '18px', color: 'rgba(255, 255, 255, 0.7)' }}>/{results.length}</span>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Response time breakdown */}
      <Box sx={{ mt: 5 }}>
        <Typography
          variant="h6"
          sx={{
            mb: 3,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          ⏱️ Response Time Breakdown
        </Typography>
        <Plot
          data={[
            {
              x: urls,
              y: results.map((r) => r.dns || 0),
              type: "bar",
              name: "DNS",
              marker: { color: '#6366f1' }
            },
            {
              x: urls,
              y: results.map((r) => r.tcp || 0),
              type: "bar",
              name: "TCP",
              marker: { color: '#8b5cf6' }
            },
            {
              x: urls,
              y: results.map((r) => r.ssl || 0),
              type: "bar",
              name: "SSL",
              marker: { color: '#ec4899' }
            },
            {
              x: urls,
              y: results.map((r) => r.ttfb || 0),
              type: "bar",
              name: "TTFB",
              marker: { color: '#10b981' }
            },
          ]}
          layout={{
            barmode: "stack",
            title: {
              text: "Request Timeline Breakdown (ms)",
              font: { color: '#e0e7ff', size: 16, family: 'Inter' }
            },
            xaxis: {
              title: "Website",
              color: '#c7d2fe',
              gridcolor: 'rgba(255, 255, 255, 0.1)',
            },
            yaxis: {
              title: "Time (ms)",
              color: '#c7d2fe',
              gridcolor: 'rgba(255, 255, 255, 0.1)',
            },
            height: 400,
            paper_bgcolor: 'rgba(255, 255, 255, 0.03)',
            plot_bgcolor: 'rgba(0, 0, 0, 0.2)',
            font: { color: '#c7d2fe', family: 'Inter' },
            legend: {
              bgcolor: 'rgba(0, 0, 0, 0.3)',
              bordercolor: 'rgba(255, 255, 255, 0.1)',
              borderwidth: 1,
            }
          }}
          style={{ width: "100%" }}
          config={{ displayModeBar: false }}
        />
      </Box>

      {/* Resource sizes */}
      <Box sx={{ mt: 5 }}>
        <Typography
          variant="h6"
          sx={{
            mb: 3,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          📦 Resource Sizes
        </Typography>
        <Plot
          data={[
            {
              x: urls,
              y: results.map((r) => r.size_kb || 0),
              name: "Total Size",
              type: "bar",
              marker: { color: '#6366f1' }
            },
            {
              x: urls,
              y: results.map((r) => r.images_kb || 0),
              name: "Images",
              type: "bar",
              marker: { color: '#8b5cf6' }
            },
            {
              x: urls,
              y: results.map((r) => r.scripts_kb || 0),
              name: "Scripts",
              type: "bar",
              marker: { color: '#ec4899' }
            },
            {
              x: urls,
              y: results.map((r) => r.css_kb || 0),
              name: "CSS",
              type: "bar",
              marker: { color: '#10b981' }
            },
          ]}
          layout={{
            barmode: "group",
            title: {
              text: "Resource Breakdown (KB)",
              font: { color: '#e0e7ff', size: 16, family: 'Inter' }
            },
            xaxis: {
              title: "Website",
              color: '#c7d2fe',
              gridcolor: 'rgba(255, 255, 255, 0.1)',
            },
            yaxis: {
              title: "Size (KB)",
              color: '#c7d2fe',
              gridcolor: 'rgba(255, 255, 255, 0.1)',
            },
            height: 400,
            paper_bgcolor: 'rgba(255, 255, 255, 0.03)',
            plot_bgcolor: 'rgba(0, 0, 0, 0.2)',
            font: { color: '#c7d2fe', family: 'Inter' },
            legend: {
              bgcolor: 'rgba(0, 0, 0, 0.3)',
              bordercolor: 'rgba(255, 255, 255, 0.1)',
              borderwidth: 1,
            }
          }}
          style={{ width: "100%" }}
          config={{ displayModeBar: false }}
        />
      </Box>
    </div>
  );
};

export default Overview;
