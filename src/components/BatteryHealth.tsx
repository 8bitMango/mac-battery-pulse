import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Battery, BatteryLow, Zap, AlertTriangle, CheckCircle } from 'lucide-react';

interface BatteryData {
  charge: number;
  health: number;
  cycles: number;
  temperature: number;
  isCharging: boolean;
  timeRemaining: string;
  capacity: string;
  status: 'excellent' | 'good' | 'fair' | 'poor';
}

export const BatteryHealth = () => {
  const [batteryData, setBatteryData] = useState<BatteryData>({
    charge: 87,
    health: 92,
    cycles: 186,
    temperature: 32,
    isCharging: false,
    timeRemaining: '4h 23m',
    capacity: '4,374 mAh',
    status: 'excellent'
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setBatteryData(prev => ({
        ...prev,
        charge: prev.isCharging 
          ? Math.min(100, prev.charge + Math.random() * 2)
          : Math.max(0, prev.charge - Math.random() * 0.5),
        temperature: Math.max(25, Math.min(45, prev.temperature + (Math.random() - 0.5) * 2)),
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getChargeColor = (charge: number) => {
    if (charge > 50) return 'text-success';
    if (charge > 20) return 'text-warning';
    return 'text-destructive';
  };

  const getHealthColor = (health: number) => {
    if (health > 80) return 'text-success';
    if (health > 60) return 'text-warning';
    return 'text-destructive';
  };

  const getStatusIcon = () => {
    switch (batteryData.status) {
      case 'excellent':
        return <CheckCircle className="w-5 h-5 text-success" />;
      case 'good':
        return <CheckCircle className="w-5 h-5 text-primary" />;
      case 'fair':
        return <AlertTriangle className="w-5 h-5 text-warning" />;
      case 'poor':
        return <AlertTriangle className="w-5 h-5 text-destructive" />;
      default:
        return <Battery className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getChargeIcon = () => {
    if (batteryData.isCharging) {
      return <Zap className="w-6 h-6 text-primary animate-pulse" />;
    }
    if (batteryData.charge < 20) {
      return <BatteryLow className="w-6 h-6 text-destructive" />;
    }
    return <Battery className="w-6 h-6 text-success" />;
  };

  return (
    <Card className="bg-gradient-card border-border/50 p-6 animate-scale-in [animation-delay:100ms]">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-success/20 rounded-lg">
              {getChargeIcon()}
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">Battery Health</h3>
              <p className="text-sm text-muted-foreground">Internal Battery</p>
            </div>
          </div>
          <div className="text-right">
            <p className={`text-2xl font-bold ${getChargeColor(batteryData.charge)}`}>
              {batteryData.charge}%
            </p>
            <p className="text-sm text-muted-foreground">
              {batteryData.isCharging ? 'Charging' : batteryData.timeRemaining}
            </p>
          </div>
        </div>

        {/* Battery Charge */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-foreground">Charge Level</p>
            <span className={`text-sm font-medium ${getChargeColor(batteryData.charge)}`}>
              {batteryData.charge}%
            </span>
          </div>
          <Progress 
            value={batteryData.charge} 
            className="h-3" 
          />
        </div>

        {/* Battery Health */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-foreground">Health Status</p>
            <div className="flex items-center space-x-2">
              {getStatusIcon()}
              <span className={`text-sm font-medium ${getHealthColor(batteryData.health)}`}>
                {batteryData.health}%
              </span>
            </div>
          </div>
          <Progress 
            value={batteryData.health} 
            className="h-3"
          />
        </div>

        {/* Battery Stats Grid */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Cycle Count</p>
            <p className="text-lg font-bold text-foreground">{batteryData.cycles}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Temperature</p>
            <p className="text-lg font-bold text-foreground">{batteryData.temperature}°C</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Capacity</p>
            <p className="text-lg font-bold text-foreground">{batteryData.capacity}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Status</p>
            <p className="text-lg font-bold text-foreground capitalize">{batteryData.status}</p>
          </div>
        </div>

        {/* Status Message */}
        <div className="p-3 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            {batteryData.health > 80 
              ? "Battery is in excellent condition. No action needed."
              : batteryData.health > 60
              ? "Battery health is good. Consider calibrating occasionally."
              : "Battery may need replacement soon. Contact support."
            }
          </p>
        </div>
      </div>
    </Card>
  );
};