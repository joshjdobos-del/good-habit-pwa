import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { recipientId, senderFirstName, senderCity, isAnonymous } = await request.json();

    // Construct notification body based on sender's privacy selection
    const notificationBody = isAnonymous
      ? `Someone in ${senderCity || 'your area'} just highfived you!`
      : `${senderFirstName} in ${senderCity || 'your area'} just highfived you!`;

    const notificationPayload = {
      title: '🖐️ New High Five!',
      body: notificationBody,
      icon: '/icon-192.png',
      data: { url: '/dashboard' },
    };

    // Send push notification using your Web Push or Firebase Admin service
    // await sendPushToUser(recipientId, notificationPayload);

    console.log(`[PUSH NOTIFICATION] To: ${recipientId} | Message: "${notificationBody}"`);

    return NextResponse.json({
      success: true,
      message: notificationBody,
    });
  } catch (error) {
    console.error('High five push error:', error);
    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500 }
    );
  }
}