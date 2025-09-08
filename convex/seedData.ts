import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const setupDemo = mutation({
  args: {},
  handler: async (ctx) => {
    // Create Barbil mine
    const barbilMineId = await ctx.db.insert("mines", {
      name: "Barbil Iron Ore Mine",
      location: "Barbil, Odisha, India",
      coordinates: { lat: 22.1167, lng: 85.3833 },
      isActive: true,
      description: "Large open-pit iron ore mine in Odisha",
    });

    // Create Rourkela mine
    const rourkelaMineId = await ctx.db.insert("mines", {
      name: "Rourkela Steel Plant Mine",
      location: "Rourkela, Odisha, India", 
      coordinates: { lat: 22.2604, lng: 84.8536 },
      isActive: true,
      description: "Steel plant associated mining operations",
    });

    // Create risk zones for Barbil
    const riskZones = [
      {
        mineId: barbilMineId,
        zoneId: "ZONE_A1",
        coordinates: [
          { lat: 22.1170, lng: 85.3830 },
          { lat: 22.1175, lng: 85.3835 },
          { lat: 22.1172, lng: 85.3840 },
          { lat: 22.1167, lng: 85.3835 }
        ],
        riskLevel: "high" as const,
        riskScore: 8.5,
        slope: 65,
        elevation: 450,
        lastUpdated: Date.now(),
      },
      {
        mineId: barbilMineId,
        zoneId: "ZONE_B2",
        coordinates: [
          { lat: 22.1160, lng: 85.3825 },
          { lat: 22.1165, lng: 85.3830 },
          { lat: 22.1162, lng: 85.3835 },
          { lat: 22.1157, lng: 85.3830 }
        ],
        riskLevel: "medium" as const,
        riskScore: 5.2,
        slope: 45,
        elevation: 420,
        lastUpdated: Date.now(),
      },
      {
        mineId: barbilMineId,
        zoneId: "ZONE_C3",
        coordinates: [
          { lat: 22.1150, lng: 85.3820 },
          { lat: 22.1155, lng: 85.3825 },
          { lat: 22.1152, lng: 85.3830 },
          { lat: 22.1147, lng: 85.3825 }
        ],
        riskLevel: "low" as const,
        riskScore: 2.8,
        slope: 25,
        elevation: 380,
        lastUpdated: Date.now(),
      }
    ];

    for (const zone of riskZones) {
      await ctx.db.insert("riskZones", zone);
    }

    // Create forecast data
    await ctx.db.insert("forecasts", {
      mineId: barbilMineId,
      probability: 72,
      timeframe: "7 days",
      confidence: 85,
      factors: ["Heavy rainfall", "High slope angle", "Recent seismic activity"],
      createdAt: Date.now(),
    });

    // Create environmental data for the last 24 hours
    const now = Date.now();
    for (let i = 0; i < 24; i++) {
      await ctx.db.insert("environmentalData", {
        mineId: barbilMineId,
        timestamp: now - (i * 60 * 60 * 1000),
        rainfall: Math.random() * 50,
        temperature: 25 + Math.random() * 15,
        humidity: 60 + Math.random() * 30,
        windSpeed: Math.random() * 20,
        displacement: Math.random() * 5,
        porePressure: 100 + Math.random() * 50,
      });
    }

    // Create some sample alerts
    await ctx.db.insert("alerts", {
      mineId: barbilMineId,
      userId: "demo" as any, // Will be updated when user logs in
      type: "high_risk",
      severity: "high",
      message: "High rockfall risk detected in Zone A1 due to heavy rainfall",
      isRead: false,
      createdAt: Date.now() - 30 * 60 * 1000, // 30 minutes ago
    });

    return { barbilMineId, rourkelaMineId };
  },
});

export const assignUserToMine = mutation({
  args: { 
    userId: v.id("users"),
    mineId: v.id("mines"),
    role: v.union(v.literal("viewer"), v.literal("analyst"), v.literal("admin"))
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("userMines", {
      userId: args.userId,
      mineId: args.mineId,
      role: args.role,
      assignedAt: Date.now(),
    });
  },
});
