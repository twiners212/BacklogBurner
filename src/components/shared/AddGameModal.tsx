"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUIStore } from "@/hooks/use-ui-store";
import { addGameToLibrary } from "@/lib/actions/addGameToLibrary";
import { useQueryClient } from "@tanstack/react-query";

const STATUS_OPTIONS = ["Wanna Play", "Playing", "Completed", "Dropped"];

export function AddGameModal() {
  const { isSearchOpen, setSearchOpen } = useUIStore();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [status, setStatus] = useState("Wanna Play");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  if (!isSearchOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Game title is required");
      return;
    }

    setPending(true);
    const formData = new FormData();
    formData.set("title", title);
    formData.set("coverUrl", coverUrl || "");
    formData.set("releaseDate", releaseDate || "");
    formData.set("status", status);

    const result = await addGameToLibrary(formData);
    setPending(false);

    if (result.success) {
      setTitle("");
      setCoverUrl("");
      setReleaseDate("");
      setStatus("Wanna Play");
      setSearchOpen(false);
      queryClient.invalidateQueries({ queryKey: ["userGames"] });
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-md bg-card p-8 neo-border flex flex-col gap-6 mx-4">
        <div className="text-center space-y-2">
          <h2 className="font-heading text-xl text-primary glitch-hover">ADD GAME</h2>
          <p className="font-mono text-xs text-muted-foreground">ENTER GAME DETAILS</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="font-mono text-xs uppercase">Title *</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="ENTER GAME TITLE"
              className="neo-border rounded-none font-mono text-sm bg-background"
            />
          </div>

          <div className="space-y-2">
            <label className="font-mono text-xs uppercase">Cover Image URL</label>
            <Input
              value={coverUrl}
              onChange={(e) => setCoverUrl(e.target.value)}
              placeholder="https://example.com/cover.jpg"
              className="neo-border rounded-none font-mono text-sm bg-background"
            />
          </div>

          <div className="space-y-2">
            <label className="font-mono text-xs uppercase">Release Date</label>
            <input
              type="date"
              value={releaseDate}
              onChange={(e) => setReleaseDate(e.target.value)}
              className="w-full neo-border rounded-none font-mono text-sm bg-background border border-border p-2 text-foreground dark:[color-scheme:dark]"
            />
          </div>

          <div className="space-y-2">
            <label className="font-mono text-xs uppercase">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full neo-border rounded-none font-mono text-sm bg-background border border-border p-2 text-foreground"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {error && (
            <p className="font-mono text-xs text-red-500">{error}</p>
          )}

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1 neo-border rounded-none font-heading text-xs"
              onClick={() => setSearchOpen(false)}
            >
              CANCEL
            </Button>
            <Button
              type="submit"
              disabled={pending}
              className="flex-1 neo-border rounded-none font-heading text-xs bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {pending ? "ADDING..." : "ADD GAME"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
