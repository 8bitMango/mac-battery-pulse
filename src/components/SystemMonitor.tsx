import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { CpuMonitor } from './CpuMonitor';
import { BatteryHealth } from './BatteryHealth';
import { SystemOverview } from './SystemOverview';
import { Activity, Battery, HardDrive, Thermometer } from 'lucide-react';

export const SystemMonitor = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">System Monitor</h1>
            <p className="text-muted-foreground">
              {currentTime.toLocaleDateString()} • {currentTime.toLocaleTimeString()}
            </p>
          </div>
          <div className="flex items-center space-x-2 text-primary">
            <Activity className="w-8 h-8 animate-pulse-glow" />
            <span className="text-lg font-medium">Live</span>
          </div>
        </div>

        {/* System Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-card border-border/50 p-6 animate-slide-up">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Activity className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">CPU Usage</p>
                <p className="text-2xl font-bold text-foreground">24%</p>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-card border-border/50 p-6 animate-slide-up [animation-delay:100ms]">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-success/20 rounded-lg">
                <Battery className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Battery</p>
                <p className="text-2xl font-bold text-foreground">87%</p>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-card border-border/50 p-6 animate-slide-up [animation-delay:200ms]">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-warning/20 rounded-lg">
                <HardDrive className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Memory</p>
                <p className="text-2xl font-bold text-foreground">16 GB</p>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-card border-border/50 p-6 animate-slide-up [animation-delay:300ms]">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Thermometer className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Temperature</p>
                <p className="text-2xl font-bold text-foreground">42°C</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Monitor Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CpuMonitor />
          <BatteryHealth />
        </div>

        {/* System Details */}
        <SystemOverview />
      </div>
    </div>
  );
};