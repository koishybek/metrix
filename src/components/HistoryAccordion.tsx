import React, { useState } from 'react';
import { ChevronDown, ChevronUp, History } from 'lucide-react';
import { ReadingHistory } from '../types';

interface HistoryAccordionProps {
  history: ReadingHistory[];
}

export const HistoryAccordion: React.FC<HistoryAccordionProps> = ({ history }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!history || history.length === 0) return null;

  return (
    <div className="mt-6 border rounded-lg overflow-hidden bg-background">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-muted/30 hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-2 font-medium text-foreground">
          <History className="w-4 h-4 text-primary" />
          <span>Посмотреть последние показания</span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        )}
      </button>

      {isOpen && (
        <div className="divide-y divide-border">
          <div className="grid grid-cols-3 gap-2 p-3 bg-muted/10 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            <div>Дата</div>
            <div className="text-right">Показание</div>
            <div className="text-right">Расход</div>
          </div>
          {history.map((item, index) => (
            <div key={index} className="grid grid-cols-3 gap-2 p-3 text-sm hover:bg-muted/5 transition-colors">
              <div className="text-foreground">
                {new Date(item.date).toLocaleDateString('ru-RU')}
                <div className="text-xs text-muted-foreground">
                  {new Date(item.date).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              <div className="text-right font-medium text-foreground">
                {item.reading.toFixed(3)} м³
              </div>
              <div className="text-right text-muted-foreground">
                {item.consumption.toFixed(3)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
