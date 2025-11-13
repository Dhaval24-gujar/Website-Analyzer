import React from "react";
import Plot from "react-plotly.js";
import { Typography, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";

const Network = ({ results }) => {
  if (!results?.length) return <p>No data available.</p>;

  const cdnCounts = results.reduce((acc, r) => {
    const cdn = r.cdn_provider || "Unknown";
    acc[cdn] = (acc[cdn] || 0) + 1;
    return acc;
  }, {});

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
        🌐 Network Infrastructure
      </Typography>

      {/* CDN Provider Chart */}
      <div id="network-chart">
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
          🚀 CDN Provider Distribution
        </Typography>
        <Plot
        data={[
          {
            type: "pie",
            labels: Object.keys(cdnCounts),
            values: Object.values(cdnCounts),
            marker: {
              colors: ['#0ea5e9', '#06b6d4', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899'],
              line: {
                color: 'rgba(255, 255, 255, 0.2)',
                width: 2
              }
            },
            textfont: {
              color: '#fff',
              size: 14,
              family: 'Inter'
            }
          },
        ]}
        layout={{
          title: {
            text: "CDN Providers",
            font: { color: '#e5e5e5', size: 16, family: 'Inter' }
          },
          height: 350,
          paper_bgcolor: 'rgba(255, 255, 255, 0.03)',
          plot_bgcolor: 'rgba(0, 0, 0, 0.2)',
          font: { color: '#cccccc', family: 'Inter' },
          legend: {
            bgcolor: 'rgba(0, 0, 0, 0.3)',
            bordercolor: 'rgba(255, 255, 255, 0.1)',
            borderwidth: 1,
          }
        }}
        style={{ width: "100%" }}
        config={{ displayModeBar: false }}
      />
      </div>

      {/* Server Locations */}
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
        📍 Server Locations
      </Typography>
      <Table sx={{
        background: 'rgba(255, 255, 255, 0.03)',
        borderRadius: '12px',
        overflow: 'hidden',
      }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 700 }}>Website</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>IP</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Location</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {results.map((r, i) => (
            <TableRow key={i}>
              <TableCell sx={{ fontWeight: 500 }}>{r.url}</TableCell>
              <TableCell sx={{ fontFamily: 'monospace', color: '#ffffff' }}>{r.ip || "N/A"}</TableCell>
              <TableCell>{r.server_location || "Unknown"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Network;
