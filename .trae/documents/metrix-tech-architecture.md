## 1. Architecture design

```mermaid
graph TD
  A[User Browser] --> B[React SPA]
  B --> C[Axios HTTP Client]
  C --> D[SmartMetrix API]
  
  subgraph "Frontend Layer"
    B
    C
  end
  
  subgraph "External Services"
    D
  end
```

## 2. Technology Description

* Frontend: React\@18 + Tailwind CSS\@3 + Vite

* HTTP Client: Axios

* Build Tool: Vite

* Initialization Tool: vite-init

* Backend: None (direct API integration)

## 3. Route definitions

| Route | Purpose                                          |
| ----- | ------------------------------------------------ |
| /     | Главная страница с формой ввода серийного номера |
| /     | Результат проверки счётчика (SPA, без смены URL) |

## 4. API definitions

### 4.1 SmartMetrix API Integration

**Base Configuration:**

```javascript
const API_CONFIG = {
  BASE_URL: 'https://sm.iot-exp.kz/api/v1/meter/',
  TOKEN: 'fc186709d0cf8bfa4bf5d8567c2456c3178abb51',
  TIMEOUT: 10000 // 10 секунд
};
```

**Get Meter Status:**

```
GET https://sm.iot-exp.kz/api/v1/meter/{serial_number}
```

**Headers:**

```
Authorization: Token fc186709d0cf8bfa4bf5d8567c2456c3178abb51
Content-Type: application/json
```

**Response Types:**

Success Response (200):

```json
{
  "success": true,
  "meter": {
    "address": "ЖК \"Aiqyn\", квартира 112, улица Алихана Бокейхана, 112",
    "account": "10743471",
    "serial": "10743471",
    "reading": 15.785,
    "last_update": "2026-02-06T19:12:24",
    "status": "online",
    "last_consumption": 0.257,
    "coverage": "satisfactory",
    "history": [
      {
        "date": "2026-02-06T19:12:31",
        "reading": 15.785,
        "consumption": 0.257
      }
    ]
  }
}
```

Error Response (404):

```json
{
  "success": false,
  "error": "Meter not found"
}
```

**TypeScript Interfaces:**

```typescript
interface MeterData {
  address: string;
  account: string;
  serial: string;
  reading: number;
  last_update: string;
  status: 'online' | 'offline';
  last_consumption?: number;
  coverage?: 'excellent' | 'good' | 'satisfactory' | 'poor';
  history?: ReadingHistory[];
}

interface ReadingHistory {
  date: string;
  reading: number;
  consumption: number;
}

interface ApiResponse {
  success: boolean;
  meter?: MeterData;
  error?: string;
}
```

## 5. Component Architecture

```mermaid
graph TD
  A[App.jsx] --> B[Header]
  A --> C[MainContent]
  C --> D[InputForm]
  C --> E[LoadingSpinner]
  C --> F[ResultCard]
  C --> G[NoData]
  F --> H[HistoryAccordion]
  
  subgraph "React Components"
    A
    B
    C
    D
    E
    F
    G
    H
  end
```

**Component Structure:**

* `App.jsx` - Корневой компонент, управление состоянием

* `Header.jsx` - Логотип и слоган

* `InputForm.jsx` - Форма ввода серийного номера

* `LoadingSpinner.jsx` - Индикатор загрузки

* `ResultCard.jsx` - Карточка с данными счётчика

* `HistoryAccordion.jsx` - Аккордеон с историей показаний

* `NoData.jsx` - Блок при отсутствии данных

* `ErrorMessage.jsx` - Сообщение об ошибке API

## 6. State Management

**Local State (useState):**

```typescript
interface AppState {
  serialNumber: string;
  isLoading: boolean;
  meterData: MeterData | null;
  error: string | null;
  showHistory: boolean;
}
```

**LocalStorage:**

* `lastSerialNumber` - Последний введённый серийный номер

## 7. Error Handling

**API Errors:**

* Network timeout (>10 секунд)

* 404 - Счётчик не найден

* 401/403 - Ошибка авторизации

* 500+ - Серверная ошибка

**User-Friendly Messages:**

* "Ошибка связи, попробуйте позже"

* "Счётчик не найден, проверьте номер"

* "Превышено время ожидания ответа"

## 8. Performance Optimization

**Code Splitting:**

* Lazy loading для компонентов результатов

**Caching:**

* LocalStorage для последнего введённого номера

* Memo для компонентов с тяжёлыми вычислениями

**Bundle Size:**

* Tree shaking для неиспользуемого кода

* Минификация CSS и JS в production

## 9. Deployment Configuration

**Vercel/Netlify Setup:**

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install"
}
```

**Environment Variables:**

* `VITE_API_BASE_URL` - URL API SmartMetrix

* `VITE_API_TOKEN` - Токен авторизации

* `VITE_SUPPORT_PHONE` - Телефон поддержки

* `VITE_SUPPORT_WHATSAPP` - WhatsApp поддержки

