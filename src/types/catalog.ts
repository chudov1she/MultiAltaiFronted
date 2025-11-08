// Base type for location reused in both listing types
export interface Location {
  id: number;
  region: string;
  locality: string;
  address_line: string;
  latitude: string; // Note: API returns strings, might need parseFloat
  longitude: string; // Note: API returns strings, might need parseFloat
}

// Type for media files (images, documents)
export interface MediaFile {
  id?: number; // Assuming ID might be present
  url: string; // Preferred field, but keeping file_url for compatibility
  file_url?: string; // Add file_url based on API response
  description?: string;
  type?: string; // e.g., 'image', 'document'
  type_display?: string; // e.g., 'Image', 'PDF'
  is_main?: boolean; // Add is_main based on API response
  order?: number;    // Add order based on API response
}

// --- Land Plot Specific Types ---
export interface LandUseType {
  id: number;
  name: string;
  description?: string;
}

export interface LandCategory {
  id: number;
  name: string;
}

export interface Feature {
  id: number;
  name: string;
  type: string;
  type_display: string;
}

// --- Land Plot Detail Response --- 
export interface LandPlotDetail {
  id: number; // For display compatibility
  _originalId?: string; // Original UUID from backend for API calls
  title: string;
  slug: string;
  description: string;
  land_type: string; // e.g., 'standard'
  land_type_display: string; // e.g., 'Стандартный участок'
  location: Location;
  cadastral_numbers?: string | string[];
  land_use_types: LandUseType[];
  land_category: LandCategory | null;
  features: Feature[];
  area: string; // Note: API returns string, might need parseFloat
  price: string; // Note: API returns string, might need parseFloat
  price_per_are?: string; // Note: API returns string, might need parseFloat
  plot_status: string; // e.g., 'available'
  plot_status_display: string; // e.g., 'Доступен'
  listing_status: string; // e.g., 'published'
  listing_status_display: string; // e.g., 'Опубликовано'
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  media_files: MediaFile[];
  // Add other potential fields if they exist in the detail view
}

// --- Property Specific Types ---
export interface PropertyTypeSummary {
  id: number;
  name: string;
  slug: string;
  // Schemas might not be needed in detail view, but keeping as placeholders
  attribute_schema?: Record<string, any>; 
  available_filters?: any[];
}

// --- Generic Property Detail Response --- 
export interface PropertyDetail {
  id: number;
  title: string;
  slug: string;
  description: string;
  property_type: PropertyTypeSummary;
  parent?: any; // Type based on actual parent structure if needed
  children_count?: number;
  location: Location;
  price: string; // Note: API returns string, might need parseFloat
  listing_status: string;
  listing_status_display: string;
  attributes: Record<string, string | number | boolean | null>; // Dynamic attributes
  created_at: string;
  updated_at: string;
  view_count?: number;
  media_files: MediaFile[];
  // Add other potential fields if they exist in the detail view
}

// --- Unified Type (Optional but helpful) ---
// Can use discriminated union based on a common field if available,
// or just a broad type for props if handling differences in the component
export type ListingDetail = LandPlotDetail | PropertyDetail | Helicopter;

// Helper type guard (example)
export function isLandPlotDetail(listing: ListingDetail): listing is LandPlotDetail {
  return (listing as LandPlotDetail).land_type !== undefined;
}

export function isHelicopter(listing: ListingDetail): listing is Helicopter {
  return (listing as Helicopter).model !== undefined;
}

// --- NEW: Define structure for available filters --- //
export interface AvailableFilter {
    param: string;  // e.g., "attr_area_sqm", "attr_has_balcony"
    label: string;  // e.g., "Площадь (кв.м.)", "Балкон/Лоджия"
    type: 'range' | 'boolean' | 'select' | 'multiselect' | 'text'; // Add other types as needed
    // Optional: Add choices for select/multiselect if provided by API
    choices?: Array<{ value: string | number; label: string }>;
}

export interface PropertyType {
  id: number;
  name: string;
  slug: string;
  attribute_schema: Record<string, any> | null; // JSON Schema for attributes
  available_filters?: AvailableFilter[]; // Add the new optional field
  // Add other property type fields if available
}

// Backend API Response Types (from LandPlotResponseDto)
export interface BackendLocation {
  id: string;
  address: string;
}

export interface BackendCategory {
  id: string;
  name: string;
}

export interface BackendPermittedUse {
  id: string;
  name: string;
}

export interface BackendCommunication {
  id: string;
  name: string;
}

export interface BackendFeature {
  id: string;
  name: string;
}

export interface BackendMediaFile {
  id: string;
  url: string;
  type: string;
  order: number;
}

export interface BackendDocumentFile {
  id: string;
  url: string;
  name: string;
}

// Backend LandPlot Response (from API)
export interface BackendLandPlot {
  id: string;
  title: string;
  slug: string;
  plotType: string; // PlotType enum
  description: string;
  isPublished: boolean;
  status: string; // LandPlotStatus enum
  location: BackendLocation;
  cadastralNumbers: string[];
  category: BackendCategory;
  permittedUse: BackendPermittedUse;
  area: number; // In 'sotka'
  price: number;
  pricePerHundred: number;
  communications: BackendCommunication[];
  features: BackendFeature[];
  mediaFiles: BackendMediaFile[];
  documentFiles: BackendDocumentFile[];
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

// Backend API Response Format
export interface BackendLandPlotsResponse {
  landPlots: BackendLandPlot[];
  total: number;
}

// Base interface for common listing properties (for frontend compatibility)
interface BaseListing {
  id: number | string; // Support both for compatibility
  title: string;
  slug: string;
  description?: string | null;
  location: Location;
  price: string; // Keep as string for display, format later
  listing_status: 'published' | 'hidden' | 'sold' | 'reserved'; // Add other statuses if needed
  media_files: MediaFile[];
  created_at: string;
  updated_at: string;
  view_count?: number; // Optional, may not be in backend response
}

export interface LandPlot extends BaseListing {
  area: string; // In 'sotka' - converted from number
  price_per_are: string; // Converted from pricePerHundred
  features: Feature[];
  land_category?: LandCategory | null; // Optional? Check API response
  land_use_types?: LandUseType[] | null; // Optional? Check API response
  plot_status?: 'available' | 'sold' | 'reserved'; // Add other statuses if needed
  // Specific LandPlot fields here
}

export interface GenericProperty extends BaseListing {
  property_type: PropertyType;
  attributes: Record<string, any>; // Dynamic attributes based on property_type.attribute_schema
  // Specific GenericProperty fields here (if any beyond attributes)
}

// --- Helicopter Type ---
export interface Helicopter extends BaseListing {
  model: string;
  capacity: string;
  engine: string;
  max_speed: string;
  range: string;
  features: string[];
  // Helicopter-specific fields
}

// Union type for any listing
export type Listing = LandPlot | GenericProperty | Helicopter;

// Type for the paginated API response
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Type for filter parameters (matching backend QueryLandPlotDto)
export interface FilterParams {
  page?: number;
  limit?: number;
  plotType?: string; // PlotType enum
  status?: string; // LandPlotStatus enum
  categoryId?: string;
  locationId?: string;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  search?: string;
  sortBy?: string; // Default: 'createdAt'
  sortOrder?: 'asc' | 'desc'; // Default: 'desc'
  // Legacy support for ordering (will be converted to sortBy/sortOrder)
  ordering?: string;
  [key: string]: any; // Allow for dynamic filter keys
}

// Type for sorting options
export interface SortingOption {
    value: string;
    label: string;
    iconName?: string; // Имя иконки вместо компонента React
} 