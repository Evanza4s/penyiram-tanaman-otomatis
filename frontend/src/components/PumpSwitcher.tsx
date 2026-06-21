import React from 'react';
import { cn } from '@/lib/utils';
import { Power } from 'lucide-react';

interface PumpSwitcherProps {
  isOn: boolean;
  onToggle: (state: boolean) => void;
}

export function PumpSwitcher({ isOn, onToggle }: PumpSwitcherProps) {
  return (
    <div className="glass p-6 rounded-2xl flex flex-col gap-4 relative overflow-hidden group h-full">
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all duration-500"></div>
      
      <div className="flex items-center justify-between z-10">
        <div>
          <h3 className="text-sm font-medium text-foreground/70">Kontrol Pompa</h3>
          <p className="text-lg font-bold text-foreground mt-2">{isOn ? 'Aktif' : 'Mati'}</p>
        </div>
      </div>

      <div className="flex-1 flex items-end justify-start z-10">
        <button
          onClick={() => onToggle(!isOn)}
          className={cn(
            "relative flex items-center justify-center w-14 h-14 rounded-full transition-all duration-300 shadow-lg",
            isOn
              ? "bg-accent text-accent-foreground shadow-accent/40"
              : "bg-card text-foreground/50 border border-border shadow-black/20 hover:text-foreground hover:bg-card/80"
          )}
        >
          {isOn && (
            <div className="absolute inset-0 bg-accent rounded-full blur-md opacity-60 animate-pulse"></div>
          )}
          <Power className={cn("w-6 h-6 relative z-10 transition-transform duration-300", isOn ? "scale-110" : "scale-100")} />
        </button>
      </div>
    </div>
  );
}
