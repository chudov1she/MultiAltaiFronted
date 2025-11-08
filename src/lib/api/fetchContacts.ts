import { Contact, WorkingHours } from '@/types/site';
import { ContactApiResponse } from '@/types/contacts';
import { getApiBaseUrl } from './utils';

/**
 * Генерирует массив working_hours из workTimeFrom/workTimeTo
 */
function generateWorkingHours(
  workTimeFrom: string | null,
  workTimeTo: string | null
): WorkingHours[] {
  const workingHours: WorkingHours[] = [];
  
  if (!workTimeFrom || !workTimeTo) {
    for (let day = 0; day < 7; day++) {
      workingHours.push({
        id: day + 1,
        day_of_week: day as 0 | 1 | 2 | 3 | 4 | 5 | 6,
        start_time: null,
        end_time: null,
        is_active: false,
      });
    }
    return workingHours;
  }

  for (let day = 0; day < 7; day++) {
    const isWeekend = day === 5 || day === 6;
    workingHours.push({
      id: day + 1,
      day_of_week: day as 0 | 1 | 2 | 3 | 4 | 5 | 6,
      start_time: isWeekend ? null : workTimeFrom,
      end_time: isWeekend ? null : workTimeTo,
      is_active: !isWeekend,
    });
  }

  return workingHours;
}

/**
 * Преобразует ответ API в формат Contact для frontend
 */
function adaptContactResponse(apiResponse: ContactApiResponse): Contact {
  const workingHours = generateWorkingHours(
    apiResponse.workTimeFrom,
    apiResponse.workTimeTo
  );

  return {
    id: apiResponse.id,
    phone: apiResponse.phone,
    whatsapp: apiResponse.whatsapp,
    telegram: apiResponse.telegram,
    email: null,
    address: apiResponse.address,
    office_address: apiResponse.address,
    latitude: apiResponse.latitude,
    longitude: apiResponse.longitude,
    workTimeFrom: apiResponse.workTimeFrom,
    workTimeTo: apiResponse.workTimeTo,
    createdAt: apiResponse.createdAt,
    updatedAt: apiResponse.updatedAt,
    working_hours: workingHours,
  };
}

/**
 * Получает основную контактную информацию из backend.
 * Использует новый endpoint: /api/v1/contacts
 * Возвращает null, если данные недоступны или пустые
 */
export async function fetchPrimaryContact(): Promise<Contact | null> {
  const baseUrl = getApiBaseUrl();
  const endpoint = '/v1/contacts';
  const apiUrl = `${baseUrl}${endpoint}`;

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error(`Error fetching primary contact: ${response.status} ${response.statusText}`);
      return null;
    }

    const data: ContactApiResponse = await response.json();
    
    // Если все поля пустые, возвращаем null
    if (!data.phone && !data.whatsapp && !data.address && !data.workTimeFrom) {
      return null;
    }
    
    return adaptContactResponse(data);
  } catch (error) {
    console.error('Error fetching or parsing primary contact data:', error);
    return null;
  }
}
