import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = {
      name: "Super 30",
      count: 4,
      images: [
        {
          url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop",
          ready: true,
          error: false
        },
        {
          url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop",
          ready: true,
          error: false
        },
        {
          url: "https://picsum.photos/seed/error/200/200",
          ready: true,
          error: true
        },
        {
          url: "https://images.unsplash.com/photo-1580013759032-c96505e24c1f?w=200&h=200&fit=crop",
          ready: true,
          error: false
        }
      ]
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch images' },
      { status: 500 }
    );
  }
}
