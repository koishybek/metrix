import { MeterData, ApiResponse } from '../types';

// Use relative path to leverage Vite proxy in development
const API_BASE_URL = '/api/v1';

export const getMeterStatus = async (value: string, type: 'serial' | 'account'): Promise<MeterData> => {
  try {
    const searchParam = type === 'serial' ? `serial_number=${value}` : `account_id=${value}`;
    const response = await fetch(`${API_BASE_URL}/meters/?${searchParam}`);
    
    if (!response.ok) {
      throw new Error('Ошибка сети');
    }

    const data: ApiResponse = await response.json();

    if (data.count === 0 || !data.results || data.results.length === 0) {
      throw new Error('Прибор не найден');
    }

    const detailData = data.results[0];

    // Map API response to MeterData
    return {
      address: `${detailData.street}, ${detailData.house}${detailData.apartment ? ', кв. ' + detailData.apartment : ''}`,
      account: detailData.account_id || 'Не указан',
      serial: detailData.serial_number,
      reading: detailData.last_reading,
      last_update: detailData.reading_dt || new Date().toISOString(),
      status: detailData.is_active ? 'online' : 'offline',
      last_consumption: 0, // This would ideally come from a history endpoint
      history: [], // Placeholder
      
      // Extended fields
      consumer: detailData.consumer,
      device_eui: detailData.device__eui,
      device_type: detailData.device__type__name,
      resource_type: detailData.resource_type__name,
      join_date: detailData.join_date,
      initial_reading: detailData.join_reading,
      check_date: detailData.check_date
    };
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
