import { motion } from "framer-motion";
import { Treasure } from "@/lib/types";
import { useState } from "react";

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
  const [hoveredTreasure, setHoveredTreasure] = useState<string | null>(null);

  return (
    <div className="relative w-full bg-gradient-to-br from-accent/10 to-secondary/20 rounded-lg overflow-hidden group">
      {/* Background Image */}
      <img
        src={image}
        alt={name}
        className="w-full h-auto block"
      />

      {/* Interactive Hotspots - Invisible until hover */}
      <div className="absolute inset-0">
        {treasures.map((treasure) => {
          const isDiscovered = Array.from(discoveredTreasures).includes(treasure.id);
          const isHovered = hoveredTreasure === treasure.id;

          return (
            <motion.button
              key={treasure.id}
              className="absolute w-16 h-16 group/hotspot"
              style={{
                left: `${treasure.x}%`,
                top: `${treasure.y}%`,
                transform: "translate(-50%, -50%)",
              }}
              onClick={() => onTreasureClick(treasure)}
              onMouseEnter={() => setHoveredTreasure(treasure.id)}
              onMouseLeave={() => setHoveredTreasure(null)}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Subtle hover indicator - only visible on hover */}
              <motion.div
                className={`absolute inset-0 rounded-full border-2 transition-all ${
                  isHovered
                    ? "border-primary bg-primary/10"
                    : "border-transparent bg-transparent"
                }`}
                animate={{
                  boxShadow: isHovered
                    ? "0 0 20px rgba(74, 155, 142, 0.5)"
                    : "0 0 0px rgba(74, 155, 142, 0)",
                }}
                transition={{ duration: 0.2 }}
              />

              {/* Discovered indicator - small checkmark for found treasures */}
              {isDiscovered && (
                <motion.div
                  className="absolute inset-2 rounded-full bg-accent flex items-center justify-center text-sm font-bold text-accent-foreground"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  ✓
                </motion.div>
              )}

              {/* Tooltip on hover */}
              <motion.div
                className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 opacity-0 group-hover/hotspot:opacity-100 transition-opacity pointer-events-none"
                animate={{ y: isHovered ? 0 : 5 }}
              >
                <div className="bg-foreground text-background px-3 py-1.5 rounded text-xs whitespace-nowrap font-lato font-semibold shadow-lg">
                  {treasure.name}
                  {isDiscovered && " ✓"}
                </div>
              </motion.div>
            </motion.button>
          );
        })}
      </div>

      {/* Subtle hint text */}
      <div className="absolute bottom-4 left-4 right-4 text-xs text-muted-foreground font-lato opacity-60 pointer-events-none">
        💡 Hover over the image to find hidden treasures
      </div>
    </div>
  );
}
