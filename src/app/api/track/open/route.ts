import { NextRequest } from 'next/server';
import { updateLeadOpenTracking } from '@/lib/googleSheets';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const leadId = searchParams.get('id');

  if (leadId) {
    try {
      await updateLeadOpenTracking(leadId);
    } catch (error) {
      console.error('Error tracking email open event:', error);
    }
  }

  // 1x1 transparent GIF bytes in base64
  const gifBase64 = 'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
  const gifBuffer = Buffer.from(gifBase64, 'base64');

  return new Response(gifBuffer, {
    headers: {
      'Content-Type': 'image/gif',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  });
}
