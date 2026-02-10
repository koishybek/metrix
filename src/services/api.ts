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

// Helper to generate mock history
const generateMockHistory = (currentReading: number, count: number = 7) => {
  const history = [];
  let reading = currentReading;
  
  for (let i = 0; i < count; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Random consumption between 0.1 and 0.5
    const consumption = 0.1 + Math.random() * 0.4;
    reading = Math.max(0, reading - consumption);
    
    history.push({
      date: date.toISOString().split('T')[0],
      reading: reading,
      consumption: consumption
    });
  }
  
  return history.reverse();
};

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
    const currentReading = detailData.reading ?? detailData.last_reading ?? 0;

    // Use sent_date as the primary source for last update
    const lastUpdateDate = detailData.sent_date || detailData.reading_dt;
    
    // Calculate status based on lastUpdateDate (offline if > 2 days)
    let status: 'online' | 'offline' = 'offline';
    if (lastUpdateDate) {
      const lastUpdate = new Date(lastUpdateDate);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - lastUpdate.getTime());
      const diffHours = diffTime / (1000 * 60 * 60);
      
      if (diffHours <= 48) {
        status = 'online';
      }
    }

    // Use serial number as account name if account_id is missing, as requested
    const accountName = detailData.account_id || `Счетчик ${detailData.serial_number || value}`;

    return {
      address: `${detailData.street || ''}, ${detailData.house || ''}${detailData.apartment ? ', кв. ' + detailData.apartment : ''}`,
      account: accountName,
      serial: detailData.serial_number || value,
      reading: currentReading, 
      last_update: lastUpdateDate || detailData.join_date || new Date().toISOString(),
      status: status, 
      last_consumption: 0.1 + Math.random() * 0.2, // Mock daily consumption for now
      history: generateMockHistory(currentReading), // Generate mock history for the chart
      
      // Extended fields
      consumer: detailData.consumer, // Keep consumer as is
      device_eui: detailData.device__eui,
      device_type: detailData.device__type__name,
      resource_type: detailData.resource_type__name,
      join_date: detailData.join_date,
      initial_reading: detailData.join_reading,
      check_date: detailData.check_date,
      coverage: detailData.coverage || 'good' 
    };
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
