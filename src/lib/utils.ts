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

export const compressImage = async (file: File, maxWidth = 600, quality = 0.5): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const newFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(newFile);
            } else {
              reject(new Error('Canvas is empty'));
            }
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};
