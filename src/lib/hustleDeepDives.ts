import type { NicheType } from './nicheRoadmaps';

export interface DeepDiveContent {
    title: string;
    description: string;
    breakdown: string; // Long form text with markdown-like formatting (paragraphs)
}

export const HUSTLE_DEEP_DIVES: Record<NicheType, DeepDiveContent> = {
    'content-creator': {
        title: 'The Content Creator Blueprint',
        description: 'Building a personal brand and monetizing your audience.',
        breakdown: `
            Becoming a successful Content Creator is more than just posting random videos. It's about building a media company of one. 
            
            **The Core Strategy:**
            Your goal is to become a "Topic Authority". This means owning a specific niche so completely that when people think of that topic, they think of you. Whether it's tech reviews, cooking, or lifestyle, clarity is your best asset.

            **Income Streams:**
            1. **Ad Revenue:** YouTube AdSense, TikTok Creator Fund. (Volume based)
            2. **Sponsorships:** Brands pay you to mention them. This is often the biggest earner for mid-sized creators.
            3. **Affiliate Marketing:** Earning commissions by recommending tools you use.
            4. **Digital Products:** Selling your own guides, courses, or templates (highest margin).

            **Getting Started Properly:**
            Don't aim for viral hits. Aim for a "Bingeable Library". Create content that answers specific questions people are searching for. This gives you long-term traffic (SEO) rather than just short-term spikes.
        `
    },
    'dropshipping': {
        title: 'E-Commerce Dropshipping Mastery',
        description: 'Selling products without holding inventory.',
        breakdown: `
            Dropshipping is a fulfillment method, not a business model itself. You are essentially a marketer. Your job is to connect a customer with a product they want, mark up the price, and keep the difference.

            **The Winning Formula:**
            Product + Offer + Creative = Sales.
            1. **Product:** Needs to solve a problem or have a "Wow" factor.
            2. **Offer:** "50% Off Today" isn't enough. Bundles, guarantees, and urgency (e.g., "Free Shipping Ends Soon") increase conversion.
            3. **Creative:** Your ad video is more important than your website. It needs to stop the scroll in 3 seconds.

            **Common Trap:**
            Selling generic products from AliExpress with 4-week shipping times. The modern dropshipper uses local suppliers (US/EU warehouses) or specialized agents to get shipping times down to 5-10 days. Branding is how you survive long-term.
        `
    },
    'freelancing': {
        title: 'High-Ticket Freelancing',
        description: 'Trading specialized skills for premium rates.',
        breakdown: `
            Freelancing is the fastest way to $5k/month because you don't need to build a product. You are selling a service.

            **Positioning:**
            Don't be a "Generalist". Don't say "I do graphic design." Say "I design high-converting landing pages for SaaS companies." Specialists get paid 3x more than generalists.

            **Client Acquisition:**
            1. **Outbound:** Cold emailing or DMing potential clients.
            2. **Inbound:** Creating content on LinkedIn/Twitter about your expertise.
            3. **Platforms:** Upwork/Fiverr (good for starting, but move off-platform eventually to avoid fees).

            **Scaling:**
            Once you are fully booked, you raise your prices. When you're booked again, you hire a junior freelancer to help you, turning your freelance gig into an Agency.
        `
    },
    'saas': {
        title: 'Micro-SaaS Founder',
        description: 'Building software solutions for recurring revenue.',
        breakdown: `
            SaaS (Software as a Service) is the holy grail of business models because of **Recurring Revenue** (MRR). You build it once, and customers pay you every month.

            **The Micro-SaaS Approach:**
            Instead of trying to build the next Salesforce or Slack, build a tiny tool that solves ONE specific pain point for a specific group of people. 
            Example: A Shopify plugin that helps pet stores track expiration dates.

            **Validation First:**
            Do not write a single line of code until you have talked to 10 potential customers who say "Yes, I would pay for that." Pre-sales are the ultimate validation.

            **Tech Stack:**
            Use what you know. React, Node, Python, or even No-Code tools like Bubble if you aren't a developer. The customer doesn't care about your code; they care about the solution.
        `
    },
    'appointment-setting': {
        title: 'Remote Appointment Setting',
        description: 'The gateway drug to high-ticket sales.',
        breakdown: `
            Appointment Setting is effectively "Sales Development". Your job is not to close the deal, but to open the door. You contact leads (often warm leads who interacted with an ad) and schedule them for a call with a Closer.

            **Why It Works:**
            Coaches, agencies, and course creators are great at marketing but bad at follow-up. They lose millions in "dead leads". You recover that money for them.

            **The Day-to-Day:**
            You live in the DMs (Instagram, LinkedIn, Email). You start conversations, qualify the person (do they have money? do they have the problem?), and book the call.

            **Compensation:**
            Usually a base Pay + Commission (e.g., $50-$100 per booked call that shows up, or % of closed revenue).
        `
    },
    'sales-closing': {
        title: 'High-Ticket Remote Closing',
        description: 'Closing deals for $1,000 to $50,000 products.',
        breakdown: `
            If Appointment Setting is the assist, Closing is the slam dunk. You get on Zoom calls with qualified prospects and help them make a buying decision.

            **The Math:**
            If you sell a $5,000 coaching program at 10% commission, you satisfy one customer and make $500. Do that once a day, and you're making $15k/month.

            **Skillset:**
            This isn't "Wolf of Wall Street" aggressive selling. It's consultative. It's about deep listening, understanding the prospect's pain, and showing them that your solution bridges the gap from where they are to where they want to be.

            **Finding Gigs:**
            Look for established offers (course creators, agencies) that already have marketing funnels running. They need Closers to handle the volume.
        `
    },
    'cold-calling': {
        title: 'Outbound Sales Specialist',
        description: 'Mastering the art of the cold outreach.',
        breakdown: `
            Cold Calling is the hardest but most valuable skill in sales. If you can pick up the phone and generate business from thin air, you will never be broke.

            **The Mindset:**
            Rejection is guaranteed. You need a "thick skin". Success is a numbers game. 100 dials -> 10 conversations -> 1 meeting.

            **The Script:**
            The first 10 seconds are critical. You need to interrupt the pattern. Don't sound like a telemarketer. Be sharp, to the point, and ask for permission to speak or drop a value hook immediately.

            **Industries:**
            Real Estate, Insurance, and SaaS are the biggest industries for cold callers.
        `
    },
    'baking': {
        title: 'Home Bakery Entrepreneur',
        description: 'Turning your kitchen into a profit center.',
        breakdown: `
            The Cottage Food laws in many areas now allow you to sell baked goods from home without a commercial kitchen. This lowers the barrier to entry significantly.

            **Niche Down:**
            Don't just be "a baker". Be the "Gluten-Free Wedding Cake Specialist" or the "Custom Decorated Sugar Cookie Artist". Specificity allows you to charge premium prices.

            **Visual Marketing:**
            People eat with their eyes first. Your Instagram photography must be top-tier. Great lighting and consistent aesthetics are non-negotiable.

            **Operations:**
            The challenge isn't baking; it's logistics. Managing orders, packaging, pickups/deliveries, and costing your ingredients properly so you actually make a profit on that $4 cupcake.
        `
    },
    'nail-tech': {
        title: 'Independent Nail Artist',
        description: 'Artistry meets service industry.',
        breakdown: `
            Nails have exploded into high art. Clients are loyal; if you are good, they come back every 3 weeks like clockwork.

            **Retention is Key:**
            Your business is built on recurring revenue. One client = $60-$100 every 3 weeks = ~$1,500/year. You only need about 50 regular clients to be fully booked.

            **Social Media:**
            TikTok and Reels are massive for nail techs. Post your "Process" videos. Show the transformation. Use local hashtags (#CityNails) to get discovered by clients in your area.
        `
    },
    'hair-stylist': {
        title: 'Freelance Hair Stylist',
        description: 'Building a personal brand in beauty.',
        breakdown: `
            Moving from a commission salon to a booth rental or home studio is where the real money is. You keep 100% of the profit (minus rent/supplies).

            **Specialization:**
            "Blonding Specialist", "Curly Hair Expert", "Extensions Pro". Specialists charge $100/hr+. Generalists charge $30.

            **The Client Experience:**
            It's not just a haircut; it's therapy and a confidence boost. The environment, your conversation, and the vibe you curate are what justify higher prices.
        `
    },
    'lash-tech': {
        title: 'Lash Extension Specialist',
        description: 'High-margin beauty service with recurring appointments.',
        breakdown: `
            Lash extensions are addictive. Once a client gets used to waking up "ready", they don't want to stop. This creates incredible customer lifetime value (LTV).

            **The Economics:**
            Full sets take time (2-3 hrs) and cost money ($150-$200+). Fills take less time (1 hr) and maintain the look ($60-$90). 

            **Safety First:**
            Your reputation hangs on safety. Isolation must be perfect to prevent damage to natural lashes. One bad review about an eye infection can kill your business. Focus on hygiene and technique above speed initially.
        `
    },
    'digital-products': {
        title: 'Digital Product Mogul',
        description: 'Create once, sell forever. The ultimate leverage.',
        breakdown: `
            Digital products (Ebooks, Templates, Presets) have 0% marginal cost. Selling 1 copy costs the same as selling 1,000 copies.

            **The "Bridge" Product:**
            Your product should bridge the gap between a problem and a solution. 
            Example: Problem = "My Notion is disorganized." Solution = "The Ultimate Life Planner Template."

            **Distribution:**
            You need traffic. You can build an audience (TikTok/IG) or buy traffic (Ads). The "Organic Content" route is slower but higher profit margin.
            
            **Platform:**
            Gumroad, Stan Store, or Lemon Squeezy handles the payments and file delivery so you don't have to.
        `
    },
    'day-trading': {
        title: 'Day Trader',
        description: 'Extracting profit from market volatility.',
        breakdown: `
            Warning: This is the hardest way to make easy money. 90% of traders fail because they treat it like gambling, not a business.

            **Risk Management:**
            This is the ONLY thing that matters. You can be wrong 50% of the time and still make money if your winners are 3x bigger than your losers. Never risk more than 1-2% of your account on a single trade.

            **The Edge:**
            You need a mechanical strategy. "I buy when price crosses VWAP and RSI is oversold." If you trade based on "feeling", you will lose.

            **The Psychology:**
            FOMO (Fear of Missing Out) and Revenge Trading (trying to win back losses) are the enemy. Discipline is your superpower.
        `
    },
    'crypto': {
        title: 'Crypto Investor & DeFi User',
        description: 'Navigating the frontier of finance.',
        breakdown: `
            Crypto offers asymmetric upside (small investment, huge potential return) but comes with extreme volatility and risk.

            **Narratives:**
            Crypto runs on narratives (AI coins, Meme coins, Real World Assets). Identifying where the attention is flowing before the masses do is how you catch the 10x moves.

            **DeFi (Decentralized Finance):**
            Instead of letting your coins sit idle, you can "Farm" yields by providing liquidity or lending them out. This generates passive income on top of price appreciation.

            **Security:**
            "Not your keys, not your coins." Learning self-custody (Hardware wallets) is not optional. It is mandatory to avoid exchange collapses (like FTX).
        `
    },
    'real-estate': {
        title: 'Real Estate Wholesaler',
        description: 'Flipping contracts, not houses.',
        breakdown: `
            Wholesaling is how you get into Real Estate with no money. You are finding a good deal, getting it under contract, and then selling that *contract* to a cash buyer for a fee (e.g., $10k).

            **The Skill:**
            It's a sales and marketing game. You are looking for "Distressed Sellers" (Divorce, Foreclosure, Inherited house, heavy repairs needed). They trade equity for speed and convenience.

            **Driving for Dollars:**
            Driving around neighborhoods looking for ugly houses (tall grass, boarded windows) is the highest ROI activity for beginners. Write down the address, skip trace the owner, and call them.
        `
    },
    // Fallbacks just in case
    'coaching': {
        title: 'Expert Coach',
        description: 'Monetizing your life experience.',
        breakdown: 'Coaching is freelancing your wisdom. Identify a transformation you have achieved (e.g., "I lost 50lbs", "I scaled a business") and sell the roadmap to others.'
    },
    'ecommerce': {
        title: 'E-Commerce Brand Owner',
        description: 'Building a physical product brand.',
        breakdown: 'Unlike dropshipping, you hold inventory and build a real brand asset. Focus on product quality, unboxing experience, and customer retention.'
    },
    'affiliate-marketing': {
        title: 'Affiliate Marketer',
        description: 'Connecting audiences to products.',
        breakdown: 'Find products with high commissions (software/SaaS is great for recurring comms). Create content that attracts people searching for those solutions (Reviews, Tutorials).'
    },
    'tutoring': {
        title: 'Private Tutor',
        description: 'Academic assistance.',
        breakdown: 'High-end tutoring (SAT/ACT prep, College/University level) pays $50-$100/hr. Marketing to parents is key.'
    },
    'photography': {
        title: 'Professional Photographer',
        description: 'Capturing moments for money.',
        breakdown: 'Niche down: Weddings pay the most ($3k/day) but are high stress. Product photography for e-commerce brands is scalable and can be done from home.'
    },
    'general': {
        title: 'The General Hustler',
        description: 'Exploring opportunities.',
        breakdown: 'You are currently exploring. Pick a niche to get a specific deep dive.'
    }
};
