import { google } from 'googleapis';

// Interface matching the payload
export interface LeadData {
  leadId?: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  website: string;
  industry: string;
  companySize: string;
  budget: string;
  services: string[];
  description: string;
}

// Interface for leads displayed on the dashboard
export interface LeadRecord {
  timestamp: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  website: string;
  industry: string;
  companySize: string;
  budget: string;
  services: string;
  description: string;
  leadId: string;
  emailOpens: number;
  lastOpenedAt: string;
  linkClicked: boolean;
  clickedAt: string;
}

// Helper to authenticate and get Google Sheets client
async function getSheetsClient() {
  const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  // Parse private key carefully to handle newlines
  const privateKey = process.env.GOOGLE_PRIVATE_KEY
    ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n')
    : undefined;
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;

  if (!serviceAccountEmail || !privateKey || !spreadsheetId) {
    throw new Error('Google Sheets environment variables are missing! Check GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, and GOOGLE_SHEET_ID.');
  }

  const auth = new google.auth.JWT({
    email: serviceAccountEmail,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
  });

  const sheets = google.sheets({ version: 'v4', auth });
  return { sheets, spreadsheetId };
}

export async function appendLeadToSheet(lead: LeadData): Promise<boolean> {
  try {
    const { sheets, spreadsheetId } = await getSheetsClient();

    // Format row values: Timestamp followed by details and tracking defaults
    const timestamp = new Date().toISOString();
    const rowValues = [
      timestamp,
      lead.companyName,
      lead.contactName,
      lead.email,
      lead.phone,
      lead.website || 'N/A',
      lead.industry,
      lead.companySize,
      lead.budget,
      lead.services.join(', '),
      lead.description,
      lead.leadId || '',
      0,       // Email Opens
      '',      // Last Opened At
      'false', // Link Clicked
      ''       // Clicked At
    ];

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Sheet1!A:A', // Appends to the first empty row starting at column A
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [rowValues]
      }
    });

    return response.status === 200;
  } catch (error) {
    console.error('Failed to append lead to Google Sheet:', error);
    return false;
  }
}

export async function updateLeadOpenTracking(leadId: string): Promise<boolean> {
  console.log(`[Google Sheets] updateLeadOpenTracking called for leadId: ${leadId}`);
  if (!leadId) return false;
  try {
    const { sheets, spreadsheetId } = await getSheetsClient();

    // 1. Fetch column L to locate the row
    const getRes = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Sheet1!L:L',
    });

    const rows = getRes.data.values;
    if (!rows || rows.length === 0) {
      console.error('[Google Sheets] No lead IDs found in sheet (column L empty).');
      return false;
    }

    let rowIndex = -1;
    for (let i = 0; i < rows.length; i++) {
      if (rows[i] && rows[i][0] === leadId) {
        rowIndex = i;
        break;
      }
    }

    if (rowIndex === -1) {
      console.error(`[Google Sheets] Lead ID ${leadId} not found in column L.`);
      return false;
    }

    const rowNumber = rowIndex + 1;
    console.log(`[Google Sheets] Found leadId ${leadId} at row ${rowNumber}.`);

    // 2. Fetch current opens count (column M)
    const countRes = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `Sheet1!M${rowNumber}`,
    });

    const currentOpensVal = countRes.data.values?.[0]?.[0];
    const currentOpens = currentOpensVal ? parseInt(currentOpensVal, 10) : 0;
    const newOpens = isNaN(currentOpens) ? 1 : currentOpens + 1;
    const lastOpenedAt = new Date().toISOString();

    // 3. Update columns M (Email Opens) and N (Last Opened At)
    const updateRes = await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `Sheet1!M${rowNumber}:N${rowNumber}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[newOpens, lastOpenedAt]]
      }
    });

    return updateRes.status === 200;
  } catch (error) {
    console.error(`Failed to update lead open tracking for ${leadId}:`, error);
    return false;
  }
}

export async function updateLeadClickTracking(leadId: string): Promise<boolean> {
  console.log(`[Google Sheets] updateLeadClickTracking called for leadId: ${leadId}`);
  if (!leadId) return false;
  try {
    const { sheets, spreadsheetId } = await getSheetsClient();

    // 1. Fetch column L to locate the row
    const getRes = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Sheet1!L:L',
    });

    const rows = getRes.data.values;
    if (!rows || rows.length === 0) {
      console.error('[Google Sheets] No lead IDs found in sheet (column L empty).');
      return false;
    }

    let rowIndex = -1;
    for (let i = 0; i < rows.length; i++) {
      if (rows[i] && rows[i][0] === leadId) {
        rowIndex = i;
        break;
      }
    }

    if (rowIndex === -1) {
      console.error(`[Google Sheets] Lead ID ${leadId} not found in column L.`);
      return false;
    }

    const rowNumber = rowIndex + 1;
    console.log(`[Google Sheets] Found leadId ${leadId} at row ${rowNumber}.`);
    const clickedAt = new Date().toISOString();

    // 2. Update columns O (Link Clicked) and P (Clicked At)
    const updateRes = await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `Sheet1!O${rowNumber}:P${rowNumber}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [['true', clickedAt]]
      }
    });

    return updateRes.status === 200;
  } catch (error) {
    console.error(`Failed to update lead click tracking for ${leadId}:`, error);
    return false;
  }
}

export async function getAllLeads(): Promise<LeadRecord[]> {
  try {
    const { sheets, spreadsheetId } = await getSheetsClient();

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Sheet1!A:P',
    });

    const rows = res.data.values;
    if (!rows || rows.length <= 1) {
      // Empty sheet or only contains headers
      return [];
    }

    const dataRows = rows.slice(1);

    return dataRows.map((row) => {
      return {
        timestamp: row[0] || '',
        companyName: row[1] || '',
        contactName: row[2] || '',
        email: row[3] || '',
        phone: row[4] || '',
        website: row[5] || '',
        industry: row[6] || '',
        companySize: row[7] || '',
        budget: row[8] || '',
        services: row[9] || '',
        description: row[10] || '',
        leadId: row[11] || '',
        emailOpens: row[12] ? parseInt(row[12], 10) || 0 : 0,
        lastOpenedAt: row[13] || '',
        linkClicked: row[14] === 'true',
        clickedAt: row[15] || '',
      };
    });
  } catch (error) {
    console.error('Failed to get leads from Google Sheet:', error);
    return [];
  }
}
