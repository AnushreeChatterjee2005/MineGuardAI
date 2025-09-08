import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";

interface ForecastPanelProps {
  mineId: Id<"mines">;
}

export function ForecastPanel({ mineId }: ForecastPanelProps) {
  const forecast = useQuery(api.mines.getLatestForecast, { mineId });

  if (!forecast) {
    return (
      <div className="mb-6 bg-red-950/20 border border-red-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-2">AI Forecast</h3>
        <div className="text-red-300">Loading forecast data...</div>
      </div>
    );
  }

  const getProbabilityColor = (prob: number) => {
    if (prob >= 70) return "text-red-400";
    if (prob >= 40) return "text-yellow-400";
    return "text-green-400";
  };

  const getProbabilityBg = (prob: number) => {
    if (prob >= 70) return "bg-red-600";
    if (prob >= 40) return "bg-yellow-600";
    return "bg-green-600";
  };

  return (
    <div className="mb-6 bg-red-950/20 border border-red-800 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-white mb-4">AI Forecast</h3>
      
      <div className="text-center mb-4">
        <div className={`text-3xl font-bold ${getProbabilityColor(forecast.probability)} mb-1`}>
          {forecast.probability}%
        </div>
        <div className="text-red-300 text-sm">
          Rockfall probability in next {forecast.timeframe}
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm text-red-300 mb-1">
          <span>Confidence</span>
          <span>{forecast.confidence}%</span>
        </div>
        <div className="w-full bg-red-950 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${forecast.confidence}%` }}
          ></div>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-white mb-2">Risk Factors</h4>
        <div className="space-y-1">
          {forecast.factors.map((factor, index) => (
            <div key={index} className="flex items-center space-x-2 text-sm">
              <div className="w-2 h-2 bg-red-600 rounded-full"></div>
              <span className="text-red-200">{factor}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-red-800">
        <div className="text-xs text-red-400">
          Last updated: {new Date(forecast.createdAt).toLocaleString()}
        </div>
      </div>
    </div>
  );
}
