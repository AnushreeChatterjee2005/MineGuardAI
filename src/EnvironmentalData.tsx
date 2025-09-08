import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";

interface EnvironmentalDataProps {
  mineId: Id<"mines">;
}

export function EnvironmentalData({ mineId }: EnvironmentalDataProps) {
  const envData = useQuery(api.mines.getEnvironmentalData, { mineId, hours: 24 });

  if (!envData || envData.length === 0) {
    return (
      <div className="bg-red-950/20 border border-red-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-2">Environmental Data</h3>
        <div className="text-red-300">Loading sensor data...</div>
      </div>
    );
  }

  const latest = envData[0];
  const avg24h = {
    rainfall: envData.reduce((sum, d) => sum + d.rainfall, 0) / envData.length,
    temperature: envData.reduce((sum, d) => sum + d.temperature, 0) / envData.length,
    displacement: envData.reduce((sum, d) => sum + d.displacement, 0) / envData.length,
    porePressure: envData.reduce((sum, d) => sum + d.porePressure, 0) / envData.length,
  };

  const getStatusColor = (value: number, thresholds: { warning: number; critical: number }) => {
    if (value >= thresholds.critical) return "text-red-400";
    if (value >= thresholds.warning) return "text-yellow-400";
    return "text-green-400";
  };

  return (
    <div className="bg-red-950/20 border border-red-800 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-white mb-4">Environmental Data</h3>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-red-950/30 rounded p-3">
            <div className="text-xs text-red-300 mb-1">Rainfall (24h avg)</div>
            <div className={`text-lg font-semibold ${getStatusColor(avg24h.rainfall, { warning: 20, critical: 40 })}`}>
              {avg24h.rainfall.toFixed(1)}mm
            </div>
          </div>
          
          <div className="bg-red-950/30 rounded p-3">
            <div className="text-xs text-red-300 mb-1">Temperature</div>
            <div className="text-lg font-semibold text-white">
              {latest.temperature.toFixed(1)}°C
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-red-950/30 rounded p-3">
            <div className="text-xs text-red-300 mb-1">Displacement</div>
            <div className={`text-lg font-semibold ${getStatusColor(latest.displacement, { warning: 2, critical: 4 })}`}>
              {latest.displacement.toFixed(2)}mm
            </div>
          </div>
          
          <div className="bg-red-950/30 rounded p-3">
            <div className="text-xs text-red-300 mb-1">Pore Pressure</div>
            <div className={`text-lg font-semibold ${getStatusColor(latest.porePressure, { warning: 120, critical: 150 })}`}>
              {latest.porePressure.toFixed(0)}kPa
            </div>
          </div>
        </div>

        {/* Simple trend chart */}
        <div className="bg-red-950/30 rounded p-3">
          <div className="text-xs text-red-300 mb-2">Displacement Trend (24h)</div>
          <div className="flex items-end space-x-1 h-16">
            {envData.slice(0, 12).reverse().map((data, index) => (
              <div
                key={index}
                className="bg-red-600 rounded-t flex-1"
                style={{ 
                  height: `${Math.max(10, (data.displacement / 5) * 100)}%`,
                  opacity: 0.7 + (index * 0.025)
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-red-800">
        <div className="text-xs text-red-400">
          Last sensor reading: {new Date(latest.timestamp).toLocaleString()}
        </div>
      </div>
    </div>
  );
}
