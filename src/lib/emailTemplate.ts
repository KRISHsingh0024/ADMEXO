import { LeadData } from './googleSheets';

export function getHtmlEmailTemplate(lead: LeadData, leadId?: string, baseUrlInput?: string): string {
  const finalLeadId = leadId || lead.leadId || '';
  const baseUrl = baseUrlInput || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const targetUrl = 'https://www.admexo.com';
  const clickTrackUrl = finalLeadId 
    ? `${baseUrl}/api/track/click?id=${finalLeadId}&url=${encodeURIComponent(targetUrl)}`
    : targetUrl;

  const year = new Date().getFullYear();
  const servicesHtml = lead.services
    .map(s => `<span style="display:inline-block; background-color:#3b82f6; color:#ffffff; font-size:12px; font-weight:600; padding:4px 10px; border-radius:12px; margin-right:6px; margin-bottom:6px; font-family:'Outfit',sans-serif;">${s}</span>`)
    .join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Growth Prospectus Confirmation | ADEMXO</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Outfit:wght@600;700;800&display=swap');
    
    body {
      font-family: 'Inter', Arial, sans-serif;
      background-color: #0b0f19;
      color: #e5e7eb;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #0b0f19;
      padding: 40px 20px;
      box-sizing: border-box;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #111827;
      border: 1px solid #1f2937;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    }
    .header {
      background: linear-gradient(135deg, #1e3a8a 0%, #4a044e 100%);
      padding: 40px 30px;
      text-align: center;
    }
    .logo-container {
      display: inline-flex;
      align-items: center;
      margin-bottom: 20px;
    }
    .logo-box {
      width: 24px;
      height: 24px;
      border-radius: 6px;
      background: linear-gradient(135deg, #3b82f6 0%, #a855f7 100%);
      display: inline-block;
      vertical-align: middle;
      margin-right: 8px;
    }
    .logo-text {
      font-family: 'Outfit', sans-serif;
      font-weight: 800;
      font-size: 20px;
      color: #ffffff;
      letter-spacing: 2px;
      display: inline-block;
      vertical-align: middle;
      margin: 0;
    }
    .header h1 {
      font-family: 'Outfit', sans-serif;
      color: #ffffff;
      font-size: 24px;
      font-weight: 700;
      margin: 10px 0 5px 0;
      letter-spacing: -0.5px;
    }
    .header p {
      color: #9ca3af;
      font-size: 14px;
      margin: 0;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      font-weight: 500;
    }
    .content {
      padding: 40px 30px;
    }
    .welcome-text {
      font-size: 15px;
      line-height: 1.6;
      color: #d1d5db;
      margin-bottom: 30px;
    }
    .welcome-text strong {
      color: #ffffff;
    }
    .table-title {
      font-family: 'Outfit', sans-serif;
      font-size: 16px;
      font-weight: 600;
      color: #ffffff;
      margin: 0 0 15px 0;
      border-bottom: 1px solid #1f2937;
      padding-bottom: 8px;
    }
    .info-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
    }
    .info-table td {
      padding: 12px 0;
      border-bottom: 1px solid #1f2937;
      font-size: 14px;
      vertical-align: top;
    }
    .label-col {
      color: #9ca3af;
      width: 160px;
      font-weight: 500;
    }
    .value-col {
      color: #ffffff;
      font-weight: 600;
    }
    .desc-box {
      background-color: #030712;
      border: 1px solid #1f2937;
      border-radius: 8px;
      padding: 15px;
      font-size: 13px;
      line-height: 1.5;
      color: #d1d5db;
      margin-top: 5px;
      font-style: italic;
    }
    .cta-box {
      text-align: center;
      margin: 40px 0 20px 0;
    }
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #3b82f6 0%, #a855f7 100%);
      color: #ffffff !important;
      font-family: 'Outfit', sans-serif;
      font-weight: 600;
      font-size: 14px;
      text-decoration: none;
      padding: 14px 28px;
      border-radius: 8px;
      box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
    }
    .footer {
      background-color: #030712;
      padding: 30px;
      text-align: center;
      border-top: 1px solid #1f2937;
    }
    .footer p {
      font-size: 12px;
      color: #6b7280;
      margin: 5px 0;
    }
    .footer-links {
      margin-bottom: 15px;
    }
    .footer-links a {
      color: #9ca3af;
      font-size: 12px;
      text-decoration: none;
      margin: 0 10px;
    }
    .footer-links a:hover {
      color: #ffffff;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <!-- Header -->
      <div class="header">
        <div class="logo-container">
          <span class="logo-box"></span>
          <h2 class="logo-text">ADEMXO</h2>
        </div>
        <h1>Proposal Request Logged</h1>
        <p>Intelligent Growth pipeline activated</p>
      </div>

      <!-- Content -->
      <div class="content">
        <p class="welcome-text">
          Hello <strong>${lead.contactName}</strong>,<br><br>
          We have received your growth request for <strong>${lead.companyName}</strong>. Our systems have successfully mapped your request parameters, and our engineering team is analyzing your specifications.<br><br>
          Below is a summary of the parameters recorded in our Google Sheet database:
        </p>

        <h3 class="table-title">Submission Specs</h3>
        <table class="info-table">
          <tr>
            <td class="label-col">Company Name</td>
            <td class="value-col">${lead.companyName}</td>
          </tr>
          <tr>
            <td class="label-col">Contact Person</td>
            <td class="value-col">${lead.contactName}</td>
          </tr>
          <tr>
            <td class="label-col">Email Address</td>
            <td class="value-col">${lead.email}</td>
          </tr>
          <tr>
            <td class="label-col">Phone Number</td>
            <td class="value-col">${lead.phone}</td>
          </tr>
          <tr>
            <td class="label-col">Company Website</td>
            <td class="value-col">${lead.website || 'N/A'}</td>
          </tr>
          <tr>
            <td class="label-col">Industry</td>
            <td class="value-col">${lead.industry}</td>
          </tr>
          <tr>
            <td class="label-col">Company Scale</td>
            <td class="value-col">${lead.companySize} Employees</td>
          </tr>
          <tr>
            <td class="label-col">Monthly Budget</td>
            <td class="value-col">${lead.budget}</td>
          </tr>
          <tr>
            <td class="label-col">Services Needed</td>
            <td class="value-col">${servicesHtml}</td>
          </tr>
          <tr>
            <td colspan="2" style="padding-top: 15px; border-bottom: none;">
              <span style="color:#9ca3af; font-size:14px; font-weight:500;">Project Requirements Description:</span>
              <div class="desc-box">"${lead.description}"</div>
            </td>
          </tr>
        </table>

        <p class="welcome-text">
          <strong>What happens next?</strong><br>
          A performance marketing architect from ADEMXO will review your description, prepare a tailored automation roadmap, and contact you via email at <strong>${lead.email}</strong> or call you at <strong>${lead.phone}</strong> within 24 business hours.
        </p>

        <div class="cta-box">
          <a href="${clickTrackUrl}" class="cta-button" target="_blank">Access Your Strategic Growth Proposal</a>
        </div>
        <div style="text-align: center; margin-top: 15px; font-size: 13px; color: #6b7280;">
          Or visit: <a href="${clickTrackUrl}" style="color: #3b82f6; text-decoration: underline;" target="_blank">${clickTrackUrl}</a>
        </div>
      </div>

      <!-- Footer -->
      <div class="footer">
        <div class="footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Contact Support</a>
        </div>
        <p>&copy; ${year} ADEMXO. All rights reserved.</p>
        <p style="font-size:10px; color:#4b5563;">You received this automated email because you filled out a lead generation inquiry on the ADEMXO marketing site.</p>
      </div>
    </div>
  </div>
  ${finalLeadId ? `<img src="${baseUrl}/api/track/open?id=${finalLeadId}" width="1" height="1" style="display:none; width: 1px; height: 1px;" alt="" />` : ''}
</body>
</html>
  `;
}
