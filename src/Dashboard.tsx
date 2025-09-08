import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignOutButton } from "./SignOutButton";
import { MineSelector } from "./MineSelector";
import { RiskMap } from "./RiskMap";
import { ForecastPanel } from "./ForecastPanel";
import { EnvironmentalData } from "./EnvironmentalData";
import { AlertsPanel } from "./AlertsPanel";
import { Id } from "../convex/_generated/dataModel";

export function Dashboard() {
  const [selectedMineId, setSelectedMineId] = useState<Id<"mines"> | null>(null);
  const loggedInUser = useQuery(api.auth.loggedInUser);
  const userMines = useQuery(api.mines.getUserMines);
  const initializeAccess = useMutation(api.mines.initializeUserAccess);
  const selectedMine = useQuery(
    api.mines.getMineDetails,
    selectedMineId ? { mineId: selectedMineId } : "skip"
  );

  // Initialize user access when they first log in
  React.useEffect(() => {
    if (loggedInUser && userMines?.length === 0) {
      initializeAccess();
    }
  }, [loggedInUser, userMines, initializeAccess]);

  if (loggedInUser === undefined || userMines === undefined) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-red-950 border-b border-red-800 px-6 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img src="/MineGuardAI Logo - Transparent Background.png" alt="MineGuardAI Logo" className="w-6 h-6" />
            <h1 className="text-xl font-bold text-white">MineGuardAI</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-red-200">Welcome, {loggedInUser?.email}</span>
            <SignOutButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <div className="w-80 bg-red-950/30 border-r border-red-800 p-6 overflow-y-auto h-full flex flex-col">
          <MineSelector
            mines={(userMines || []).filter(Boolean) as any[]}
            selectedMineId={selectedMineId}
            onMineSelect={setSelectedMineId}
          />
          
          {selectedMineId && (
            <>
              <ForecastPanel mineId={selectedMineId} />
              <EnvironmentalData mineId={selectedMineId} />
            </>
          )}
        </div>

        {/* Main Panel */}
        <div className="flex-1 flex flex-col">
          {/* Alerts Bar */}
          {selectedMineId && <AlertsPanel />}
          
          {/* Map Area */}
          <div className="flex-1 p-6">
            {selectedMineId ? (
              <RiskMap mineId={selectedMineId} mine={selectedMine} />
            ) : (
              <div className="h-full flex items-center justify-center bg-red-950/10 rounded-lg border border-red-800">
                <div className="text-center">
                  <svg className="w-16 h-16 text-red-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <h3 className="text-xl font-semibold text-white mb-2">Select a Mine Site</h3>
                  <p className="text-red-300">Choose a mine from the sidebar to view risk analysis</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
