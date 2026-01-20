import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface TreasureCardProps {
  id: string;
  name: string;
  vocabulary: string;
  explanation: string;
  example: string;
  grammarTopic: string;
  difficulty: string;
  isNew?: boolean;
}

export default function TreasureCard({
  id,
  name,
  vocabulary,
  explanation,
  example,
  grammarTopic,
  difficulty,
  isNew = false,
}: TreasureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-card border-2 border-accent/20 hover:border-accent/50 transition-colors">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2 flex-1">
              {isNew && (
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                </motion.div>
              )}
              <div className="flex-1">
                <CardTitle className="text-lg font-playfair text-foreground">
                  {name}
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1 font-lato">
                  {vocabulary}
                </p>
              </div>
            </div>
            <Badge variant="outline" className="text-xs whitespace-nowrap">
              {grammarTopic}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="bg-secondary/30 p-3 rounded-md">
            <p className="text-sm text-foreground font-lato leading-relaxed">
              {explanation}
            </p>
          </div>

          <div className="border-l-4 border-accent pl-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Example
            </p>
            <p className="text-sm text-foreground italic font-lato mt-1">
              "{example}"
            </p>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <span className="text-xs font-semibold text-muted-foreground">
              Level:
            </span>
            <Badge className="bg-accent/20 text-accent hover:bg-accent/30">
              {difficulty}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
