import { NextRequest, NextResponse } from 'next/server';
import { updateLeadClickTracking } from '@/lib/googleSheets';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const leadId = searchParams.get('id');
  const targetUrl = searchParams.get('url') || 'https://ademxo.com';

  if (leadId) {
    try {
      await updateLeadClickTracking(leadId);
    } catch (error) {
      console.error('Error tracking CTA link click event:', error);
    }
  }

  // Ensure redirect URL is absolute and valid
  let redirectUrl = targetUrl;
  if (!redirectUrl.startsWith('http://') && !redirectUrl.startsWith('https://')) {
    redirectUrl = `https://${redirectUrl}`;
  }

  return NextResponse.redirect(redirectUrl);
}
