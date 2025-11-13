import React from "react";
import Plot from "react-plotly.js";
import { Typography } from "@mui/material";

const Performance = ({ results }) => {
  if (!results?.length) return <p>No data available.</p>;

  const urls = results.map((r) => r.url);

  const totalTimes = results.map((r) => r.total || 0).filter((v) => v !== null);

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
        ⚡ Performance Details
      </Typography>

      {/* Connection Reuse */}
      <div id="performance-chart">
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
          🔄 Connection Reuse Optimization
        </Typography>
        <Plot
        data={[
          {
            x: urls,
            y: results.map((r) => r.connection_reuse_benefit || 0),
            type: "bar",
            marker: {
              color: "#8b5cf6",
              line: {
                color: 'rgba(255, 255, 255, 0.2)',
                width: 1
              }
            },
          },
        ]}
        layout={{
          title: {
            text: "Time Saved by Connection Reuse (ms)",
            font: { color: '#e5e5e5', size: 16, family: 'Inter' }
          },
          xaxis: {
            title: "Website",
            color: '#cccccc',
            gridcolor: 'rgba(255, 255, 255, 0.1)',
          },
          yaxis: {
            title: "Time Saved (ms)",
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

      {/* Compression Distribution */}
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
        📦 Compression Types
      </Typography>
      <Plot
        data={[
          {
            type: "pie",
            values: Object.values(
              results.reduce((acc, r) => {
                const type = r.compression_type || "Unknown";
                acc[type] = (acc[type] || 0) + 1;
                return acc;
              }, {})
            ),
            labels: Object.keys(
              results.reduce((acc, r) => {
                const type = r.compression_type || "Unknown";
                acc[type] = (acc[type] || 0) + 1;
                return acc;
              }, {})
            ),
            marker: {
              colors: ['#0ea5e9', '#06b6d4', '#8b5cf6', '#10b981', '#f59e0b'],
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
            text: "Compression Methods Used",
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

      {/* Load Time Distribution */}
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
        ⏱️ Load Time Distribution
      </Typography>
      <Plot
        data={[
          {
            y: totalTimes,
            type: "box",
            boxmean: "sd",
            marker: { color: "#0ea5e9" },
            name: "Load Times",
            line: { color: '#06b6d4' },
            fillcolor: 'rgba(14, 165, 233, 0.3)',
          },
        ]}
        layout={{
          title: {
            text: "Load Time Spread (ms)",
            font: { color: '#e5e5e5', size: 16, family: 'Inter' }
          },
          yaxis: {
            title: "Time (ms)",
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

export default Performance;
