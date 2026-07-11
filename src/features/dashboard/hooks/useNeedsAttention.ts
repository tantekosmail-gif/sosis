"use client";

import { useInstagramSummary } from "@/features/instagram/hooks/useInstagramSummary";
import { useFacebookSummary } from "@/features/facebook/hooks/useFacebookSummary";
import { useTwitterSummary } from "@/features/twitter/hooks/useTwitterSummary";
import { useTikTokSummary } from "@/features/tiktok/hooks/useTikTokSummary";

export interface AttentionAccount {
  platform: "instagram" | "facebook" | "twitter" | "tiktok";
  username: string;
  negatifCount: number;
  negatifRatio: number;
  analyzedCount: number;
}

// Bentuk per_account[].sentiment ({positif, negatif, netral} sbg raw count)
// sudah terkonfirmasi dipakai nyata di *SummaryWidget masing-masing platform —
// bukan tebakan.
function toAttentionAccounts(platform: AttentionAccount["platform"], perAccount: any[] | undefined): AttentionAccount[] {
  if (!Array.isArray(perAccount)) return [];
  return perAccount
    .map((acc): AttentionAccount => {
      const { positif = 0, negatif = 0, netral = 0 } = acc.sentiment ?? {};
      const total = positif + negatif + netral;
      return {
        platform,
        username: acc.username,
        negatifCount: negatif,
        negatifRatio: total > 0 ? negatif / total : 0,
        analyzedCount: acc.analyzed_count ?? total,
      };
    })
    .filter((a) => a.analyzedCount > 0 && a.negatifCount > 0);
}

export function useNeedsAttention() {
  const ig = useInstagramSummary();
  const fb = useFacebookSummary();
  const tw = useTwitterSummary();
  const tt = useTikTokSummary();

  const loading = ig.loading || fb.loading || tw.loading || tt.loading;

  const accounts = [
    ...toAttentionAccounts("instagram", ig.data?.per_account),
    ...toAttentionAccounts("facebook", fb.data?.per_account),
    ...toAttentionAccounts("twitter", tw.data?.per_account),
    ...toAttentionAccounts("tiktok", tt.data?.per_account),
  ].sort((a, b) => b.negatifRatio - a.negatifRatio || b.negatifCount - a.negatifCount);

  return { accounts, loading };
}
