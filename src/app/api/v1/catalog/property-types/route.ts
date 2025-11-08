import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Get backend URL from environment
  if (!process.env.BACKEND_API_URL) {
    return NextResponse.json(
      { error: 'BACKEND_API_URL environment variable is not set' },
      { status: 500 }
    );
  }
  
  const backendUrl = `${process.env.BACKEND_API_URL}/v1/catalog/property-types/`;
  
  console.log(`[Property Types API] Proxying to: ${backendUrl}`);
  
  try {
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log(`[Property Types API] Backend response status: ${response.status}`);
    
    if (!response.ok) {
      console.error(`[Property Types API] Backend error: ${response.status} ${response.statusText}`);
      return NextResponse.json(
        { error: `Backend error: ${response.status}` },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    console.log(`[Property Types API] Successfully proxied response with ${data.results?.length || 0} results`);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('[Property Types API] Proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch from backend' },
      { status: 500 }
    );
  }
}
