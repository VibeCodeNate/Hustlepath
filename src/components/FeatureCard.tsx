import type { LucideIcon } from 'lucide-react';
import { cn } from '../lib/utils';

interface FeatureCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
    className?: string;
}

export function FeatureCard({ icon: Icon, title, description, className }: FeatureCardProps) {
    return (
        <div className={cn("bg-card border border-white/5 rounded-2xl p-6 hover:border-primary/50 transition-colors group", className)}>
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Icon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-foreground">{title}</h3>
            <p className="text-muted-foreground leading-relaxed">
                {description}
            </p>
        </div>
    );
}
