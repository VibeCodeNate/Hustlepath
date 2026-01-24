import { Check } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../lib/utils';

interface PricingCardProps {
    title: string;
    price: string;
    features: string[];
    isPopular?: boolean;
    ctaText: string;
    onCtaClick?: () => void;
}

export function PricingCard({ title, price, features, isPopular, ctaText, onCtaClick }: PricingCardProps) {
    return (
        <div className={cn(
            "relative rounded-3xl p-8 border hover:scale-105 transition-transform duration-300",
            isPopular
                ? "bg-card border-primary shadow-[0_0_40px_rgba(190,242,100,0.1)]"
                : "bg-card/50 border-white/5"
        )}>
            {isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-bold shadow-[0_0_20px_rgba(190,242,100,0.4)]">
                    MOST POPULAR
                </div>
            )}

            <div className="mb-8">
                <h3 className="text-lg font-medium text-muted-foreground mb-4">{title}</h3>
                <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-foreground">{price}</span>
                    {price !== 'Free' && <span className="text-muted-foreground">/month</span>}
                </div>
            </div>

            <ul className="space-y-4 mb-8">
                {features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-foreground/90">
                        <Check className="h-5 w-5 text-primary shrink-0" />
                        <span>{feature}</span>
                    </li>
                ))}
            </ul>

            <Button
                className="w-full"
                variant={isPopular ? 'primary' : 'secondary'}
                onClick={onCtaClick}
            >
                {ctaText}
            </Button>
        </div>
    );
}
