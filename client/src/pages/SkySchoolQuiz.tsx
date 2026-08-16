import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import {
  ArrowLeft, CheckCircle, XCircle, Award, Download, Share2, Trophy,
  Zap, Target, Brain, Sparkles, Lock, Unlock, BarChart3
} from "lucide-react";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface QuizData {
  courseId: string;
  courseName: string;
  lessonTitle: string;
  questions: Question[];
  passingScore: number;
}

// Quiz data for each lesson
const QUIZ_DATA: Record<string, QuizData | undefined> = {
  "blockchain-101-lesson-0": {
    courseId: "blockchain-101",
    courseName: "Blockchain Fundamentals",
    lessonTitle: "What is Blockchain?",
    passingScore: 70,
    questions: [
      {
        id: "q1",
        question: "What is the primary characteristic of blockchain technology?",
        options: [
          "Centralized control",
          "Distributed ledger with cryptographic security",
          "Faster than traditional databases",
          "Requires less storage"
        ],
        correctAnswer: 1,
        explanation: "Blockchain is a distributed ledger technology that maintains records across multiple nodes with cryptographic security, ensuring no single point of failure."
      },
      {
        id: "q2",
        question: "Who created Bitcoin, the first blockchain?",
        options: [
          "Vitalik Buterin",
          "Satoshi Nakamoto",
          "Charlie Lee",
          "Unknown"
        ],
        correctAnswer: 1,
        explanation: "Bitcoin was created in 2008 by Satoshi Nakamoto, whose true identity remains unknown to this day."
      },
      {
        id: "q3",
        question: "What does immutability mean in blockchain?",
        options: [
          "Data can be easily changed",
          "Once recorded, data cannot be altered",
          "Data is stored in multiple locations",
          "Data is encrypted"
        ],
        correctAnswer: 1,
        explanation: "Immutability means that once data is recorded on the blockchain, it cannot be altered or deleted, ensuring data integrity."
      },
      {
        id: "q4",
        question: "Which of the following is NOT an advantage of blockchain?",
        options: [
          "Transparency",
          "Decentralization",
          "Instant processing",
          "Security"
        ],
        correctAnswer: 2,
        explanation: "While blockchain offers transparency, decentralization, and security, instant processing is not guaranteed due to consensus mechanisms and network conditions."
      },
      {
        id: "q5",
        question: "What is the difference between public and private blockchains?",
        options: [
          "Public blockchains are faster",
          "Public blockchains are open to anyone, private blockchains are restricted",
          "Private blockchains are more secure",
          "There is no difference"
        ],
        correctAnswer: 1,
        explanation: "Public blockchains are open to anyone and fully decentralized, while private blockchains restrict access to authorized participants."
      }
    ]
  },
  "blockchain-101-lesson-1": {
    courseId: "blockchain-101",
    courseName: "Blockchain Fundamentals",
    lessonTitle: "Distributed Ledgers",
    passingScore: 70,
    questions: [
      {
        id: "q1",
        question: "What is a distributed ledger?",
        options: [
          "A database controlled by one entity",
          "A database replicated and synchronized across multiple sites",
          "A traditional accounting ledger",
          "A centralized server"
        ],
        correctAnswer: 1,
        explanation: "A distributed ledger is a database that is consensually shared, replicated, and synchronized across multiple sites or institutions."
      },
      {
        id: "q2",
        question: "Which of the following is an advantage of distributed ledgers?",
        options: [
          "Single point of control",
          "Increased resilience and fault tolerance",
          "Slower transaction processing",
          "Reduced transparency"
        ],
        correctAnswer: 1,
        explanation: "Distributed ledgers provide increased resilience and fault tolerance because there is no single point of failure."
      },
      {
        id: "q3",
        question: "What is a use case for distributed ledgers in supply chain?",
        options: [
          "Increasing costs",
          "Tracking products from manufacture to consumer",
          "Reducing transparency",
          "Centralizing control"
        ],
        correctAnswer: 1,
        explanation: "Distributed ledgers can track products throughout the supply chain, verifying authenticity and reducing counterfeiting."
      },
      {
        id: "q4",
        question: "How are distributed ledgers kept synchronized?",
        options: [
          "Manual updates",
          "Consensus mechanisms",
          "Central authority",
          "Random selection"
        ],
        correctAnswer: 1,
        explanation: "Distributed ledgers use consensus mechanisms to ensure all copies are kept in sync across the network."
      },
      {
        id: "q5",
        question: "Which industry can benefit from distributed ledgers for digital identity?",
        options: [
          "Only banking",
          "Only healthcare",
          "Multiple industries including finance, healthcare, and government",
          "None"
        ],
        correctAnswer: 2,
        explanation: "Distributed ledgers can provide self-sovereign identity solutions across multiple industries for secure, verifiable credentials."
      }
    ]
  }
};

interface QuizResult {
  score: number;
  passed: boolean;
  answers: Record<string, number>;
  timestamp: Date;
}

export default function SkySchoolQuiz({ lessonId, onComplete }: { lessonId: string; onComplete?: (result: QuizResult) => void }) {
  const { isAuthenticated, user } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const quiz = QUIZ_DATA[lessonId];

  if (!quiz) {
    return (
      <Card className="bg-slate-900/50 border border-white/10">
        <CardContent className="p-6 text-center">
          <p className="text-slate-400">Quiz not available for this lesson yet.</p>
        </CardContent>
      </Card>
    );
  }

  const question = quiz.questions[currentQuestion];
  const answered = answers[question.id] !== undefined;

  const handleAnswer = (optionIndex: number) => {
    setSelectedAnswer(optionIndex);
  };

  const handleNext = () => {
    if (selectedAnswer === null) {
      toast.error("Please select an answer");
      return;
    }

    setAnswers(prev => ({
      ...prev,
      [question.id]: selectedAnswer as number
    }));

    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      calculateResults();
    }
  };

  const calculateResults = () => {
    const finalAnswers: Record<string, number> = {
      ...answers,
      [question.id]: selectedAnswer as number
    };

    let correctCount = 0;
    quiz.questions.forEach(q => {
      if (finalAnswers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / quiz.questions.length) * 100);
    const passed = score >= quiz.passingScore;

    const result: QuizResult = {
      score,
      passed,
      answers: finalAnswers,
      timestamp: new Date()
    };

    setQuizResult(result);
    setShowResults(true);
    setAnswers(finalAnswers);

    if (onComplete) {
      onComplete(result);
    }

    if (passed) {
      toast.success(`Quiz Passed! Score: ${score}%`);
    } else {
      toast.error(`Quiz Failed. Score: ${score}%. Try again!`);
    }
  };

  const handleRetake = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setQuizResult(null);
    setSelectedAnswer(null);
  };

  // Results View
  if (showResults && quizResult) {
    const correctCount = Object.entries(answers).filter(
      ([qId, answer]) => quiz.questions.find(q => q.id === qId)?.correctAnswer === answer
    ).length;

    return (
      <div className="space-y-6">
        {/* Score Card */}
        <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border border-white/10 overflow-hidden">
          <div className={`h-2 w-full ${quizResult.passed ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-red-500 to-orange-500'}`} />
          <CardContent className="p-8 text-center">
            <div className="mb-4">
              {quizResult.passed ? (
                <Trophy className="w-16 h-16 mx-auto text-yellow-400 mb-4" />
              ) : (
                <Target className="w-16 h-16 mx-auto text-orange-400 mb-4" />
              )}
            </div>
            <h2 className={`text-4xl font-bold mb-2 ${quizResult.passed ? 'text-green-400' : 'text-orange-400'}`}>
              {quizResult.score}%
            </h2>
            <p className="text-xl text-slate-300 mb-4">
              {quizResult.passed ? "Quiz Passed! 🎉" : "Quiz Failed - Try Again"}
            </p>
            <p className="text-slate-400">
              You got {correctCount} out of {quiz.questions.length} questions correct
            </p>
          </CardContent>
        </Card>

        {/* Certificate (if passed) */}
        {quizResult.passed && (
          <Card className="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 border border-yellow-500/30">
            <CardHeader>
              <CardTitle className="text-yellow-300 flex items-center gap-2">
                <Award className="w-5 h-5" />
                Certificate of Completion
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-slate-900/50 p-6 rounded-lg border border-yellow-500/20 text-center">
                <p className="text-slate-400 text-sm mb-2">This certifies that</p>
                <p className="text-xl font-bold text-white mb-2">{user?.name || "Student"}</p>
                <p className="text-slate-400 text-sm mb-4">has successfully completed</p>
                <p className="text-lg font-semibold text-yellow-300 mb-4">{quiz.lessonTitle}</p>
                <p className="text-slate-400 text-sm">with a score of {quizResult.score}%</p>
                <p className="text-slate-500 text-xs mt-4">{new Date().toLocaleDateString()}</p>
              </div>
              <div className="flex gap-3">
                <Button className="flex-1 bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-300 border border-yellow-500/30">
                  <Download className="w-4 h-4 mr-2" />
                  Download Certificate
                </Button>
                <Button className="flex-1 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Achievement
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Review Answers */}
        <Card className="bg-slate-900/50 border border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Review Your Answers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {quiz.questions.map((q, idx) => {
              const userAnswer = answers[q.id];
              const isCorrect = userAnswer === q.correctAnswer;

              return (
                <div key={q.id} className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                  <div className="flex items-start gap-3 mb-3">
                    {isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-1" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-1" />
                    )}
                    <div className="flex-1">
                      <p className="font-semibold text-white mb-2">Question {idx + 1}: {q.question}</p>
                      <p className={`text-sm mb-2 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                        Your answer: {q.options[userAnswer]}
                      </p>
                      {!isCorrect && (
                        <p className="text-sm text-green-400 mb-2">
                          Correct answer: {q.options[q.correctAnswer]}
                        </p>
                      )}
                      <p className="text-sm text-slate-400 italic">{q.explanation}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 border-slate-600 text-slate-300"
            onClick={handleRetake}
          >
            Retake Quiz
          </Button>
          <Button className="flex-1 bg-purple-600 hover:bg-purple-700">
            Continue to Next Lesson
          </Button>
        </div>
      </div>
    );
  }

  // Quiz View
  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">{quiz.lessonTitle} Quiz</h2>
          <p className="text-slate-400">Question {currentQuestion + 1} of {quiz.questions.length}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-400 mb-2">Progress</p>
          <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question Card */}
      <Card className="bg-slate-900/50 border border-white/10">
        <CardContent className="p-8">
          <h3 className="text-xl font-semibold text-white mb-6">{question.question}</h3>

          <RadioGroup value={selectedAnswer?.toString() || ""} onValueChange={(val) => handleAnswer(parseInt(val))}>
            <div className="space-y-3">
              {question.options.map((option, idx) => (
                <Label
                  key={idx}
                  className="flex items-center p-4 rounded-lg border border-slate-700 hover:border-cyan-500/50 hover:bg-slate-800/50 cursor-pointer transition-all"
                >
                  <RadioGroupItem value={idx.toString()} className="mr-3" />
                  <span className="text-slate-300">{option}</span>
                </Label>
              ))}
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          className="border-slate-600 text-slate-300"
          onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
          disabled={currentQuestion === 0}
        >
          Previous
        </Button>
        <Button
          className="flex-1 bg-purple-600 hover:bg-purple-700"
          onClick={handleNext}
          disabled={selectedAnswer === null}
        >
          {currentQuestion === quiz.questions.length - 1 ? "Submit Quiz" : "Next Question"}
        </Button>
      </div>
    </div>
  );
}
