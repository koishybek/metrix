export interface ReadingHistory {
  date: string;
  reading: number;
  consumption: number;
}

export interface MeterData {
  address: string;
  account: string;
  serial: string;
  reading: number;
  last_update: string;
  status: 'online' | 'offline';
  last_consumption?: number;
  coverage?: 'excellent' | 'good' | 'satisfactory' | 'poor';
  history?: ReadingHistory[];
  
  // New fields based on real API
  consumer?: string;
  device_eui?: string;
  device_type?: string;
  resource_type?: string;
  join_date?: string;
  initial_reading?: number;
  check_date?: string | null;
}

export interface ApiMeterResult {
  id: number;
  node__name: string;
  type__name: string;
  resource_type__name: string;
  device__eui: string;
  device__type__name: string;
  street: string;
  house: string;
  reading: number;
  reading_dt: string | null;
  serial_number: string;
  description: string | null;
  port: number;
  join_date: string;
  check_date: string | null;
  join_reading: number;
  sent_date: string;
  last_reading: number;
  upload_date: string | null;
  upload_status: string | null;
  is_active: boolean;
  client_sector: string;
  avatar: string | null;
  address_code: string | null;
  additional_data: string | null;
  consumer: string;
  apartment: string | null;
  phone: string | null;
  account_id: string | null;
  device_mode: number;
  type: number;
  object_type: number;
  installation_place: number;
  device: number;
  resource_type: number;
  node: number;
  installation: number | null;
}

export interface ApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ApiMeterResult[];
}

export interface RecentSearch {
  value: string;
  type: 'serial' | 'account';
  date: string;
  found: boolean;
}

export interface AppState {
  searchValue: string;
  searchType: 'serial' | 'account';
  isLoading: boolean;
  meterData: MeterData | null;
  error: string | null;
  showHistory: boolean;
  recentSearches: RecentSearch[];
}
