import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  HardDrive, 
  Thermometer, 
  Wifi, 
  Monitor, 
  MemoryStick,
  Timer,
  Activity
} from 'lucide-react';

interface SystemStats {
  memory: {
    used: number;
    total: number;
    pressure: number;
  };
  storage: {
    used: number;
    total: number;
    available: number;
  };
  network: {
    download: number;
    upload: number;
    connected: boolean;
  };
  uptime: string;
  processes: number;
}

export const SystemOverview = () => {
  const [systemStats, setSystemStats] = useState<SystemStats>({
    memory: {
      used: 11.2,
      total: 16,
      pressure: 28
    },
    storage: {
      used: 487,
      total: 1000,
      available: 513
    },
    network: {
      download: 45.3,
      upload: 12.7,
      connected: true
    },
    uptime: '2d 14h 23m',
    processes: 342
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setSystemStats(prev => ({
        ...prev,
        memory: {
          ...prev.memory,
          used: Math.max(8, Math.min(15.8, prev.memory.used + (Math.random() - 0.5) * 0.5)),
          pressure: Math.max(10, Math.min(80, prev.memory.pressure + (Math.random() - 0.5) * 5))
        },
        network: {
          ...prev.network,
          download: Math.max(0, prev.network.download + (Math.random() - 0.5) * 20),
          upload: Math.max(0, prev.network.upload + (Math.random() - 0.5) * 10)
        }
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const memoryUsagePercent = (systemStats.memory.used / systemStats.memory.total) * 100;
  const storageUsagePercent = (systemStats.storage.used / systemStats.storage.total) * 100;

  return (
    <Card className="bg-gradient-card border-border/50 p-6 animate-scale-in [animation-delay:200ms]">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Monitor className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">System Overview</h3>
              <p className="text-sm text-muted-foreground">macOS Sonoma 14.1</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-success">
            <Activity className="w-4 h-4 animate-pulse" />
            <span className="text-sm font-medium">System Healthy</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Memory Usage */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <MemoryStick className="w-4 h-4 text-primary" />
              <p className="text-sm font-medium text-foreground">Memory Usage</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {systemStats.memory.used.toFixed(1)} GB of {systemStats.memory.total} GB
                </span>
                <span className="text-foreground font-medium">
                  {memoryUsagePercent.toFixed(1)}%
                </span>
              </div>
              <Progress value={memoryUsagePercent} className="h-2" />
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Pressure: {systemStats.memory.pressure}%</span>
                <span className="text-muted-foreground">Available: {(systemStats.memory.total - systemStats.memory.used).toFixed(1)} GB</span>
              </div>
            </div>
          </div>

          {/* Storage */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <HardDrive className="w-4 h-4 text-warning" />
              <p className="text-sm font-medium text-foreground">Storage</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {systemStats.storage.used} GB of {systemStats.storage.total} GB
                </span>
                <span className="text-foreground font-medium">
                  {storageUsagePercent.toFixed(1)}%
                </span>
              </div>
              <Progress value={storageUsagePercent} className="h-2" />
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">SSD - Macintosh HD</span>
                <span className="text-muted-foreground">{systemStats.storage.available} GB free</span>
              </div>
            </div>
          </div>

          {/* Network Activity */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Wifi className={`w-4 h-4 ${systemStats.network.connected ? 'text-success' : 'text-destructive'}`} />
              <p className="text-sm font-medium text-foreground">Network</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Download</span>
                <span className="text-foreground font-medium">
                  {systemStats.network.download.toFixed(1)} MB/s
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Upload</span>
                <span className="text-foreground font-medium">
                  {systemStats.network.upload.toFixed(1)} MB/s
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                Status: {systemStats.network.connected ? 'Connected' : 'Disconnected'}
              </div>
            </div>
          </div>
        </div>

        {/* System Info Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border/50">
          <div className="flex items-center space-x-2">
            <Timer className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Uptime</p>
              <p className="text-sm font-medium text-foreground">{systemStats.uptime}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Processes</p>
              <p className="text-sm font-medium text-foreground">{systemStats.processes}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Thermometer className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">CPU Temp</p>
              <p className="text-sm font-medium text-foreground">42°C</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Monitor className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Display</p>
              <p className="text-sm font-medium text-foreground">2560×1440</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};