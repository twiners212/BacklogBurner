import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Star } from "lucide-react";

export interface Game {
  userGameId?: number;
  id: number;
  title: string;
  coverUrl: string | null;
  releaseDate: string | null;
  status?: string;
  rating?: number | null;
}

interface GameCardProps {
  game: Game;
  onClick?: () => void;
}

export function GameCard({ game, onClick }: GameCardProps) {
  return (
    <Card 
      className="neo-border rounded-none cursor-pointer group bg-card overflow-hidden flex flex-col h-full"
      onClick={onClick}
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted">
        <div className="absolute inset-0 crt-overlay z-10" />
        {/* Mock image for now using placehold.co or simple div */}
        {game.coverUrl ? (
          <img 
            src={game.coverUrl} 
            alt={game.title} 
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center font-heading text-muted-foreground text-xs p-4 text-center">
            NO COVER DATA
          </div>
        )}
        
        {game.status && (
          <Badge className="absolute top-2 right-2 z-20 rounded-none neo-border font-heading text-[10px] bg-primary text-primary-foreground">
            {game.status}
          </Badge>
        )}
      </div>
      
      <CardContent className="p-4 flex-grow flex flex-col justify-between border-t border-border">
        <div>
          <h3 className="font-heading text-sm font-bold glitch-hover line-clamp-2 mb-2 leading-tight">
            {game.title}
          </h3>
          <p className="text-xs text-muted-foreground font-mono">
            {game.releaseDate}
          </p>
        </div>
      </CardContent>
      
      {game.rating !== undefined && (
        <CardFooter className="p-4 pt-0">
          <div className="flex items-center gap-1 text-secondary">
            <Star className="w-4 h-4 fill-current" />
            <span className="font-heading text-xs mt-1">{game.rating}/10</span>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
