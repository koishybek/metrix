import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { PhotoUpload } from './PhotoUpload';

interface FAQItem {
  question: string;
  answer: React.ReactNode;
}

const faqs: FAQItem[] = [
  {
    question: 'Почему модем не на связи?',
    answer: 'Возможные причины: разрядилась батарея, слабый уровень сигнала, технические работы на базовой станции или механическое повреждение устройства. Если связь отсутствует более 3 дней, рекомендуем оставить заявку.'
  },
  {
    question: 'Что делать, если водоканал звонит?',
    answer: 'Если водоканал сообщает о проблемах с передачей данных, проверьте статус счётчика в этом приложении. Если статус "На связи" и показания актуальны, сообщите оператору водоканала, что данные передаются. В противном случае обратитесь в нашу поддержку.'
  },
  {
    question: 'Как передать показания вручную?',
    answer: (
      <div className="space-y-3">
        <p>Если автоматическая передача не работает, вы можете сфотографировать счётчик прямо сейчас. Мы обработаем фото и обновим данные.</p>
        <PhotoUpload />
      </div>
    )
  },
  {
    question: 'Как часто обновляются данные?',
    answer: 'Обычно данные обновляются раз в сутки. В некоторых случаях (например, при аварийных ситуациях) чаще. Если данные не обновлялись более 24 часов, это не всегда означает неисправность.'
  }
];

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="w-full max-w-2xl mx-auto mt-12 mb-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex items-center gap-2 mb-6 px-2">
        <HelpCircle className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-bold text-foreground">Часто задаваемые вопросы</h2>
      </div>
      
      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <div 
            key={index}
            className="bg-card rounded-xl border border-border overflow-hidden transition-all duration-200"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/30 transition-colors"
            >
              <span className="font-medium text-foreground pr-4">{faq.question}</span>
              {openIndex === index ? (
                <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              ) : (
                <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              )}
            </button>
            
            <div 
              className={cn(
                "overflow-hidden transition-all duration-300 ease-in-out",
                openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              )}
            >
              <div className="p-4 pt-0 text-sm text-muted-foreground leading-relaxed bg-muted/10 border-t border-border/50">
                {faq.answer}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
