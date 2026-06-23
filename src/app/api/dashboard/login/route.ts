import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    const correctPassword = process.env.DASHBOARD_PASSWORD;

    if (!correctPassword) {
      console.error('DASHBOARD_PASSWORD env variable is not set!');
      return NextResponse.json({ error: 'Dashboard auth is not configured on the server.' }, { status: 500 });
    }

    if (password === correctPassword) {
      const response = NextResponse.json({ success: true });
      
      // Set the session cookie securely
      response.cookies.set('dashboard_session', correctPassword, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 1 day session
      });
      
      return response;
    }

    return NextResponse.json({ error: 'Invalid password. Please try again.' }, { status: 401 });
  } catch (error) {
    console.error('Error in /api/dashboard/login:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
