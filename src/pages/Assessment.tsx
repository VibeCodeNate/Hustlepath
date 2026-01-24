import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/Button';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../lib/auth';

type Question = {
    id: number;
    text: string;
    type: 'choice' | 'text';
    allowMultiple?: boolean;
    options?: string[];
    placeholder?: string;
    key: string;
};

// Expanded Question Bank
const RAW_QUESTIONS: Question[] = [
    {
        id: 1,
        text: "How much starting capital do you have?",
        type: 'choice',
        options: [
            "$0 (Broke / Bootstrapping)",
            "$100 - $500",
            "$500 - $1,000",
            "$1,000 - $5,000",
            "$5,000 - $10,000",
            "$10,000+ (Ready to invest)"
        ],
        key: "capital"
    },
    {
        id: 2,
        text: "How much time can you commit weekly?",
        type: 'choice',
        options: [
            "1-5 hours (Weekends only)",
            "5-10 hours (Evenings)",
            "10-20 hours (Part-time)",
            "20-40 hours (Full-time focus)",
            "40+ hours (Obsessed)",
            "Whatever it takes (No sleep)"
        ],
        key: "time"
    },
    {
        id: 3,
        text: "What is your primary financial goal right now?",
        type: 'choice',
        allowMultiple: true,
        options: [
            "Extra spending money ($500/mo)",
            "Pay off debt fast",
            "Replace my 9-5 job",
            "Build generational wealth",
            "Fund world travel",
            "Retire early (FIRE)"
        ],
        key: "goal"
    },
    {
        id: 4,
        text: "Which skill areas naturally interest you most? (Select all that apply)",
        type: 'choice',
        allowMultiple: true,
        options: [
            "Content Creation (Video/Art)",
            "Tech, Coding & AI",
            "Sales, Marketing & Persuasion",
            "Physical Services / Hands-on",
            "Writing & Copywriting",
            "Teaching, Coaching & Mentoring"
        ],
        key: "interest"
    },
    {
        id: 5,
        text: "How would you describe your tech skills?",
        type: 'choice',
        options: [
            "Beginner (I struggle with email)",
            "Basic (Can use Social Media/Canvas)",
            "Intermediate (Comfortable with new software)",
            "Advanced (No-code tools / Automation)",
            "Pro (I code / build websites)",
            "Elite (Hacker / AI Engineer)"
        ],
        key: "tech_level"
    },
    {
        id: 6,
        text: "Do you prefer working with people or alone?",
        type: 'choice',
        options: [
            "Solo (Leave me alone in my cave)",
            "Small Team (2-3 trusted partners)",
            "Client-facing (1-on-1 interactions)",
            "Large Groups (Public speaking/Leading)",
            "Behind the scenes (Operations)",
            "No preference, I adapt"
        ],
        key: "social_preference"
    },
    {
        id: 7,
        text: "How soon do you need to see returns (money)?",
        type: 'choice',
        options: [
            "Yesterday (Emergency)",
            "This week (Very Urgent)",
            "Within a month",
            "3-6 months (Building a foundation)",
            "1 year+ (Playing the long game)",
            "I don't care, I want to learn"
        ],
        key: "urgency"
    },
    {
        id: 8,
        text: "What hardware/equipment do you currently own? (Select all that apply)",
        type: 'choice',
        allowMultiple: true,
        options: [
            "Smartphone only",
            "Laptop + Smartphone",
            "High-end PC/Mac Setup",
            "Camera & Audio Gear",
            "Tools / Vehicle Access",
            "Access to a 3D Printer / Workshop"
        ],
        key: "equipment"
    },
    {
        id: 9,
        text: "What is your risk tolerance?",
        type: 'choice',
        options: [
            "Zero risk (Only guaranteed returns)",
            "Low (Willing to lose time, not money)",
            "Medium (Balanced approach)",
            "High (Willing to invest aggressive)",
            "Degen (Crypto / High leverage)",
            "Calculated (I bet on myself)"
        ],
        key: "risk"
    },
    {
        id: 10,
        text: "Are you comfortable appearing on camera?",
        type: 'choice',
        options: [
            "Absolutely not (Faceless only)",
            "Prefer not to, but will if needed",
            "Yes, I'm okay with it",
            "I love the camera (Star power)",
            "Prefer voice/audio only",
            "Only for 1-on-1 calls"
        ],
        key: "camera"
    },
    // Expanded Text/Mixed Questions
    { id: 11, text: "What is your biggest frustration with your current income source?", type: 'text', placeholder: "e.g. Not enough freedom, micromanagement, capped salary...", key: "frustration" },
    { id: 12, text: "List 3 hobbies or topics you love talking about.", type: 'text', placeholder: "e.g. Gaming, Cooking, Football, History...", key: "hobbies" },

    {
        id: 13,
        text: "How do you handle rejection or failure?",
        type: 'choice',
        options: [
            "I give up and spiral",
            "It hurts for a day, then I recover",
            "It annnoys me but I persist",
            "It fuels my fire (Spite driven)",
            "I analyze it and optimize",
            "I don't care, it's a numbers game"
        ],
        key: "resilience"
    },
    {
        id: 14,
        text: "Describe your current workspace:",
        type: 'choice',
        options: [
            "Dedicated home office",
            "Shared room / Bedroom corner",
            "Chaotic / No quiet space",
            "I prefer cafes / Coworking spaces",
            "On the go / Mobile",
            "Garage / Workshop"
        ],
        key: "workspace"
    },
    {
        id: 15,
        text: "Are you willing to do sales (Cold calls/DMs)?",
        type: 'choice',
        options: [
            "Absolutely not, I hate selling",
            "Only inbound (They come to me)",
            "If I have a script/template",
            "Yes, via email/text only",
            "Yes, I can sell ice to eskimos",
            "I want to learn sales"
        ],
        key: "sales_comfort"
    },
    {
        id: 16,
        text: "Preferred income style?",
        type: 'choice',
        options: [
            "100% Passive (Build once, sell forever)",
            "Semi-Passive (Maintenance req.)",
            "Active Service (Paid for time)",
            "High Ticket Sales (Big commissions)",
            "Recurring / Subscription",
            "No preference, cash is cash"
        ],
        key: "income_type"
    },
    { id: 17, text: "What is your specific monthly income goal number?", type: 'text', placeholder: "e.g. $10,000/month", key: "income_target" },
    {
        id: 18,
        text: "Do you have access to a vehicle?",
        type: 'choice',
        options: [
            "No vehicle",
            "Bike / E-Scooter",
            "Reliable Car (Sedan/Hatch)",
            "Truck / Van (Cargo space)",
            "Luxury Vehicle",
            "Public Transport only"
        ],
        key: "vehicle"
    },
    {
        id: 19,
        text: "Rate your writing skills:",
        type: 'choice',
        options: [
            "I hate writing",
            "Below average (Use AI helper)",
            "Average / Conversational",
            "Strong / Academic",
            "Persuasive Copywriter",
            "Professional Author/Journalist"
        ],
        key: "writing_skill"
    },
    {
        id: 20,
        text: "If you had to pick one task for 8 hours:",
        type: 'choice',
        options: [
            "Talking to people / Networking",
            "Building / Fixing physical things",
            "Deep focus Coding / Analyzing data",
            "Creating Art / Design / Video",
            "Researching / Learning topics",
            "Organizing / Managing others"
        ],
        key: "work_preference"
    }
];

// Fisher-Yates Shuffle
function shuffleArray<T>(array: T[]): T[] {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
}

export function Assessment() {
    const navigate = useNavigate();
    const { user } = useAuth();

    // Initialize questions with a random shuffle
    const [questionsState] = useState(() => shuffleArray(RAW_QUESTIONS));

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
    const [direction, setDirection] = useState(0);

    // For Multi-Select
    const [currentSelections, setCurrentSelections] = useState<string[]>([]);

    // For Text
    const [textInput, setTextInput] = useState("");

    const question = questionsState[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questionsState.length) * 100;

    // Reset local inputs when question changes
    const [lastQuestionId, setLastQuestionId] = useState<number | null>(null);
    if (question.id !== lastQuestionId) {
        setLastQuestionId(question.id);
        setCurrentSelections([]);
        setTextInput("");
    }

    const nextQuestion = (finalAnswer: string | string[]) => {
        setAnswers(prev => ({ ...prev, [question.key]: finalAnswer }));

        setDirection(1);

        if (currentQuestionIndex < questionsState.length - 1) {
            setTimeout(() => setCurrentQuestionIndex(prev => prev + 1), 200);
        } else {
            // Quiz complete
            const finalAnswersState = { ...answers, [question.key]: finalAnswer };
            sessionStorage.setItem('hustlepath_answers', JSON.stringify(finalAnswersState));

            if (user) {
                navigate('/results', { state: { answers: finalAnswersState } });
            } else {
                navigate('/signup', { state: { from: '/results', answers: finalAnswersState } });
            }
        }
    };

    const handleSingleChoice = (answer: string) => {
        // Toggle if allowed? No, single choice is instant next usually, unless requested otherwise.
        // User asked for "multiple choice answers".
        if (question.allowMultiple) {
            setCurrentSelections(prev => {
                if (prev.includes(answer)) return prev.filter(x => x !== answer);
                return [...prev, answer];
            });
        } else {
            nextQuestion(answer);
        }
    };

    const handleMultiSubmit = () => {
        if (currentSelections.length > 0) {
            nextQuestion(currentSelections);
        }
    };

    const handleTextSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (textInput.trim()) {
            nextQuestion(textInput);
        }
    };

    const handleBack = () => {
        if (currentQuestionIndex > 0) {
            setDirection(-1);
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />

            <div className="flex-1 container mx-auto px-4 pt-32 pb-12 max-w-2xl">
                {/* Progress Bar */}
                <div className="mb-12">
                    <div className="flex justify-between text-sm text-muted-foreground mb-2">
                        <span>Question {currentQuestionIndex + 1} of {questionsState.length}</span>
                        <span>{Math.round(progress)}% Complete</span>
                    </div>
                    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary transition-all duration-300 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Question Card */}
                <div className="relative overflow-hidden min-h-[400px] p-4">
                    <AnimatePresence mode='wait' initial={false} custom={direction}>
                        <motion.div
                            key={currentQuestionIndex}
                            custom={direction}
                            initial={{ x: direction > 0 ? 50 : -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: direction > 0 ? -50 : 50, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="w-full"
                        >
                            <h2 className="text-3xl md:text-4xl font-bold mb-8 leading-tight">
                                {question.text}
                            </h2>

                            {question.type === 'choice' ? (
                                <>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {question.options?.map((option, idx) => {
                                            const isSelected = currentSelections.includes(option);
                                            return (
                                                <button
                                                    key={idx}
                                                    onClick={() => handleSingleChoice(option)}
                                                    className={`text-left p-6 rounded-2xl border transition-all group flex items-start justify-between h-full active:scale-[0.98] ${isSelected
                                                        ? 'border-primary bg-primary/10 ring-1 ring-primary'
                                                        : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
                                                        }`}
                                                >
                                                    <span className={`text-sm md:text-base font-medium transition-colors ${isSelected ? 'text-primary' : 'group-hover:text-white'}`}>
                                                        {option}
                                                    </span>
                                                    {question.allowMultiple && (
                                                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${isSelected ? 'bg-primary border-primary' : 'border-white/30'
                                                            }`}>
                                                            {isSelected && <ChevronRight className="w-3 h-3 text-black rotate-90" />}
                                                        </div>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {question.allowMultiple && (
                                        <div className="mt-8 flex justify-end">
                                            <Button
                                                size="lg"
                                                onClick={handleMultiSubmit}
                                                disabled={currentSelections.length === 0}
                                                className="w-full md:w-auto"
                                            >
                                                Continue ({currentSelections.length} selected)
                                                <ChevronRight className="ml-2 h-5 w-5" />
                                            </Button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <form onSubmit={handleTextSubmit} className="space-y-6">
                                    <input
                                        type="text"
                                        value={textInput}
                                        onChange={(e) => setTextInput(e.target.value)}
                                        placeholder={question.placeholder}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-white placeholder:text-muted-foreground"
                                        autoFocus
                                    />
                                    <Button
                                        size="lg"
                                        className="w-full h-14 text-lg"
                                        disabled={!textInput.trim()}
                                        type="submit"
                                    >
                                        Next Question
                                        <ChevronRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </form>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Navigation Controls */}
                <div className="mt-8 flex justify-between items-center">
                    <Button
                        variant="ghost"
                        onClick={handleBack}
                        disabled={currentQuestionIndex === 0}
                        className={currentQuestionIndex === 0 ? 'opacity-0' : 'opacity-100'}
                    >
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Previous
                    </Button>
                </div>
            </div>
        </div>
    );
}
