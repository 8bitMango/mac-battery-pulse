import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import * as si from 'systeminformation';

const isDev = process.env.NODE_ENV === 'development';

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    titleBarStyle: 'hiddenInset',
    show: false,
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:8080');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });
}

// IPC handlers for system information
ipcMain.handle('get-cpu-info', async () => {
  try {
    const [cpuCurrentSpeed, cpuLoad, cpuTemp] = await Promise.all([
      si.cpuCurrentSpeed(),
      si.currentLoad(),
      si.cpuTemperature()
    ]);

    return {
      usage: Math.round(cpuLoad.currentLoad),
      temperature: cpuTemp.main || 0,
      frequency: cpuCurrentSpeed.avg || 0,
      cores: cpuLoad.cpus?.map(cpu => ({
        usage: Math.round(cpu.load),
        temperature: cpuTemp.cores?.[cpu.cpu] || 0
      })) || []
    };
  } catch (error) {
    console.error('Error getting CPU info:', error);
    return { usage: 0, temperature: 0, frequency: 0, cores: [] };
  }
});

ipcMain.handle('get-battery-info', async () => {
  try {
    const battery = await si.battery();
    return {
      level: battery.percent || 0,
      isCharging: battery.isCharging || false,
      health: battery.maxCapacity ? Math.round((battery.currentCapacity / battery.maxCapacity) * 100) : 100,
      cycleCount: battery.cycleCount || 0,
      temperature: battery.temperature || 0,
      voltage: battery.voltage || 0,
      timeRemaining: battery.timeRemaining || null
    };
  } catch (error) {
    console.error('Error getting battery info:', error);
    return { level: 0, isCharging: false, health: 100, cycleCount: 0, temperature: 0, voltage: 0, timeRemaining: null };
  }
});

ipcMain.handle('get-memory-info', async () => {
  try {
    const memory = await si.mem();
    return {
      total: memory.total,
      used: memory.used,
      free: memory.free,
      usage: Math.round((memory.used / memory.total) * 100)
    };
  } catch (error) {
    console.error('Error getting memory info:', error);
    return { total: 0, used: 0, free: 0, usage: 0 };
  }
});

ipcMain.handle('get-system-info', async () => {
  try {
    const [system, osInfo, cpu] = await Promise.all([
      si.system(),
      si.osInfo(),
      si.cpu()
    ]);

    return {
      manufacturer: system.manufacturer,
      model: system.model,
      os: `${osInfo.distro} ${osInfo.release}`,
      arch: osInfo.arch,
      cpuManufacturer: cpu.manufacturer,
      cpuBrand: cpu.brand,
      cpuCores: cpu.cores,
      cpuSpeed: cpu.speed
    };
  } catch (error) {
    console.error('Error getting system info:', error);
    return { manufacturer: 'Unknown', model: 'Unknown', os: 'Unknown', arch: 'Unknown', cpuManufacturer: 'Unknown', cpuBrand: 'Unknown', cpuCores: 0, cpuSpeed: 0 };
  }
});

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});