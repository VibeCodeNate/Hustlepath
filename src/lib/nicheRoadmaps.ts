// Niche-Specific 12-Week Roadmaps for HustlePath
// Each niche has tailored weekly objectives for the side hustle journey

import type { Week } from './roadmap';

export type NicheType =
    | 'content-creator'
    | 'dropshipping'
    | 'freelancing'
    | 'saas'
    | 'appointment-setting'
    | 'sales-closing'
    | 'cold-calling'
    | 'baking'
    | 'nail-tech'
    | 'hair-stylist'
    | 'coaching'
    | 'ecommerce'
    | 'affiliate-marketing'
    | 'tutoring'
    | 'photography'
    | 'general';

export interface NicheInfo {
    id: NicheType;
    name: string;
    icon: string;
    description: string;
    color: string;
}

export const NICHE_INFO: NicheInfo[] = [
    { id: 'content-creator', name: 'Content Creator', icon: '🎬', description: 'YouTube, TikTok, Instagram', color: 'fuchsia' },
    { id: 'dropshipping', name: 'Dropshipping', icon: '📦', description: 'E-commerce without inventory', color: 'cyan' },
    { id: 'freelancing', name: 'Freelancing', icon: '💻', description: 'Skills-based client work', color: 'primary' },
    { id: 'saas', name: 'SaaS', icon: '🚀', description: 'Software as a Service', color: 'purple' },
    { id: 'appointment-setting', name: 'Appointment Setting', icon: '📅', description: 'B2B lead scheduling', color: 'blue' },
    { id: 'sales-closing', name: 'Sales & Closing', icon: '🤝', description: 'High-ticket sales', color: 'green' },
    { id: 'cold-calling', name: 'Cold Calling', icon: '📞', description: 'Outbound sales calls', color: 'orange' },
    { id: 'baking', name: 'Baking', icon: '🧁', description: 'Home bakery business', color: 'pink' },
    { id: 'nail-tech', name: 'Nail Tech', icon: '💅', description: 'Nail art & services', color: 'rose' },
    { id: 'hair-stylist', name: 'Hair Stylist', icon: '💇', description: 'Hair styling & cuts', color: 'amber' },
    { id: 'coaching', name: 'Coaching', icon: '🎯', description: 'Life/business coaching', color: 'indigo' },
    { id: 'ecommerce', name: 'E-Commerce', icon: '🛒', description: 'Online store owner', color: 'teal' },
    { id: 'affiliate-marketing', name: 'Affiliate Marketing', icon: '🔗', description: 'Commission-based promotion', color: 'lime' },
    { id: 'tutoring', name: 'Tutoring', icon: '📚', description: 'Online education', color: 'sky' },
    { id: 'photography', name: 'Photography', icon: '📷', description: 'Photo/video services', color: 'slate' },
];

// Helper to create a task with unique ID and coin reward
const task = (weekNum: number, dayNum: number, taskNum: number, title: string, xp: number) => {
    // Calculate coins based on XP (5-30 range)
    // XP ranges from 25-100 typically, so scale proportionally
    const minCoins = 5;
    const maxCoins = 30;
    const coins = Math.min(maxCoins, Math.max(minCoins, Math.round((xp / 100) * maxCoins)));

    return {
        id: `w${weekNum}d${dayNum}t${taskNum}`,
        title,
        xp,
        coins,
        completed: false
    };
};

// ============================================
// CONTENT CREATOR ROADMAP
// ============================================
export const CONTENT_CREATOR_ROADMAP: Week[] = [
    {
        id: 1, title: 'Week 1', description: 'Foundation & Niche Selection',
        isLocked: false, isCompleted: false,
        days: [
            {
                day: 1, tasks: [
                    task(1, 1, 1, 'Research 5 successful creators in your interest area', 50),
                    task(1, 1, 2, 'Analyze what content gets the most engagement', 50),
                    task(1, 1, 3, 'Write down 10 content ideas', 25)
                ]
            },
            {
                day: 2, tasks: [
                    task(1, 2, 1, 'Define your target audience (age, interests, problems)', 75),
                    task(1, 2, 2, 'Create your unique value proposition', 50),
                    task(1, 2, 3, 'Choose your primary platform (YouTube/TikTok/Instagram)', 25)
                ]
            },
            {
                day: 3, tasks: [
                    task(1, 3, 1, 'Set up your account with optimized bio', 50),
                    task(1, 3, 2, 'Design a simple profile picture', 50),
                    task(1, 3, 3, 'Research trending hashtags in your niche', 25)
                ]
            },
            {
                day: 4, tasks: [
                    task(1, 4, 1, 'Plan your content calendar for next 7 days', 75),
                    task(1, 4, 2, 'Study the algorithm of your chosen platform', 50),
                    task(1, 4, 3, 'Follow 10 creators for inspiration', 25)
                ]
            },
            {
                day: 5, tasks: [
                    task(1, 5, 1, 'Set up basic recording equipment (phone is fine!)', 50),
                    task(1, 5, 2, 'Practice recording a 60-second video', 75),
                    task(1, 5, 3, 'Learn one editing technique', 50)
                ]
            },
            {
                day: 6, tasks: [
                    task(1, 6, 1, 'Create your first piece of content', 100),
                    task(1, 6, 2, 'Write an engaging caption/description', 50),
                    task(1, 6, 3, 'Prepare 3 different thumbnail options', 50)
                ]
            },
            {
                day: 7, tasks: [
                    task(1, 7, 1, 'Post your first content piece', 100),
                    task(1, 7, 2, 'Engage with 10 comments on similar content', 50),
                    task(1, 7, 3, 'Reflect and journal about the week', 25)
                ]
            }
        ]
    },
    {
        id: 2, title: 'Week 2', description: 'Consistency & Style Development',
        isLocked: true, isCompleted: false,
        days: [
            {
                day: 1, tasks: [
                    task(2, 1, 1, 'Analyze your first post performance', 50),
                    task(2, 1, 2, 'Create content piece #2', 75),
                    task(2, 1, 3, 'Respond to all comments on your content', 25)
                ]
            },
            {
                day: 2, tasks: [
                    task(2, 2, 1, 'Post content piece #2', 50),
                    task(2, 2, 2, 'Learn a new editing transition', 50),
                    task(2, 2, 3, 'Engage with 15 accounts in your niche', 50)
                ]
            },
            {
                day: 3, tasks: [
                    task(2, 3, 1, 'Create content piece #3 (try a trend)', 75),
                    task(2, 3, 2, 'Study what hooks get attention', 50),
                    task(2, 3, 3, 'Save 5 trending audio/sounds', 25)
                ]
            },
            {
                day: 4, tasks: [
                    task(2, 4, 1, 'Post content piece #3', 50),
                    task(2, 4, 2, 'Create a unique intro/outro style', 75),
                    task(2, 4, 3, 'Batch film 2 videos for the week', 75)
                ]
            },
            {
                day: 5, tasks: [
                    task(2, 5, 1, 'Edit and post content piece #4', 75),
                    task(2, 5, 2, 'Try a different content format', 50),
                    task(2, 5, 3, 'Engage in niche communities/groups', 50)
                ]
            },
            {
                day: 6, tasks: [
                    task(2, 6, 1, 'Create a carousel or multi-part content', 75),
                    task(2, 6, 2, 'Analyze your top performing content', 50),
                    task(2, 6, 3, 'Plan next week\'s content themes', 50)
                ]
            },
            {
                day: 7, tasks: [
                    task(2, 7, 1, 'Post content piece #5', 75),
                    task(2, 7, 2, 'Review weekly analytics', 50),
                    task(2, 7, 3, 'Document your processes', 25)
                ]
            }
        ]
    },
    // Weeks 3-12 follow similar pattern but with progressive challenges
    ...generateRemainingWeeks('content-creator')
];

// ============================================
// DROPSHIPPING ROADMAP
// ============================================
export const DROPSHIPPING_ROADMAP: Week[] = [
    {
        id: 1, title: 'Week 1', description: 'Product Research & Validation',
        isLocked: false, isCompleted: false,
        days: [
            {
                day: 1, tasks: [
                    task(1, 1, 1, 'Research trending products on AliExpress/CJ', 50),
                    task(1, 1, 2, 'Analyze 5 successful dropshipping stores', 50),
                    task(1, 1, 3, 'Make a list of 10 potential products', 25)
                ]
            },
            {
                day: 2, tasks: [
                    task(1, 2, 1, 'Check product margins (aim for 3x markup)', 75),
                    task(1, 2, 2, 'Research shipping times and suppliers', 50),
                    task(1, 2, 3, 'Validate demand using Google Trends', 50)
                ]
            },
            {
                day: 3, tasks: [
                    task(1, 3, 1, 'Narrow down to top 3 products', 50),
                    task(1, 3, 2, 'Find backup suppliers for each product', 50),
                    task(1, 3, 3, 'Calculate potential profit per sale', 50)
                ]
            },
            {
                day: 4, tasks: [
                    task(1, 4, 1, 'Select your winning product', 75),
                    task(1, 4, 2, 'Order a sample for quality check', 100),
                    task(1, 4, 3, 'Research competitor pricing', 50)
                ]
            },
            {
                day: 5, tasks: [
                    task(1, 5, 1, 'Sign up for Shopify free trial', 50),
                    task(1, 5, 2, 'Choose and install a theme', 50),
                    task(1, 5, 3, 'Set up your store name and branding', 50)
                ]
            },
            {
                day: 6, tasks: [
                    task(1, 6, 1, 'Install DSers/Oberlo app', 50),
                    task(1, 6, 2, 'Import product with optimized description', 75),
                    task(1, 6, 3, 'Create product images/mockups', 75)
                ]
            },
            {
                day: 7, tasks: [
                    task(1, 7, 1, 'Write compelling product copy', 75),
                    task(1, 7, 2, 'Set up payment gateway (Stripe/PayPal)', 50),
                    task(1, 7, 3, 'Review and refine store design', 50)
                ]
            }
        ]
    },
    {
        id: 2, title: 'Week 2', description: 'Store Optimization & Launch Prep',
        isLocked: true, isCompleted: false,
        days: [
            {
                day: 1, tasks: [
                    task(2, 1, 1, 'Create legal pages (Privacy, Terms, Refund)', 50),
                    task(2, 1, 2, 'Set up shipping rates and zones', 50),
                    task(2, 1, 3, 'Test checkout process end-to-end', 50)
                ]
            },
            {
                day: 2, tasks: [
                    task(2, 2, 1, 'Install essential apps (reviews, upsells)', 50),
                    task(2, 2, 2, 'Set up abandoned cart recovery emails', 75),
                    task(2, 2, 3, 'Create urgency elements (timers, stock)', 50)
                ]
            },
            {
                day: 3, tasks: [
                    task(2, 3, 1, 'Set up Facebook Business Manager', 75),
                    task(2, 3, 2, 'Install Facebook Pixel on store', 75),
                    task(2, 3, 3, 'Create Facebook/Instagram business page', 50)
                ]
            },
            {
                day: 4, tasks: [
                    task(2, 4, 1, 'Research successful ads in your niche', 75),
                    task(2, 4, 2, 'Write 3 different ad copy variations', 75),
                    task(2, 4, 3, 'Create or source video ads', 100)
                ]
            },
            {
                day: 5, tasks: [
                    task(2, 5, 1, 'Set up ad campaign structure', 75),
                    task(2, 5, 2, 'Define target audiences', 75),
                    task(2, 5, 3, 'Set initial budget ($5-10/day)', 50)
                ]
            },
            {
                day: 6, tasks: [
                    task(2, 6, 1, 'Launch first ad campaign', 100),
                    task(2, 6, 2, 'Monitor initial results', 50),
                    task(2, 6, 3, 'Prepare customer service responses', 50)
                ]
            },
            {
                day: 7, tasks: [
                    task(2, 7, 1, 'Analyze day 1-2 ad data', 75),
                    task(2, 7, 2, 'Adjust targeting based on results', 50),
                    task(2, 7, 3, 'Document learnings', 25)
                ]
            }
        ]
    },
    ...generateRemainingWeeks('dropshipping')
];

// ============================================
// APPOINTMENT SETTING ROADMAP
// ============================================
export const APPOINTMENT_SETTING_ROADMAP: Week[] = [
    {
        id: 1, title: 'Week 1', description: 'Foundation & Skill Building',
        isLocked: false, isCompleted: false,
        days: [
            {
                day: 1, tasks: [
                    task(1, 1, 1, 'Research appointment setting industry', 50),
                    task(1, 1, 2, 'Identify 5 niches that need appointments', 50),
                    task(1, 1, 3, 'Study successful appointment setter scripts', 50)
                ]
            },
            {
                day: 2, tasks: [
                    task(1, 2, 1, 'Learn objection handling techniques', 75),
                    task(1, 2, 2, 'Practice your opening pitch 10 times', 50),
                    task(1, 2, 3, 'Record yourself and review', 50)
                ]
            },
            {
                day: 3, tasks: [
                    task(1, 3, 1, 'Create your service offering document', 75),
                    task(1, 3, 2, 'Set up a professional email signature', 25),
                    task(1, 3, 3, 'Create a LinkedIn profile for B2B', 75)
                ]
            },
            {
                day: 4, tasks: [
                    task(1, 4, 1, 'Research CRM tools (HubSpot, Close)', 50),
                    task(1, 4, 2, 'Set up free CRM account', 50),
                    task(1, 4, 3, 'Learn to track calls and appointments', 50)
                ]
            },
            {
                day: 5, tasks: [
                    task(1, 5, 1, 'Find 10 potential client businesses', 75),
                    task(1, 5, 2, 'Research each company thoroughly', 75),
                    task(1, 5, 3, 'Prepare personalized outreach for each', 75)
                ]
            },
            {
                day: 6, tasks: [
                    task(1, 6, 1, 'Send outreach to 5 potential clients', 75),
                    task(1, 6, 2, 'Perfect your follow-up sequence', 50),
                    task(1, 6, 3, 'Practice rebuttals for common objections', 50)
                ]
            },
            {
                day: 7, tasks: [
                    task(1, 7, 1, 'Send outreach to remaining 5 clients', 75),
                    task(1, 7, 2, 'Track all responses in CRM', 50),
                    task(1, 7, 3, 'Refine pitch based on feedback', 50)
                ]
            }
        ]
    },
    {
        id: 2, title: 'Week 2', description: 'Client Acquisition & Cold Calling',
        isLocked: true, isCompleted: false,
        days: [
            {
                day: 1, tasks: [
                    task(2, 1, 1, 'Make 20 cold calls to potential clients', 100),
                    task(2, 1, 2, 'Log all call outcomes', 50),
                    task(2, 1, 3, 'Analyze what worked and didn\'t', 50)
                ]
            },
            {
                day: 2, tasks: [
                    task(2, 2, 1, 'Follow up on warm leads', 75),
                    task(2, 2, 2, 'Make 15 more cold calls', 75),
                    task(2, 2, 3, 'Book at least 1 discovery call', 100)
                ]
            },
            {
                day: 3, tasks: [
                    task(2, 3, 1, 'Prepare proposal template', 75),
                    task(2, 3, 2, 'Set your pricing structure', 50),
                    task(2, 3, 3, 'Create case study template', 50)
                ]
            },
            {
                day: 4, tasks: [
                    task(2, 4, 1, 'Conduct discovery call with prospect', 100),
                    task(2, 4, 2, 'Make 10 cold calls', 50),
                    task(2, 4, 3, 'Send follow-up emails to all contacts', 50)
                ]
            },
            {
                day: 5, tasks: [
                    task(2, 5, 1, 'Send proposal to interested client', 100),
                    task(2, 5, 2, 'Continue prospecting on LinkedIn', 75),
                    task(2, 5, 3, 'Make 15 cold calls', 75)
                ]
            },
            {
                day: 6, tasks: [
                    task(2, 6, 1, 'Follow up on sent proposals', 75),
                    task(2, 6, 2, 'Close your first client!', 150),
                    task(2, 6, 3, 'Set up onboarding process', 50)
                ]
            },
            {
                day: 7, tasks: [
                    task(2, 7, 1, 'Review weekly metrics', 50),
                    task(2, 7, 2, 'Document successful scripts', 50),
                    task(2, 7, 3, 'Plan next week\'s outreach targets', 50)
                ]
            }
        ]
    },
    ...generateRemainingWeeks('appointment-setting')
];

// ============================================
// NAIL TECH ROADMAP
// ============================================
export const NAIL_TECH_ROADMAP: Week[] = [
    {
        id: 1, title: 'Week 1', description: 'Setup & Skill Building',
        isLocked: false, isCompleted: false,
        days: [
            {
                day: 1, tasks: [
                    task(1, 1, 1, 'Research nail tech licensing in your area', 50),
                    task(1, 1, 2, 'Inventory your current supplies', 50),
                    task(1, 1, 3, 'Make a list of needed equipment', 50)
                ]
            },
            {
                day: 2, tasks: [
                    task(1, 2, 1, 'Practice basic manicure on yourself/friend', 75),
                    task(1, 2, 2, 'Watch 3 tutorial videos on techniques', 50),
                    task(1, 2, 3, 'Create your services menu', 50)
                ]
            },
            {
                day: 3, tasks: [
                    task(1, 3, 1, 'Set up Instagram for your nail business', 75),
                    task(1, 3, 2, 'Take photos of your practice work', 50),
                    task(1, 3, 3, 'Create a cohesive feed aesthetic', 50)
                ]
            },
            {
                day: 4, tasks: [
                    task(1, 4, 1, 'Practice gel application technique', 75),
                    task(1, 4, 2, 'Practice on a hand model or tips', 75),
                    task(1, 4, 3, 'Time yourself for efficiency', 50)
                ]
            },
            {
                day: 5, tasks: [
                    task(1, 5, 1, 'Set your pricing structure', 50),
                    task(1, 5, 2, 'Create your booking system (Acuity/Calendly)', 75),
                    task(1, 5, 3, 'Write your service descriptions', 50)
                ]
            },
            {
                day: 6, tasks: [
                    task(1, 6, 1, 'Post your first nail photos on Instagram', 75),
                    task(1, 6, 2, 'Use relevant hashtags for nail tech', 50),
                    task(1, 6, 3, 'Engage with 20 local accounts', 50)
                ]
            },
            {
                day: 7, tasks: [
                    task(1, 7, 1, 'Practice nail art design', 75),
                    task(1, 7, 2, 'Offer free/discounted nails to friends', 100),
                    task(1, 7, 3, 'Collect before/after photos', 50)
                ]
            }
        ]
    },
    {
        id: 2, title: 'Week 2', description: 'Building Portfolio & Clients',
        isLocked: true, isCompleted: false,
        days: [
            {
                day: 1, tasks: [
                    task(2, 1, 1, 'Do 2 practice clients this week', 100),
                    task(2, 1, 2, 'Ask for feedback after each session', 50),
                    task(2, 1, 3, 'Post results on Instagram Stories', 50)
                ]
            },
            {
                day: 2, tasks: [
                    task(2, 2, 1, 'Learn a new nail art technique', 75),
                    task(2, 2, 2, 'Create reels/TikToks of your work', 75),
                    task(2, 2, 3, 'Research trending nail designs', 50)
                ]
            },
            {
                day: 3, tasks: [
                    task(2, 3, 1, 'Set up Google Business profile', 75),
                    task(2, 3, 2, 'Ask practice clients for reviews', 50),
                    task(2, 3, 3, 'Create a referral incentive', 50)
                ]
            },
            {
                day: 4, tasks: [
                    task(2, 4, 1, 'Post a transformation reel', 75),
                    task(2, 4, 2, 'Engage with nail tech community', 50),
                    task(2, 4, 3, 'Message 5 local influencers for collab', 75)
                ]
            },
            {
                day: 5, tasks: [
                    task(2, 5, 1, 'Book your first paying client', 150),
                    task(2, 5, 2, 'Prepare your workspace thoroughly', 50),
                    task(2, 5, 3, 'Review health & safety protocols', 50)
                ]
            },
            {
                day: 6, tasks: [
                    task(2, 6, 1, 'Complete first paid appointment', 150),
                    task(2, 6, 2, 'Request testimonial and photos', 50),
                    task(2, 6, 3, 'Follow up for rebooking', 50)
                ]
            },
            {
                day: 7, tasks: [
                    task(2, 7, 1, 'Review the week\'s income', 50),
                    task(2, 7, 2, 'Plan next week\'s content', 50),
                    task(2, 7, 3, 'Order any needed supplies', 50)
                ]
            }
        ]
    },
    ...generateRemainingWeeks('nail-tech')
];

// ============================================
// HAIR STYLIST ROADMAP
// ============================================
export const HAIR_STYLIST_ROADMAP: Week[] = [
    {
        id: 1, title: 'Week 1', description: 'Business Setup & Branding',
        isLocked: false, isCompleted: false,
        days: [
            {
                day: 1, tasks: [
                    task(1, 1, 1, 'Define your specialty (cuts, color, braids, etc)', 50),
                    task(1, 1, 2, 'Research local competition and pricing', 50),
                    task(1, 1, 3, 'List required licenses/certifications', 50)
                ]
            },
            {
                day: 2, tasks: [
                    task(1, 2, 1, 'Create your brand name and logo', 75),
                    task(1, 2, 2, 'Set up Instagram business account', 50),
                    task(1, 2, 3, 'Choose your brand colors and aesthetic', 50)
                ]
            },
            {
                day: 3, tasks: [
                    task(1, 3, 1, 'Take professional photos of past work', 75),
                    task(1, 3, 2, 'Create a portfolio post', 75),
                    task(1, 3, 3, 'Write your bio with specialty highlighted', 50)
                ]
            },
            {
                day: 4, tasks: [
                    task(1, 4, 1, 'Set up booking system', 75),
                    task(1, 4, 2, 'Create service menu with prices', 50),
                    task(1, 4, 3, 'Plan your workspace setup', 50)
                ]
            },
            {
                day: 5, tasks: [
                    task(1, 5, 1, 'Practice your signature technique', 75),
                    task(1, 5, 2, 'Film a before/after transformation', 100),
                    task(1, 5, 3, 'Edit and post content', 50)
                ]
            },
            {
                day: 6, tasks: [
                    task(1, 6, 1, 'Reach out to 10 potential clients', 75),
                    task(1, 6, 2, 'Offer launch discount', 50),
                    task(1, 6, 3, 'Engage in local Facebook groups', 50)
                ]
            },
            {
                day: 7, tasks: [
                    task(1, 7, 1, 'Do a practice client for portfolio', 100),
                    task(1, 7, 2, 'Collect reviews and testimonials', 50),
                    task(1, 7, 3, 'Review and plan next week', 25)
                ]
            }
        ]
    },
    {
        id: 2, title: 'Week 2', description: 'Client Booking & Social Growth',
        isLocked: true, isCompleted: false,
        days: [
            {
                day: 1, tasks: [
                    task(2, 1, 1, 'Post transformation content', 75),
                    task(2, 1, 2, 'Use 20+ relevant hashtags', 25),
                    task(2, 1, 3, 'DM 5 people about your services', 50)
                ]
            },
            {
                day: 2, tasks: [
                    task(2, 2, 1, 'Create a reels tutorial', 100),
                    task(2, 2, 2, 'Share styling tips in Stories', 50),
                    task(2, 2, 3, 'Engage with 30 local accounts', 50)
                ]
            },
            {
                day: 3, tasks: [
                    task(2, 3, 1, 'Book first paying client', 150),
                    task(2, 3, 2, 'Confirm appointment details', 25),
                    task(2, 3, 3, 'Prepare for service', 50)
                ]
            },
            {
                day: 4, tasks: [
                    task(2, 4, 1, 'Complete client service', 150),
                    task(2, 4, 2, 'Take before/after photos', 50),
                    task(2, 4, 3, 'Request review and referrals', 50)
                ]
            },
            {
                day: 5, tasks: [
                    task(2, 5, 1, 'Post client transformation', 75),
                    task(2, 5, 2, 'Set up Google Business listing', 75),
                    task(2, 5, 3, 'Reply to all DMs and comments', 50)
                ]
            },
            {
                day: 6, tasks: [
                    task(2, 6, 1, 'Book 2 more clients for next week', 100),
                    task(2, 6, 2, 'Create a referral program', 50),
                    task(2, 6, 3, 'Order any needed products', 50)
                ]
            },
            {
                day: 7, tasks: [
                    task(2, 7, 1, 'Track income and expenses', 50),
                    task(2, 7, 2, 'Plan content for next week', 50),
                    task(2, 7, 3, 'Rest and reflect', 25)
                ]
            }
        ]
    },
    ...generateRemainingWeeks('hair-stylist')
];

// ============================================
// BAKING ROADMAP
// ============================================
export const BAKING_ROADMAP: Week[] = [
    {
        id: 1, title: 'Week 1', description: 'Recipe Testing & Legal Setup',
        isLocked: false, isCompleted: false,
        days: [
            {
                day: 1, tasks: [
                    task(1, 1, 1, 'Research cottage food laws in your state', 75),
                    task(1, 1, 2, 'Decide your specialty (cakes, cookies, bread)', 50),
                    task(1, 1, 3, 'List 5 signature items you\'ll sell', 50)
                ]
            },
            {
                day: 2, tasks: [
                    task(1, 2, 1, 'Test bake your first signature item', 75),
                    task(1, 2, 2, 'Take styled photos of your baking', 50),
                    task(1, 2, 3, 'Calculate ingredient costs', 50)
                ]
            },
            {
                day: 3, tasks: [
                    task(1, 3, 1, 'Test bake second signature item', 75),
                    task(1, 3, 2, 'Get feedback from friends/family', 50),
                    task(1, 3, 3, 'Refine recipes based on feedback', 50)
                ]
            },
            {
                day: 4, tasks: [
                    task(1, 4, 1, 'Set up Instagram for your bakery', 75),
                    task(1, 4, 2, 'Create a brand name and aesthetic', 50),
                    task(1, 4, 3, 'Post your first baking content', 50)
                ]
            },
            {
                day: 5, tasks: [
                    task(1, 5, 1, 'Price your products (cost x 3-4)', 50),
                    task(1, 5, 2, 'Create a simple menu with prices', 50),
                    task(1, 5, 3, 'Research packaging options', 50)
                ]
            },
            {
                day: 6, tasks: [
                    task(1, 6, 1, 'Order packaging supplies', 50),
                    task(1, 6, 2, 'Set up order/booking system', 75),
                    task(1, 6, 3, 'Create food labels if required', 50)
                ]
            },
            {
                day: 7, tasks: [
                    task(1, 7, 1, 'Bake a sample batch for photos', 75),
                    task(1, 7, 2, 'Take professional product photos', 75),
                    task(1, 7, 3, 'Share with local friends for word-of-mouth', 50)
                ]
            }
        ]
    },
    {
        id: 2, title: 'Week 2', description: 'First Orders & Marketing',
        isLocked: true, isCompleted: false,
        days: [
            {
                day: 1, tasks: [
                    task(2, 1, 1, 'Post menu on Instagram', 75),
                    task(2, 1, 2, 'Share in local Facebook groups', 50),
                    task(2, 1, 3, 'Offer launch week special', 50)
                ]
            },
            {
                day: 2, tasks: [
                    task(2, 2, 1, 'Take orders for the week', 75),
                    task(2, 2, 2, 'Create order tracking system', 50),
                    task(2, 2, 3, 'Plan baking schedule', 50)
                ]
            },
            {
                day: 3, tasks: [
                    task(2, 3, 1, 'Prep ingredients for orders', 50),
                    task(2, 3, 2, 'Batch bake first orders', 100),
                    task(2, 3, 3, 'Package products beautifully', 50)
                ]
            },
            {
                day: 4, tasks: [
                    task(2, 4, 1, 'Deliver/arrange pickup for orders', 75),
                    task(2, 4, 2, 'Ask for reviews and photos', 50),
                    task(2, 4, 3, 'Repost customer content', 50)
                ]
            },
            {
                day: 5, tasks: [
                    task(2, 5, 1, 'Test a new product for next week', 75),
                    task(2, 5, 2, 'Create behind-the-scenes content', 50),
                    task(2, 5, 3, 'Engage with local food accounts', 50)
                ]
            },
            {
                day: 6, tasks: [
                    task(2, 6, 1, 'Analyze what sold best', 50),
                    task(2, 6, 2, 'Collect all customer feedback', 50),
                    task(2, 6, 3, 'Plan next week\'s menu', 50)
                ]
            },
            {
                day: 7, tasks: [
                    task(2, 7, 1, 'Calculate weekly profit', 50),
                    task(2, 7, 2, 'Restock ingredients', 50),
                    task(2, 7, 3, 'Rest and celebrate wins!', 25)
                ]
            }
        ]
    },
    ...generateRemainingWeeks('baking')
];

// ============================================
// COLD CALLING ROADMAP  
// ============================================
export const COLD_CALLING_ROADMAP: Week[] = [
    {
        id: 1, title: 'Week 1', description: 'Script Development & Practice',
        isLocked: false, isCompleted: false,
        days: [
            {
                day: 1, tasks: [
                    task(1, 1, 1, 'Study 5 successful cold calling scripts', 50),
                    task(1, 1, 2, 'Identify your target market', 50),
                    task(1, 1, 3, 'Define your value proposition', 50)
                ]
            },
            {
                day: 2, tasks: [
                    task(1, 2, 1, 'Write your opening script (30 seconds)', 75),
                    task(1, 2, 2, 'Practice delivery 20 times', 50),
                    task(1, 2, 3, 'Record and review yourself', 50)
                ]
            },
            {
                day: 3, tasks: [
                    task(1, 3, 1, 'Develop rebuttals for top 5 objections', 75),
                    task(1, 3, 2, 'Practice objection handling', 50),
                    task(1, 3, 3, 'Roleplay with a friend', 75)
                ]
            },
            {
                day: 4, tasks: [
                    task(1, 4, 1, 'Build list of 50 prospects', 75),
                    task(1, 4, 2, 'Research each company basics', 75),
                    task(1, 4, 3, 'Set up call tracking spreadsheet', 50)
                ]
            },
            {
                day: 5, tasks: [
                    task(1, 5, 1, 'Make your first 10 cold calls', 100),
                    task(1, 5, 2, 'Track outcomes (answer, voicemail, DM)', 50),
                    task(1, 5, 3, 'Note what worked and didn\'t', 50)
                ]
            },
            {
                day: 6, tasks: [
                    task(1, 6, 1, 'Make 15 more cold calls', 100),
                    task(1, 6, 2, 'Refine script based on feedback', 50),
                    task(1, 6, 3, 'Follow up on any callbacks', 50)
                ]
            },
            {
                day: 7, tasks: [
                    task(1, 7, 1, 'Make 15 more cold calls', 100),
                    task(1, 7, 2, 'Analyze weekly metrics', 50),
                    task(1, 7, 3, 'Set targets for next week', 50)
                ]
            }
        ]
    },
    {
        id: 2, title: 'Week 2', description: 'Volume & Optimization',
        isLocked: true, isCompleted: false,
        days: [
            {
                day: 1, tasks: [
                    task(2, 1, 1, 'Make 25 cold calls', 100),
                    task(2, 1, 2, 'Track connect rate', 50),
                    task(2, 1, 3, 'A/B test two opening lines', 50)
                ]
            },
            {
                day: 2, tasks: [
                    task(2, 2, 1, 'Make 25 cold calls', 100),
                    task(2, 2, 2, 'Focus on tonality and energy', 50),
                    task(2, 2, 3, 'Set at least one appointment', 75)
                ]
            },
            {
                day: 3, tasks: [
                    task(2, 3, 1, 'Make 30 cold calls', 100),
                    task(2, 3, 2, 'Try calling at different times', 50),
                    task(2, 3, 3, 'Improve your closing question', 50)
                ]
            },
            {
                day: 4, tasks: [
                    task(2, 4, 1, 'Make 30 cold calls', 100),
                    task(2, 4, 2, 'Book at least 2 appointments', 100),
                    task(2, 4, 3, 'Send recap emails after calls', 50)
                ]
            },
            {
                day: 5, tasks: [
                    task(2, 5, 1, 'Make 25 cold calls', 100),
                    task(2, 5, 2, 'Follow up on all warm leads', 75),
                    task(2, 5, 3, 'Refine your pitch based on data', 50)
                ]
            },
            {
                day: 6, tasks: [
                    task(2, 6, 1, 'Make 20 cold calls', 75),
                    task(2, 6, 2, 'Conduct booked appointments', 100),
                    task(2, 6, 3, 'Document successful approaches', 50)
                ]
            },
            {
                day: 7, tasks: [
                    task(2, 7, 1, 'Analyze week\'s performance', 50),
                    task(2, 7, 2, 'Calculate appointment rate', 50),
                    task(2, 7, 3, 'Build next week\'s prospect list', 75)
                ]
            }
        ]
    },
    ...generateRemainingWeeks('cold-calling')
];

// ============================================
// SALES & CLOSING ROADMAP
// ============================================
export const SALES_CLOSING_ROADMAP: Week[] = [
    {
        id: 1, title: 'Week 1', description: 'Sales Fundamentals',
        isLocked: false, isCompleted: false,
        days: [
            {
                day: 1, tasks: [
                    task(1, 1, 1, 'Study SPIN selling methodology', 75),
                    task(1, 1, 2, 'Learn the psychology of buying', 50),
                    task(1, 1, 3, 'Identify your ideal customer profile', 50)
                ]
            },
            {
                day: 2, tasks: [
                    task(1, 2, 1, 'Create your discovery call script', 75),
                    task(1, 2, 2, 'Develop 10 probing questions', 50),
                    task(1, 2, 3, 'Practice active listening techniques', 50)
                ]
            },
            {
                day: 3, tasks: [
                    task(1, 3, 1, 'Learn 5 closing techniques', 75),
                    task(1, 3, 2, 'Practice the assumptive close', 50),
                    task(1, 3, 3, 'Practice the urgency close', 50)
                ]
            },
            {
                day: 4, tasks: [
                    task(1, 4, 1, 'Shadow a sales call (online/record)', 75),
                    task(1, 4, 2, 'Take notes on techniques used', 50),
                    task(1, 4, 3, 'Identify 3 techniques to adopt', 50)
                ]
            },
            {
                day: 5, tasks: [
                    task(1, 5, 1, 'Create your follow-up sequence', 75),
                    task(1, 5, 2, 'Write email templates for each stage', 50),
                    task(1, 5, 3, 'Set up CRM for pipeline tracking', 50)
                ]
            },
            {
                day: 6, tasks: [
                    task(1, 6, 1, 'Role-play a full sales call', 100),
                    task(1, 6, 2, 'Get feedback on your pitch', 50),
                    task(1, 6, 3, 'Refine based on feedback', 50)
                ]
            },
            {
                day: 7, tasks: [
                    task(1, 7, 1, 'Make your first real sales call', 100),
                    task(1, 7, 2, 'Document what happened', 50),
                    task(1, 7, 3, 'Identify areas for improvement', 50)
                ]
            }
        ]
    },
    {
        id: 2, title: 'Week 2', description: 'Pipeline Building & Closing',
        isLocked: true, isCompleted: false,
        days: [
            {
                day: 1, tasks: [
                    task(2, 1, 1, 'Generate 10 qualified leads', 75),
                    task(2, 1, 2, 'Research each lead thoroughly', 75),
                    task(2, 1, 3, 'Schedule discovery calls', 75)
                ]
            },
            {
                day: 2, tasks: [
                    task(2, 2, 1, 'Conduct 2 discovery calls', 100),
                    task(2, 2, 2, 'Qualify leads using BANT', 50),
                    task(2, 2, 3, 'Move qualified leads to proposal stage', 50)
                ]
            },
            {
                day: 3, tasks: [
                    task(2, 3, 1, 'Create proposal template', 75),
                    task(2, 3, 2, 'Send 2 proposals', 75),
                    task(2, 3, 3, 'Schedule follow-up calls', 50)
                ]
            },
            {
                day: 4, tasks: [
                    task(2, 4, 1, 'Handle objections on calls', 75),
                    task(2, 4, 2, 'Use trial close technique', 50),
                    task(2, 4, 3, 'Document common objections', 50)
                ]
            },
            {
                day: 5, tasks: [
                    task(2, 5, 1, 'Close your first deal!', 200),
                    task(2, 5, 2, 'Celebrate the win', 25),
                    task(2, 5, 3, 'Send thank you to customer', 25)
                ]
            },
            {
                day: 6, tasks: [
                    task(2, 6, 1, 'Follow up on pending proposals', 75),
                    task(2, 6, 2, 'Add 5 new leads to pipeline', 50),
                    task(2, 6, 3, 'Review call recordings', 50)
                ]
            },
            {
                day: 7, tasks: [
                    task(2, 7, 1, 'Calculate weekly close rate', 50),
                    task(2, 7, 2, 'Identify your best techniques', 50),
                    task(2, 7, 3, 'Plan next week\'s targets', 50)
                ]
            }
        ]
    },
    ...generateRemainingWeeks('sales-closing')
];

// ============================================
// FREELANCING ROADMAP (Same pattern, abbreviated here)
// ============================================
export const FREELANCING_ROADMAP: Week[] = [
    {
        id: 1, title: 'Week 1', description: 'Portfolio & Profile Setup',
        isLocked: false, isCompleted: false,
        days: [
            {
                day: 1, tasks: [
                    task(1, 1, 1, 'Define your freelance skill offering', 50),
                    task(1, 1, 2, 'Research top freelancers in your niche', 50),
                    task(1, 1, 3, 'Identify 3 platforms to use', 50)
                ]
            },
            {
                day: 2, tasks: [
                    task(1, 2, 1, 'Create your Upwork profile', 75),
                    task(1, 2, 2, 'Write a compelling bio', 50),
                    task(1, 2, 3, 'Add portfolio samples', 75)
                ]
            },
            {
                day: 3, tasks: [
                    task(1, 3, 1, 'Create your Fiverr profile', 75),
                    task(1, 3, 2, 'Design 3 gig offerings', 75),
                    task(1, 3, 3, 'Set competitive pricing', 50)
                ]
            },
            {
                day: 4, tasks: [
                    task(1, 4, 1, 'Create personal portfolio website', 100),
                    task(1, 4, 2, 'Add case studies', 75),
                    task(1, 4, 3, 'Include testimonials if any', 50)
                ]
            },
            {
                day: 5, tasks: [
                    task(1, 5, 1, 'Send your first 5 proposals', 75),
                    task(1, 5, 2, 'Personalize each proposal', 50),
                    task(1, 5, 3, 'Follow proposal best practices', 50)
                ]
            },
            {
                day: 6, tasks: [
                    task(1, 6, 1, 'Send 5 more proposals', 75),
                    task(1, 6, 2, 'Optimize based on any feedback', 50),
                    task(1, 6, 3, 'Network in freelancer communities', 50)
                ]
            },
            {
                day: 7, tasks: [
                    task(1, 7, 1, 'Review proposal success rate', 50),
                    task(1, 7, 2, 'Refine your service offerings', 50),
                    task(1, 7, 3, 'Plan next week\'s outreach', 50)
                ]
            }
        ]
    },
    {
        id: 2, title: 'Week 2', description: 'Landing First Clients',
        isLocked: true, isCompleted: false,
        days: [
            {
                day: 1, tasks: [
                    task(2, 1, 1, 'Send 10 proposals today', 100),
                    task(2, 1, 2, 'Focus on best-fit projects', 50),
                    task(2, 1, 3, 'Track all submissions', 50)
                ]
            },
            {
                day: 2, tasks: [
                    task(2, 2, 1, 'Respond to client messages within 1hr', 50),
                    task(2, 2, 2, 'Schedule discovery calls', 75),
                    task(2, 2, 3, 'Prepare for calls with research', 50)
                ]
            },
            {
                day: 3, tasks: [
                    task(2, 3, 1, 'Conduct discovery call', 100),
                    task(2, 3, 2, 'Send follow-up with next steps', 50),
                    task(2, 3, 3, 'Create custom proposal if needed', 75)
                ]
            },
            {
                day: 4, tasks: [
                    task(2, 4, 1, 'Land your first client!', 200),
                    task(2, 4, 2, 'Set clear expectations', 50),
                    task(2, 4, 3, 'Begin project immediately', 75)
                ]
            },
            {
                day: 5, tasks: [
                    task(2, 5, 1, 'Deliver first milestone', 100),
                    task(2, 5, 2, 'Request feedback', 50),
                    task(2, 5, 3, 'Continue sending proposals', 50)
                ]
            },
            {
                day: 6, tasks: [
                    task(2, 6, 1, 'Complete first project', 150),
                    task(2, 6, 2, 'Request testimonial', 50),
                    task(2, 6, 3, 'Ask for referrals', 50)
                ]
            },
            {
                day: 7, tasks: [
                    task(2, 7, 1, 'Review weekly income', 50),
                    task(2, 7, 2, 'Update portfolio with new work', 50),
                    task(2, 7, 3, 'Set income goal for next week', 50)
                ]
            }
        ]
    },
    ...generateRemainingWeeks('freelancing')
];

// ============================================
// SAAS ROADMAP
// ============================================
export const SAAS_ROADMAP: Week[] = [
    {
        id: 1, title: 'Week 1', description: 'Idea Validation',
        isLocked: false, isCompleted: false,
        days: [
            {
                day: 1, tasks: [
                    task(1, 1, 1, 'Identify 3 problems you want to solve', 50),
                    task(1, 1, 2, 'Research if solutions exist', 50),
                    task(1, 1, 3, 'Talk to 3 potential users', 75)
                ]
            },
            {
                day: 2, tasks: [
                    task(1, 2, 1, 'Define your target customer', 50),
                    task(1, 2, 2, 'Write problem statement', 50),
                    task(1, 2, 3, 'Sketch your solution concept', 50)
                ]
            },
            {
                day: 3, tasks: [
                    task(1, 3, 1, 'Create landing page mockup', 75),
                    task(1, 3, 2, 'Write value proposition', 50),
                    task(1, 3, 3, 'List core features needed', 50)
                ]
            },
            {
                day: 4, tasks: [
                    task(1, 4, 1, 'Build landing page (Carrd/Framer)', 100),
                    task(1, 4, 2, 'Add email waitlist signup', 50),
                    task(1, 4, 3, 'Write compelling copy', 50)
                ]
            },
            {
                day: 5, tasks: [
                    task(1, 5, 1, 'Share landing page in communities', 75),
                    task(1, 5, 2, 'Collect at least 10 signups', 75),
                    task(1, 5, 3, 'Get feedback on concept', 50)
                ]
            },
            {
                day: 6, tasks: [
                    task(1, 6, 1, 'Interview 5 waitlist signups', 100),
                    task(1, 6, 2, 'Document pain points', 50),
                    task(1, 6, 3, 'Refine core features list', 50)
                ]
            },
            {
                day: 7, tasks: [
                    task(1, 7, 1, 'Finalize MVP feature set', 75),
                    task(1, 7, 2, 'Create simple wireframes', 75),
                    task(1, 7, 3, 'Set development timeline', 50)
                ]
            }
        ]
    },
    {
        id: 2, title: 'Week 2', description: 'MVP Development',
        isLocked: true, isCompleted: false,
        days: [
            {
                day: 1, tasks: [
                    task(2, 1, 1, 'Set up development environment', 50),
                    task(2, 1, 2, 'Create project repository', 50),
                    task(2, 1, 3, 'Build database schema', 75)
                ]
            },
            {
                day: 2, tasks: [
                    task(2, 2, 1, 'Implement user authentication', 100),
                    task(2, 2, 2, 'Create basic UI layout', 75),
                    task(2, 2, 3, 'Set up hosting', 50)
                ]
            },
            {
                day: 3, tasks: [
                    task(2, 3, 1, 'Build core feature #1', 100),
                    task(2, 3, 2, 'Test functionality', 50),
                    task(2, 3, 3, 'Document any bugs', 50)
                ]
            },
            {
                day: 4, tasks: [
                    task(2, 4, 1, 'Build core feature #2', 100),
                    task(2, 4, 2, 'Connect to database', 75),
                    task(2, 4, 3, 'Add error handling', 50)
                ]
            },
            {
                day: 5, tasks: [
                    task(2, 5, 1, 'Build core feature #3', 100),
                    task(2, 5, 2, 'Do full testing pass', 75),
                    task(2, 5, 3, 'Fix critical bugs', 50)
                ]
            },
            {
                day: 6, tasks: [
                    task(2, 6, 1, 'Polish UI/UX', 75),
                    task(2, 6, 2, 'Add payment integration', 100),
                    task(2, 6, 3, 'Prepare launch checklist', 50)
                ]
            },
            {
                day: 7, tasks: [
                    task(2, 7, 1, 'Deploy MVP to production', 100),
                    task(2, 7, 2, 'Announce to waitlist', 75),
                    task(2, 7, 3, 'Collect early feedback', 50)
                ]
            }
        ]
    },
    ...generateRemainingWeeks('saas')
];

// Helper function to generate remaining weeks (3-12) with progressive challenges
function generateRemainingWeeks(_niche: string): Week[] {
    // Tangible objectives organized by week theme - 3 tasks per day for 7 days
    const weekObjectives: { [key: number]: { theme: string; tasks: string[][] } } = {
        3: {
            theme: 'Growth & Scale',
            tasks: [
                ['Increase output by 50% - set daily production goals', 'Analyze your best-performing work from Week 1-2', 'Identify one bottleneck and create a fix plan'],
                ['Reach out to 5 potential collaborators or partners', 'Create a simple referral system for happy clients', 'Set up basic analytics tracking'],
                ['Post 2x more content than last week', 'Respond to every comment/message within 4 hours', 'Study a competitor 6 months ahead of you'],
                ['Set a goal to double your audience this week', 'Create a compilation of your best work', 'Optimize your bio with clear value proposition'],
                ['Launch a weekend challenge or special offer', 'Network in 3 online communities in your niche', 'Ask 5 clients for testimonials'],
                ['Create your first case study or success story', 'Set up an automated welcome message', 'Post a behind-the-scenes look at your process'],
                ['Document top 3 wins and 3 improvements this week', 'Set specific numeric goals for Week 4', 'Celebrate with a reward for yourself']
            ]
        },
        4: {
            theme: 'Systems & Automation',
            tasks: [
                ['Create and follow a daily routine schedule', 'Set up templates for your 3 most common tasks', 'Start using a project management tool'],
                ['Schedule social media posts for the week', 'Create email templates for common responses', 'Set up automatic payment reminders'],
                ['Document your entire workflow step-by-step', 'Create a client onboarding checklist', 'Automate one repetitive task using free tools'],
                ['Build a content calendar for next month', 'Create a swipe file of best-performing content', 'Set up keyboard shortcuts'],
                ['Batch all similar tasks on the same day', 'Plan what help you need to hire first', 'Create Standard Operating Procedures'],
                ['Set up a CRM to track leads and clients', 'Organize your files with a naming system', 'Create a pricing calculator'],
                ['Eliminate 3 time-wasters from your routine', 'Calculate your effective hourly rate', 'Pre-schedule 80% of next week']
            ]
        },
        5: {
            theme: 'Advanced Techniques',
            tasks: [
                ['Complete one lesson in an advanced course', 'Study what the top 1% in your industry do', 'Try one technique you have been avoiding'],
                ['A/B test two versions of your main offer', 'Learn SEO basics and optimize 5 posts', 'Master one new tool in your workflow'],
                ['Create a premium tier of your service', 'Develop a signature method or framework', 'Collaborate with someone more experienced'],
                ['Research certifications in your field', 'Pitch to speak on a podcast or guest post', 'Create a lead magnet or free resource'],
                ['Publish an advanced tutorial in your niche', 'Set up simple retargeting to warm audience', 'Track 5 key metrics daily'],
                ['Build an upsell into your main process', 'Improve your sales page or pitch', 'Add ethical urgency to your offers'],
                ['Identify next 3 skills to learn', 'Plan a signature project showcasing expertise', 'Document all new techniques learned']
            ]
        },
        6: {
            theme: 'Monetization Mastery',
            tasks: [
                ['Raise your prices by minimum 20%', 'Create 3-tier pricing options', 'Calculate your customer acquisition cost'],
                ['Launch a high-ticket offer ($500+)', 'Create a payment plan option', 'Set up referral commissions'],
                ['Bundle services into a valuable package', 'Create a fixed-scope productized service', 'Add a subscription or retainer option'],
                ['Contact 10 past clients for repeat business', 'Cross-sell to existing clients', 'Create a Done For You premium option'],
                ['Set a monthly revenue goal and track daily', 'Double down on most profitable offering', 'Remove or reprice low-margin services'],
                ['Launch a limited-time promotion', 'Create bonuses for fast action takers', 'Develop a VIP priority tier'],
                ['Calculate customer lifetime value', 'Review what brought 80% of revenue', 'Set income goal for next month']
            ]
        },
        7: {
            theme: 'Community Building',
            tasks: [
                ['Start or grow an email newsletter', 'Create a private group for your audience', 'Host a live Q&A session'],
                ['Feature community members publicly', 'Create a branded hashtag', 'Respond personally to every DM today'],
                ['Launch a challenge for your followers', 'Give away $100+ in value free', 'Interview a successful community member'],
                ['Create exclusive content for loyal fans', 'Host a virtual meetup or event', 'Start a members-only tier'],
                ['Partner with 3 complementary creators', 'Launch a user-generated content campaign', 'Create an ambassador program'],
                ['Write thank-you notes to top 20 clients', 'Create a client appreciation event', 'Build a recognition system'],
                ['Survey your community for feedback', 'Plan monthly events for next 3 months', 'Celebrate community milestones publicly']
            ]
        },
        8: {
            theme: 'Optimization',
            tasks: [
                ['Audit your funnel - fix #1 drop-off point', 'Speed test and optimize your website', 'Simplify your offering messaging'],
                ['Test two versions of your signup flow', 'Improve first 24 hours of client experience', 'Reduce time-to-value for new clients'],
                ['Fix top 3 customer complaints', 'Streamline your delivery process', 'Get response time under 2 hours'],
                ['Optimize your #1 traffic source', 'Improve your best-selling product', 'Cut costs by 10% without quality loss'],
                ['Remove friction from payment process', 'Create better onboarding documentation', 'Speed up project turnaround time'],
                ['Test 5 different headlines on key pages', 'Improve mobile experience', 'Optimize top 5 pages for search'],
                ['Measure all improvements made', 'Document what worked best', 'Set targets for next optimization round']
            ]
        },
        9: {
            theme: 'Expansion',
            tasks: [
                ['Identify a parallel niche to expand into', 'Research new geographic markets', 'Find a partner in adjacent space'],
                ['Launch on a new platform', 'Create content in a new format', 'Adapt content for new audience'],
                ['Test paid ads with $50-100 budget', 'Pitch to 5 potential B2B clients', 'Apply to speak at an industry event'],
                ['Create a course or educational product', 'License your methods to others', 'White-label your service'],
                ['Launch virtually in a new region', 'Create strategic cross-promotion deal', 'Pitch to larger companies'],
                ['Create a template others can use', 'Build multiple income streams', 'Connect with industry influencers'],
                ['Map out 12-month expansion plan', 'Prioritize highest ROI expansion', 'Set 3 expansion goals for next quarter']
            ]
        },
        10: {
            theme: 'Brand Authority',
            tasks: [
                ['Get featured in a publication or podcast', 'Write a thought leadership article', 'Get a testimonial from a recognized name'],
                ['Create a professional press kit', 'Apply for industry awards', 'Publish a detailed case study'],
                ['Host a webinar (100+ attendees goal)', 'Get verified on social platforms', 'Create a signature quote or philosophy'],
                ['Contribute to industry discussions', 'Mentor someone newer in your field', 'Join a high-level mastermind group'],
                ['Create an annual industry insight', 'Build relationships with journalists', 'Develop a personal brand style guide'],
                ['Speak at a meetup or summit', 'Create shareable graphics with insights', 'Get endorsed by industry figures'],
                ['Audit and clean up online presence', 'Plan 3-month thought leadership calendar', 'Identify 5 authority opportunities']
            ]
        },
        11: {
            theme: 'Passive Income',
            tasks: [
                ['Create and launch a digital product', 'Set up evergreen sales funnel', 'Create a template or toolkit to sell'],
                ['Launch an affiliate marketing strategy', 'Record and package course content', 'Set up print-on-demand merchandise'],
                ['Create membership with recurring revenue', 'License assets you already own', 'Build passive stream from existing audience'],
                ['Set up advertising revenue on content', 'Create a paid newsletter tier', 'Develop sponsorship packages'],
                ['Write an ebook or guide to sell', 'Monetize old content you created', 'Create income-generating partnerships'],
                ['Set up recurring commission relationships', 'Build referral incentives into products', 'Create automated webinar funnel'],
                ['Calculate monthly passive income potential', 'Prioritize highest leverage passive income', 'Set passive income goal for 3 months']
            ]
        },
        12: {
            theme: 'Long-term Vision',
            tasks: [
                ['Write your 1-year business vision', 'Set 3 major goals for next 12 months', 'Identify who you need to become'],
                ['Create a 90-day action plan', 'Design your ideal work week schedule', 'Plan for sustainable work-life balance'],
                ['Document everything learned in 12 weeks', 'Create systems that run without you', 'Identify what to stop, start, continue'],
                ['Build a team hiring plan', 'Set up backup and succession systems', 'Plan for scaling without burnout'],
                ['Calculate what income level is enough', 'Design your exit strategy or legacy', 'Create a charitable giving plan'],
                ['Plan a celebration for completing 12 weeks', 'Share your journey to inspire others', 'Find accountability for next 12 weeks'],
                ['Final reflection on surprises and lessons', 'Update all goals for next quarter', 'Schedule your next 12-week journey']
            ]
        }
    };

    return Array.from({ length: 10 }, (_, i) => {
        const weekNum = i + 3;
        const weekData = weekObjectives[weekNum];
        return {
            id: weekNum,
            title: `Week ${weekNum}`,
            description: weekData.theme,
            isLocked: true,
            isCompleted: false,
            days: Array.from({ length: 7 }, (_, d) => ({
                day: d + 1,
                tasks: [
                    task(weekNum, d + 1, 1, weekData.tasks[d][0], 75),
                    task(weekNum, d + 1, 2, weekData.tasks[d][1], 50),
                    task(weekNum, d + 1, 3, weekData.tasks[d][2], 25)
                ]
            }))
        };
    });
}

// Get roadmap for a specific niche
export function getNicheRoadmap(nicheId: NicheType): Week[] {
    const roadmaps: Record<NicheType, Week[]> = {
        'content-creator': CONTENT_CREATOR_ROADMAP,
        'dropshipping': DROPSHIPPING_ROADMAP,
        'freelancing': FREELANCING_ROADMAP,
        'saas': SAAS_ROADMAP,
        'appointment-setting': APPOINTMENT_SETTING_ROADMAP,
        'sales-closing': SALES_CLOSING_ROADMAP,
        'cold-calling': COLD_CALLING_ROADMAP,
        'baking': BAKING_ROADMAP,
        'nail-tech': NAIL_TECH_ROADMAP,
        'hair-stylist': HAIR_STYLIST_ROADMAP,
        'coaching': FREELANCING_ROADMAP, // Reuse freelancing pattern
        'ecommerce': DROPSHIPPING_ROADMAP, // Similar to dropshipping
        'affiliate-marketing': CONTENT_CREATOR_ROADMAP, // Similar content focus
        'tutoring': FREELANCING_ROADMAP, // Similar pattern
        'photography': FREELANCING_ROADMAP, // Similar pattern
        'general': FREELANCING_ROADMAP // Default fallback
    };

    return roadmaps[nicheId] || roadmaps['general'];
}
