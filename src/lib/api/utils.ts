/**
 * Returns the API base URL for the backend server.
 * Reads URL from environment variables.
 * 
 * Environment variables:
 * - BACKEND_API_URL: Backend URL for server-side (required)
 * - NEXT_PUBLIC_BACKEND_URL: Backend URL for client-side (optional, defaults to /api proxy)
 */
export function getApiBaseUrl(): string {
  const isServer = typeof window === 'undefined';
  
  if (isServer) {
    // Server-side: must use BACKEND_API_URL from .env
    if (!process.env.BACKEND_API_URL) {
      throw new Error('BACKEND_API_URL environment variable is required');
    }
    return process.env.BACKEND_API_URL;
  } else {
    // Client-side: use NEXT_PUBLIC_BACKEND_URL or proxy through /api
    if (process.env.NEXT_PUBLIC_BACKEND_URL) {
      return process.env.NEXT_PUBLIC_BACKEND_URL;
    }
    // Default to relative path (proxied through Next.js API routes)
    return '/api';
  }
}

/**
 * Returns the image URL as-is from backend.
 * Backend returns full S3 URLs, so no transformation is needed.
 * 
 * @param url - Full S3 URL from backend or null/undefined
 * @returns URL as-is or null
 */
export function getPublicImageUrl(url: string | undefined | null): string | null {
  if (!url) {
    return null;
  }

  // Backend returns full S3 URLs, so just return as-is
  // If it's already a full URL (http/https), return it
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // If it's a relative path (shouldn't happen with S3, but handle it)
  // Return null as we can't construct a valid URL
  return null;
}

/**
 * Returns the asset URL as-is from backend.
 * Backend returns full S3 URLs, so no transformation is needed.
 * 
 * @param url - Full S3 URL from backend or null/undefined
 * @returns URL as-is or null
 */
export function getPublicAssetUrl(url: string | undefined | null): string | null {
  if (!url) {
    return null;
  }

  // Backend returns full S3 URLs, so just return as-is
  // If it's already a full URL (http/https), return it
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // If it's a relative path (shouldn't happen with S3, but handle it)
  // Return null as we can't construct a valid URL
  return null;
}

// Optionally, you could create a universal fetch function here
// export async function fetchApiUtil(endpoint: string, options: RequestInit = {}) { ... } 
