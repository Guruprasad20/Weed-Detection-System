import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listClassifications from "./tools/list-classifications";
import getClassification from "./tools/get-classification";
import deleteClassification from "./tools/delete-classification";
import weedStats from "./tools/weed-stats";
import classifyWeedImage from "./tools/classify-weed-image";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "verdant-vision",
  title: "Verdant Vision",
  version: "0.1.0",
  instructions:
    "Tools for WeedVision AI, a smart-agriculture weed detection platform. Use `classify_weed_image` to identify weeds in a photo, `list_classifications` and `get_classification` to browse the signed-in user's detection history, `weed_stats` for aggregate insights, and `delete_classification` to remove a record.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [classifyWeedImage, listClassifications, getClassification, weedStats, deleteClassification],
});
