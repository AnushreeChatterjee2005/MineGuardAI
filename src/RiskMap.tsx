import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";

interface RiskMapProps {
  mineId: Id<"mines">;
  mine: any;
}

export function RiskMap({ mineId, mine }: RiskMapProps) {
  const riskZones = useQuery(api.mines.getRiskZones, { mineId });
  const [zoom, setZoom] = useState(1);

  if (!riskZones || !mine) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case "high": return "#B40426";
      case "medium": return "#F7F7F7";
      case "low": return "#3B4CC0";
      default: return "#808080";
    }
  };

  const getRiskBgColor = (level: string) => {
    switch (level) {
      case "high": return "#B40426";
      case "medium": return "#F7F7F7";
      case "low": return "#3B4CC0";
      default: return "#808080";
    }
  };

  return (
    <div className="h-full bg-red-950/10 rounded-lg border border-red-800 overflow-hidden relative">
      <div className="p-4 border-b border-red-800">
        <h2 className="text-xl font-semibold text-white">{mine.name} - Risk Assessment Map</h2>
        <p className="text-red-300">{mine.location}</p>
      </div>
      
      <div className="flex w-[1200px] h-[600px] relative">
        {/* Map Visualization */}
        <div className="flex-1 relative overflow-hidden flex flex-col items-center justify-center p-8">
          {/* Removed the text label as requested */}
          {/* <div className="mb-4 text-center text-white font-semibold">
            Rockfall Risk Map (Subsampled)
          </div> */}
          <img
            src="/rockfall-risk-map (3).png"
            alt="Rockfall Risk Map (Subsampled)"
            className="max-w-full max-h-full rounded-lg border border-red-800"
            style={{ transform: `scale(${zoom})` }}
          />
          {/* Map Controls */}
          <div className="absolute top-4 right-4 space-y-2 z-10">
            <button
              className="bg-red-950 border border-red-800 text-white p-2 rounded hover:bg-red-900"
              onClick={() => setZoom((z) => Math.min(z + 0.1, 3))}
              aria-label="Zoom In"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
            <button
              className="bg-red-950 border border-red-800 text-white p-2 rounded hover:bg-red-900"
              onClick={() => setZoom((z) => Math.max(z - 0.1, 0.5))}
              aria-label="Zoom Out"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
          </div>
        </div>

        {/* Legend and Forecasts */}
        <div className="w-96 border-l border-red-800 p-4 flex">
          {/* Legend and Zone Summary */}
          <div className="flex-1 pr-24 border-r border-red-800">
            <h3 className="text-lg font-semibold text-white mb-4">Risk Legend</h3>
 
            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: "#B40426" }}></div>
                <span className="text-white">High Risk (7-10)</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: "#F7F7F7" }}></div>
                <span className="text-white">Medium Risk (4-6)</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: "#3B4CC0" }}></div>
                <span className="text-white">Low Risk (1-3)</span>
              </div>
            </div>
 
            <div className="border-t border-red-800 pt-4">
              <h4 className="font-semibold text-white mb-3">Zone Summary</h4>
              <div className="space-y-2 text-sm">
                {riskZones.map((zone) => (
                  <div key={zone._id} className="flex justify-between">
                    <span className="text-red-200">{zone.zoneId}</span>
                    <span className={`px-2 py-1 rounded text-xs ${getRiskBgColor(zone.riskLevel)} text-white`}>
                      {zone.riskLevel}
                    </span>
                  </div>
                ))}
              </div>
              <ul className="mt-4 list-disc list-inside text-white text-sm space-y-3">
                <li><strong>Selected Location:</strong> Barbil</li>
                <li><strong>Risk Level:</strong> Low</li>
                <li><strong>Details:</strong> This area has gentle slopes and stable terrain.</li>
                <li><strong>Probability of High Risk:</strong> {"<10%"}</li>
                <li><strong>Safe Zone:</strong> Suitable for settlements and routine activities.</li>
              </ul>
            </div>
          </div>
 
          {/* Probability Based Forecasts */}
        </div>
      </div>
    </div>
  );
}
