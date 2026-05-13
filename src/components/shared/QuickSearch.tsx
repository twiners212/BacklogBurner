"use client";

import { X, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface QuickSearchProps {
  query: string;
  onQueryChange: (query: string) => void;
  onAddGame: () => void;
}

export function QuickSearch({ query, onQueryChange, onAddGame }: QuickSearchProps) {
  return (
    <div className="flex w-full max-w-xl items-center gap-2">
      <div className="relative flex-1">
        <Input
          type="text"
          placeholder="FILTER YOUR LIBRARY..."
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          className="pl-3 pr-10 neo-border rounded-none font-mono bg-background focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:border-primary"
        />
        {query && (
          <button
            type="button"
            onClick={() => onQueryChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      <Button onClick={onAddGame} className="neo-border rounded-none font-heading text-xs uppercase bg-secondary text-secondary-foreground hover:bg-secondary/90 gap-2 flex-shrink-0">
        <Plus className="w-4 h-4" />
        Add Game
      </Button>
    </div>
  );
}
