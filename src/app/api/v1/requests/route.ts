import { NextRequest, NextResponse } from 'next/server';

interface ApplicationRequestBody {
  name: string;
  phone: string;
  email?: string | null;
  user_message?: string;
  request_type: string;
  status: string;
  related_object_content_type_app_label?: string;
  related_object_model_name?: string;
  related_object_id?: number;
}

// Обработка CORS preflight запросов
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body: ApplicationRequestBody = await request.json();
    
    // Валидация обязательных полей
    if (!body.name || !body.phone) {
      return NextResponse.json(
        { error: 'Имя и телефон обязательны' },
        { status: 400 }
      );
    }

    // Проверяем формат телефона (должен содержать минимум 11 цифр)
    const cleanPhone = body.phone.replace(/\D/g, '');
    if (cleanPhone.length < 11) {
      return NextResponse.json(
        { error: 'Некорректный формат телефона' },
        { status: 400 }
      );
    }

    // Отправляем данные на внешний бэкенд
    if (!process.env.BACKEND_API_URL) {
      return NextResponse.json(
        { error: 'BACKEND_API_URL environment variable is not set' },
        { status: 500 }
      );
    }
    
    const response = await fetch(`${process.env.BACKEND_API_URL}/v1/requests/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...body,
        phone: cleanPhone, // Отправляем чистый номер
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Backend API error:', response.status, errorData);
      
      return NextResponse.json(
        { error: 'Ошибка на сервере' },
        { status: response.status }
      );
    }

    const result = await response.json();
    
    return NextResponse.json({
      success: true,
      message: 'Заявка успешно отправлена',
      data: result
    });

  } catch (error) {
    console.error('Application submission error:', error);
    
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
