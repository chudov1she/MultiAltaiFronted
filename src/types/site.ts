export interface MenuItem {
  id: number | string; // Используем number или string для гибкости
  title: string;
  path: string;
}

export interface LogoData {
  src?: string; // Сделаем необязательным, можно использовать дефолтное значение
  alt?: string; // Сделаем необязательным
}

export interface HeaderData {
  logo: LogoData;
  menu: MenuItem[];
  phone: string;
}

// --- Типы для Footer --- 
export interface SocialLink {
  id: number | string;
  name: string;
  icon: string; // Ключ для объекта socialIcons
  url: string;
}

export interface ContactDetails {
  phone: string;
  email: string;
  address: string;
  workingHours: string;
}

export interface PolicyLink {
  text: string;
  url: string;
}

// Тип для одного дня рабочего времени (из API)
export interface WorkingHours {
  id: number;
  day_of_week: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Понедельник, 6 = Воскресенье
  start_time: string | null; // Формат "HH:MM"
  end_time: string | null;
  is_active: boolean; // true - рабочий день, false - выходной
}

// Тип для контактных данных из backend API (/api/v1/contacts)
export interface Contact {
  id: string; // UUID из backend
  phone: string | null;
  whatsapp: string | null;
  telegram: string | null;
  email: string | null; // Fallback, так как нет в backend
  address: string | null; // Из backend (используем как office_address)
  office_address: string | null; // Маппим из address для совместимости
  latitude: number | null;
  longitude: number | null;
  workTimeFrom: string | null; // Формат "HH:MM"
  workTimeTo: string | null; // Формат "HH:MM"
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  working_hours: WorkingHours[]; // Генерируем из workTimeFrom/workTimeTo для совместимости
}

// Тип для данных футера, обновляем поле contacts
export interface FooterData {
  logo: LogoData;
  companyDescription: string;
  socialLinks: SocialLink[];
  menu: MenuItem[];
  contacts: Contact | null; // Используем новый тип Contact, может быть null если не загрузились
  copyright: string;
  privacyPolicy: {
    text: string;
    url: string;
  };
}
// --- Конец типов для Footer --- 

// Можно добавить и другие типы для сайта здесь 