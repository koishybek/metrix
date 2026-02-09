import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { MeterData } from "../types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateWhatsAppLink = (
  context: {
    type: 'meter_detail' | 'not_found';
    meter?: MeterData;
    searchValue?: string;
    userPhone?: string;
  }
) => {
  const PHONE_NUMBER = '77776291638';
  let message = '';

  if (context.type === 'meter_detail' && context.meter) {
    const m = context.meter;
    const signalText = 
      m.coverage === 'excellent' ? 'Отличное' : 
      m.coverage === 'good' ? 'Хорошее' : 
      m.coverage === 'satisfactory' ? 'Удовлетворительное' : 
      m.coverage === 'poor' ? 'Плохое' : 'Неизвестно';

    const statusText = m.status === 'online' ? 'На связи' : 'Не на связи';
    const date = new Date(m.last_update).toLocaleString('ru-RU', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    message = `Серийный номер: ${m.serial}
Лицевой счёт: ${m.account}
Адрес: ${m.address}
Текущее показание: ${m.reading} м³
Обновлено: ${date}
Статус: ${statusText}
Уровень сигнала: ${signalText}
Мой вопрос / проблема: `;
  } 
  
  else if (context.type === 'not_found') {
    message = `Здравствуйте!
Я не могу найти прибор в системе.
Вводил данные: ${context.searchValue || '---'}
Мой номер: ${context.userPhone || 'Не указан'}
Прошу помочь разобраться.`;
  }

  return `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
};
