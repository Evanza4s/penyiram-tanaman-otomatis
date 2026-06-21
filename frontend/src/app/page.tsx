'use client';

import React from 'react';
import { useMqtt } from '@/hooks/useMqtt';
import { StatsCard } from '@/components/StatsCard';
import { SensorChart } from '@/components/SensorChart';
import { PumpSwitcher } from '@/components/PumpSwitcher';
import { Droplets, Activity, Wifi, WifiOff, Waves } from 'lucide-react';

export default function Home() {
  const { isConnected, sensorHistory, currentMoisture, waterDistance, pumpStatusStr, isPumpOn, togglePump } = useMqtt();

  const isWaterEmpty = waterDistance >= 20;

  return (
    <main className="min-h-screen p-6 md:p-12 lg:p-24 max-w-7xl mx-auto flex flex-col gap-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-foreground tracking-tight">Smart Garden</h1>
          <p className="text-foreground/60 mt-1">Sistem Penyiram Tanaman Otomatis</p>
        </div>

        <div className="flex items-center gap-2 glass px-4 py-2 rounded-full w-fit">
          {isConnected ? (
            <Wifi className="w-4 h-4 text-accent animate-pulse" />
          ) : (
            <WifiOff className="w-4 h-4 text-red-500" />
          )}
          <span className="text-sm font-medium text-foreground/80">
            {isConnected ? 'MQTT Terhubung' : 'Terputus'}
          </span>
        </div>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Kelembapan Tanah"
          value={`${currentMoisture.toFixed(1)}%`}
          description={currentMoisture < 30 ? "Tanah kering, butuh disiram" : "Kelembapan optimal"}
          icon={Droplets}
        />
        <StatsCard
          title="Sisa Air Tandon"
          value={isWaterEmpty ? "HABIS" : "TERSEDIA"}
          description={`Jarak sensor: ${waterDistance.toFixed(1)} cm`}
          icon={Waves}
          className={isWaterEmpty ? "border-red-500/50 shadow-lg shadow-red-500/10" : ""}
        />
        <StatsCard
          title="Status Pompa Air"
          value={isPumpOn ? "AKTIF" : "MATI"}
          description={pumpStatusStr}
          icon={Activity}
          className={isPumpOn ? "border-accent/50 shadow-lg shadow-accent/10" : ""}
        />
        <PumpSwitcher isOn={isPumpOn} onToggle={togglePump} />
      </section>
      <section className="w-full">
        <SensorChart data={sensorHistory} />
      </section>
    </main>
  );
}
