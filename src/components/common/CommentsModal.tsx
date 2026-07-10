"use client";

import type { ReactNode } from "react";
import { ExternalLink } from "lucide-react";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function CommentsModal({
  open,
  onClose,
  title = "Komentar",
  url,
  caption,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  url?: string;
  caption?: string;
  children: ReactNode;
}) {
  return (
    <Dialog open={open} onOpenChange={(next) => { if (!next) onClose(); }}>
      <DialogContent variant="bottom-sheet" className="overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-w-0 items-center gap-1 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700"
            >
              <span className="min-w-0 flex-1 truncate">{caption || url}</span>
              <ExternalLink size={10} className="shrink-0" />
            </a>
          )}
        </DialogHeader>

        <div className="min-w-0">{children}</div>
      </DialogContent>
    </Dialog>
  );
}
