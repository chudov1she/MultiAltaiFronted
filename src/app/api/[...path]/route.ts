import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const path = params.path.join('/');
  const url = new URL(request.url);
  const queryString = url.search;
  
  if (!process.env.BACKEND_API_URL) {
    return NextResponse.json(
      { error: 'BACKEND_API_URL environment variable is not set' },
      { status: 500 }
    );
  }
  
  const backendUrl = `${process.env.BACKEND_API_URL}/${path}${queryString}`;
  
  console.log(`[API Route] Proxying: /api/${path}${queryString} -> ${backendUrl}`);
  
  try {
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log(`[API Route] Backend response status: ${response.status}`);
    
    if (!response.ok) {
      console.error(`[API Route] Backend error: ${response.status} ${response.statusText}`);
      return NextResponse.json(
        { error: `Backend error: ${response.status}` },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    console.log(`[API Route] Successfully proxied response`);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('[API Route] Proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch from backend' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const path = params.path.join('/');
  const body = await request.json();
  
  if (!process.env.BACKEND_API_URL) {
    return NextResponse.json(
      { error: 'BACKEND_API_URL environment variable is not set' },
      { status: 500 }
    );
  }
  
  const backendUrl = `${process.env.BACKEND_API_URL}/${path}`;
  
  console.log(`[API Route] Proxying POST: /api/${path} -> ${backendUrl}`);
  
  try {
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    const data = await response.json();
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('[API Route] Proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to post to backend' },
      { status: 500 }
    );
  }
}
