// OmniScore AI — Executive PDF Scorecard Exporter Generator
// Produces printable executive HTML/PDF report templates containing composite scores,
// radar charts, skill gap matrix, and top rewrites.

interface AnalysisReportData {
  id: string;
  fileName: string;
  createdAt: string;
  scoreBreakdown: {
    overall: number;
    grade: string;
    label: string;
    pillars: {
      ats: { score: number; label: string };
      skillMatch: { score: number; label: string };
      proofOfWork: { score: number; label: string };
      impact: { score: number; label: string };
    };
  };
  parsedResume: {
    contactInfo: { name: string; email: string; phone: string };
    skills: string[];
    summary: string;
  };
  optimizations: { title: string; category: string; suggested?: string }[];
}

export function generateScorecardHTMLReport(data: AnalysisReportData): string {
  const { overall, grade, label, pillars } = data.scoreBreakdown;
  const candidateName = data.parsedResume.contactInfo.name || data.fileName || "Candidate Profile";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>OmniScore AI Executive Scorecard — ${candidateName}</title>
  <style>
    body {
      font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #0F1D32;
      background: #FFFFFF;
      margin: 0;
      padding: 40px;
      line-height: 1.5;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 3px solid #10B981;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .logo {
      font-size: 24px;
      font-weight: 800;
      color: #0A1628;
    }
    .logo span { color: #10B981; }
    .subtitle { font-size: 12px; color: #64748B; margin-top: 4px; }
    
    .hero-box {
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 16px;
      padding: 30px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 30px;
    }
    .score-circle {
      width: 110px;
      height: 110px;
      border-radius: 50%;
      background: linear-gradient(135deg, #10B981, #06B6D4);
      color: white;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
    }
    .score-circle .number { font-size: 42px; font-weight: 800; line-height: 1; }
    .score-circle .label { font-size: 10px; font-weight: 600; opacity: 0.9; }

    .pillars-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 15px;
      margin-bottom: 30px;
    }
    .pillar-card {
      background: #F1F5F9;
      padding: 16px;
      border-radius: 12px;
      text-align: center;
    }
    .pillar-card .title { font-size: 11px; color: #475569; font-weight: 600; text-transform: uppercase; }
    .pillar-card .val { font-size: 24px; font-weight: 800; color: #0F1D32; margin: 6px 0; }

    .section-title { font-size: 16px; font-weight: 700; color: #0A1628; margin-bottom: 12px; border-left: 4px solid #10B981; padding-left: 10px; }

    .skills-flex { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 30px; }
    .skill-tag { background: #E2E8F0; color: #1E293B; font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 20px; }

    .suggestions-list { margin-bottom: 30px; }
    .sugg-item { background: #F8FAFC; border: 1px solid #E2E8F0; padding: 12px 16px; border-radius: 8px; margin-bottom: 8px; font-size: 12px; }
    .sugg-item strong { color: #0F1D32; }

    .footer {
      border-top: 1px solid #E2E8F0;
      padding-top: 15px;
      font-size: 10px;
      color: #94A3B8;
      display: flex;
      justify-content: space-between;
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="logo">Omni<span>Score</span> AI</div>
      <div class="subtitle">Executive Candidate Profile Evaluation Report</div>
    </div>
    <div style="text-align: right; font-size: 12px; color: #64748B;">
      <strong>Report ID:</strong> ${data.id.substring(0, 8)}<br>
      <strong>Date:</strong> ${new Date(data.createdAt).toLocaleDateString()}
    </div>
  </div>

  <div class="hero-box">
    <div>
      <h1 style="margin: 0; font-size: 22px; color: #0A1628;">${candidateName}</h1>
      <p style="margin: 4px 0 0 0; font-size: 13px; color: #64748B;">Target File: ${data.fileName}</p>
      <div style="margin-top: 12px; font-size: 14px; font-weight: 600; color: #10B981;">
        Status: Grade ${grade} — ${label}
      </div>
    </div>
    <div class="score-circle">
      <div class="number">${overall}</div>
      <div class="label">OMNISCORE</div>
    </div>
  </div>

  <div class="section-title">Pillar Score Breakdown</div>
  <div class="pillars-grid">
    <div class="pillar-card">
      <div class="title">ATS Match (20%)</div>
      <div class="val">${pillars.ats.score}</div>
    </div>
    <div class="pillar-card">
      <div class="title">Skill Match (40%)</div>
      <div class="val">${pillars.skillMatch.score}</div>
    </div>
    <div class="pillar-card">
      <div class="title">Proof of Work (25%)</div>
      <div class="val">${pillars.proofOfWork.score}</div>
    </div>
    <div class="pillar-card">
      <div class="title">Impact (15%)</div>
      <div class="val">${pillars.impact.score}</div>
    </div>
  </div>

  <div class="section-title">Detected Candidate Capabilities (${data.parsedResume.skills.length})</div>
  <div class="skills-flex">
    ${data.parsedResume.skills.map((s) => `<span class="skill-tag">${s}</span>`).join("")}
  </div>

  <div class="section-title">Top Priority Optimization Suggestions</div>
  <div class="suggestions-list">
    ${data.optimizations
      .slice(0, 4)
      .map(
        (opt) => `
        <div class="sugg-item">
          <strong>[${opt.category.toUpperCase()}] ${opt.title}</strong>
          ${opt.suggested ? `<br><em style="color:#059669;">Suggested: "${opt.suggested}"</em>` : ""}
        </div>
      `
      )
      .join("")}
  </div>

  <div class="footer">
    <div>Generated by OmniScore AI — Enterprise Career Intelligence Platform</div>
    <div>Confidential & Proprietary</div>
  </div>
</body>
</html>
  `;
}
