import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { appendLeadToSheet, LeadData } from '@/lib/googleSheets';
import { sendConfirmationEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body: LeadData = await request.json();

    // Extract dynamic base URL from request headers
    const hostHeader = request.headers.get('x-forwarded-host') || request.headers.get('host');
    const protoHeader = request.headers.get('x-forwarded-proto') || 'http';
    let baseUrl = '';
    if (hostHeader) {
      const host = hostHeader.split(',')[0].trim();
      const proto = protoHeader.split(',')[0].trim();
      baseUrl = `${proto}://${host}`;
    } else {
      baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    }

    // Server-side validation
    const { companyName, contactName, email, phone, industry, companySize, budget, services, description } = body;

    if (!companyName || !companyName.trim()) {
      return NextResponse.json({ error: 'Company name is required' }, { status: 400 });
    }
    if (!contactName || !contactName.trim()) {
      return NextResponse.json({ error: 'Contact name is required' }, { status: 400 });
    }
    if (!email || !email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'A valid email is required' }, { status: 400 });
    }
    if (!phone || !phone.trim() || phone.replace(/\D/g, '').length < 8) {
      return NextResponse.json({ error: 'A valid phone number is required' }, { status: 400 });
    }
    if (!industry) {
      return NextResponse.json({ error: 'Industry is required' }, { status: 400 });
    }
    if (!companySize) {
      return NextResponse.json({ error: 'Company size is required' }, { status: 400 });
    }
    if (!budget) {
      return NextResponse.json({ error: 'Budget range is required' }, { status: 400 });
    }
    if (!services || services.length === 0) {
      return NextResponse.json({ error: 'At least one service must be selected' }, { status: 400 });
    }
    if (!description || !description.trim() || description.trim().length < 20) {
      return NextResponse.json({ error: 'Project description is required (min 20 characters)' }, { status: 400 });
    }

    // Execute integrations concurrently (or in sequence, with individual try-catch blocks)
    let sheetAppended = false;
    let emailSent = false;

    // Generate unique Lead ID
    const leadId = crypto.randomUUID();
    const leadData: LeadData = {
      ...body,
      leadId
    };

    try {
      sheetAppended = await appendLeadToSheet(leadData);
    } catch (sheetError) {
      console.error('Google Sheets append error:', sheetError);
    }

    try {
      emailSent = await sendConfirmationEmail(leadData, leadId, baseUrl);
    } catch (emailError) {
      console.error('SMTP email sending error:', emailError);
    }

    // Determine status response
    // If BOTH fail, it's a critical infrastructure fail.
    // If one fails, we can still return success: true but with warning indicators in logs.
    // If credentials are omitted entirely, we might fail silently or bypass.
    // Let's log details of what succeeded.
    console.log(`Lead processed: Sheets=${sheetAppended ? 'SUCCESS' : 'FAILED'}, Email=${emailSent ? 'SUCCESS' : 'FAILED'}`);

    // If both failed AND credentials are set, we might return an error, but let's be flexible:
    // If SMTP_HOST or GOOGLE_SHEET_ID are NOT set, we assume local development mode. We can mock success!
    const isDevMode = !process.env.SMTP_HOST && !process.env.GOOGLE_SHEET_ID;
    
    if (!sheetAppended && !emailSent && !isDevMode) {
      return NextResponse.json({
        success: false,
        error: 'System integration error. We are experiencing issues logging requests. Please try again later.'
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Lead processed successfully',
      devMode: isDevMode,
      details: {
        sheetAppended: sheetAppended || isDevMode,
        emailSent: emailSent || isDevMode
      }
    });

  } catch (error) {
    console.error('API /api/submit-lead error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
