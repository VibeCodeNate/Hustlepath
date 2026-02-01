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
    const stateHustle = location.state?.hustle;
    const stateAnswers = location.state?.answers;

    interface HustleType {
        title: string;
        difficulty_score: number;
        velocity_score: number;
        income_score: number;
        xp_value: number;
        category?: string;
    }
    const [hustle] = useState<HustleType | null>(stateHustle || null);

    const [loading, setLoading] = useState(true);
    const [content, setContent] = useState<ExplainerContent | null>(null);
    const [activeWeek, setActiveWeek] = useState(0);
    const [upgrading, setUpgrading] = useState(false);

    // Get Niche ID directly from hustle object
    const getNicheId = (): string => {
        // The recommendations now include a niche_id field directly from the AI
        return (hustle as any)?.niche_id || 'general';
    };

    const handleUpgrade = async () => {
        setUpgrading(true);
        try {
            const nicheId = getNicheId();
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

    // 1. Recover state if missing (Refresh handling)
    useEffect(() => {
        if (!hustle && profile?.current_hustle_title) {
            // If we have a title but no full object, we might need to "fake" the object 
            // or fetch it. For now, let's redirect to specific roadmap if PRO
            if (profile.is_pro) {
                navigate('/roadmap');
                return;
            }
            // Otherwise redirect to results to pick again
            navigate('/results');
        } else if (!hustle && !profile) {
            navigate('/assessment');
        }
    }, [hustle, profile, navigate]);

    // 2. Persist Selection if PRO
    useEffect(() => {
        const key = `hustlepath_saved_${user?.id}`;
        if (hustle && user && profile?.is_pro && !localStorage.getItem(key)) {
            const saveSelection = async () => {
                const nicheId = getNicheId();

                // Update Profile Title
                if (profile.current_hustle_title !== hustle.title) {
                    await updateProfile({
                        current_hustle_title: hustle.title,
                        current_hustle_id: (hustle as any).niche_id // Using niche_id directly
                    });
                }

                // Update Progress Niche (Direct DB call as updateProfile doesn't touch progress)
                const { error } = await supabase
                    .from('user_progress')
                    .update({ niche_id: nicheId })
                    .eq('user_id', user.id);

                if (!error) {
                    localStorage.setItem(key, 'true'); // Prevent excessive writes
                    refreshProfile();
                }
            };
            saveSelection();
        }
    }, [hustle, user, profile?.is_pro, profile?.current_hustle_title, refreshProfile, updateProfile]); // Added missing dependencies

    useEffect(() => {
        if (!hustle) return;

        const fetchDetails = async () => {
            try {
                const answers = stateAnswers || profile?.quiz_answers || {};
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

                    {/* PRO CONTENT UNLOCKED (or CTA if not pro) */}
                    {!profile?.is_pro ? (
                        <div className="relative rounded-3xl border border-white/10 bg-black/40 overflow-hidden mb-20 min-h-[400px]">
                            {/* Blur Layer */}
                            <div className="absolute inset-0 backdrop-blur-md bg-black/60 z-10 flex flex-col items-center justify-center p-8 text-center">
                                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-6">
                                    <Lock className="w-8 h-8 text-white/50" />
                                </div>
                                <h3 className="text-3xl font-bold text-white mb-4">Unlock Full Mission Data</h3>
                                <p className="text-xl text-white/60 max-w-md mb-8">
                                    Get access to advanced growth tactics, pro tools list, and community support to accelerate your earnings.
                                </p>
                                <Button
                                    size="lg"
                                    className="text-lg px-12 py-6 shadow-[0_0_30px_rgba(190,242,100,0.3)]"
                                    onClick={handleUpgrade}
                                    disabled={upgrading}
                                >
                                    {upgrading ? (
                                        <>
                                            <Loader2 className="mr-2 animate-spin" /> Processing...
                                        </>
                                    ) : (
                                        <>
                                            Upgrade to Pro <ArrowRight className="ml-2" />
                                        </>
                                    )}
                                </Button>
                            </div>

                            {/* Fake Content Behind Blur */}
                            <div className="p-8 opacity-20 pointer-events-none select-none min-h-[350px]">
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div>
                                        <h3 className="text-2xl font-bold mb-4">Advanced Tactics</h3>
                                        <div className="space-y-4">
                                            <div className="h-4 bg-white/20 rounded w-3/4"></div>
                                            <div className="h-4 bg-white/20 rounded w-full"></div>
                                            <div className="h-4 bg-white/20 rounded w-5/6"></div>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold mb-4">Pro Tools List</h3>
                                        <div className="space-y-4">
                                            <div className="h-4 bg-white/20 rounded w-1/2"></div>
                                            <div className="h-4 bg-white/20 rounded w-2/3"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* PRO CONTENT */
                        <div className="bg-black/40 border border-primary/20 rounded-3xl p-8 mb-20">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-2 bg-primary/20 rounded-lg"><CheckCircle2 className="text-primary w-6 h-6" /></div>
                                <h2 className="text-2xl font-bold">Pro Access: Advanced Intel</h2>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-4">Growth Tactics</h3>
                                    <div className="space-y-4 text-white/70">
                                        <p>• Leverage short-form video (TikTok/Reels) to drive organic traffic.</p>
                                        <p>• Use cold outreach scripts (available in Resources) to land first clients.</p>
                                        <p>• Bundle your services to increase average order value by 30%.</p>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-4">Recommended Tools</h3>
                                    <div className="space-y-4 text-white/70">
                                        <p>• <strong>Notion</strong> - For project management.</p>
                                        <p>• <strong>Canva</strong> - For quick design assets.</p>
                                        <p>• <strong>Stripe</strong> - For payments (integrated).</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-8 border-t border-white/10 text-center">
                                <Button size="lg" className="w-full md:w-auto" onClick={() => navigate('/dashboard')}>
                                    Accept Mission & Go to Dashboard
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            ) : null}
        </div>
    );
}
