import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { code, state } = await request.json();

    // Verify state
    const savedState = request.cookies.get('digilocker_state')?.value;
    if (state !== savedState) {
      return NextResponse.json(
        { message: 'Invalid state parameter' },
        { status: 400 }
      );
    }

    // Exchange code for access token with DigiLocker
    const tokenResponse = await fetch(
      'https://api.meripehchaan.gov.in/public/oauth2/1/token',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          client_id: process.env.NEXT_PUBLIC_DIGILOCKER_CLIENT_ID || '',
          client_secret: process.env.DIGILOCKER_CLIENT_SECRET || '',
          redirect_uri: process.env.NEXT_PUBLIC_DIGILOCKER_REDIRECT_URI || '',
        }).toString(),
      }
    );

    const tokenData = await tokenResponse.json();

    // Fetch user documents
    const docsResponse = await fetch(
      'https://api.meripehchaan.gov.in/public/oauth2/1/user/documents',
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      }
    );

    const documents = await docsResponse.json();

    // Update user verification status in database
    // await db.users.updateVerification({ documents });

    return NextResponse.json({
      message: 'DigiLocker verification successful',
      documents,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}
