import { MeterData } from '../types';

// Use relative path to leverage Vite proxy in development
const API_BASE_URL = '/api/v1';
const API_TOKEN = 'fc186709d0cf8bfa4bf5d8567c2456c3178abb51';

interface ApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: any[];
}

export const getMeterStatus = async (value: string, type: 'serial' | 'account'): Promise<MeterData> => {
  try {
    // Correct endpoint is /meter/ (singular) and filter uses 'search' parameter
    const response = await fetch(`${API_BASE_URL}/meter/?search=${value}`, {
      headers: {
        'Authorization': `Token ${API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Прибор не найден');
      }
      throw new Error(`Ошибка сети: ${response.status} ${response.statusText}`);
    }

    const data: ApiResponse = await response.json();

    if (data.count === 0 || !data.results || data.results.length === 0) {
      throw new Error('Прибор не найден');
    }

    // Use the first result
    const detailData = data.results[0];

    return {
      address: `${detailData.street || ''}, ${detailData.house || ''}${detailData.apartment ? ', кв. ' + detailData.apartment : ''}`,
      account: detailData.account_id || 'Не указан',
      serial: detailData.serial_number || value,
      reading: detailData.reading || 0, // In list it's 'reading', not 'last_reading'
      last_update: detailData.reading_dt || new Date().toISOString(),
      status: detailData.is_active !== false ? 'online' : 'offline', // Assuming active unless false
      last_consumption: 0,
      history: [], 
      
      // Extended fields
      consumer: detailData.consumer,
      device_eui: detailData.device__eui,
      device_type: detailData.device__type__name,
      resource_type: detailData.resource_type__name,
      join_date: detailData.join_date,
      initial_reading: detailData.join_reading,
      check_date: detailData.check_date,
      coverage: detailData.coverage || 'good' // Default to good if not provided
    };
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
