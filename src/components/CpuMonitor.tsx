import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Cpu, TrendingUp, Zap } from 'lucide-react';

interface CpuCore {
  id: number;
  usage: number;
  frequency: number;
}

export const CpuMonitor = () => {
  const [cpuCores, setCpuCores] = useState<CpuCore[]>([
    { id: 1, usage: 15, frequency: 2.4 },
    { id: 2, usage: 32, frequency: 2.8 },
    { id: 3, usage: 8, frequency: 2.1 },
    { id: 4, usage: 45, frequency: 3.2 },
    { id: 5, usage: 22, frequency: 2.6 },
    { id: 6, usage: 38, frequency: 3.0 },
    { id: 7, usage: 12, frequency: 2.3 },
    { id: 8, usage: 28, frequency: 2.9 },
  ]);

  const [cpuHistory, setCpuHistory] = useState<number[]>([
    20, 25, 18, 32, 28, 35, 22, 40, 36, 29, 33, 27, 31, 24, 38, 42, 35, 29, 32, 28
  ]);

  const averageCpuUsage = Math.round(cpuCores.reduce((sum, core) => sum + core.usage, 0) / cpuCores.length);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time CPU data updates
      setCpuCores(prev => 
        prev.map(core => ({
          ...core,
          usage: Math.max(5, Math.min(95, core.usage + (Math.random() - 0.5) * 10)),
          frequency: Math.max(1.8, Math.min(3.8, core.frequency + (Math.random() - 0.5) * 0.2))
        }))
      );

      setCpuHistory(prev => {
        const newHistory = [...prev.slice(1), averageCpuUsage];
        return newHistory;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [averageCpuUsage]);

  const getUsageColor = (usage: number) => {
    if (usage > 80) return 'text-destructive';
    if (usage > 60) return 'text-warning';
    return 'text-success';
  };

  const getProgressColor = (usage: number) => {
    if (usage > 80) return 'bg-gradient-danger';
    if (usage > 60) return 'bg-gradient-warning';
    return 'bg-gradient-primary';
  };

  return (
    <Card className="bg-gradient-card border-border/50 p-6 animate-scale-in">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Cpu className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">CPU Monitor</h3>
              <p className="text-sm text-muted-foreground">Intel Core i9-13900K</p>
            </div>
          </div>
          <div className="text-right">
            <p className={`text-2xl font-bold ${getUsageColor(averageCpuUsage)}`}>
              {averageCpuUsage}%
            </p>
            <p className="text-sm text-muted-foreground">Average Usage</p>
          </div>
        </div>

        {/* Usage Graph */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-foreground">Usage History</p>
            <div className="flex items-center space-x-1">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary">Live</span>
            </div>
          </div>
          <div className="h-20 flex items-end space-x-1">
            {cpuHistory.map((usage, index) => (
              <div
                key={index}
                className={`flex-1 rounded-t transition-all duration-500 ${getProgressColor(usage)}`}
                style={{ height: `${Math.max(2, (usage / 100) * 100)}%` }}
              />
            ))}
          </div>
        </div>

        {/* Core Details */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-primary" />
            <p className="text-sm font-medium text-foreground">Core Usage</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {cpuCores.map((core) => (
              <div key={core.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Core {core.id}</span>
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm font-medium ${getUsageColor(core.usage)}`}>
                      {core.usage}%
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {core.frequency.toFixed(1)}GHz
                    </span>
                  </div>
                </div>
                <Progress 
                  value={core.usage} 
                  className="h-2" 
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};