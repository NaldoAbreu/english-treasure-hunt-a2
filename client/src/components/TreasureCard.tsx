import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, Volume2 } from "lucide-react";
import { motion } from "framer-motion";
import { Treasure } from "@/lib/types";

interface TreasureCardProps {
  treasure: Treasure;
  isDiscovered: boolean;
  onSpeak: () => void;
  isSpeaking: boolean;
}

export default function TreasureCard({
  treasure,
  isDiscovered,
  onSpeak,
  isSpeaking,
}: TreasureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-lg p-6 shadow-md">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {isDiscovered && (
              <motion.div
                initial={{ rotate: -180, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <Sparkles className="w-6 h-6 text-amber-600" />
              </motion.div>
            )}
            <div>
              <h3 className="text-xl font-bold text-amber-900">{treasure.name}</h3>
              <p className="text-sm text-amber-700">{treasure.grammarTopic}</p>
            </div>
          </div>
          <Badge className="bg-amber-600 text-white">{treasure.difficulty}</Badge>
        </div>

        <div className="space-y-4">
          {/* Vocabulary */}
          <div>
            <label className="text-sm font-semibold text-amber-900 block mb-1">
              Vocabulary
            </label>
            <div className="flex items-center gap-2">
              <p className="text-base text-amber-800 font-medium">{treasure.vocabulary}</p>
              <Button
                size="sm"
                variant="ghost"
                onClick={onSpeak}
                disabled={isSpeaking}
                className="text-amber-600 hover:bg-amber-100"
              >
                <Volume2 className={`w-4 h-4 ${isSpeaking ? "animate-pulse" : ""}`} />
              </Button>
            </div>
          </div>

          {/* Explanation */}
          <div>
            <label className="text-sm font-semibold text-amber-900 block mb-1">
              Explanation
            </label>
            <p className="text-sm text-amber-800 leading-relaxed">{treasure.explanation}</p>
          </div>

          {/* Example */}
          <div>
            <label className="text-sm font-semibold text-amber-900 block mb-1">
              Example
            </label>
            <blockquote className="text-sm text-amber-700 italic border-l-4 border-amber-400 pl-3 py-1">
              "{treasure.example}"
            </blockquote>
          </div>

          {/* Points */}
          <div className="bg-white/50 rounded-lg p-3 flex items-center justify-between">
            <span className="text-sm font-semibold text-amber-900">Points</span>
            <span className="text-lg font-bold text-amber-600">+{treasure.points}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
