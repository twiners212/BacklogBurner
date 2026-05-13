"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUIStore } from "@/hooks/use-ui-store";
import { getGameDetail, type GameDetail } from "@/lib/actions/getGameDetail";
import { updateGame } from "@/lib/actions/updateGame";
import { deleteGame } from "@/lib/actions/deleteGame";
import { useQueryClient } from "@tanstack/react-query";
import { Star, X } from "lucide-react";

const RATINGS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const STATUS_OPTIONS = ["Wanna Play", "Playing", "Completed", "Dropped"];

export function GameDetailModal() {
  const queryClient = useQueryClient();
  const { isReviewModalOpen, setReviewModalOpen, selectedGameId, setSelectedGameId } = useUIStore();

  const [detail, setDetail] = useState<GameDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const [editTitle, setEditTitle] = useState("");
  const [editCoverUrl, setEditCoverUrl] = useState("");
  const [editReleaseDate, setEditReleaseDate] = useState("");
  const [editStatus, setEditStatus] = useState("Wanna Play");
  const [editRating, setEditRating] = useState<number | null>(null);
  const [editReview, setEditReview] = useState("");

  useEffect(() => {
    if (!isReviewModalOpen || !selectedGameId) return;

    setLoading(true);
    setError("");

    getGameDetail(selectedGameId).then((result) => {
      setLoading(false);
      if (result.success) {
        setDetail(result.data);
        setEditTitle(result.data.title);
        setEditCoverUrl(result.data.coverUrl ?? "");
        setEditReleaseDate(result.data.releaseDate ?? "");
        setEditStatus(result.data.status);
        setEditRating(result.data.rating);
        setEditReview(result.data.review ?? "");
      } else {
        setError(result.error);
      }
    });
  }, [isReviewModalOpen, selectedGameId]);

  if (!isReviewModalOpen || !selectedGameId) return null;

  const hasChanges =
    detail &&
    (editTitle !== detail.title ||
      editCoverUrl !== (detail.coverUrl ?? "") ||
      editReleaseDate !== (detail.releaseDate ?? "") ||
      editStatus !== detail.status ||
      editRating !== detail.rating ||
      editReview !== (detail.review ?? ""));

  const handleSave = async () => {
    if (!detail) return;
    setSaving(true);
    setError("");

    const result = await updateGame(selectedGameId, {
      title: editTitle,
      coverUrl: editCoverUrl || null,
      releaseDate: editReleaseDate || null,
      status: editStatus as "Wanna Play" | "Playing" | "Completed" | "Dropped",
      rating: editRating,
      review: editReview || null,
    });

    setSaving(false);

    if (result.success) {
      closeModal();
    } else {
      setError(result.error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this game from your library?")) return;

    setDeleting(true);
    setError("");

    const result = await deleteGame(selectedGameId);

    if (result.success) {
      closeModal();
    } else {
      setError(result.error);
      setDeleting(false);
    }
  };

  const closeModal = () => {
    setReviewModalOpen(false);
    setSelectedGameId(null);
    setDetail(null);
    queryClient.invalidateQueries({ queryKey: ["userGames"] });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-lg bg-card p-6 neo-border flex flex-col gap-4 mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg text-primary glitch-hover uppercase">Game Details</h2>
          <Button variant="ghost" size="icon" onClick={closeModal} className="text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <p className="font-heading text-primary animate-pulse">LOADING...</p>
          </div>
        ) : error && !detail ? (
          <div className="py-8 text-center">
            <p className="font-mono text-xs text-red-500">{error}</p>
            <Button variant="outline" onClick={closeModal} className="mt-4 neo-border rounded-none font-heading text-xs">
              CLOSE
            </Button>
          </div>
        ) : detail ? (
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-32 h-44 flex-shrink-0 bg-muted neo-border">
                {editCoverUrl ? (
                  <img src={editCoverUrl} alt={editTitle} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-heading text-[10px] text-muted-foreground p-2 text-center">
                    NO COVER
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-3">
                <div className="space-y-1">
                  <label className="font-mono text-[10px] uppercase text-muted-foreground">Title</label>
                  <Input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="neo-border rounded-none font-mono text-sm bg-background"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-[10px] uppercase text-muted-foreground">Cover URL</label>
                  <Input
                    value={editCoverUrl}
                    onChange={(e) => setEditCoverUrl(e.target.value)}
                    placeholder="https://..."
                    className="neo-border rounded-none font-mono text-sm bg-background"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-mono text-[10px] uppercase text-muted-foreground">Release Date</label>
                <input
                  type="date"
                  value={editReleaseDate}
                  onChange={(e) => setEditReleaseDate(e.target.value)}
                  className="w-full neo-border rounded-none font-mono text-sm bg-background border border-border p-2 text-foreground dark:[color-scheme:dark]"
                />
              </div>
              <div className="space-y-1">
                <label className="font-mono text-[10px] uppercase text-muted-foreground">Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full neo-border rounded-none font-mono text-sm bg-background border border-border p-2 text-foreground"
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-mono text-xs uppercase text-muted-foreground">Rating</label>
              <div className="flex gap-1 flex-wrap">
                {RATINGS.map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setEditRating(editRating === n ? null : n)}
                    className={`w-9 h-9 flex items-center justify-center font-heading text-xs neo-border transition-colors ${
                      editRating !== null && n <= editRating
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-background text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
              {editRating !== null && (
                <div className="flex items-center gap-1 text-secondary">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-heading text-xs">{editRating}/10</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="font-mono text-xs uppercase text-muted-foreground">Playing Impression</label>
              <textarea
                value={editReview}
                onChange={(e) => setEditReview(e.target.value)}
                rows={4}
                placeholder="WRITE ABOUT YOUR IMPRESSIONS AND EXPERIENCES PLAYING THIS GAME..."
                className="w-full neo-border rounded-none font-mono text-sm bg-background border border-border p-2 text-foreground resize-none"
              />
            </div>

            {error && (
              <p className="font-mono text-xs text-red-500">{error}</p>
            )}

            <div className="flex gap-2 pt-2 border-t border-border">
              <Button
                variant="outline"
                className="flex-1 neo-border rounded-none font-heading text-xs text-destructive border-destructive hover:bg-destructive/10"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? "DELETING..." : "DELETE"}
              </Button>
              <Button
                variant="outline"
                className="flex-1 neo-border rounded-none font-heading text-xs"
                onClick={closeModal}
              >
                CANCEL
              </Button>
              <Button
                className="flex-1 neo-border rounded-none font-heading text-xs bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={handleSave}
                disabled={saving || !hasChanges}
              >
                {saving ? "SAVING..." : "SAVE"}
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
