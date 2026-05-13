import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/shared/Navbar";
import { FloatingIcons } from "@/components/shared/FloatingIcons";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="relative flex-1 flex flex-col items-center justify-center p-8 text-center bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] dark:bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
        <FloatingIcons />
        <div className="max-w-2xl space-y-8 p-12 bg-card/80 backdrop-blur-md neo-border">
          <h1 className="font-heading text-4xl md:text-6xl text-primary glitch-hover">
            BACKLOG<br/>BURNER
          </h1>
          <p className="text-muted-foreground font-mono md:text-lg">
            Track your personal game library, rate your completions, and burn through your backlog in retro-neon style.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link href="/dashboard">
              <Button size="lg" className="w-full sm:w-auto font-heading rounded-none neo-border bg-primary text-primary-foreground hover:bg-primary/90">
                ENTER LIBRARY
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
