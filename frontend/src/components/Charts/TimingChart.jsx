import React from 'react';
import Plot from 'react-plotly.js';

const TimingChart = ({ results }) => {
  const urls = results.map(r => r.url);

  const traces = [
    {
      x: urls,
      y: results.map(r => r.dns || 0),
      name: 'DNS',
      type: 'bar',
    },
    {
      x: urls,
      y: results.map(r => r.tcp || 0),
      name: 'TCP',
      type: 'bar',
    },
    {
      x: urls,
      y: results.map(r => r.ssl || 0),
      name: 'SSL',
      type: 'bar',
    },
    {
      x: urls,
      y: results.map(r => r.ttfb || 0),
      name: 'TTFB',
      type: 'bar',
    },
  ];

  const layout = {
    barmode: 'stack',
    title: 'Request Timeline Breakdown (ms)',
    xaxis: { title: 'Website' },
    yaxis: { title: 'Time (ms)' },
  };

  return <Plot data={traces} layout={layout} style={{width: '100%', height: '400px'}} />;
};

export default TimingChart;