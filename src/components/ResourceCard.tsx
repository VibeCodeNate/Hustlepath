import { motion } from 'framer-motion';
import { ExternalLink, Play, FileText, Download, Lock } from 'lucide-react';
import { Button } from './Button';

export interface Resource {
    id: string;
    title: string;
    description: string;
    type: 'video' | 'article' | 'pdf' | 'tool';
    url: string;
    thumbnail?: string;
    isPremium: boolean;
    duration?: string;
}

interface ResourceCardProps {
    resource: Resource;
    isPro: boolean;
}

export function ResourceCard({ resource, isPro }: ResourceCardProps) {
    const isLocked = resource.isPremium && !isPro;

    const Icon = {
        video: Play,
        article: FileText,
        pdf: Download,
        tool: ExternalLink
    }[resource.type];

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className={`group relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden flex flex-col ${isLocked ? 'opacity-75' : ''}`}
        >
            {/* Thumbnail / Header */}
            <div className={`h-32 bg-black/40 flex items-center justify-center relative overflow-hidden ${resource.thumbnail ? '' : 'bg-gradient-to-br from-primary/20 to-blue-500/20'}`}>
                {resource.thumbnail ? (
                    <img src={resource.thumbnail} alt={resource.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                ) : (
                    <Icon className="w-10 h-10 text-white/40 group-hover:text-primary transition-colors" />
                )}

                {resource.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform">
                            <Play className="w-4 h-4 ml-1 fill-white" />
                        </div>
                    </div>
                )}

                {isLocked && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex items-center justify-center">
                        <Lock className="w-8 h-8 text-white/60" />
                    </div>
                )}

                {resource.duration && (
                    <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/60 rounded text-[10px] font-mono">
                        {resource.duration}
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-primary/80 px-2 py-1 bg-primary/10 rounded">
                        {resource.type}
                    </span>
                    {resource.isPremium && (
                        <span className="text-[10px] uppercase font-bold tracking-wider text-yellow-400">
                            PRO
                        </span>
                    )}
                </div>

                <h3 className="font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {resource.title}
                </h3>
                <p className="text-sm text-white/50 mb-4 line-clamp-2 flex-1">
                    {resource.description}
                </p>

                <Button
                    variant={isLocked ? "ghost" : "outline"}
                    size="sm"
                    className="w-full mt-auto"
                    disabled={isLocked}
                    onClick={() => !isLocked && window.open(resource.url, '_blank')}
                >
                    {isLocked ? (
                        <>
                            <Lock className="w-3 h-3 mr-2" /> Locked
                        </>
                    ) : (
                        <>
                            {resource.type === 'pdf' ? 'Download' : 'Open'} <ExternalLink className="w-3 h-3 ml-2" />
                        </>
                    )}
                </Button>
            </div>
        </motion.div>
    );
}
