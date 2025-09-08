import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  mines: defineTable({
    name: v.string(),
    location: v.string(),
    coordinates: v.object({
      lat: v.number(),
      lng: v.number(),
    }),
    isActive: v.boolean(),
    description: v.optional(v.string()),
  }),
  
  riskZones: defineTable({
    mineId: v.id("mines"),
    zoneId: v.string(),
    coordinates: v.array(v.object({
      lat: v.number(),
      lng: v.number(),
    })),
    riskLevel: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
    riskScore: v.number(),
    slope: v.number(),
    elevation: v.number(),
    lastUpdated: v.number(),
  }).index("by_mine", ["mineId"]),
  
  forecasts: defineTable({
    mineId: v.id("mines"),
    probability: v.number(),
    timeframe: v.string(),
    confidence: v.number(),
    factors: v.array(v.string()),
    createdAt: v.number(),
  }).index("by_mine", ["mineId"]),
  
  environmentalData: defineTable({
    mineId: v.id("mines"),
    timestamp: v.number(),
    rainfall: v.number(),
    temperature: v.number(),
    humidity: v.number(),
    windSpeed: v.number(),
    displacement: v.number(),
    porePressure: v.number(),
  }).index("by_mine_and_time", ["mineId", "timestamp"]),
  
  alerts: defineTable({
    mineId: v.id("mines"),
    userId: v.id("users"),
    type: v.union(v.literal("high_risk"), v.literal("forecast"), v.literal("sensor")),
    severity: v.union(v.literal("low"), v.literal("medium"), v.literal("high"), v.literal("critical")),
    message: v.string(),
    isRead: v.boolean(),
    createdAt: v.number(),
  }).index("by_user", ["userId"])
    .index("by_mine", ["mineId"]),
  
  userMines: defineTable({
    userId: v.id("users"),
    mineId: v.id("mines"),
    role: v.union(v.literal("viewer"), v.literal("analyst"), v.literal("admin")),
    assignedAt: v.number(),
  }).index("by_user", ["userId"])
    .index("by_mine", ["mineId"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
