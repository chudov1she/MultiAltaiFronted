import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const queryString = url.search;
  
  // Get backend URL from environment
  if (!process.env.BACKEND_API_URL) {
    return NextResponse.json(
      { error: 'BACKEND_API_URL environment variable is not set' },
      { status: 500 }
    );
  }
  
  const backendUrl = `${process.env.BACKEND_API_URL}/v1/catalog/properties${queryString}`;
  
  console.log(`[Properties API] Proxying: ${queryString} -> ${backendUrl}`);
  
  try {
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log(`[Properties API] Backend response status: ${response.status}`);
    
    if (!response.ok) {
      console.error(`[Properties API] Backend error: ${response.status} ${response.statusText}`);
      return NextResponse.json(
        { error: `Backend error: ${response.status}` },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    console.log(`[Properties API] Successfully proxied response with ${data.results?.length || 0} results`);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('[Properties API] Proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch from backend' },
      { status: 500 }
    );
  }
}
