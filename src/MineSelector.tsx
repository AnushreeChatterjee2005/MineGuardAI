import { Id } from "../convex/_generated/dataModel";

interface Mine {
  _id: Id<"mines">;
  _creationTime: number;
  name: string;
  location: string;
  coordinates: { lat: number; lng: number; };
  isActive: boolean;
  description?: string;
  role: string;
}

interface MineSelectorProps {
  mines: Mine[];
  selectedMineId: Id<"mines"> | null;
  onMineSelect: (mineId: Id<"mines">) => void;
}

export function MineSelector({ mines, selectedMineId, onMineSelect }: MineSelectorProps) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-white mb-4">Mine Sites</h2>
      <div className="space-y-2">
        {mines.map((mine) => (
          <button
            key={mine._id}
            onClick={() => onMineSelect(mine._id)}
            className={`w-full text-left p-4 rounded-lg border transition-all ${
              selectedMineId === mine._id
                ? "bg-red-600 border-red-500 text-white"
                : "bg-red-950/20 border-red-800 text-red-200 hover:bg-red-950/40"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{mine.name}</h3>
                <p className="text-sm opacity-75">{mine.location}</p>
              </div>
              <div className="flex flex-col items-end">
                <span className={`px-2 py-1 rounded text-xs ${
                  mine.isActive 
                    ? "bg-green-600 text-white" 
                    : "bg-gray-600 text-gray-200"
                }`}>
                  {mine.isActive ? "Active" : "Inactive"}
                </span>
                <span className="text-xs mt-1 opacity-60">{mine.role}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
      
      {mines.length === 0 && (
        <div className="text-center py-8 text-red-300">
          <p>No mine sites assigned</p>
          <p className="text-sm mt-1">Contact your administrator for access</p>
        </div>
      )}
    </div>
  );
}
