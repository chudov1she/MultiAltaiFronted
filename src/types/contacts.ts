// Type for Working Hours entry
export interface WorkingHour {
  day_of_week: number; // 0 = Monday, 6 = Sunday
  start_time: string | null;
  end_time: string | null;
  is_active: boolean;
}

// Backend API response type (raw from /api/v1/contacts)
export interface ContactApiResponse {
  id: string;
  phone: string | null;
  whatsapp: string | null;
  telegram: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  workTimeFrom: string | null;
  workTimeTo: string | null;
  createdAt: string;
  updatedAt: string;
}

// Main Contact Information type (adapted for frontend)
export interface ContactInfo {
  id: string;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  office_address: string | null;
  created_at: string;
  updated_at: string;
  working_hours: WorkingHour[];
} 