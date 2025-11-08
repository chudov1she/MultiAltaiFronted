import { 
  PaginatedResponse, 
  PropertyType, 
  LandPlot, 
  GenericProperty, 
  FilterParams, 
  LandCategory, 
  LandUseType, 
  Feature,
  BackendLandPlot,
  BackendLandPlotsResponse,
  Location,
  MediaFile,
  Feature as FrontendFeature,
  LandCategory as FrontendLandCategory
} from '@/types/catalog';
import { getApiBaseUrl } from './utils'; // Import the utility function

// Remove top-level constants for API URL
// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
// const API_VERSION_PREFIX = '/api/v1';

// Modify fetchAPI to use getApiBaseUrl
export async function fetchAPI<T>(endpoint: string, params?: URLSearchParams, options: RequestInit = {}): Promise<T> {
    const baseUrl = getApiBaseUrl(); // Get base URL dynamically
    // Construct the full URL. Assuming endpoint starts with /v1/...
    let url = `${baseUrl}${endpoint}`;
    if (params) {
        url += `?${params.toString()}`;
    }

    console.log(`Fetching: ${url}`);

    try {
        const response = await fetch(url, {
            // headers: { ... },
            next: { revalidate: 60 },
            ...options
        });

        if (!response.ok) {
            let errorBody = 'Could not read error body'; 
            try {
                errorBody = await response.text(); 
            } catch (e) {
                console.error("Error reading response text:", e);
            } 
            console.error(`API Error (${response.status}): ${response.statusText}`, errorBody);
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        return await response.json() as T;
    } catch (error) {
        console.error(`Network or fetch error for ${url}: ${error}`);
        throw error;
    }
}

/**
 * Fetches the list of property types (excluding land plots).
 * Handles both direct array response and paginated object response.
 */
export async function getPropertyTypes(): Promise<PropertyType[]> {
    try {
        // Assuming endpoint is /api/v1/catalog/property-types/
        const data = await fetchAPI<PropertyType[] | PaginatedResponse<PropertyType> | any>('/v1/catalog/property-types/');

        // Check if it looks like a paginated response object and has a results array
        if (data && typeof data === 'object' && Array.isArray(data.results)) {
            console.log('getPropertyTypes: Received paginated response, returning results array.');
            return data.results as PropertyType[];
        }
        // Check if it's directly an array
        else if (Array.isArray(data)) {
            console.log('getPropertyTypes: Received direct array response.');
            return data;
        }
        // If it's neither, something is wrong with the API response format
        else {
            console.warn("getPropertyTypes received unexpected data format:", data);
            return [];
        }
    } catch (error) {
        console.error("Failed to fetch property types:", error);
        return []; // Return empty array on error
    }
}

/**
 * Converts backend BackendLandPlot to frontend LandPlot format
 * This adapter preserves the visual structure while adapting data format
 */
function adaptBackendLandPlot(backendPlot: BackendLandPlot): LandPlot {
  // Convert location
  const location: Location = {
    id: parseInt(backendPlot.location.id) || 0,
    region: '', // Backend only provides address
    locality: '', // Backend only provides address
    address_line: backendPlot.location.address,
    latitude: '',
    longitude: '',
  };

  // Convert media files
  // Backend returns type as 'IMAGE' or 'VIDEO' (uppercase enum), convert to lowercase
  const media_files: MediaFile[] = (backendPlot.mediaFiles || []).map((mf) => ({
    id: parseInt(mf.id) || undefined,
    url: mf.url,
    file_url: mf.url,
    type: (mf.type || '').toLowerCase(), // Convert to lowercase: 'IMAGE' -> 'image'
    order: mf.order || 0,
    is_main: (mf.order || 0) === 0, // First file is main
  }));

  // Convert features
  const features: FrontendFeature[] = backendPlot.features.map((f) => ({
    id: parseInt(f.id) || 0,
    name: f.name,
    type: '', // Not provided by backend
    type_display: '', // Not provided by backend
  }));

  // Convert category
  const land_category: FrontendLandCategory | null = backendPlot.category ? {
    id: parseInt(backendPlot.category.id) || 0,
    name: backendPlot.category.name,
  } : null;

  // Map status - backend uses enum values like 'AVAILABLE', 'SOLD', 'RESERVED'
  const statusLower = backendPlot.status.toLowerCase();
  const plot_status: 'available' | 'sold' | 'reserved' = 
    statusLower === 'available' || statusLower === 'sold' || statusLower === 'reserved'
      ? statusLower
      : 'available'; // Default fallback
  const listing_status = backendPlot.isPublished ? 'published' : 'hidden';

  return {
    id: backendPlot.id,
    title: backendPlot.title,
    slug: backendPlot.slug,
    description: backendPlot.description || null,
    location,
    price: backendPlot.price.toString(), // Convert number to string
    listing_status,
    media_files,
    created_at: backendPlot.createdAt,
    updated_at: backendPlot.updatedAt,
    view_count: 0, // Not provided by backend
    area: backendPlot.area.toString(), // Convert number to string
    price_per_are: backendPlot.pricePerHundred.toString(), // Convert number to string
    features,
    land_category,
    land_use_types: backendPlot.permittedUse ? [{
      id: parseInt(backendPlot.permittedUse.id) || 0,
      name: backendPlot.permittedUse.name,
      description: undefined,
    }] : null,
    plot_status,
  };
}

/**
 * Converts snake_case to camelCase for Prisma field names
 */
function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Converts filter params object into URLSearchParams for backend API.
 * Handles conversion from frontend format (ordering) to backend format (sortBy/sortOrder).
 * Converts snake_case field names to camelCase for Prisma compatibility.
 */
function buildFilterParams(filters: FilterParams): URLSearchParams {
    const params = new URLSearchParams();
    
    for (const [key, value] of Object.entries(filters)) {
        if (value === undefined || value === null || value === '') continue;

        // Skip legacy 'ordering' param - we'll convert it below
        if (key === 'ordering') continue;

        if (Array.isArray(value)) {
            // Join array values with commas for backend
            if (value.length > 0) {
                params.set(key, value.join(','));
            }
        } else {
            params.set(key, String(value));
        }
    }

    // Convert legacy 'ordering' to sortBy/sortOrder if present
    if (filters.ordering) {
        const ordering = filters.ordering;
        const fieldName = ordering.startsWith('-') ? ordering.substring(1) : ordering;
        // Convert snake_case to camelCase for Prisma
        const camelFieldName = snakeToCamel(fieldName);
        
        if (ordering.startsWith('-')) {
            params.set('sortBy', camelFieldName);
            params.set('sortOrder', 'desc');
        } else {
            params.set('sortBy', camelFieldName);
            params.set('sortOrder', 'asc');
        }
    } else {
        // Set defaults if not provided
        if (!params.has('sortBy')) {
            params.set('sortBy', 'createdAt');
        }
        if (!params.has('sortOrder')) {
            params.set('sortOrder', 'desc');
        }
    }

    // Also convert sortBy if it's in snake_case
    if (params.has('sortBy')) {
        const sortBy = params.get('sortBy');
        if (sortBy && sortBy.includes('_')) {
            params.set('sortBy', snakeToCamel(sortBy));
        }
    }

    return params;
}

/**
 * Fetches a paginated list of land plots with filtering and sorting.
 * Uses the correct backend endpoint /v1/land-plots and adapts response format.
 */
export async function getLandPlots(filters: FilterParams): Promise<PaginatedResponse<LandPlot>> {
    const params = buildFilterParams(filters);
    try {
        // Use correct backend endpoint
        const backendResponse = await fetchAPI<BackendLandPlotsResponse>('/v1/land-plots', params);
        
        // Adapt backend response to frontend format
        const adaptedResults = backendResponse.landPlots.map(adaptBackendLandPlot);
        
        // Convert to paginated format expected by frontend components
        return {
            count: backendResponse.total,
            next: null, // Backend doesn't provide next/previous URLs, calculate if needed
            previous: null,
            results: adaptedResults,
        };
    } catch (error) {
        console.error("Failed to fetch land plots:", error);
        // Return a default empty response on error
        return { count: 0, next: null, previous: null, results: [] };
    }
}

/**
 * Alias for getLandPlots - kept for backward compatibility
 */
export async function getListingsLandPlots(filters: FilterParams): Promise<PaginatedResponse<LandPlot>> {
    return getLandPlots(filters);
}

/**
 * Fetches a paginated list of generic properties with filtering and sorting.
 * Requires the property_type slug in filters.
 */
export async function getGenericProperties(filters: FilterParams): Promise<PaginatedResponse<GenericProperty>> {
    if (!filters.property_type) {
        console.error("getGenericProperties requires a 'property_type' slug in filters.");
        // Return empty response if required filter is missing
        return { count: 0, next: null, previous: null, results: [] };
    }
    const params = buildFilterParams(filters);
    try {
        // Endpoint should start with a slash
        return await fetchAPI<PaginatedResponse<GenericProperty>>('/v1/catalog/properties/', params);
    } catch (error) {
        console.error("Failed to fetch generic properties:", error);
        return { count: 0, next: null, previous: null, results: [] };
    }
}

// --- Filter Option Fetching Functions (Ensure endpoints are correct) --- //

export async function getLandCategories(): Promise<LandCategory[]> {
    try {
        // Assuming endpoint is /api/v1/catalog/land-categories/
        const data = await fetchAPI<LandCategory[] | any>('/v1/catalog/land-categories/'); 
         if (data && typeof data === 'object' && Array.isArray(data.results)) {
            return data.results;
        } else if (Array.isArray(data)) {
            return data;
        }
        console.warn('getLandCategories received unexpected format:', data);
        return [];
    } catch (error) {
        console.error("Failed to fetch land categories:", error);
        return [];
    }
}

export async function getLandUseTypes(): Promise<LandUseType[]> {
     try {
        // Assuming endpoint is /api/v1/catalog/land-use-types/
        const data = await fetchAPI<LandUseType[] | any>('/v1/catalog/land-use-types/');
         if (data && typeof data === 'object' && Array.isArray(data.results)) {
            return data.results;
        } else if (Array.isArray(data)) {
            return data;
        }
        console.warn('getLandUseTypes received unexpected format:', data);
        return [];
    } catch (error) {
        console.error("Failed to fetch land use types:", error);
        return [];
    }
}

export async function getFeatures(): Promise<Feature[]> {
     try {
        // Assuming endpoint is /api/v1/catalog/features/
        const data = await fetchAPI<Feature[] | any>('/v1/catalog/features/');
         if (data && typeof data === 'object' && Array.isArray(data.results)) {
            return data.results;
        } else if (Array.isArray(data)) {
            return data;
        }
        console.warn('getFeatures received unexpected format:', data);
        return [];
    } catch (error) {
        console.error("Failed to fetch features:", error);
        return [];
    }
}

// Mock helicopter function removed - no longer needed 