// supabase/functions/sync-gbp-posts/index.ts
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

Deno.serve(async (req) => {
  try {
    if (req.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    const body = await req.json();
    const postIds: string[] = body.postIds; // Instagram投稿のIDリスト

    if (!Array.isArray(postIds) || postIds.length === 0) {
      return new Response(JSON.stringify({ error: "No postIds provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const googleAccessToken = Deno.env.get("GOOGLE_API_ACCESS_TOKEN");
    const locationId = Deno.env.get("GOOGLE_BUSINESS_LOCATION_ID");

    if (!googleAccessToken || !locationId) {
      throw new Error("Missing GBP API credentials");
    }

    // DBから対象の投稿を取得
    const { data: posts, error } = await supabase
      .from("instagram_posts")
      .select("*")
      .in("instagram_id", postIds);

    if (error) throw error;

    let successCount = 0;
    let errorCount = 0;
    const results = [];

    for (const post of posts) {
      try {
        const payload = {
          languageCode: "ja",
          summary: post.caption?.slice(0, 150) || "Instagram投稿",
          media: [
            {
              mediaFormat: post.media_type === "VIDEO" ? "VIDEO" : "PHOTO",
              sourceUrl: post.media_url,
            },
          ],
        };

        const gbpResponse = await fetch(
          `https://mybusiness.googleapis.com/v4/locations/${locationId}/localPosts`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${googleAccessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );

        if (!gbpResponse.ok) {
          const errorText = await gbpResponse.text();
          console.error(`Failed to sync ${post.instagram_id}: ${errorText}`);
          errorCount++;
          results.push({ id: post.instagram_id, success: false });
          continue;
        }

        // 成功時に is_synced を更新
        await supabase
          .from("instagram_posts")
          .update({ is_synced: true, synced_at: new Date().toISOString() })
          .eq("instagram_id", post.instagram_id);

        console.log(`Synced to GBP: ${post.instagram_id}`);
        successCount++;
        results.push({ id: post.instagram_id, success: true });
      } catch (err) {
        console.error(`Exception for ${post.instagram_id}:`, err);
        errorCount++;
        results.push({ id: post.instagram_id, success: false });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        synced: successCount,
        failed: errorCount,
        results,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("Fatal Error:", err);
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
});
