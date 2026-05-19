import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, CheckCircle, XCircle, Trophy, ArrowRight, ArrowLeft, Lightbulb } from "lucide-react";
import { useGameStore } from "@/shared/stores/gameStore";
import { useUserStore } from "@/shared/stores/userStore";
import { useAudio } from "@/shared/hooks/useAudio";

export default function Learn() {
  const completedModules = useGameStore((s) => s.completedModules);
  const completeModule   = useGameStore((s) => s.completeModule);
  const currentModules   = useUserStore((s) => s.mindset?.modules ?? []);
  const mindset          = useUserStore((s) => s.mindset);
  const { playSuccess }  = useAudio();

  const [activeModule, setActiveModule] = useState<number | null>(null);
  const [quizIndex, setQuizIndex]       = useState(0);
  const [answers, setAnswers]           = useState<number[]>([]);
  const [showResult, setShowResult]     = useState(false);
  const [showNotes, setShowNotes]       = useState(false);

  const module = activeModule !== null
    ? currentModules.find((m) => m.id === activeModule)
    : null;

  const startModule = (id: number) => {
    setActiveModule(id);
    setQuizIndex(0);
    setAnswers([]);
    setShowResult(false);
    setShowNotes(true);
  };

  const answerQuestion = (optionIndex: number) => {
    const newAnswers = [...answers, optionIndex];
    setAnswers(newAnswers);
    if (newAnswers.length < (module?.quiz.length ?? 0)) {
      setQuizIndex(newAnswers.length);
    } else {
      setShowResult(true);
      const correct = newAnswers.filter((a, i) => a === module!.quiz[i].correct).length;
      if (correct === module!.quiz.length) {
        completeModule(module!.id);
        playSuccess();
      }
    }
  };

  const closeModule = () => {
    setActiveModule(null);
    setShowNotes(false);
    setShowResult(false);
  };

  return (
    <div className="page-container pb-24">
      <h2 className="font-serif text-3xl font-bold text-white mb-2">Your Modules</h2>
      <p className="text-muted-foreground text-sm mb-6">
        {mindset
          ? `${mindset.name} Curriculum — ${currentModules.length} modules to mastery`
          : "Select a mindset to unlock your learning path"}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentModules.map((m, i) => {
          const isCompleted = completedModules.includes(m.id);
          return (
            <motion.button
              key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => startModule(m.id)}
              className={`glass-card-hover p-5 text-left relative overflow-hidden ${isCompleted ? "border-xhosa-teal/30" : ""}`}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              {isCompleted && (
                <div className="absolute top-3 right-3">
                  <CheckCircle className="w-5 h-5 text-xhosa-teal" />
                </div>
              )}
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-4 h-4 text-gold" />
                <span className="text-xs text-gold uppercase tracking-wider">Module {m.id}</span>
              </div>
              <h3 className="font-semibold text-white mb-2">{m.name}</h3>
              <p className="text-xs text-muted-foreground line-clamp-2">{m.notes.substring(0, 140)}...</p>
              <div className="mt-3 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${isCompleted ? "bg-xhosa-teal" : "bg-gradient-to-r from-gold-light to-gold"}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${isCompleted ? 100 : 0}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* ── Module Modal ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {activeModule !== null && module && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={closeModule}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-dark-card border border-gold/20 rounded-3xl p-6 md:p-8 max-w-lg w-full max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-xs text-gold uppercase tracking-wider">Module {module.id}</span>
                  <h3 className="font-serif text-xl font-semibold text-white">{module.name}</h3>
                </div>
                <button onClick={closeModule} className="text-muted-foreground hover:text-white">✕</button>
              </div>

              {/* Notes view */}
              {showNotes && !showResult && answers.length === 0 && (
                <div className="mb-6">
                  <div className="bg-gold/5 border border-gold/20 rounded-xl p-4 mb-4">
                    <div className="flex items-center gap-2 text-gold mb-2">
                      <Lightbulb className="w-4 h-4" />
                      <span className="text-xs font-medium uppercase tracking-wider">Key Insight</span>
                    </div>
                    <p className="text-sm text-white/80 leading-relaxed">{module.notes}</p>
                  </div>
                  {completedModules.includes(module.id) ? (
                    <div className="flex items-center gap-2 text-xhosa-teal">
                      <Trophy className="w-5 h-5" />
                      <span className="font-medium">Module Completed — +100 XP Earned</span>
                    </div>
                  ) : (
                    <button
                      className="btn-premium w-full flex items-center justify-center gap-2"
                      onClick={() => setShowNotes(false)}
                    >
                      Start Quiz <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}

              {/* Quiz view */}
              {!showNotes && !showResult && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    {module.quiz.map((_, i) => (
                      <div
                        key={i}
                        className={`h-1.5 flex-1 rounded-full ${
                          i < answers.length ? "bg-gold" : i === quizIndex ? "bg-gold/50" : "bg-white/10"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mb-4">
                    Question {quizIndex + 1} of {module.quiz.length}
                  </p>
                  <h4 className="text-white font-medium mb-4">{module.quiz[quizIndex].q}</h4>
                  <div className="space-y-2">
                    {module.quiz[quizIndex].opts.map((opt, idx) => (
                      <button
                        key={idx}
                        className="w-full text-left p-4 rounded-xl bg-white/5 border border-white/10 hover:border-gold/30 hover:bg-gold/5 transition-all text-sm"
                        onClick={() => answerQuestion(idx)}
                      >
                        <span className="text-gold font-bold mr-2">{String.fromCharCode(65 + idx)}.</span>
                        {opt}
                      </button>
                    ))}
                  </div>
                  <button className="btn-outline-premium w-full mt-4" onClick={() => setShowNotes(true)}>
                    <ArrowLeft className="w-4 h-4 inline mr-2" /> Review Notes
                  </button>
                </div>
              )}

              {/* Result view */}
              {showResult && (() => {
                const correct = answers.filter((a, i) => a === module.quiz[i].correct).length;
                const passed  = correct === module.quiz.length;
                return (
                  <div className="text-center py-4">
                    {passed ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-16 h-16 bg-xhosa-teal/20 rounded-full flex items-center justify-center mx-auto mb-4"
                      >
                        <Trophy className="w-8 h-8 text-xhosa-teal" />
                      </motion.div>
                    ) : (
                      <div className="w-16 h-16 bg-xhosa-red/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <XCircle className="w-8 h-8 text-xhosa-red" />
                      </div>
                    )}
                    <h4 className={`font-serif text-xl font-bold mb-2 ${passed ? "text-xhosa-teal" : "text-xhosa-red"}`}>
                      {passed ? "Nailed it!" : "Keep Learning"}
                    </h4>
                    <p className="text-muted-foreground text-sm mb-4">{correct}/{module.quiz.length} correct</p>
                    {module.quiz.map((q, i) => (
                      <div key={i} className="text-left text-xs mb-2 p-2 rounded-lg bg-white/5">
                        <p className="text-white/70 mb-1">{q.q}</p>
                        <p className={answers[i] === q.correct ? "text-xhosa-teal" : "text-xhosa-red"}>
                          Your answer: {q.opts[answers[i]]} {answers[i] === q.correct ? "✓" : "✗"}
                        </p>
                        {answers[i] !== q.correct && (
                          <p className="text-xhosa-teal mt-1">Correct: {q.opts[q.correct]}</p>
                        )}
                      </div>
                    ))}
                    <button type="button" className="btn-premium w-full mt-4" onClick={closeModule}>
                      {passed ? "Continue Journey" : "Try Again Later"}
                    </button>
                  </div>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
