import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const BUCKET = "hateslop_data";
const PREFIX = "generation_2/chatbot/chatbot2";
const PROJECT_ID = 2;
console.log("BUCKET =", BUCKET);
console.log("PREFIX =", PREFIX);
async function run() {
  const { data: files, error } = await supabase
    .storage
    .from(BUCKET)
    .list(PREFIX);

  if (error) throw error;

  for (const file of files ?? []) {
    const path = `${PREFIX}/${file.name}`;

    const { data: urlData } = supabase
      .storage
      .from(BUCKET)
      .getPublicUrl(path);

    await supabase.from("project_media").insert({
      project_id: PROJECT_ID,
      media_url: urlData.publicUrl,
      media_type: file.name.endsWith(".mp4") ? "video" : "image",
      order_index: 0,
    });

    console.log("inserted:", file.name);
  }
}

run().catch(console.error);