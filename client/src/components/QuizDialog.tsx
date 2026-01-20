import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Sparkles } from "lucide-react";
import { Quiz } from "@/lib/types";

interface QuizDialogProps {
  open: boolean;
  quiz: Quiz | null;
  treasureName: string;
  points: number;
  onClose: () => void;
  onAnswer: (isCorrect: boolean, points: number) => void;
}

export default function QuizDialog({
  open,
  quiz,
  treasureName,
  points,
  onClose,
  onAnswer,
}: QuizDialogProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSubmit = () => {
    if (selectedAnswer === null) return;

    const correct = selectedAnswer === quiz?.correctAnswer;
    setIsCorrect(correct);
    setSubmitted(true);

    if (correct) {
      onAnswer(true, points);
    } else {
      onAnswer(false, 0);
    }
  };

  const handleClose = () => {
    setSelectedAnswer(null);
    setSubmitted(false);
    setIsCorrect(false);
    onClose();
  };

  if (!quiz) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-playfair text-lg">
            Quick Quiz: {treasureName}
          </DialogTitle>
          <DialogDescription className="font-lato">
            Answer correctly to earn {points} points!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Question */}
          <div className="bg-secondary/30 p-4 rounded-md">
            <p className="text-foreground font-lato font-medium">
              {quiz.question}
            </p>
          </div>

          {/* Options */}
          <div className="space-y-2">
            {quiz.options.map((option, index) => (
              <motion.button
                key={index}
                onClick={() => !submitted && setSelectedAnswer(index)}
                disabled={submitted}
                className={`w-full p-3 rounded-md text-left font-lato transition-all ${
                  selectedAnswer === index
                    ? "bg-primary text-primary-foreground border-2 border-primary"
                    : "bg-card border-2 border-border hover:border-primary/50"
                } ${
                  submitted && index === quiz.correctAnswer
                    ? "bg-green-100 border-green-500 text-foreground"
                    : ""
                } ${
                  submitted && selectedAnswer === index && !isCorrect
                    ? "bg-red-100 border-red-500 text-foreground"
                    : ""
                }`}
                whileHover={!submitted ? { scale: 1.02 } : {}}
                whileTap={!submitted ? { scale: 0.98 } : {}}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {submitted && index === quiz.correctAnswer && (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  )}
                  {submitted && selectedAnswer === index && !isCorrect && (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                </div>
              </motion.button>
            ))}
          </div>

          {/* Result Message */}
          {submitted && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-3 rounded-md ${
                isCorrect
                  ? "bg-green-100 border border-green-300"
                  : "bg-red-100 border border-red-300"
              }`}
            >
              <div className="flex items-start gap-2">
                {isCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <p
                    className={`font-bold font-lato ${
                      isCorrect ? "text-green-700" : "text-red-700"
                    }`}
                  >
                    {isCorrect ? "Correct! 🎉" : "Not quite right"}
                  </p>
                  <p className="text-sm font-lato text-foreground mt-1">
                    {quiz.explanation}
                  </p>
                  {isCorrect && (
                    <div className="flex items-center gap-2 mt-2">
                      <Sparkles className="w-4 h-4 text-accent" />
                      <span className="text-sm font-bold text-accent">
                        +{points} points!
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Buttons */}
          <div className="flex gap-2 pt-2">
            {!submitted ? (
              <>
                <Button
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1 font-lato"
                >
                  Skip
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={selectedAnswer === null}
                  className="flex-1 font-lato"
                >
                  Submit
                </Button>
              </>
            ) : (
              <Button onClick={handleClose} className="w-full font-lato">
                Continue
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
