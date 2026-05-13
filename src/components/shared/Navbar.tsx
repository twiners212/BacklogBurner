"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { Gamepad2, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { theme, setTheme } = useTheme();

  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Gamepad2 className="w-8 h-8 text-primary" />
          <span className="font-heading text-lg glitch-hover text-primary hidden sm:inline-block">
            BacklogBurner
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            className="neo-border rounded-none bg-background hover:bg-muted"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </nav>
  );
}
