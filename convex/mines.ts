import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getUserMines = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const userMines = await ctx.db
      .query("userMines")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const mines = await Promise.all(
      userMines.map(async (userMine) => {
        const mine = await ctx.db.get(userMine.mineId);
        return mine ? { ...mine, role: userMine.role } : null;
      })
    );

    return mines.filter(Boolean);
  },
});

export const getMineDetails = query({
  args: { mineId: v.id("mines") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Check if user has access to this mine
    const userMine = await ctx.db
      .query("userMines")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("mineId"), args.mineId))
      .first();

    if (!userMine) {
      throw new Error("Access denied to this mine");
    }

    const mine = await ctx.db.get(args.mineId);
    if (!mine) {
      throw new Error("Mine not found");
    }

    return { ...mine, role: userMine.role };
  },
});

export const getRiskZones = query({
  args: { mineId: v.id("mines") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    return await ctx.db
      .query("riskZones")
      .withIndex("by_mine", (q) => q.eq("mineId", args.mineId))
      .collect();
  },
});

export const getLatestForecast = query({
  args: { mineId: v.id("mines") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    return await ctx.db
      .query("forecasts")
      .withIndex("by_mine", (q) => q.eq("mineId", args.mineId))
      .order("desc")
      .first();
  },
});

export const getEnvironmentalData = query({
  args: { 
    mineId: v.id("mines"),
    hours: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const hoursBack = args.hours || 24;
    const cutoffTime = Date.now() - (hoursBack * 60 * 60 * 1000);

    return await ctx.db
      .query("environmentalData")
      .withIndex("by_mine_and_time", (q) => 
        q.eq("mineId", args.mineId).gt("timestamp", cutoffTime)
      )
      .order("desc")
      .take(100);
  },
});

export const getUserAlerts = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    return await ctx.db
      .query("alerts")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(args.limit || 10);
  },
});

export const markAlertAsRead = mutation({
  args: { alertId: v.id("alerts") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const alert = await ctx.db.get(args.alertId);
    if (!alert || alert.userId !== userId) {
      throw new Error("Alert not found or access denied");
    }

    await ctx.db.patch(args.alertId, { isRead: true });
  },
});

export const initializeUserAccess = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    console.log(`initializeUserAccess called for userId: ${userId}`);

    // Check if user already has mine access
    const existingAccess = await ctx.db
      .query("userMines")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (existingAccess) {
      console.log(`User ${userId} already has mine access.`);
      return; // User already has access
    }

    // Hardcoded Barbil Iron Ore Mine ID (replace with actual ID if known)
    // Since we don't know the actual ID, create or find the mine by name first
    let barbilMine = await ctx.db.query("mines").filter(q => q.eq(q.field("name"), "Barbil Iron Ore Mine")).first();
    if (!barbilMine) {
      console.log("Creating Barbil Iron Ore Mine entry");
      const newMineId = await ctx.db.insert("mines", {
        name: "Barbil Iron Ore Mine",
        location: "Barbil, Odisha, India",
        coordinates: { lat: 22.1167, lng: 85.3833 },
        isActive: true,
        description: "Large open-pit iron ore mine in Odisha",
      });
      const mineData = await ctx.db.get(newMineId);
      barbilMine = { 
        _id: newMineId, 
        _creationTime: mineData?._creationTime ?? Date.now(), 
        name: mineData?.name || "Barbil Iron Ore Mine",
        location: mineData?.location || "Barbil, Odisha, India",
        coordinates: mineData?.coordinates || { lat: 22.1167, lng: 85.3833 },
        isActive: mineData?.isActive ?? true,
        description: mineData?.description || "Large open-pit iron ore mine in Odisha",
      };
    }

    if (barbilMine) {
      console.log(`Assigning Barbil Iron Ore Mine to user ${userId}`);
      await ctx.db.insert("userMines", {
        userId,
        mineId: barbilMine._id,
        role: "analyst",
        assignedAt: Date.now(),
      });
    } else {
      console.log(`Failed to create or find Barbil Iron Ore Mine.`);
    }
  },
});

export const initializeUserAccessForFrontend = mutation({
  args: {},
  handler: async (ctx) => {
    // Call the initializeUserAccess mutation logic directly
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Check if user already has mine access
    const existingAccess = await ctx.db
      .query("userMines")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (existingAccess) {
      return; // User already has access
    }

    // Get the specific mine "Barbil Iron Ore Mine" and assign user as analyst
    const barbilMine = await ctx.db.query("mines").filter(q => q.eq(q.field("name"), "Barbil Iron Ore Mine")).first();

    if (barbilMine) {
      await ctx.db.insert("userMines", {
        userId,
        mineId: barbilMine._id,
        role: "analyst",
        assignedAt: Date.now(),
      });
    }
  },
});
