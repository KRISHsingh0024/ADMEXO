import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getAllLeads } from '@/lib/googleSheets';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('dashboard_session')?.value;
    const correctPassword = process.env.DASHBOARD_PASSWORD;

    if (!correctPassword) {
      console.error('DASHBOARD_PASSWORD env variable is not set!');
      return NextResponse.json({ error: 'Dashboard server configuration error' }, { status: 500 });
    }

    if (sessionCookie !== correctPassword) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const leads = await getAllLeads();
    return NextResponse.json({ leads });
  } catch (error) {
    console.error('Error in /api/dashboard/leads:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
