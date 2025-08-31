import { useState, useEffect, useCallback } from 'react';

export interface SystemData {
  cpu: {
    usage: number;
    temperature: number;
    frequency: number;
    cores: Array<{ usage: number; temperature: number }>;
  };
  battery: {
    level: number;
    isCharging: boolean;
    health: number;
    cycleCount: number;
    temperature: number;
    voltage: number;
    timeRemaining: number | null;
  };
  memory: {
    total: number;
    used: number;
    free: number;
    usage: number;
  };
  system: {
    manufacturer: string;
    model: string;
    os: string;
    arch: string;
    cpuManufacturer: string;
    cpuBrand: string;
    cpuCores: number;
    cpuSpeed: number;
  };
}

export const useSystemData = () => {
  const [data, setData] = useState<SystemData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      if (!window.electronAPI) {
        // Fallback to simulated data if not in Electron
        setData({
          cpu: {
            usage: Math.floor(Math.random() * 60) + 20,
            temperature: Math.floor(Math.random() * 20) + 35,
            frequency: 2.4 + Math.random() * 1.2,
            cores: Array.from({ length: 8 }, (_, i) => ({
              usage: Math.floor(Math.random() * 80) + 10,
              temperature: Math.floor(Math.random() * 15) + 30
            }))
          },
          battery: {
            level: Math.floor(Math.random() * 50) + 50,
            isCharging: Math.random() > 0.5,
            health: Math.floor(Math.random() * 20) + 80,
            cycleCount: Math.floor(Math.random() * 300) + 100,
            temperature: Math.floor(Math.random() * 10) + 30,
            voltage: 11.2 + Math.random() * 1.3,
            timeRemaining: Math.floor(Math.random() * 300) + 120
          },
          memory: {
            total: 16 * 1024 * 1024 * 1024,
            used: Math.floor(Math.random() * 8 + 6) * 1024 * 1024 * 1024,
            free: 0,
            usage: Math.floor(Math.random() * 40) + 30
          },
          system: {
            manufacturer: 'Apple Inc.',
            model: 'MacBook Pro',
            os: 'macOS Sonoma 14.1',
            arch: 'arm64',
            cpuManufacturer: 'Apple',
            cpuBrand: 'Apple M2 Pro',
            cpuCores: 8,
            cpuSpeed: 3.5
          }
        });
        setLoading(false);
        return;
      }

      const [cpuInfo, batteryInfo, memoryInfo, systemInfo] = await Promise.all([
        window.electronAPI.getCpuInfo(),
        window.electronAPI.getBatteryInfo(),
        window.electronAPI.getMemoryInfo(),
        window.electronAPI.getSystemInfo()
      ]);

      setData({
        cpu: cpuInfo,
        battery: batteryInfo,
        memory: {
          ...memoryInfo,
          free: memoryInfo.total - memoryInfo.used
        },
        system: systemInfo
      });
      setError(null);
    } catch (err) {
      setError('Failed to fetch system data');
      console.error('Error fetching system data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};