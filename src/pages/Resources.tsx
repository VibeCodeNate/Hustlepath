import { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { ResourceCard, type Resource } from '../components/ResourceCard';
import { Button } from '../components/Button';
import { ArrowLeft, BookOpen, Search, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';

// STATIC DATA FOR MVP
const MOCK_RESOURCES: Resource[] = [
    {
        id: '1',
        title: 'The Ultimate Side Hustle Checklist',
        description: 'A 20-point checklist to launch your business in 48 hours.',
        type: 'pdf',
        url: '#',
        isPremium: false
    },
    {
        id: '2',
        title: 'Finding Your Niche (Masterclass)',
        description: 'How to identify high-profit, low-competition markets.',
        type: 'video',
        url: '#',
        duration: '15:42',
        isPremium: false
    },
    {
        id: '3',
        title: 'Top 10 Tools for Solo Founders',
        description: 'Software stack that saves me 20 hours a week.',
        type: 'article',
        url: '#',
        isPremium: false
    },
    {
        id: '4',
        title: 'Advanced Pricing Strategies',
        description: 'Psychomagic pricing to double your conversion rate.',
        type: 'video',
        url: '#',
        duration: '42:10',
        isPremium: true
    },
    {
        id: '5',
        title: 'Tax & Legal Guide 2024',
        description: 'What every side hustler needs to know about the IRS.',
        type: 'pdf',
        url: '#',
        isPremium: true
    },
    {
        id: '6',
        title: 'Viral Content Templates',
        description: '50 Plug-and-play hooks for TikTok and Reels.',
        type: 'tool',
        url: '#',
        isPremium: true
    }
];

export function Resources() {
    const navigate = useNavigate();
    const { profile } = useAuth();
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState<'all' | 'video' | 'article' | 'tool'>('all');

    // Filter resources
    const filteredResources = MOCK_RESOURCES.filter(r => {
        const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === 'all' || r.type === filter || (filter === 'tool' && (r.type === 'tool' || r.type === 'pdf'));
        return matchesSearch && matchesFilter;
    });

    const isPro = profile?.is_pro || false; // Assume false for mostly everyone unless they paid

    return (
        <div className="min-h-screen bg-background pb-20">
            <Navbar />

            <div className="container mx-auto px-4 pt-20 md:pt-24">
                {/* Header */}
                <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
                    <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2 md:gap-3">
                            <BookOpen className="w-6 h-6 md:w-8 md:h-8 text-primary" />
                            Knowledge Base
                        </h1>
                        <p className="text-sm md:text-base text-muted-foreground">Curated tools and guides for your journey.</p>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex flex-col md:flex-row gap-4 mb-8 bg-white/5 p-4 rounded-2xl border border-white/10">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                        <input
                            type="text"
                            placeholder="Search resources..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-black/20 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-primary/50"
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                        {['all', 'video', 'article', 'tool'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f as any)}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors capitalize whitespace-nowrap ${filter === f
                                    ? 'bg-primary text-black'
                                    : 'bg-black/20 text-white/60 hover:text-white'
                                    }`}
                            >
                                {f === 'tool' ? 'Tools & PDFs' : f + 's'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredResources.map(resource => (
                        <ResourceCard key={resource.id} resource={resource} isPro={isPro} />
                    ))}
                </div>

                {/* Upsell if not Pro */}
                {!isPro && (
                    <div className="mt-12 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-3xl p-8 border border-white/10 text-center relative overflow-hidden">
                        <div className="relative z-10">
                            <Sparkles className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold mb-2">Unlock Pro Resources</h2>
                            <p className="text-white/70 max-w-md mx-auto mb-6">
                                Get access to advanced pricing strategies, legal guides, and our viral content templates.
                            </p>
                            <Button className="bg-white text-black hover:bg-white/90">
                                Upgrade to Pro - $5/mo
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
