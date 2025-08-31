export interface ElectronAPI {
  getCpuInfo: () => Promise<{
    usage: number;
    temperature: number;
    frequency: number;
    cores: Array<{ usage: number; temperature: number }>;
  }>;
  getBatteryInfo: () => Promise<{
    level: number;
    isCharging: boolean;
    health: number;
    cycleCount: number;
    temperature: number;
    voltage: number;
    timeRemaining: number | null;
  }>;
  getMemoryInfo: () => Promise<{
    total: number;
    used: number;
    free: number;
    usage: number;
  }>;
  getSystemInfo: () => Promise<{
    manufacturer: string;
    model: string;
    os: string;
    arch: string;
    cpuManufacturer: string;
    cpuBrand: string;
    cpuCores: number;
    cpuSpeed: number;
  }>;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}