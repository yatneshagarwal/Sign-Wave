import { useState, useEffect } from "react";
import { Clock, Target, Hand, CheckCircle } from "lucide-react";

interface StatsData {
  avgLatency: number;
  accuracy: number;
  gestureCount: number;
  successRate: number;
}

interface StatsPanelProps {
  isScanning: boolean;
  gestureHistory: Array<{ gesture: any; timestamp: Date }>;
}

export default function StatsPanel({ isScanning, gestureHistory }: StatsPanelProps) {
  const [stats, setStats] = useState<StatsData>({
    avgLatency: 245,
    accuracy: 94.2,
    gestureCount: 0,
    successRate: 91.8
  });

  // Update stats based on gesture history
  useEffect(() => {
    setStats(prev => ({
      ...prev,
      gestureCount: gestureHistory.length,
    }));
  }, [gestureHistory]);

  // Simulate real-time fluctuations when scanning
  useEffect(() => {
    if (!isScanning) return;

    const interval = setInterval(() => {
      setStats(prev => ({
        avgLatency: Math.max(200, Math.min(300, prev.avgLatency + Math.floor(Math.random() * 20 - 10))),
        accuracy: Math.max(90, Math.min(98, prev.accuracy + Math.random() * 2 - 1)),
        gestureCount: prev.gestureCount,
        successRate: Math.max(85, Math.min(95, prev.successRate + Math.random() * 1 - 0.5))
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [isScanning]);

  const statItems = [
    {
      label: "Avg Latency",
      value: `${stats.avgLatency}ms`,
      icon: Clock,
      color: "text-neon-teal",
      testId: "stat-latency"
    },
    {
      label: "Accuracy",
      value: `${stats.accuracy.toFixed(1)}%`,
      icon: Target,
      color: "text-neon-magenta",
      testId: "stat-accuracy"
    },
    {
      label: "Gestures Today",
      value: stats.gestureCount.toString(),
      icon: Hand,
      color: "text-neon-amber",
      testId: "stat-gestures"
    },
    {
      label: "Success Rate",
      value: `${stats.successRate.toFixed(1)}%`,
      icon: CheckCircle,
      color: "text-green-400",
      testId: "stat-success"
    }
  ];

  return (
    <div className="mt-8 grid md:grid-cols-4 gap-4">
      {statItems.map((stat) => (
        <div key={stat.label} className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`} data-testid={stat.testId}>
                {stat.value}
              </p>
            </div>
            <stat.icon className={`w-6 h-6 ${stat.color}`} />
          </div>
        </div>
      ))}
    </div>
  );
}
