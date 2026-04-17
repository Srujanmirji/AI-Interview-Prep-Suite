import { NextResponse } from 'next/server';

export async function GET() {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/github/callback`;
  
  if (!clientId) {
    return NextResponse.json({ error: 'GITHUB_CLIENT_ID is not configured' }, { status: 500 });
  }

  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=read:user user:email`;
  return NextResponse.redirect(githubAuthUrl);
}
