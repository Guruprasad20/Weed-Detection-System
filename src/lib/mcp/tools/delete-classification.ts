import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "delete_classification",
  title: "Delete classification",
  description: "Permanently delete one of the signed-in user's saved weed classifications.",
  inputSchema: { id: z.string().uuid().describe("Classification record id to delete.") },
  annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ id }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase.from("classifications").delete().eq("id", id).select("id");
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    if (!data?.length) return { content: [{ type: "text", text: `No classification found with id ${id}` }], isError: true };
    return { content: [{ type: "text", text: `Deleted classification ${id}` }], structuredContent: { deleted: id } };
  },
});
