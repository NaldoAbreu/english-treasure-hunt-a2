import { motion } from "framer-motion";
import { Treasure } from "@/lib/types";

interface ScenarioMapProps {
  image: string;
  name: string;
  treasures: Treasure[];
  discoveredTreasures: Set<string>;
  onTreasureClick: (treasure: Treasure) => void;
}

export default function ScenarioMap({
  image,
  name,
  treasures,
  discoveredTreasures,
  onTreasureClick,
}: ScenarioMapProps) {
  return (
    <div className="relative w-full bg-gradient-to-br from-accent/10 to-secondary/20 rounded-lg overflow-hidden">
      {/* Background Image */}
      <img
        src={image}
        alt={name}
        className="w-full h-auto block"
      />

      {/* Interactive Hotspots */}
      <div className="absolute inset-0">
        {treasures.map((treasure) => {
          const isDiscovered = discoveredTreasures.has(treasure.id);
          return (
            <motion.button
              key={treasure.id}
              className="absolute w-12 h-12 group"
              style={{
                left: `${treasure.x}%`,
                top: `${treasure.y}%`,
                transform: "translate(-50%, -50%)",
              }}
              onClick={() => onTreasureClick(treasure)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Outer glow ring */}
              <motion.div
                className={`absolute inset-0 rounded-full ${
                  isDiscovered
                    ? "bg-accent/30 border-2 border-accent"
                    : "bg-primary/20 border-2 border-primary"
                }`}
                animate={{
                  boxShadow: isDiscovered
                    ? "0 0 20px rgba(212, 165, 116, 0.6)"
                    : "0 0 15px rgba(74, 155, 142, 0.4)",
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />

              {/* Inner icon */}
              <div
                className={`absolute inset-2 rounded-full flex items-center justify-center text-lg font-bold ${
                  isDiscovered
                    ? "bg-accent text-accent-foreground"
                    : "bg-primary text-primary-foreground"
                }`}
              >
                {isDiscovered ? "✓" : "?"}
              </div>

              {/* Tooltip on hover */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="bg-foreground text-background px-2 py-1 rounded text-xs whitespace-nowrap font-lato">
                  {treasure.name}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
