import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/Button';
import { openai } from '../lib/openai';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth'; // Import Auth
import { motion } from 'framer-motion';
import {
    CheckCircle2,
    Lock,
    ArrowRight,
    Calendar,
    DollarSign,
    ChevronRight,
    Loader2
} from 'lucide-react';

interface RoadmapStep {
    week: string;
    title: string;
    tasks: string[];
}

interface ExplainerContent {
    mission_brief: string;
    first_dollar_objective: string;
    roadmap: RoadmapStep[];
}

export function Explainer() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, profile, updateProfile, refreshProfile } = useAuth();

    // Fallback: If no state, maybe we can recover from profile?
    // Fallback: If no state, maybe we can recover from profile?
    const stateHustle = location.state?.hustle;
    const stateAnswers = location.state?.answers;

    // Helper to recover from localStorage if state is missing
    const getStoredData = (key: string) => {
        try {
            const stored = localStorage.getItem(key);
            return stored ? JSON.parse(stored) : null;
        } catch { return null; }
    };

    interface HustleType {
        title: string;
        difficulty_score: number;
        velocity_score: number;
        income_score: number;
        xp_value: number;
        category?: string;
        niche_id?: string;
        current_hustle_id?: string;
    }

    // Initialize state from Location OR LocalStorage
    const [hustle] = useState<HustleType | null>(() =>
        stateHustle || getStoredData('hustlepath_selected_quest')
    );

    const [loading, setLoading] = useState(true);
    const [content, setContent] = useState<ExplainerContent | null>(null);
    const [activeWeek, setActiveWeek] = useState(0);
    const [upgrading, setUpgrading] = useState(false);

    // Get Niche ID directly from hustle object
    const getNicheId = (): string => {
        // The recommendations now include a niche_id field directly from the AI
        return hustle?.niche_id || 'general';
    };

    const handleUpgrade = async () => {
        setUpgrading(true);
        try {
            const nicheId = getNicheId();

            // Persist the selected hustle to localStorage (survives Stripe redirect)
            if (user) {
                localStorage.setItem(`hustlepath_pending_hustle_${user.id}`, JSON.stringify({
                    title: hustle?.title || 'HustlePath Pro',
                    nicheId: nicheId,
                    difficulty_score: hustle?.difficulty_score,
                    velocity_score: hustle?.velocity_score,
                    income_score: hustle?.income_score,
                    xp_value: hustle?.xp_value
                }));
            }

            const { data, error } = await supabase.functions.invoke('create-checkout-session', {
                body: {
                    hustleTitle: hustle?.title || 'HustlePath Pro',
                    nicheId: nicheId
                }
            });

            if (error) throw error;
            if (data?.url) {
                window.location.href = data.url;
            }
        } catch (err) {
            console.error('Checkout error:', err);
            alert('Failed to start checkout. Please try again.');
            setUpgrading(false);
        }
    };

    // NOTE: Removed aggressive redirect logic that was causing loops.
    // If hustle is missing, we simply won't render anything (handled by `if (!hustle) return null` below).

    // 2. Persist Selection IMMEDIATELY on mount (before payment)
    // This ensures the database always has the user's chosen hustle
    useEffect(() => {
        if (!hustle || !user) return;

        const saveSelection = async () => {
            const nicheId = getNicheId();

            // Update Profile with hustle title and ID
            if (profile?.current_hustle_title !== hustle.title || profile?.current_hustle_id !== nicheId) {
                await updateProfile({
                    current_hustle_title: hustle.title,
                    current_hustle_id: nicheId
                });
            }

            // Update Progress Niche (Direct DB call as updateProfile doesn't touch progress)
            const { error } = await supabase
                .from('user_progress')
                .update({ niche_id: nicheId })
                .eq('user_id', user.id);

            if (!error) {
                refreshProfile();
            }
        };

        saveSelection();
    }, [hustle, user]); // Run once when hustle and user are available

    useEffect(() => {
        if (!hustle) return;

        const fetchDetails = async () => {
            try {
                // Recover answers from State -> Profile -> LocalStorage
                const answers = stateAnswers ||
                    profile?.quiz_answers ||
                    getStoredData('hustlepath_answers') ||
                    {};

                const prompt = `
                    Generate a specific "Mission Brief" for this Side Hustle Quest: "${hustle.title}".
                    
                    Context:
                    - User Budget: ${answers.capital}
                    - Time: ${answers.time}
                    - Goal: ${answers.goal}
                    
                    Return a JSON object with these keys:
                    - mission_brief: A 2-sentence motivational summary of the mission.
                    - first_dollar_objective: The specific, concrete action to earn the very first $1 (e.g. "Sell one PDF to a friend").
                    - roadmap: An array of 4 objects (Week 1 to Week 4), each with:
                        - week: "Week 1", "Week 2", etc.
                        - title: The main focus (e.g. "Setup & Identity").
                        - tasks: An array of 3 specific, actionable bullet points for that week.

                    Do not include markdown. Just raw JSON.
                `;

                const completion = await openai.chat.completions.create({
                    messages: [{ role: "user", content: prompt }],
                    model: "gpt-4o-mini",
                });

                const rawContent = completion.choices[0].message.content;
                if (rawContent) {
                    const clean = rawContent.replace(/```json/g, '').replace(/```/g, '').trim();
                    setContent(JSON.parse(clean));
                }
            } catch (error) {
                console.error("AI Error", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [hustle, stateAnswers, profile?.quiz_answers]);

    if (!hustle) return null;

    return (
        <div className="min-h-screen bg-background pb-20">
            <Navbar />

            {/* Loading State / Decrypting UI */}
            {loading ? (
                <div className="flex flex-col items-center justify-center min-h-screen pt-20">
                    <div className="w-24 h-24 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-8" />
                    <h2 className="text-2xl font-mono text-primary animate-pulse">DECRYPTING MISSION DATA...</h2>
                    <p className="text-muted-foreground mt-2">Generating your custom launch protocol</p>
                </div>
            ) : content ? (
                <div className="container mx-auto px-4 pt-32 max-w-4xl">

                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 text-primary/80 border border-primary/20 bg-primary/5 px-4 py-1.5 rounded-full text-xs font-mono mb-6">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            LIVE MISSION PROTOCOL
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-4">{hustle.title}</h1>
                        <p className="text-xl text-white/70 max-w-2xl mx-auto">{content.mission_brief}</p>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
                        <div className="bg-white/5 border border-white/10 p-4 rounded-2xl text-center">
                            <div className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Difficulty</div>
                            <div className="text-xl font-bold text-white">{hustle.difficulty_score}/10</div>
                        </div>
                        <div className="bg-white/5 border border-white/10 p-4 rounded-2xl text-center">
                            <div className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Velocity</div>
                            <div className="text-xl font-bold text-primary">{hustle.velocity_score}/10</div>
                        </div>
                        <div className="bg-white/5 border border-white/10 p-4 rounded-2xl text-center">
                            <div className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Earnings</div>
                            <div className="text-xl font-bold text-green-400">{hustle.income_score}/10</div>
                        </div>
                        <div className="bg-white/5 border border-white/10 p-4 rounded-2xl text-center">
                            <div className="text-muted-foreground text-xs uppercase tracking-wider mb-1">XP Reward</div>
                            <div className="text-xl font-bold text-yellow-400">+{hustle.xp_value}</div>
                        </div>
                    </div>

                    {/* First Dollar Objective */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-r from-primary/10 to-transparent border border-primary/20 p-8 rounded-3xl mb-16 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <DollarSign className="w-32 h-32" />
                        </div>
                        <h3 className="text-primary font-bold tracking-widest uppercase text-sm mb-2">Primary Objective</h3>
                        <h2 className="text-3xl font-bold text-white mb-2">Earn Your First Dollar</h2>
                        <p className="text-lg text-white/80">{content.first_dollar_objective}</p>
                    </motion.div>

                    {/* 4-Week Roadmap */}
                    <div className="mb-20">
                        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                            <Calendar className="text-primary" />
                            4-Week Launch Roadmap
                        </h2>

                        <div className="space-y-6">
                            {content.roadmap.map((step, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className={`group rounded-2xl border transition-all duration-300 overflow-hidden ${activeWeek === idx
                                        ? 'bg-white/10 border-primary/50 shadow-lg shadow-primary/10'
                                        : 'bg-white/5 border-white/10 hover:border-white/20'
                                        }`}
                                    onClick={() => setActiveWeek(idx)}
                                >
                                    <div className="p-6 cursor-pointer flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={`
                                                w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
                                                ${activeWeek === idx ? 'bg-primary text-black' : 'bg-white/10 text-white/50'}
                                            `}>
                                                {idx + 1}
                                            </div>
                                            <div>
                                                <div className="text-xs uppercase tracking-wider text-muted-foreground font-bold">{step.week}</div>
                                                <div className="text-xl font-bold text-white">{step.title}</div>
                                            </div>
                                        </div>
                                        <ChevronRight className={`transition-transform ${activeWeek === idx ? 'rotate-90 text-primary' : 'text-white/20'}`} />
                                    </div>

                                    {activeWeek === idx && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            className="px-6 pb-6 pl-20"
                                        >
                                            <ul className="space-y-3">
                                                {step.tasks.map((task, tIdx) => (
                                                    <li key={tIdx} className="flex items-start gap-3 text-white/80">
                                                        <CheckCircle2 className="w-5 h-5 text-primary/50 shrink-0 mt-0.5" />
                                                        <span>{task}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </motion.div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* CTA Section - Different for Pro vs Free */}
                    <div className="bg-gradient-to-r from-primary/10 to-transparent border border-primary/20 rounded-3xl p-8 mb-20 text-center">
                        {profile?.is_pro ? (
                            <>
                                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle2 className="w-8 h-8 text-primary" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">You're Ready!</h3>
                                <p className="text-white/60 mb-8 max-w-md mx-auto">
                                    Your roadmap is set. Head to the Dashboard to access the full 12-week plan, community, and more.
                                </p>
                                <Button
                                    size="lg"
                                    className="text-lg px-12 py-6"
                                    onClick={() => navigate('/dashboard')}
                                >
                                    Go to Dashboard <ArrowRight className="ml-2" />
                                </Button>
                            </>
                        ) : (
                            <>
                                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Lock className="w-8 h-8 text-white/50" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Unlock Your Full Journey</h3>
                                <p className="text-white/60 mb-8 max-w-md mx-auto">
                                    Upgrade to Pro to access the Dashboard, full 12-week roadmap, community, and earn real XP & rewards.
                                </p>
                                <Button
                                    size="lg"
                                    className="text-lg px-12 py-6 shadow-[0_0_30px_rgba(190,242,100,0.3)] bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold hover:shadow-[0_0_40px_rgba(234,179,8,0.4)]"
                                    onClick={handleUpgrade}
                                    disabled={upgrading}
                                >
                                    {upgrading ? (
                                        <>
                                            <Loader2 className="mr-2 animate-spin" /> Processing...
                                        </>
                                    ) : (
                                        <>
                                            Upgrade to Pro - $4.99/mo <ArrowRight className="ml-2" />
                                        </>
                                    )}
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            ) : null}
        </div>
    );
}
