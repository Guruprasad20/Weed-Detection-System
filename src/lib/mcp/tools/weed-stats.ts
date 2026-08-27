import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "weed_stats",
  title: "Weed detection statistics",
  description: "Summarize the signed-in user's weed detections: totals, risk breakdown, most common species and average confidence.",
  inputSchema: {
    days: z.number().int().min(1).max(365).optional().describe("Only include detections from the last N days."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ days }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    let query = supabase.from("classifications").select("top_common_name, top_confidence, risk, is_weed, created_at");
    if (days) query = query.gte("created_at", new Date(Date.now() - days * 86_400_000).toISOString());

    const { data, error } = await query;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };

    const rows = data ?? [];
    const bySpecies: Record<string, number> = {};
    const byRisk: Record<string, number> = {};
    let confidenceSum = 0;
    let confidenceCount = 0;
    for (const row of rows) {
      bySpecies[row.top_common_name] = (bySpecies[row.top_common_name] ?? 0) + 1;
      const risk = row.risk ?? "Unknown";
      byRisk[risk] = (byRisk[risk] ?? 0) + 1;
      if (typeof row.top_confidence === "number") {
        confidenceSum += row.top_confidence;
        confidenceCount += 1;
      }
    }
    const topSpecies = Object.entries(bySpecies)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    const stats = {
      total_detections: rows.length,
      weeds_confirmed: rows.filter((r) => r.is_weed).length,
      average_confidence: confidenceCount ? Number((confidenceSum / confidenceCount).toFixed(2)) : null,
      by_risk: byRisk,
      top_species: topSpecies,
      window_days: days ?? null,
    };
    return {
      content: [{ type: "text", text: JSON.stringify(stats, null, 2) }],
      structuredContent: stats,
    };
  },
});
