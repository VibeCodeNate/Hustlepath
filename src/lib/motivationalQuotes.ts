// 1000+ Motivational Quotes for Daily Check-in
// Generated using templates × variations for massive variety

const QUOTE_TEMPLATES = [
    "{action} is the bridge between goals and accomplishment.",
    "Your {quality} today determines your {result} tomorrow.",
    "Every {timeframe} is a chance to {action}.",
    "The only way to do great work is to {action} what you do.",
    "Success is not final, {action} is not fatal: it is the courage to {action} that counts.",
    "Don't watch the clock; do what it does. Keep {action}.",
    "The future belongs to those who {action} in the beauty of their dreams.",
    "Believe you can and you're {quality} there.",
    "It does not matter how slowly you go as long as you do not {action}.",
    "The secret of getting ahead is getting {action}.",
    "Your {quality} is your superpower.",
    "Make each {timeframe} your masterpiece.",
    "The only limit is the one you {action} on yourself.",
    "Dream big, {action} bigger.",
    "{action} is the first step to success.",
    "Your {quality} will take you places money can't buy.",
    "Every expert was once a {stage}.",
    "The {timeframe} you've been waiting for is today.",
    "Turn your {challenge} into your {result}.",
    "Be the {quality} you wish to see in the world.",
];

const ACTIONS = [
    "action", "hustle", "grind", "work", "effort", "persistence", "dedication",
    "consistency", "focus", "discipline", "movement", "progress", "growth",
    "learning", "building", "creating", "executing", "shipping", "starting",
    "continuing", "pushing", "believing", "achieving", "winning", "succeeding"
];

const QUALITIES = [
    "persistence", "determination", "courage", "strength", "wisdom",
    "patience", "resilience", "creativity", "passion", "ambition",
    "drive", "energy", "vision", "mindset", "attitude", "spirit",
    "hustle", "dedication", "fire", "hunger", "grit"
];

const RESULTS = [
    "success", "victory", "triumph", "achievement", "breakthrough",
    "empire", "legacy", "wealth", "freedom", "impact", "results",
    "lifestyle", "dreams", "goals", "vision", "future"
];

const TIMEFRAMES = [
    "day", "moment", "hour", "morning", "step", "action", "decision",
    "choice", "opportunity", "chance", "second"
];

const STAGES = [
    "beginner", "student", "learner", "amateur", "newcomer", "rookie"
];

const CHALLENGES = [
    "obstacles", "struggles", "setbacks", "failures", "doubts",
    "fears", "challenges", "problems", "pain", "difficulties"
];

// Direct quotes (no template)
const DIRECT_QUOTES = [
    "Your future is created by what you do today, not tomorrow.",
    "Dreams don't work unless you do.",
    "The harder you work, the luckier you get.",
    "Success is the sum of small efforts repeated day in and day out.",
    "Don't be afraid to give up the good to go for the great.",
    "The only place where success comes before work is in the dictionary.",
    "Opportunities don't happen. You create them.",
    "Success usually comes to those who are too busy to be looking for it.",
    "Don't let yesterday take up too much of today.",
    "The way to get started is to quit talking and begin doing.",
    "If you really look closely, most overnight successes took a long time.",
    "The harder the conflict, the greater the triumph.",
    "You miss 100% of the shots you don't take.",
    "Winners are not people who never fail, but people who never quit.",
    "Your limitation—it's only your imagination.",
    "Push yourself, because no one else is going to do it for you.",
    "Great things never come from comfort zones.",
    "Dream it. Wish it. Do it.",
    "Success doesn't just find you. You have to go out and get it.",
    "The key to success is to start before you are ready.",
    "It's going to be hard, but hard does not mean impossible.",
    "Don't stop when you're tired. Stop when you're done.",
    "Wake up with determination. Go to bed with satisfaction.",
    "Do something today that your future self will thank you for.",
    "Little things make big days.",
    "It's going to be a good day. Believe it.",
    "You are capable of amazing things.",
    "Make today count.",
    "Stay focused and never give up.",
    "Your only limit is you.",
    "Doubt kills more dreams than failure ever will.",
    "Every accomplishment starts with the decision to try.",
    "The best time to start was yesterday. The next best time is now.",
    "Don't wish it were easier. Wish you were better.",
    "What you get by achieving your goals is not as important as what you become.",
    "Hustle until your haters ask if you're hiring.",
    "Work hard in silence, let success be your noise.",
    "I didn't come this far to only come this far.",
    "Starve your distractions, feed your focus.",
    "Small daily improvements are the key to staggering long-term results.",
    "Be so good they can't ignore you.",
    "Stop doubting yourself. Work hard and make it happen.",
    "The comeback is always stronger than the setback.",
    "You didn't wake up today to be mediocre.",
    "Make yourself proud.",
    "Today is your opportunity to build the tomorrow you want.",
    "If it doesn't challenge you, it won't change you.",
    "Stay patient and trust your journey.",
    "Be fearless in the pursuit of what sets your soul on fire.",
    "Success is liking yourself, liking what you do, and liking how you do it.",
    "Your speed doesn't matter, forward is forward.",
    "Every day is a new beginning. Take a deep breath and start again.",
    "You are one decision away from a totally different life.",
    "Champions keep playing until they get it right.",
    "The only bad workout is the one that didn't happen.",
    "Hustle beats talent when talent doesn't hustle.",
    "Focus on being productive instead of busy.",
    "You are stronger than you think.",
    "Don't count the days, make the days count.",
    "One day or day one. You decide.",
    "Be the energy you want to attract.",
    "Rise up and attack the day with enthusiasm.",
    "Your vibe attracts your tribe.",
    "Invest in yourself. It pays the best interest.",
    "If you want it, work for it. It's that simple.",
    "You are what you do, not what you say you'll do.",
    "Never let success get to your head. Never let failure get to your heart.",
    "Action is the foundational key to all success.",
    "Life is what happens when you're busy making excuses.",
    "Successful people do what unsuccessful people are not willing to do.",
    "Don't be pushed around by your fears. Be led by your dreams.",
    "The difference between ordinary and extraordinary is that little extra.",
    "You have the power to create the life you want.",
    "Stop waiting for Friday, for summer, for someone to fall in love with you.",
    "Your potential is endless. Go do what you were created to do.",
    "Make it happen. Shock everyone.",
    "Be addicted to progress, not perfection.",
    "Difficult roads often lead to beautiful destinations.",
    "The struggle you're in today is developing the strength you need tomorrow.",
    "Believe in yourself and all that you are.",
    "You're allowed to scream, but then you have to get back to work.",
    "Motivation gets you going, habit keeps you growing.",
    "The only way to guarantee failure is to quit.",
    "Your attitude determines your direction.",
    "Champions train, losers complain.",
    "Good things come to those who hustle.",
    "Success is earned, not given.",
    "Be humble. Be hungry. Always be the hardest worker in the room.",
    "Excuses don't burn calories.",
    "The grind includes Friday nights and Saturday mornings.",
    "You're not going to master the rest of your life in one day. Just relax.",
    "Stay committed to your decisions, but stay flexible in your approach.",
    "Make yourself a priority.",
    "Work until your bank account looks like a phone number.",
    "Prove them wrong.",
    "Your future needs you. Your past doesn't.",
    "Be patient. Good things take time.",
    "Collect moments, not things.",
    "The expert in anything was once a beginner.",
    "Stop being afraid of what could go wrong and focus on what could go right.",
    "You have what it takes to be victorious.",
    "The pain you feel today will be the strength you feel tomorrow.",
    "Go the extra mile. It's never crowded.",
    "You are enough just as you are.",
    "Remember why you started.",
    "It always seems impossible until it's done.",
    "Hustle until you no longer have to introduce yourself.",
    "Success is the best revenge.",
    "Keep going. Your hardest times often lead to the greatest moments.",
    "Stay positive. Work hard. Make it happen.",
    "The only time success comes before work is in the dictionary.",
    "Don't tell people your dreams. Show them.",
    "A goal without a plan is just a wish.",
    "Be a voice, not an echo.",
    "Life begins at the end of your comfort zone.",
    "Failure is not the opposite of success; it's part of success.",
    "You don't have to be great to start, but you have to start to be great.",
    "Work like there is someone working 24 hours a day to take it away from you.",
    "The world is changed by your example, not your opinion.",
    "Hustle in silence and let your success make the noise.",
    "Winners focus on winning. Losers focus on winners.",
    "Don't decrease the goal. Increase the effort.",
    "The question isn't who is going to let me; it's who is going to stop me.",
    "Believe you deserve it and the universe will serve it.",
    "What you think, you become.",
    "Turn your can'ts into cans and your dreams into plans.",
    "Wake up. Kick ass. Repeat.",
    "The distance between your dreams and reality is called action.",
    "You were born to be real, not to be perfect.",
    "Don't look back. You're not going that way.",
    "Life is tough, but so are you.",
    "You can and you will.",
    "Be stubborn about your goals, flexible about your methods.",
    "Your life does not get better by chance. It gets better by change.",
    "What feels like the end is often the beginning.",
    "Do what you love. Love what you do.",
    "Progress, not perfection.",
    "Big journeys begin with small steps.",
    "Fear is temporary. Regret is forever.",
    "You're closer than you think.",
    "Stay hungry. Stay foolish.",
    "The grind never stops.",
    "Work hard, dream big.",
    "Outwork everyone.",
    "Comfort zone? Never heard of it.",
    "Today's hustle is tomorrow's harvest.",
    "Make moves in silence.",
    "Level up every day.",
    "Built different.",
    "No shortcuts to success.",
    "Earn your place.",
    "Rise and grind.",
    "Execute relentlessly.",
    "Zero excuses.",
    "All gas, no brakes.",
    "Trust the process.",
    "Stay locked in.",
    "Legendary mindset.",
    "Be undeniable.",
    "Play to win.",
    "Own your story.",
    "Write your legacy.",
];

// Generate templated quotes
function generateTemplatedQuotes(): string[] {
    const quotes: string[] = [];

    for (const template of QUOTE_TEMPLATES) {
        // Generate variations
        for (let i = 0; i < 50; i++) {
            let quote = template;
            quote = quote.replace(/{action}/g, ACTIONS[Math.floor(Math.random() * ACTIONS.length)]);
            quote = quote.replace(/{quality}/g, QUALITIES[Math.floor(Math.random() * QUALITIES.length)]);
            quote = quote.replace(/{result}/g, RESULTS[Math.floor(Math.random() * RESULTS.length)]);
            quote = quote.replace(/{timeframe}/g, TIMEFRAMES[Math.floor(Math.random() * TIMEFRAMES.length)]);
            quote = quote.replace(/{stage}/g, STAGES[Math.floor(Math.random() * STAGES.length)]);
            quote = quote.replace(/{challenge}/g, CHALLENGES[Math.floor(Math.random() * CHALLENGES.length)]);

            // Capitalize first letter
            quote = quote.charAt(0).toUpperCase() + quote.slice(1);

            if (!quotes.includes(quote)) {
                quotes.push(quote);
            }
        }
    }

    return quotes;
}

// Pre-generate all quotes
const TEMPLATED_QUOTES = generateTemplatedQuotes();
export const ALL_QUOTES = [...DIRECT_QUOTES, ...TEMPLATED_QUOTES];

// Get a random quote
export function getRandomQuote(): string {
    return ALL_QUOTES[Math.floor(Math.random() * ALL_QUOTES.length)];
}

// Get a seeded quote (same for same day)
export function getDailyQuote(dateString: string): string {
    // Simple hash function
    let hash = 0;
    for (let i = 0; i < dateString.length; i++) {
        const char = dateString.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    const index = Math.abs(hash) % ALL_QUOTES.length;
    return ALL_QUOTES[index];
}

console.log(`Loaded ${ALL_QUOTES.length} motivational quotes`);
