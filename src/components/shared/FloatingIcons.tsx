import {
  Gamepad2, Star, Trophy, Sparkles, Swords, Gem,
  Monitor, Keyboard, Mouse, Headphones, Joystick,
  Shield, Zap, Target, Heart, Flame, Crown,
  Rocket, Ghost, Skull, Clover, Diamond,
  Eye, Music, Radio, Volume2, Coins,
  Award, Bell, Flag, Book, Send,
  Lightbulb, Cat, Cloud, Moon, Sun,
} from "lucide-react";

const allIcons = [
  Gamepad2, Star, Trophy, Sparkles, Swords, Gem,
  Monitor, Keyboard, Mouse, Headphones, Joystick,
  Shield, Zap, Target, Heart, Flame, Crown,
  Rocket, Ghost, Skull, Clover, Diamond,
  Eye, Music, Radio, Volume2, Coins,
  Award, Bell, Flag, Book, Send,
  Lightbulb, Cat, Cloud, Moon, Sun,
];

const positions = [
  { top: "5%", left: "3%" }, { top: "10%", right: "5%" }, { top: "8%", left: "50%" },
  { top: "22%", left: "8%" }, { top: "18%", right: "12%" },
  { top: "35%", left: "2%" }, { top: "30%", right: "3%" }, { top: "40%", left: "55%" },
  { top: "50%", left: "6%" }, { top: "48%", right: "8%" },
  { top: "62%", left: "4%" }, { top: "58%", right: "5%" }, { top: "65%", left: "48%" },
  { top: "75%", left: "2%" }, { top: "78%", right: "6%" },
  { top: "88%", left: "7%" }, { top: "85%", right: "3%" }, { top: "90%", left: "52%" },
  { top: "15%", left: "25%" }, { top: "25%", right: "22%" },
  { top: "45%", left: "30%" }, { top: "55%", right: "28%" },
  { top: "70%", left: "22%" }, { top: "82%", right: "25%" },
  { top: "12%", left: "70%" }, { top: "32%", right: "55%" },
  { top: "52%", left: "70%" }, { top: "72%", right: "50%" },
  { top: "38%", left: "42%" }, { top: "68%", left: "38%" },
  { top: "20%", left: "42%" }, { top: "60%", left: "55%" },
  { top: "42%", left: "16%" }, { top: "28%", right: "35%" },
  { top: "80%", left: "42%" }, { top: "48%", right: "45%" },
];

const colors = ["#66FCF1", "#FF007F", "#66FCF1", "#FF007F", "#66FCF1"];

export function FloatingIcons({ density = 1 }: { density?: number }) {
  const count = Math.floor(allIcons.length * density);
  const visible = allIcons.slice(0, count);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {visible.map((Icon, i) => {
        const pos = positions[i % positions.length];
        const color = colors[i % colors.length];
        const size = 22 + ((i * 3) % 20);
        const dur = 7 + (i % 6);
        const del = (i * 0.7) % 5;

        return (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              top: pos.top,
              left: pos.left,
              right: pos.right,
              width: size,
              height: size,
              animationDuration: `${dur}s`,
              animationDelay: `${del}s`,
              filter: `drop-shadow(0 0 6px ${color}) drop-shadow(0 0 12px ${color}40)`,
              opacity: 0.12,
              color,
            }}
          >
            <Icon size={size} />
          </div>
        );
      })}
    </div>
  );
}
