import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { toast } from "sonner";

export function AlertsPanel() {
  const alerts = useQuery(api.mines.getUserAlerts, { limit: 5 });
  const markAsRead = useMutation(api.mines.markAlertAsRead);

  if (!alerts || alerts.length === 0) {
    return (
      <div className="bg-green-950/20 border-b border-green-800 px-6 py-3">
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-green-300">All systems normal - No active alerts</span>
        </div>
      </div>
    );
  }

  const criticalAlerts = alerts.filter(a => a.severity === "critical" && !a.isRead);
  const highAlerts = alerts.filter(a => a.severity === "high" && !a.isRead);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-red-600 text-white";
      case "high": return "bg-red-500 text-white";
      case "medium": return "bg-yellow-600 text-white";
      default: return "bg-gray-600 text-white";
    }
  };

  const handleMarkAsRead = async (alertId: string) => {
    try {
      await markAsRead({ alertId: alertId as any });
      toast.success("Alert marked as read");
    } catch (error) {
      toast.error("Failed to mark alert as read");
    }
  };

  if (criticalAlerts.length > 0 || highAlerts.length > 0) {
    return (
      <div className="bg-red-950/40 border-b border-red-600 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 animate-pulse">
              <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span className="text-red-200 font-semibold">⚠️ HIGH ROCKFALL RISK ALERT</span>
            </div>
            <div className="flex space-x-2">
              {criticalAlerts.length > 0 && (
                <span className="px-2 py-1 bg-red-600 text-white text-xs rounded">
                  {criticalAlerts.length} Critical
                </span>
              )}
              {highAlerts.length > 0 && (
                <span className="px-2 py-1 bg-red-500 text-white text-xs rounded">
                  {highAlerts.length} High
                </span>
              )}
            </div>
          </div>
          <button className="text-red-300 hover:text-white text-sm">
            View All Alerts
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-yellow-950/20 border-b border-yellow-800 px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-yellow-300">
            {alerts.filter(a => !a.isRead).length} unread alerts
          </span>
        </div>
        <button className="text-yellow-300 hover:text-white text-sm">
          View All
        </button>
      </div>
    </div>
  );
}
