import { supabase } from "@/lib/supabaseClient";

export async function getDashboard(topicId: string) {
  const [dashboard, platform, sentiment, timeline, topPosts, wordCloud] =
    await Promise.all([
      supabase.from("vw_dashboard").select("*").eq("topic_id", topicId),
      supabase
        .from("vw_platform_distribution")
        .select("*")
        .eq("topic_id", topicId),
      supabase.from("vw_sentiment").select("*").eq("topic_id", topicId),
      supabase.from("vw_timeline").select("*").eq("topic_id", topicId),
      supabase
        .from("vw_top_posts")
        .select("*")
        .eq("topic_id", topicId)
        .limit(10),
      supabase.from("vw_wordcloud").select("*").eq("topic_id", topicId),
    ]);

  return {
    dashboard: dashboard.data ?? [],
    platform: platform.data ?? [],
    sentiment: sentiment.data ?? [],
    timeline: timeline.data ?? [],
    topPosts: topPosts.data ?? [],
    wordCloud: wordCloud.data ?? [],
  };
}
