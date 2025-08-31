import { contextBridge, ipcRenderer } from 'electron';

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

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  getCpuInfo: () => ipcRenderer.invoke('get-cpu-info'),
  getBatteryInfo: () => ipcRenderer.invoke('get-battery-info'),
  getMemoryInfo: () => ipcRenderer.invoke('get-memory-info'),
  getSystemInfo: () => ipcRenderer.invoke('get-system-info'),
} as ElectronAPI);