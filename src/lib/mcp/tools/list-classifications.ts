import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_classifications",
  title: "List weed classifications",
  description: "List the signed-in user's saved weed classification history, newest first.",
  inputSchema: {
    limit: z.number().int().min(1).max(50).optional().describe("Max rows to return (default 10)."),
    risk: z.enum(["Low", "Medium", "High"]).optional().describe("Filter by agricultural risk level."),
    search: z.string().trim().min(1).optional().describe("Filter by weed common name (partial match)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ limit, risk, search }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    let query = supabase
      .from("classifications")
      .select("id, created_at, top_common_name, top_scientific_name, top_confidence, risk, is_weed, summary, notes")
      .order("created_at", { ascending: false })
      .limit(limit ?? 10);
    if (risk) query = query.eq("risk", risk);
    if (search) query = query.ilike("top_common_name", `%${search}%`);

    const { data, error } = await query;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? [], null, 2) }],
      structuredContent: { items: data ?? [] },
    };
  },
});
