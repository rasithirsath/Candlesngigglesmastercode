import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { products } from "@/contexts/StoreContext";

interface QuizQuestion {
  id: number;
  question: string;
  options: { value: string; label: string }[];
}

const quizQuestions: QuizQuestion[] = [
  // QUESTION 1
  {
    id: 1,
    question: "Who are you buying this candle for?",
    options: [
      { value: "friend", label: "A close friend" },
      { value: "partner", label: "My partner / someone I love" },
      { value: "self", label: "Myself (because I deserve it)" },
      { value: "special", label: "Someone special but hard to shop for" },
    ],
  },

  // QUESTION 2
  {
    id: 2,
    question: "What’s the occasion (or reason)?",
    options: [
      { value: "birthday", label: "Birthday or celebration " },
      { value: "justbecause", label: "Just because / no reason needed" },
      { value: "romantic", label: "A romantic moment or milestone " },
      { value: "comfort", label: "Comfort, support, or self-care " },
    ],
  },

  // QUESTION 3
  {
    id: 3,
    question: "How would you describe their personality?",
    options: [
      { value: "funny", label: "Funny, sarcastic, and a little unfiltered" },
      { value: "emotional", label: "Warm, emotional, and sentimental" },
      { value: "calm", label: "Calm, grounded, and mindful" },
      { value: "bold", label: "Bold, confident, and classy" },
    ],
  },

  // QUESTION 4
  {
    id: 4,
    question: "What kind of scent do they gravitate towards?",
    options: [
      {
        value: "cozy",
        label: "Warm & cozy (vanilla, amber, woody notes)",
      },
      {
        value: "fresh",
        label: "Fresh & clean (rain, linen, light florals)",
      },
      {
        value: "sensual",
        label: "Romantic & sensual (rose, musk, soft spice)",
      },
      {
        value: "earthy",
        label: "Earthy & calming (sandalwood, herbal, meditative)",
      },
    ],
  },

  // QUESTION 5
  {
    id: 5,
    question: "When they open the candle, what reaction are you hoping for?",
    options: [
      {
        value: "laugh",
        label: "A laugh they didn’t expect",
      },
      {
        value: "smile",
        label: "A quiet smile that means everything",
      },
      {
        value: "comfort",
        label: "A feeling of comfort and calm",
      },
      {
        value: "wow",
        label: "A “wow, this is beautiful” moment",
      },
    ],
  },
];

const Quiz = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const handleAnswer = (value: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion]: value }));
  };

  const nextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      // Navigate to results
      navigate("/quiz-result", { state: { answers } });
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-32 pb-24 px-6 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-2xl">
          {/* Progress Bar */}
          <div className="mb-12">
            <div className="h-1 bg-charcoal-medium rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <p className="text-center text-foreground/40 text-sm mt-4 font-light tracking-wide">
              Question {currentQuestion + 1} of {quizQuestions.length}
            </p>
          </div>

          {/* Question Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="luxury-card p-12"
            >
              <h2 className="text-2xl md:text-3xl font-light tracking-[0.1em] text-primary text-center mb-12">
                {quizQuestions[currentQuestion].question}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quizQuestions[currentQuestion].options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleAnswer(option.value)}
                    className={`p-6 border rounded-sm text-left transition-all duration-500 ${
                      answers[currentQuestion] === option.value
                        ? "border-primary bg-primary/10 shadow-[0_0_20px_hsl(43_45%_59%_/_0.2)]"
                        : "border-primary/20 hover:border-primary/50"
                    }`}
                  >
                    <p className="text-foreground/80 font-light tracking-wide">
                      {option.label}
                    </p>
                  </button>
                ))}
              </div>

              {/* Navigation */}
              <div className="flex justify-between mt-12">
                <Button
                  variant="ghost"
                  onClick={prevQuestion}
                  disabled={currentQuestion === 0}
                  className="text-foreground/60"
                >
                  <ChevronLeft size={18} />
                  Back
                </Button>
                <Button
                  variant="luxury"
                  onClick={nextQuestion}
                  disabled={!answers[currentQuestion]}
                >
                  {currentQuestion === quizQuestions.length - 1
                    ? "See Results"
                    : "Next"}
                  <ChevronRight size={18} />
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default Quiz;
