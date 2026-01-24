import { Navbar } from '../components/Navbar';
import { CharacterCreator } from '../components/CharacterCreator';
import { motion } from 'framer-motion';
import { Palette, ArrowLeft } from 'lucide-react';
import { Button } from '../components/Button';
import { useNavigate } from 'react-router-dom';

export function CharacterPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background pb-20">
            <Navbar />

            <div className="container mx-auto px-4 pt-20 md:pt-32">
                {/* Header */}
                <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-10">
                    <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2 md:gap-3">
                            <Palette className="w-6 h-6 md:w-8 md:h-8 text-primary" />
                            Character Studio
                        </h1>
                        <p className="text-sm md:text-base text-muted-foreground">Customize your hustle avatar.</p>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <CharacterCreator />
                </motion.div>
            </div>
        </div>
    );
}
