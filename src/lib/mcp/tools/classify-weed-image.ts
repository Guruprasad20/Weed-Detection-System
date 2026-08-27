import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser, supabaseProjectUrl } from "../supabase";

export default defineTool({
  name: "classify_weed_image",
  title: "Classify a weed image",
  description:
    "Run the app's AI vision classifier on a plant photo (public https image URL) and return the top candidate weed species with confidence, risk and treatment. Optionally save the result to the user's history.",
  inputSchema: {
    image_url: z.string().url().describe("Public https URL of the plant/weed photo to classify."),
    save: z.boolean().optional().describe("Save the result to the user's classification history (default false)."),
    notes: z.string().trim().max(500).optional().describe("Optional note stored with a saved result."),
  },
  annotations: { readOnlyHint: false, openWorldHint: true },
  handler: async ({ image_url, save, notes }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    if (!image_url.startsWith("https://")) {
      throw new ToolError("image_url must be an https URL");
    }

    const response = await fetch(`${supabaseProjectUrl()}/functions/v1/classify-weed`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ctx.getToken()}`,
      },
      body: JSON.stringify({ image: image_url }),
    });
    const result = await response.json().catch(() => null);
    if (!response.ok || !result || result.error) {
      return {
        content: [{ type: "text", text: result?.error ?? `Classification failed (${response.status})` }],
        isError: true,
      };
    }

    let savedId: string | null = null;
    if (save) {
      const top = result.candidates?.[0];
      const supabase = supabaseForUser(ctx);
      const { data, error } = await supabase
        .from("classifications")
        .insert({
          user_id: ctx.getUserId(),
          result_json: result,
          is_weed: result.is_weed ?? null,
          summary: result.summary ?? null,
          notes: notes ?? null,
          top_common_name: top?.common_name ?? "Unknown",
          top_scientific_name: top?.scientific_name ?? null,
          top_confidence: top?.confidence ?? null,
          risk: top?.risk ?? null,
          image_preview: image_url,
        })
        .select("id")
        .maybeSingle();
      if (error) return { content: [{ type: "text", text: error.message }], isError: true };
      savedId = data?.id ?? null;
    }

    return {
      content: [{ type: "text", text: JSON.stringify({ ...result, saved_id: savedId }, null, 2) }],
      structuredContent: { result, saved_id: savedId },
    };
  },
});
