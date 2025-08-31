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
import { SystemData } from '@/hooks/useSystemData';

interface SystemOverviewProps {
  systemData: SystemData;
}

export const SystemOverview = ({ systemData }: SystemOverviewProps) => {
  const [networkData, setNetworkData] = useState({
    download: 45.3,
    upload: 12.7,
    connected: true
  });

  const [uptime] = useState('2d 14h 23m');
  const [processes] = useState(342);

  const { memory, system, cpu } = systemData;

  useEffect(() => {
    const interval = setInterval(() => {
      setNetworkData(prev => ({
        ...prev,
        download: Math.max(0, prev.download + (Math.random() - 0.5) * 20),
        upload: Math.max(0, prev.upload + (Math.random() - 0.5) * 10)
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const memoryUsagePercent = memory.usage;
  const storageUsagePercent = 48.7; // Simulated storage usage since we don't have storage data

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
              <p className="text-sm text-muted-foreground">{system.os}</p>
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
                  {(memory.used / (1024 * 1024 * 1024)).toFixed(1)} GB of {(memory.total / (1024 * 1024 * 1024)).toFixed(0)} GB
                </span>
                <span className="text-foreground font-medium">
                  {memoryUsagePercent.toFixed(1)}%
                </span>
              </div>
              <Progress value={memoryUsagePercent} className="h-2" />
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Available Memory</span>
                <span className="text-muted-foreground">{(memory.free / (1024 * 1024 * 1024)).toFixed(1)} GB free</span>
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
                  487 GB of 1000 GB
                </span>
                <span className="text-foreground font-medium">
                  {storageUsagePercent.toFixed(1)}%
                </span>
              </div>
              <Progress value={storageUsagePercent} className="h-2" />
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">SSD - Macintosh HD</span>
                <span className="text-muted-foreground">513 GB free</span>
              </div>
            </div>
          </div>

          {/* Network Activity */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Wifi className={`w-4 h-4 ${networkData.connected ? 'text-success' : 'text-destructive'}`} />
              <p className="text-sm font-medium text-foreground">Network</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Download</span>
                <span className="text-foreground font-medium">
                  {networkData.download.toFixed(1)} MB/s
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Upload</span>
                <span className="text-foreground font-medium">
                  {networkData.upload.toFixed(1)} MB/s
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                Status: {networkData.connected ? 'Connected' : 'Disconnected'}
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
              <p className="text-sm font-medium text-foreground">{uptime}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Processes</p>
              <p className="text-sm font-medium text-foreground">{processes}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Thermometer className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">CPU Temp</p>
              <p className="text-sm font-medium text-foreground">{cpu.temperature}°C</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Monitor className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">CPU</p>
              <p className="text-sm font-medium text-foreground">{system.cpuBrand}</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};