import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Battery, BatteryLow, Zap, AlertTriangle, CheckCircle } from 'lucide-react';
import { SystemData } from '@/hooks/useSystemData';

interface BatteryHealthProps {
  systemData: SystemData;
}

export const BatteryHealth = ({ systemData }: BatteryHealthProps) => {
  const { battery } = systemData;
  const [batteryHistory, setBatteryHistory] = useState<number[]>([
    85, 86, 87, 86, 85, 87, 88, 87, 86, 87
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBatteryHistory(prev => {
        const newHistory = [...prev.slice(1), battery.level];
        return newHistory;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [battery.level]);

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

  const getStatusFromHealth = (health: number): 'excellent' | 'good' | 'fair' | 'poor' => {
    if (health > 90) return 'excellent';
    if (health > 80) return 'good';
    if (health > 60) return 'fair';
    return 'poor';
  };

  const status = getStatusFromHealth(battery.health);

  const getStatusIcon = () => {
    switch (status) {
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
    if (battery.isCharging) {
      return <Zap className="w-6 h-6 text-primary animate-pulse" />;
    }
    if (battery.level < 20) {
      return <BatteryLow className="w-6 h-6 text-destructive" />;
    }
    return <Battery className="w-6 h-6 text-success" />;
  };

  const formatTimeRemaining = (timeInMinutes: number | null): string => {
    if (!timeInMinutes) return 'Calculating...';
    const hours = Math.floor(timeInMinutes / 60);
    const minutes = timeInMinutes % 60;
    return `${hours}h ${minutes}m`;
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
            <p className={`text-2xl font-bold ${getChargeColor(battery.level)}`}>
              {battery.level}%
            </p>
            <p className="text-sm text-muted-foreground">
              {battery.isCharging ? 'Charging' : formatTimeRemaining(battery.timeRemaining)}
            </p>
          </div>
        </div>

        {/* Battery Charge */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-foreground">Charge Level</p>
            <span className={`text-sm font-medium ${getChargeColor(battery.level)}`}>
              {battery.level}%
            </span>
          </div>
          <Progress 
            value={battery.level} 
            className="h-3" 
          />
        </div>

        {/* Battery Health */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-foreground">Health Status</p>
            <div className="flex items-center space-x-2">
              {getStatusIcon()}
              <span className={`text-sm font-medium ${getHealthColor(battery.health)}`}>
                {battery.health}%
              </span>
            </div>
          </div>
          <Progress 
            value={battery.health} 
            className="h-3"
          />
        </div>

        {/* Battery Stats Grid */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Cycle Count</p>
            <p className="text-lg font-bold text-foreground">{battery.cycleCount}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Temperature</p>
            <p className="text-lg font-bold text-foreground">{battery.temperature}°C</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Voltage</p>
            <p className="text-lg font-bold text-foreground">{battery.voltage.toFixed(1)}V</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Status</p>
            <p className="text-lg font-bold text-foreground capitalize">{status}</p>
          </div>
        </div>

        {/* Status Message */}
        <div className="p-3 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            {battery.health > 80 
              ? "Battery is in excellent condition. No action needed."
              : battery.health > 60
              ? "Battery health is good. Consider calibrating occasionally."
              : "Battery may need replacement soon. Contact support."
            }
          </p>
        </div>
      </div>
    </Card>
  );
};