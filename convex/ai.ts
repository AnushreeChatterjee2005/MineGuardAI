import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

export const generateRiskForecast = action({
  args: { mineId: v.id("mines") },
  handler: async (ctx, args) => {
    // Get recent environmental data
    const envData = await ctx.runQuery(api.mines.getEnvironmentalData, {
      mineId: args.mineId,
      hours: 72
    });

    // Get current risk zones
    const riskZones = await ctx.runQuery(api.mines.getRiskZones, {
      mineId: args.mineId
    });

    // Calculate risk factors
    const avgRainfall = envData.reduce((sum, d) => sum + d.rainfall, 0) / envData.length;
    const maxDisplacement = Math.max(...envData.map(d => d.displacement));
    const highRiskZones = riskZones.filter(z => z.riskLevel === "high").length;

    // Simple AI model simulation
    let probability = 30; // Base probability
    
    if (avgRainfall > 20) probability += 25;
    if (maxDisplacement > 3) probability += 20;
    if (highRiskZones > 2) probability += 15;
    
    probability = Math.min(probability, 95);

    const factors = [];
    if (avgRainfall > 20) factors.push("Heavy rainfall detected");
    if (maxDisplacement > 3) factors.push("Significant ground displacement");
    if (highRiskZones > 2) factors.push("Multiple high-risk zones active");

    return {
      probability,
      confidence: 85,
      factors,
      timeframe: "7 days"
    };
  },
});

export const analyzeRiskPattern = action({
  args: { 
    mineId: v.id("mines"),
    prompt: v.string()
  },
  handler: async (ctx, args) => {
    // This would integrate with OpenAI for advanced analysis
    // For now, return a simulated response
    
    const responses = [
      "Based on current data patterns, the eastern slope shows increased instability due to recent rainfall and geological factors.",
      "Risk assessment indicates elevated probability in zones with slopes exceeding 60 degrees and recent displacement readings above 3mm.",
      "Environmental conditions suggest monitoring should be increased in high-risk zones, particularly during monsoon season.",
      "Sensor data correlation shows strong relationship between pore pressure increases and subsequent rockfall events."
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  },
});
