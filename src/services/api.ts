import { MeterData } from '../types';

// Use relative path to leverage Vite proxy in development
const API_BASE_URL = '/api/v1';
const API_TOKEN = 'fc186709d0cf8bfa4bf5d8567c2456c3178abb51';

export const getMeterStatus = async (value: string, type: 'serial' | 'account'): Promise<MeterData> => {
  try {
    // The API seems to work with /meter/{serial}
    // We'll assume 'value' is the identifier. 
    // If searching by account is supported by the same endpoint, we use it.
    // Otherwise, we might need a different endpoint. 
    // Given test-api.js only shows /meter/, we'll use that.
    
    // Also, handling the case where type is account might be tricky without docs.
    // For now, we will try to query the same endpoint.
    
    const response = await fetch(`${API_BASE_URL}/meter/${value}`, {
      headers: {
        'Authorization': `Token ${API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Прибор не найден');
      }
      throw new Error('Ошибка сети');
    }

    const data = await response.json();

    // The API returns a single object based on test-api.js implication, 
    // OR maybe it returns a list? 
    // Let's assume it returns the meter detail object directly.
    // We need to map the fields carefully.
    // Based on previous code, we had mapping logic.
    // Let's try to map what we can.
    
    const detailData = data;

    return {
      address: `${detailData.street || ''}, ${detailData.house || ''}${detailData.apartment ? ', кв. ' + detailData.apartment : ''}`,
      account: detailData.account_id || 'Не указан',
      serial: detailData.serial_number || value,
      reading: detailData.last_reading,
      last_update: detailData.reading_dt || new Date().toISOString(),
      status: detailData.is_active ? 'online' : 'offline',
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
      coverage: detailData.coverage // Assuming this field exists or was added
    };
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
