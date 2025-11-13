import React from "react";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
} from "@mui/material";
import jsPDF from "jspdf";
import "jspdf-autotable";

const RawData = ({ results }) => {
  if (!results?.length) return <p>No data available.</p>;

  const headers = Object.keys(results[0]);

  const download = (type) => {
    const blob = new Blob(
      [type === "csv" ? toCSV(results) : JSON.stringify(results, null, 2)],
      { type: type === "csv" ? "text/csv" : "application/json" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `results.${type}`;
    a.click();
  };

  const toCSV = (data) => {
    const rows = data.map((obj) =>
      headers.map((h) => JSON.stringify(obj[h] ?? "")).join(",")
    );
    return [headers.join(","), ...rows].join("\n");
  };

const generatePDF = async () => {
  const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });

  // 🎨 Theme colors - Monochrome Black & White
  const primary = [26, 26, 26]; // #1a1a1a
  const accent = [85, 85, 85]; // #555555

  // 🧭 Header
  doc.setFillColor(primary[0], primary[1], primary[2]);
  doc.rect(0, 0, doc.internal.pageSize.width, 80, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.text("🌐 Website Analysis Report", 40, 45);
  doc.setFontSize(12);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 40, 65);

  // Summary metrics
  const totalSites = results.length;
  const avgSSL = avg("ssl_score");
  const avgLoad = avg("total");
  const cdnUsed = results.filter(
    (r) => r.cdn_provider && r.cdn_provider !== "None detected"
  ).length;

  doc.setTextColor(60);
  doc.setFontSize(14);
  doc.text("Summary", 40, 120);

  const summaryData = [
    ["Total Websites Analyzed", totalSites],
    ["Average SSL Score", `${avgSSL}/100`],
    ["Average Total Load Time", `${avgLoad} ms`],
    ["Websites with CDN", `${cdnUsed}/${totalSites}`],
  ];

  doc.autoTable({
    startY: 130,
    body: summaryData,
    theme: "plain",
    styles: { fontSize: 12, cellPadding: 6 },
    columnStyles: { 0: { fontStyle: "bold", textColor: accent } },
  });

  // 📊 Embed Overview Chart
  const overviewEl = document.querySelector("#overview-chart");
  if (overviewEl) {
    const canvas = overviewEl.querySelector("canvas");
    if (canvas) {
      const img = canvas.toDataURL("image/png");
      let startY = doc.lastAutoTable.finalY + 30;
      // Check if we need a new page
      if (startY + 250 > doc.internal.pageSize.height - 40) {
        doc.addPage();
        startY = 40;
      }
      doc.addImage(img, "PNG", 40, startY, 500, 250);
    }
  }

  // 🔒 Security
  addSectionHeader(doc, "Security Insights", accent);

  // 📊 Embed Security Chart
  let securityChartAdded = false;
  const securityEl = document.querySelector("#security-chart");
  if (securityEl) {
    const canvas = securityEl.querySelector("canvas");
    if (canvas) {
      const img = canvas.toDataURL("image/png");
      let startY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 30 : 200;
      // Check if we need a new page
      if (startY + 250 > doc.internal.pageSize.height - 40) {
        doc.addPage();
        startY = 40;
      }
      doc.addImage(img, "PNG", 40, startY, 500, 250);
      securityChartAdded = true;
    }
  }

  doc.autoTable({
    startY: securityChartAdded ? (doc.lastAutoTable ? doc.lastAutoTable.finalY + 290 : 330) : (doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 200),
    head: [["Website", "SSL Score", "Headers Score", "TLS Version", "Compression"]],
    body: results.map((r) => [
      short(r.url),
      r.ssl_score || "-",
      r.security_headers_score || "-",
      r.ssl_version || "-",
      r.compression_type || "-",
    ]),
    styles: { fontSize: 9, cellPadding: 4 },
    headStyles: { fillColor: primary },
    margin: { left: 40, right: 40 },
  });

  // ⚡ Performance
  addSectionHeader(doc, "Performance Metrics", accent);
  doc.autoTable({
    startY: doc.lastAutoTable.finalY + 10,
    head: [["Website", "DNS", "TCP", "SSL", "TTFB", "Total (ms)"]],
    body: results.map((r) => [
      short(r.url),
      r.dns || "-",
      r.tcp || "-",
      r.ssl || "-",
      r.ttfb || "-",
      r.total || "-",
    ]),
    styles: { fontSize: 9, cellPadding: 4 },
    headStyles: { fillColor: primary },
    margin: { left: 40, right: 40 },
  });

  // 📈 Embed Performance Chart
  const perfEl = document.querySelector("#performance-chart");
  if (perfEl) {
    const canvas = perfEl.querySelector("canvas");
    if (canvas) {
      const img = canvas.toDataURL("image/png");
      let startY = doc.lastAutoTable.finalY + 30;
      // Check if we need a new page
      if (startY + 250 > doc.internal.pageSize.height - 40) {
        doc.addPage();
        startY = 40;
      }
      doc.addImage(img, "PNG", 40, startY, 500, 250);
    }
  }

  // 🌐 Network
  addSectionHeader(doc, "Network Overview", accent);

  // 📊 Embed Network Chart
  let networkChartAdded = false;
  const networkEl = document.querySelector("#network-chart");
  if (networkEl) {
    const canvas = networkEl.querySelector("canvas");
    if (canvas) {
      const img = canvas.toDataURL("image/png");
      let startY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 30 : 200;
      // Check if we need a new page
      if (startY + 250 > doc.internal.pageSize.height - 40) {
        doc.addPage();
        startY = 40;
      }
      doc.addImage(img, "PNG", 40, startY, 500, 250);
      networkChartAdded = true;
    }
  }

  doc.autoTable({
    startY: networkChartAdded ? (doc.lastAutoTable ? doc.lastAutoTable.finalY + 290 : 330) : (doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 200),
    head: [["Website", "IP", "CDN Provider", "Server Location"]],
    body: results.map((r) => [
      short(r.url),
      r.ip || "-",
      r.cdn_provider || "-",
      r.server_location || "-",
    ]),
    styles: { fontSize: 9, cellPadding: 4 },
    headStyles: { fillColor: primary },
    margin: { left: 40, right: 40 },
  });

  // 🧾 Fixed Raw Data Snapshot
  addSectionHeader(doc, "Raw Data Snapshot", accent);
  const snapshotHeaders = Object.keys(results[0]).slice(0, 8);
  const snapshotBody = results.map((r) =>
    snapshotHeaders.map((h) => String(r[h] ?? ""))
  );

  doc.autoTable({
    startY: doc.lastAutoTable.finalY + 10,
    head: [snapshotHeaders],
    body: snapshotBody,
    styles: { fontSize: 8, cellPadding: 3, overflow: "linebreak" },
    headStyles: { fillColor: primary },
    margin: { left: 40, right: 40 },
    tableWidth: "wrap",
  });

  // Footer
  const footerY = doc.internal.pageSize.height - 30;
  doc.setFontSize(10);
  doc.setTextColor(150);
  doc.text("Generated by Website Analyzer © 2025", 40, footerY);

  doc.save("website_analysis_report.pdf");

  // --- Helpers ---
  function avg(key) {
    const vals = results.map((r) => r[key]).filter((v) => v != null);
    return vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1) : 0;
  }

  function short(url) {
    return url.replace("https://", "").replace("http://", "").replace("www.", "").split("/")[0];
  }

  function addSectionHeader(doc, title, color) {
    const startY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 40 : 200;
    if (startY > 700) doc.addPage();
    doc.setFontSize(14);
    doc.setTextColor(color[0], color[1], color[2]);
    doc.text(title, 40, startY);
    doc.setTextColor(60);
  }
};



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
        📄 Raw Data
      </Typography>

      <Table sx={{
        background: 'rgba(255, 255, 255, 0.03)',
        borderRadius: '12px',
        overflow: 'hidden',
        mb: 4,
      }}>
        <TableHead>
          <TableRow>
            {headers.slice(0, 6).map((key) => (
              <TableCell key={key} sx={{ fontWeight: 700, textTransform: 'capitalize' }}>
                {key.replace(/_/g, ' ')}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {results.map((r, i) => (
            <TableRow key={i}>
              {headers.slice(0, 6).map((key) => (
                <TableCell key={key} sx={{ fontFamily: key === 'url' ? 'inherit' : 'monospace' }}>
                  {String(r[key] ?? "")}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div style={{
        marginTop: 32,
        display: 'flex',
        gap: '16px',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        <Button
          variant="contained"
          onClick={() => download("csv")}
          sx={{
            minWidth: '180px',
            py: 1.5,
            fontSize: '15px',
            fontWeight: 600,
          }}
        >
          📥 Download CSV
        </Button>
        <Button
          variant="outlined"
          onClick={() => download("json")}
          sx={{
            minWidth: '180px',
            py: 1.5,
            fontSize: '15px',
            fontWeight: 600,
          }}
        >
          📥 Download JSON
        </Button>
        <Button
          variant="contained"
          onClick={generatePDF}
          sx={{
            minWidth: '200px',
            py: 1.5,
            fontSize: '15px',
            fontWeight: 600,
            background: '#1a1a1a',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            '&:hover': {
              background: '#2a2a2a',
              border: '1px solid rgba(255, 255, 255, 0.3)',
            }
          }}
        >
          📄 Generate PDF Report
        </Button>
      </div>
    </div>
  );
};

export default RawData;
