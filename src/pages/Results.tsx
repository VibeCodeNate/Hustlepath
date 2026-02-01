import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/Button';
import { openai } from '../lib/openai';
import { fireConfetti } from '../lib/confetti';
import { Sparkles, ArrowRight, Trophy, Cpu, TrendingUp, Users, RefreshCw, Star, Target, Coins, Rocket, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { useSound } from '../lib/sound';
import { CoolLoadingScreen } from '../components/CoolLoadingScreen';

interface Recommendation {
    title: string;
    description: string;
    why_this_fits: string;
    earnings_potential_text: string;
    getting_started_steps: string[];
    key_influencers: string[];
    pro_insight_teaser: string;
    difficulty_score: number;
    income_score: number;
    velocity_score: number;
    match_score: number;
    xp_value: number;
    niche_id: string; // NicheType key
}

export function Results() {
    const location = useLocation();
    const navigate = useNavigate();
    const { profile, progress, refreshProfile, loading: authLoading } = useAuth(); // Need refreshProfile to update UI after DB writes
    const { play } = useSound();


    // Try to get answers from location state, fallback to sessionStorage, then profile
    const [answers, setAnswers] = useState<any>(() => {
        if (location.state?.answers) return location.state.answers;
        const stored = sessionStorage.getItem('hustlepath_answers');
        if (stored) return JSON.parse(stored);
        return null;
    });

    const [loading, setLoading] = useState(true);
    const [recommendations, setRecommendations] = useState<Recommendation[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [rerollsLeft, setRerollsLeft] = useState(0); // Initialized from profile later
    const [excludedTitles, setExcludedTitles] = useState<string[]>([]);


    // Sync answers from profile if needed
    useEffect(() => {
        if (!answers && profile?.quiz_answers) {
            setAnswers(profile.quiz_answers);
        }
    }, [profile, answers]);

    // Sync rerolls from progress
    useEffect(() => {
        if (progress) {
            setRerollsLeft(progress.rerolls_remaining ?? 1);
        }
    }, [progress]);

    // Main Logic: Load or Generate
    useEffect(() => {
        // Wait for auth to fully load (profile AND progress)
        if (authLoading) return;
        if (!profile) return;

        // 1. Check if we already have generated results in DB
        if (progress?.generated_hustles && progress.generated_hustles.length > 0) {
            // Only update if recommendations is null/empty (not already set)
            if (!recommendations || recommendations.length === 0) {
                console.log("Loading persisted results from DB");
                setRecommendations(progress.generated_hustles);
                setExcludedTitles(progress.generated_hustles.map((h: any) => h.title));
            }
            setLoading(false);
            return;
        }

        // 2. If no persisted results, generate them (First run)
        // Ensure we have answers AND we haven't generated yet
        const answersToUse = answers || profile.quiz_answers;
        if (answersToUse && loading && !recommendations) {
            generateAndSaveResults(answersToUse);
        }

    }, [authLoading, profile?.id, progress?.generated_hustles, answers]); // Use profile.id instead of profile object

    const generateAndSaveResults = async (answersData: any, isReroll = false) => {
        setLoading(true);
        setError(null);

        // Min wait time for "cool loading screen" to be appreciated
        const minWaitPromise = new Promise(resolve => setTimeout(resolve, 3500));

        try {
            const prompt = `
                Act as a sophisticated business consultant and video game quest giver. Based on this profile, generate 3 "Side Hustle Quests" that are perfect matches.

                User Profile:
                - Capital: ${answersData.capital}
                - Time: ${answersData.time}
                - Goal: ${answersData.goal}
                - Interests: ${answersData.interest}
                - Tech Skill: ${answersData.tech_level}
                - Social: ${answersData.social_preference}
                - Hobbies: ${answersData.hobbies}
                - Frustration: ${answersData.frustration}
                - Vehicle Access: ${answersData.vehicle}

                ${excludedTitles.length > 0 ? `CRITICAL: You MUST generate completely DIFFERENT side hustles than these previous ones. Do not reuse the same business model or topic: ${excludedTitles.join(', ')}` : ''}

                Pool of Options (Tailor the title/angle to the user):
                - Baking business / Custom Dessert Orders
                - Digital products (E-books, Notion Templates)
                - Monetize a YouTube channel (Content Creation)
                - Start a blog or newsletter
                - Secure social media sponsorships (UGC/Influencer)
                - Record a podcast
                - Participate in online surveys (Market Research)
                - Get paid to test apps
                - Become an affiliate marketer
                - Start a dropshipping business
                - Offer digital marketing services (Ads/Social Managment)
                - Develop mobile apps
                - Resell used or vintage goods (Flipping)
                - Advise eco-friendly businesses (Consulting)
                - Design and sell t-shirts (Print on Demand)
                - Develop a clothing line
                - Sell your photography / Videography
                - Voice-over artist
                - Virtual interior design consultation
                - Create handmade goods (Etsy)
                - IRL or online tutor
                - Transcribe or translate content
                - Teach fitness classes online (Yoga/Pilates)
                - Deliver packages (Amazon Flex/Courier)
                - Deliver groceries (Instacart/DoorDash)
                - Rent out your home or spare room (Airbnb)
                - Ride-share driver (Uber/Lyft)
                - Wash and detail cars (Mobile Detailing)
                - Mow lawns / Landscaping
                - Give neighborhood tours (Experiences)
                - Pet-sitting and dog walking
                - Lash Technician (Eyelash Extensions)
                - Day Trading (Stock Market / Forex)
                - Crypto Trading & Investing
                - Real Estate Wholesaling / Investing
                - Appointment Setting (Remote Sales)
                - Cold Calling / Remote Sales Closing

                For EACH of the 3 result objects, you must provide a COMPREHENSIVE GUIDE (approx 200 words total content per item).
                Return a JSON array of 3 objects with these EXACT keys:
                - title: "Quest Name" (e.g. "The Digital Artisan")
                - description: One catchy hook sentence.
                - why_this_fits: A 2-3 sentence explanation of why this specific hustle matches their detailed profile (skills, time, vehicle, etc).
                - earnings_potential_text: A detailed sentence about realistic earnings (e.g. "Beginners often make $X/mo, while experts scale to $Y/mo by doing Z.").
                - getting_started_steps: An array of 3 concrete, actionable first steps they can take TODAY.
                - key_influencers: An array of 2-3 names or channels to watch in this space.
                - pro_insight_teaser: A tantalizing 1-sentence teaser about a specific advanced strategy or resource that is "locked" in the pro guide (e.g. "Unlock the Pro map to get our vendor list" or "See how to automate this fully").
                
                - difficulty_score: Number 1-10 (1 = easy).
                - income_score: Number 1-10 (10 = millionaire potential).
                - velocity_score: Number 1-10 (10 = paid today).
                - match_score: Number between 85 and 99.
                - xp_value: Number between 300 and 1000.
                - niche_id: One of: "content-creator", "dropshipping", "freelancing", "saas", "appointment-setting", "sales-closing", "cold-calling", "baking", "nail-tech", "hair-stylist", "coaching", "ecommerce", "affiliate-marketing", "tutoring", "photography", "lash-tech", "digital-products", "day-trading", "crypto", "real-estate", "general". Pick the BEST match for the hustle.
                
                Do not include markdown. Just raw JSON.
            `;

            const [completion] = await Promise.all([
                openai.chat.completions.create({
                    messages: [{ role: "user", content: prompt }],
                    model: "gpt-4o-mini",
                }),
                minWaitPromise // Ensure we wait at least 3.5s for the cool animation
            ]);

            const content = completion.choices[0].message.content;
            if (content) {
                const cleanContent = content.replace(/```json/g, '').replace(/```/g, '').trim();
                const newRecs = JSON.parse(cleanContent);

                setRecommendations(newRecs);
                // Add new titles to excluded list
                setExcludedTitles(prev => [...prev, ...newRecs.map((r: any) => r.title)]);

                // Save to Supabase
                if (profile) {
                    const updates: any = {
                        generated_hustles: newRecs
                    };

                    if (isReroll) {
                        updates.rerolls_remaining = (progress?.rerolls_remaining ?? 1) - 1;
                    }

                    const { error: dbError } = await supabase
                        .from('user_progress')
                        .update(updates)
                        .eq('user_id', profile.id);

                    if (dbError) console.error('Error saving results:', dbError);
                    else refreshProfile(); // Refresh local profile state
                }

                play('success'); // Play sound!
            } else {
                throw new Error("No content received from AI");
            }
        } catch (err: any) {
            console.error("AI Error:", err);
            setError("Failed to generate quests. Please try again.");
            play('error');
        } finally {
            setLoading(false);
        }
    };

    const handleReroll = () => {
        if (rerollsLeft > 0) {
            play('click');
            generateAndSaveResults(answers || profile?.quiz_answers, true);
        }
    };



    // Safety redirect primarily for guests
    useEffect(() => {
        const timer = setTimeout(() => {
            if (!answers && !loading && !profile) {
                navigate('/assessment');
            }
        }, 3000);
        return () => clearTimeout(timer);
    }, [answers, loading, profile, navigate]);


    const handleStartQuest = (quest: Recommendation) => {
        play('levelUp');
        fireConfetti();

        // Backup to localStorage in case navigation state is lost
        localStorage.setItem('hustlepath_selected_quest', JSON.stringify(quest));
        if (answers) {
            localStorage.setItem('hustlepath_answers', JSON.stringify(answers));
        }

        setTimeout(() => {
            navigate('/explainer', { state: { hustle: quest, answers } });
        }, 800);
    };

    if (!answers && !profile) return null;

    const getCategoryIcon = (nicheId: string) => {
        // Group niches into icon categories
        const techNiches = ['freelancing', 'saas', 'digital-products'];
        const creativeNiches = ['content-creator', 'photography'];
        const serviceNiches = ['appointment-setting', 'sales-closing', 'cold-calling', 'baking', 'nail-tech', 'hair-stylist', 'lash-tech', 'tutoring', 'coaching'];
        // bizNiches (default): dropshipping, ecommerce, affiliate-marketing, day-trading, crypto, real-estate, general

        if (techNiches.includes(nicheId)) return <Cpu className="h-8 w-8 text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]" />;
        if (creativeNiches.includes(nicheId)) return <Sparkles className="h-8 w-8 text-fuchsia-400 drop-shadow-[0_0_10px_rgba(232,121,249,0.8)]" />;
        if (serviceNiches.includes(nicheId)) return <Users className="h-8 w-8 text-orange-400 drop-shadow-[0_0_10px_rgba(251,146,60,0.8)]" />;
        return <TrendingUp className="h-8 w-8 text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.8)]" />;
    };

    const getCategoryColor = (nicheId: string) => {
        const techNiches = ['freelancing', 'saas', 'digital-products'];
        const creativeNiches = ['content-creator', 'photography'];
        const serviceNiches = ['appointment-setting', 'sales-closing', 'cold-calling', 'baking', 'nail-tech', 'hair-stylist', 'lash-tech', 'tutoring', 'coaching'];

        if (techNiches.includes(nicheId)) return 'border-cyan-500/30 bg-cyan-500/5 hover:border-cyan-500/60';
        if (creativeNiches.includes(nicheId)) return 'border-fuchsia-500/30 bg-fuchsia-500/5 hover:border-fuchsia-500/60';
        if (serviceNiches.includes(nicheId)) return 'border-orange-500/30 bg-orange-500/5 hover:border-orange-500/60';
        return 'border-emerald-500/30 bg-emerald-500/5 hover:border-emerald-500/60';
    };

    return (
        <div className="min-h-screen bg-background pb-20 overflow-x-hidden relative">
            {/* Animated Background Particles */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute bg-primary/10 rounded-full blur-xl"
                        initial={{
                            x: Math.random() * window.innerWidth,
                            y: Math.random() * window.innerHeight,
                            scale: Math.random() * 0.5 + 0.5,
                            opacity: 0.1
                        }}
                        animate={{
                            y: [null, Math.random() * window.innerHeight],
                            x: [null, Math.random() * window.innerWidth],
                            opacity: [0.1, 0.3, 0.1]
                        }}
                        transition={{
                            duration: Math.random() * 20 + 10,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        style={{
                            width: Math.random() * 200 + 50,
                            height: Math.random() * 200 + 50,
                        }}
                    />
                ))}
            </div>

            <Navbar />

            <div className="container mx-auto px-4 pt-32 max-w-5xl relative z-10">
                {/* Header (Hidden while loading to focus on the bar) */}
                {!loading && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-10"
                    >
                        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-6 py-2 rounded-full text-sm font-bold mb-6 border border-primary/20 shadow-[0_0_20px_rgba(190,242,100,0.2)]">
                            <Trophy className="h-5 w-5" />
                            QUESTS AVAILABLE
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
                            Mission <span className="text-primary">Accepted.</span>
                        </h1>
                        <p className="text-muted-foreground text-xl max-w-2xl mx-auto">
                            We analyzed your stats. Here are the 3 highest-value opportunities for your specific skill set.
                        </p>
                    </motion.div>
                )}

                {/* Reroll Button */}
                {!loading && rerollsLeft > 0 && recommendations && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-center mb-10"
                    >
                        <Button
                            variant="outline"
                            onClick={handleReroll}
                            className="bg-black/40 border-primary/30 text-primary hover:bg-primary/20 hover:border-primary"
                        >
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Reroll Quests ({rerollsLeft} Left)
                        </Button>
                    </motion.div>
                )}

                {/* Loading or Content */}
                {loading ? (
                    <CoolLoadingScreen />
                ) : error ? (
                    <div className="text-center py-12">
                        <span className="text-red-500 font-bold text-xl">{error}</span>
                        <Button className="mt-4" onClick={() => window.location.reload()}>Retry Mission</Button>
                    </div>
                ) : (
                    <div className="grid gap-8">
                        <AnimatePresence mode='wait'>
                            {recommendations?.map((quest, idx) => (
                                <motion.div
                                    key={quest.title}
                                    initial={{ opacity: 0, x: -20, scale: 0.95 }}
                                    animate={{ opacity: 1, x: 0, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className={`relative rounded-3xl p-1 border backdrop-blur-sm transition-all duration-300 group ${getCategoryColor(quest.niche_id)}`}
                                >
                                    {/* Star Badge for High Match */}
                                    {quest.match_score > 90 && (
                                        <div className="absolute -top-3 -right-3 z-20 bg-yellow-500 text-black font-bold p-2 px-3 rounded-full flex items-center gap-1 shadow-lg shadow-yellow-500/20 text-xs transform rotate-12">
                                            <Star className="h-3 w-3 fill-black" />
                                            Top Pick
                                        </div>
                                    )}

                                    {/* LED Glow Effect */}
                                    <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] ease-in-out`} style={{ transitionDuration: '1.5s' }} />

                                    <div className="bg-card/80 rounded-[1.4rem] p-6 md:p-10 relative overflow-hidden h-full">
                                        <div className="flex flex-col lg:flex-row gap-8 items-start">

                                            {/* Left Column: Icon & Score */}
                                            <div className="flex-shrink-0 flex flex-row lg:flex-col items-center gap-4 lg:w-32 text-center">
                                                <div className="h-20 w-20 rounded-2xl bg-black/40 flex items-center justify-center border border-white/10 shadow-inner group-hover:scale-110 transition-transform duration-300">
                                                    {getCategoryIcon(quest.niche_id)}
                                                </div>
                                                <div className="relative">
                                                    <svg className="w-24 h-24 transform -rotate-90">
                                                        <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-white/5" />
                                                        <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="6" fill="transparent" strokeDasharray={251.2} strokeDashoffset={251.2 - (251.2 * quest.match_score) / 100} className="text-primary transition-all duration-1000 ease-out" />
                                                    </svg>
                                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                                                        <span className="text-xl font-bold text-white leading-none">{quest.match_score}%</span>
                                                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Match</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Middle Column: Content */}
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h2 className="text-3xl font-bold text-white group-hover:text-primary transition-colors">{quest.title}</h2>
                                                    <span className="bg-primary/20 text-primary text-xs font-bold px-2 py-1 rounded border border-primary/20">+{quest.xp_value} XP</span>
                                                </div>
                                                <p className="text-lg text-white/80 font-medium mb-6 italic border-b border-white/10 pb-4">"{quest.description}"</p>

                                                {/* Why It Fits */}
                                                <div className="mb-6">
                                                    <h3 className="text-sm font-bold text-primary mb-2 flex items-center gap-2">
                                                        <Target className="w-4 h-4" /> WHY IT FITS YOU
                                                    </h3>
                                                    <p className="text-muted-foreground leading-relaxed">
                                                        {quest.why_this_fits}
                                                    </p>
                                                </div>

                                                {/* Earnings Potential */}
                                                <div className="mb-6">
                                                    <h3 className="text-sm font-bold text-green-400 mb-2 flex items-center gap-2">
                                                        <Coins className="w-4 h-4" /> EARNING POTENTIAL
                                                    </h3>
                                                    <p className="text-white/90 leading-relaxed font-medium bg-green-500/10 p-3 rounded-lg border border-green-500/20">
                                                        {quest.earnings_potential_text}
                                                    </p>
                                                </div>

                                                {/* Getting Started & Influencers Grid */}
                                                <div className="grid md:grid-cols-2 gap-6 mb-6">
                                                    <div>
                                                        <h3 className="text-sm font-bold text-blue-400 mb-2 flex items-center gap-2">
                                                            <Rocket className="w-4 h-4" /> START TODAY
                                                        </h3>
                                                        <ul className="space-y-2">
                                                            {quest.getting_started_steps.map((step, i) => (
                                                                <li key={i} className="flex gap-2 text-sm text-gray-300">
                                                                    <span className="text-blue-500 font-bold">{i + 1}.</span>
                                                                    {step}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                    <div>
                                                        <h3 className="text-sm font-bold text-amber-400 mb-2 flex items-center gap-2">
                                                            <Users className="w-4 h-4" /> TOP PLAYERS
                                                        </h3>
                                                        <div className="flex flex-wrap gap-2">
                                                            {quest.key_influencers.map((name, i) => (
                                                                <span key={i} className="bg-amber-500/10 text-amber-300 text-xs px-2 py-1 rounded border border-amber-500/20">
                                                                    {name}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Pro Teaser (Locked) */}
                                                <div className="bg-black/40 border border-white/10 rounded-xl p-4 relative overflow-hidden group/lock cursor-pointer hover:border-primary/50 transition-colors">
                                                    <div className="flex items-start gap-4 opacity-50 group-hover/lock:opacity-80 transition-opacity">
                                                        <div className="bg-white/5 p-2 rounded-lg">
                                                            <Lock className="w-5 h-5 text-white" />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-sm font-bold text-white mb-1">Pro Secret Unlocked in Roadmap</h4>
                                                            <p className="text-sm text-muted-foreground blur-[2px] select-none group-hover/lock:blur-[1px] transition-all">
                                                                {quest.pro_insight_teaser} with the complete vendor list and templates.
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/lock:opacity-100 transition-opacity bg-black/50 backdrop-blur-[1px]">
                                                        <span className="text-primary font-bold text-sm bg-black px-4 py-2 rounded-full border border-primary shadow-[0_0_10px_rgba(190,242,100,0.3)]">
                                                            View Full Roadmap
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right Column: CTA & Stats */}
                                            <div className="flex-shrink-0 lg:w-48 flex flex-col gap-6">
                                                {/* Stat Bars Vertical Stack */}
                                                <div className="space-y-4 bg-black/20 p-4 rounded-xl border border-white/5">
                                                    <div className="space-y-1">
                                                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                                            <span>Difficulty</span>
                                                            <span>{quest.difficulty_score}/10</span>
                                                        </div>
                                                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${quest.difficulty_score * 10}%` }} />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                                            <span>Income</span>
                                                            <span>{quest.income_score}/10</span>
                                                        </div>
                                                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                            <div className="h-full bg-green-500 rounded-full" style={{ width: `${quest.income_score * 10}%` }} />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                                            <span>Speed</span>
                                                            <span>{quest.velocity_score}/10</span>
                                                        </div>
                                                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                            <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${quest.velocity_score * 10}%` }} />
                                                        </div>
                                                    </div>
                                                </div>

                                                <Button
                                                    type="button"
                                                    className="w-full h-14 text-lg font-bold shadow-[0_0_20px_rgba(190,242,100,0.2)] hover:shadow-[0_0_30px_rgba(190,242,100,0.4)] transition-all whitespace-normal leading-tight"
                                                    onClick={() => handleStartQuest(quest)}
                                                >
                                                    Start Mission
                                                    <ArrowRight className="ml-2 h-5 w-5 shrink-0" />
                                                </Button>
                                            </div>

                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>

        </div>
    );
}
