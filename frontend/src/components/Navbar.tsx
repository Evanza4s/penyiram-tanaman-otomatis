import React from 'react';
import Image from 'next/image';
import Logo from '@/assets/logo.png';

export function Navbar() {
  return (
    <nav className="w-full border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <div className="bg-primary/20 p-1.5 rounded-lg flex items-center justify-center">
            <Image src={Logo} alt="SmartGarden Logo" className="w-8 h-8 object-contain" />
          </div>
          <span className="font-bold text-xl text-foreground hidden sm:block tracking-tight">SmartGarden</span>
        </div>
        
        {/* User Info Section */}
        <div className="flex flex-col items-end justify-center">
          <span className="text-sm font-medium text-foreground">
            Evanza Agusta Setiawan
          </span>
          <span className="text-xs text-foreground/60">
            NIP 250655001
          </span>
        </div>
      </div>
    </nav>
  );
}
