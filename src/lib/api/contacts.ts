import { ContactInfo, ContactApiResponse } from "@/types/contacts";
import { Contact, WorkingHours } from "@/types/site";
import { getApiBaseUrl } from './utils';

/**
 * Генерирует массив working_hours из workTimeFrom/workTimeTo
 * Создает записи для всех дней недели (0-6), где 0 = Понедельник
 */
function generateWorkingHours(
  workTimeFrom: string | null,
  workTimeTo: string | null
): WorkingHours[] {
  const workingHours: WorkingHours[] = [];
  
  // Если время не указано, все дни выходные
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

  // Генерируем рабочие дни (Пн-Пт = 0-4) с указанным временем
  // Сб-Вс (5-6) - выходные
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
    email: null, // Нет в backend, используем null
    address: apiResponse.address,
    office_address: apiResponse.address, // Маппим для совместимости
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
 * Преобразует ответ API в формат ContactInfo для frontend
 */
function adaptContactInfo(apiResponse: ContactApiResponse): ContactInfo {
  const workingHours = generateWorkingHours(
    apiResponse.workTimeFrom,
    apiResponse.workTimeTo
  ).map((wh) => ({
    day_of_week: wh.day_of_week,
    start_time: wh.start_time,
    end_time: wh.end_time,
    is_active: wh.is_active,
  }));

  return {
    id: apiResponse.id,
    phone: apiResponse.phone || '',
    whatsapp: apiResponse.whatsapp,
    email: null,
    office_address: apiResponse.address,
    created_at: apiResponse.createdAt,
    updated_at: apiResponse.updatedAt,
    working_hours: workingHours,
  };
}

/**
 * Получает контактную информацию из backend API
 * Использует новый endpoint: /api/v1/contacts
 * Возвращает null, если данные недоступны или пустые
 */
export async function getContacts(): Promise<ContactInfo | null> {
  const baseUrl = getApiBaseUrl();
  const endpoint = '/v1/contacts';
  const url = `${baseUrl}${endpoint}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error(`[getContacts] API error: ${response.status} ${response.statusText}`);
      return null;
    }

    const data: ContactApiResponse = await response.json();
    
    // Если все поля пустые, возвращаем null
    if (!data.phone && !data.whatsapp && !data.address && !data.workTimeFrom) {
      console.warn(`[getContacts] Backend returned empty data`);
      return null;
    }
    
    const adapted = adaptContactInfo(data);
    return adapted;
  } catch (error) {
    console.error(`[getContacts] Network error:`, error);
    return null;
  }
}
