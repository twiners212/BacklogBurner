"use client";

import { Suspense, useState, useCallback, useMemo } from "react";
import { Navbar } from "@/components/shared/Navbar";
import { QuickSearch } from "@/components/shared/QuickSearch";
import { GameCard, type Game } from "@/components/shared/GameCard";
import { AddGameModal } from "@/components/shared/AddGameModal";
import { GameDetailModal } from "@/components/shared/GameDetailModal";
import { FloatingIcons } from "@/components/shared/FloatingIcons";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { getUserGames } from "@/lib/actions/getUserGames";
import { useUIStore } from "@/hooks/use-ui-store";

function DashboardContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentTab = searchParams.get("status") || "All";
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const [localFilter, setLocalFilter] = useState("");
  const { setSearchOpen, setSelectedGameId, setReviewModalOpen } = useUIStore();

  const { data: result, isLoading } = useQuery({
    queryKey: ["userGames", currentTab, currentPage],
    queryFn: () => getUserGames(currentTab, currentPage, 8),
  });

  const games = useMemo(() => {
    if (!result?.success) return [];
    let filtered = result.data.games;
    if (localFilter.trim()) {
      const q = localFilter.toLowerCase();
      filtered = filtered.filter((g) => g.title.toLowerCase().includes(q));
    }
    return filtered;
  }, [result, localFilter]);

  const totalPages = result?.success ? result.data.totalPages : 1;

  const handleSearch = useCallback((query: string) => {
    setLocalFilter(query);
  }, []);

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value === "All") {
      params.delete("status");
    } else {
      params.set("status", value);
    }
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleGameClick = (game: Game) => {
    if (game.userGameId) {
      setSelectedGameId(game.userGameId);
      setReviewModalOpen(true);
    }
  };

  return (
    <main className="flex-1 container mx-auto px-4 py-8 flex flex-col gap-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-heading text-2xl text-primary uppercase glitch-hover">My Library</h1>
          <p className="font-mono text-xs text-muted-foreground mt-1">
            TOTAL GAMES: {result?.success ? result.data.statusCounts.total : "..."}
          </p>
        </div>
        <QuickSearch query={localFilter} onQueryChange={handleSearch} onAddGame={() => setSearchOpen(true)} />
      </div>

      <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="bg-muted neo-border rounded-none p-0 h-auto flex flex-wrap">
          {["All", "Wanna Play", "Playing", "Completed", "Dropped"].map((tab) => (
            <TabsTrigger
              key={tab}
              value={tab}
              className="rounded-none font-heading text-xs uppercase data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex-1 py-3"
            >
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-[3/4] w-full rounded-none" />
              <Skeleton className="h-4 w-3/4 rounded-none" />
              <Skeleton className="h-3 w-1/2 rounded-none" />
            </div>
          ))}
        </div>
      ) : games.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {games.map((game) => (
            <GameCard key={game.userGameId ?? game.id} game={game} onClick={() => handleGameClick(game)} />
          ))}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center border-2 border-dashed border-border p-12">
          <p className="font-mono text-muted-foreground text-center">
            NO GAMES FOUND IN THIS CATEGORY.<br />
            CLICK &ldquo;ADD GAME&rdquo; TO ADD ONE.
          </p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <Button
            variant="outline"
            size="sm"
            className="neo-border rounded-none font-heading text-xs"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            PREV
          </Button>

          <div className="flex gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <Button
                key={i}
                variant={currentPage === i + 1 ? "default" : "outline"}
                size="sm"
                className={`neo-border rounded-none font-heading text-xs w-10 ${currentPage === i + 1 ? "bg-primary text-primary-foreground" : ""}`}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            className="neo-border rounded-none font-heading text-xs"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            NEXT
          </Button>
        </div>
      )}

      <AddGameModal />
      <GameDetailModal />
    </main>
  );
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex flex-col relative">
      <FloatingIcons />
      <Navbar />
      <Suspense fallback={
        <div className="flex-1 flex items-center justify-center">
          <p className="font-heading text-primary animate-pulse">LOADING DASHBOARD...</p>
        </div>
      }>
        <DashboardContent />
      </Suspense>
    </div>
  );
}
