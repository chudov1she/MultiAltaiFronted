import { ListingDetail, LandPlotDetail, PropertyDetail, BackendLandPlot } from "@/types/catalog";
import { getApiBaseUrl } from './utils';
import { Location, MediaFile, Feature, LandCategory, LandUseType } from '@/types/catalog';

/**
 * Converts backend BackendLandPlot to frontend LandPlotDetail format
 * This adapter preserves the visual structure while adapting data format
 */
function adaptBackendLandPlotToDetail(backendPlot: BackendLandPlot): LandPlotDetail {
  // Convert location
  const location: Location = {
    id: parseInt(backendPlot.location.id) || 0,
    region: '', // Backend only provides address
    locality: '', // Backend only provides address
    address_line: backendPlot.location.address,
    latitude: '',
    longitude: '',
  };

  // Convert media files (images/videos only)
  // Backend returns type as 'IMAGE' or 'VIDEO' (uppercase enum)
  const media_files: MediaFile[] = (backendPlot.mediaFiles || [])
    .filter(mf => {
      const typeLower = (mf.type || '').toLowerCase();
      return typeLower === 'image' || typeLower === 'video';
    })
    .map((mf) => ({
      id: parseInt(mf.id) || undefined,
      url: mf.url,
      file_url: mf.url,
      type: (mf.type || '').toLowerCase(), // Convert to lowercase: 'IMAGE' -> 'image'
      order: mf.order || 0,
      is_main: (mf.order || 0) === 0, // First file is main
    }));

  // Convert document files (add to media_files with type 'document')
  const document_files: MediaFile[] = (backendPlot.documentFiles || []).map((df) => ({
    id: parseInt(df.id) || undefined,
    url: df.url,
    file_url: df.url,
    type: 'document',
    order: 0,
    is_main: false,
    description: df.name, // Use document name as description
  }));

  // Convert features
  const features: Feature[] = backendPlot.features.map((f) => ({
    id: parseInt(f.id) || 0,
    name: f.name,
    type: '', // Not provided by backend
    type_display: '', // Not provided by backend
  }));

  // Convert category (can be null)
  const land_category: LandCategory | null = backendPlot.category ? {
    id: parseInt(backendPlot.category.id) || 0,
    name: backendPlot.category.name,
  } : null;

  // Convert permitted use to land_use_types array
  const land_use_types: LandUseType[] = backendPlot.permittedUse ? [{
    id: parseInt(backendPlot.permittedUse.id) || 0,
    name: backendPlot.permittedUse.name,
    description: undefined,
  }] : [];

  // Map status
  const statusLower = backendPlot.status.toLowerCase();
  const plot_status = statusLower === 'available' || statusLower === 'sold' || statusLower === 'reserved'
    ? statusLower
    : 'available';
  
  // Map plot type
  const plotTypeLower = backendPlot.plotType.toLowerCase();
  const land_type = plotTypeLower === 'russia' ? 'russia' : 'novorossia';
  const land_type_display = plotTypeLower === 'russia' ? 'Россия' : 'Новороссия';

  // Status display mapping
  const statusDisplayMap: Record<string, string> = {
    'available': 'Доступен',
    'reserved': 'Забронирован',
    'sold': 'Продан',
  };
  const plot_status_display = statusDisplayMap[plot_status] || 'Доступен';
  const listing_status = backendPlot.isPublished ? 'published' : 'hidden';
  const listing_status_display = backendPlot.isPublished ? 'Опубликовано' : 'Скрыто';

  return {
    id: parseInt(backendPlot.id) || 0, // For display compatibility
    _originalId: backendPlot.id, // Store original UUID for API calls
    title: backendPlot.title,
    slug: backendPlot.slug,
    description: backendPlot.description || '',
    land_type,
    land_type_display,
    location,
    cadastral_numbers: backendPlot.cadastralNumbers, // Keep as array
    land_use_types,
    land_category,
    features,
    area: backendPlot.area.toString(), // Convert number to string
    price: backendPlot.price.toString(), // Convert number to string
    price_per_are: backendPlot.pricePerHundred.toString(), // Convert number to string
    plot_status,
    plot_status_display,
    listing_status,
    listing_status_display,
    created_at: backendPlot.createdAt,
    updated_at: backendPlot.updatedAt,
    media_files: [...media_files, ...document_files], // Combine media and documents
  };
}

// Function to fetch details for a single listing
export async function getListingDetails(
  categorySlug: string,
  listingSlug: string // Changed from listingId to listingSlug
): Promise<ListingDetail | null> {
  const baseUrl = getApiBaseUrl();
  let endpoint: string;

  // Determine the correct endpoint based on category slug
  // Backend uses slug, not ID for land plots
  if (categorySlug === 'land-plots') {
    endpoint = `/v1/land-plots/${listingSlug}`; // Use slug, not ID
  } else {
    // Assume other slugs map to the generic properties endpoint
    endpoint = `/v1/catalog/properties/${listingSlug}`;
  }

  // Construct the URL correctly: baseUrl already contains /api
  const url = `${baseUrl}${endpoint}`;
  const env = typeof window === 'undefined' ? 'SERVER' : 'CLIENT';
  console.log(`Fetching listing details from [${env}]: ${url}`);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 3600 }
    });

    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`Listing not found at ${url}`);
        return null; // Return null for 404 Not Found
      } else {
        // Log other errors
        console.error(`API error fetching ${url}: ${response.status} ${response.statusText}`);
        return null; // Return null for other errors for now
      }
    }

    // For land plots, adapt the backend response
    if (categorySlug === 'land-plots') {
      const backendData: BackendLandPlot = await response.json();
      return adaptBackendLandPlotToDetail(backendData);
    } else {
      // For other types, return as-is (may need adaptation later)
      const data: ListingDetail = await response.json();
      return data;
    }

  } catch (error) {
    console.error(`Network or other error fetching ${url}:`, error);
    return null; // Return null on network or parsing errors
  }
} 