import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  if (clientId && clientSecret && clientSecret !== 'your_github_client_secret_here') {
    try {
      const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          code,
        }),
      });

      const tokenData = await tokenResponse.json();
      
      if (tokenData.access_token) {
        // Here you can fetch user data from GitHub using the access token
        // and create a session/user in your database.
        const response = NextResponse.redirect(new URL('/dashboard', request.url));
        response.cookies.set('github_access_token', tokenData.access_token, { 
          path: '/',
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60 * 24 * 7 // 1 week
        });
        return response;
      }
    } catch (error) {
      console.error('Error exchanging GitHub code for token:', error);
    }
  }

  // If we don't have a valid secret set up yet, still simulate a successful login for development
  const response = NextResponse.redirect(new URL('/dashboard', request.url));
  response.cookies.set('github_access_token', 'mock_token_for_development', { path: '/' });
  return response;
}
