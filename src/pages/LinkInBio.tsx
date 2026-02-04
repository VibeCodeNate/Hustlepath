import React from 'react';
import { motion } from 'framer-motion';
import {
    Instagram,
    Twitter,
    Linkedin,
    ArrowRight,
    ExternalLink,
    Mail
} from 'lucide-react';

const LinkInBio = () => {
    const profile = {
        name: "@YourName",
        bio: "Building meaningful digital products.\nSharing my journey to $1M ARR. 🚀",
        image: "https://ui-avatars.com/api/?name=User&background=6d28d9&color=fff&size=200"
    };

    const links = [
        {
            id: 1,
            title: "🔥 Get the Ultimate Side Hustle Guide",
            url: "#",
            featured: true
        },
        {
            id: 2,
            title: "Join the Community",
            url: "#",
            featured: false
        },
        {
            id: 3,
            title: "Book a 1:1 Consultation",
            url: "#",
            featured: false
        },
        {
            id: 4,
            title: "Read my latest Newsletter",
            url: "#",
            featured: false
        }
    ];

    const socialLinks = [
        { icon: <Instagram size={20} />, url: "#" },
        { icon: <Twitter size={20} />, url: "#" },
        { icon: <Linkedin size={20} />, url: "#" },
        { icon: <Mail size={20} />, url: "#" }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center py-16 px-4">

            <motion.div
                className="w-full max-w-md flex flex-col items-center gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Profile Section */}
                <motion.div variants={itemVariants} className="flex flex-col items-center text-center">
                    <div className="relative mb-4 group">
                        <div className="absolute inset-0 bg-purple-600 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                        <img
                            src={profile.image}
                            alt="Profile"
                            className="w-28 h-28 rounded-full border-2 border-purple-500 relative z-10 object-cover shadow-2xl"
                        />
                    </div>

                    <h1 className="text-2xl font-bold mb-2 tracking-tight">{profile.name}</h1>
                    <p className="text-neutral-400 text-sm whitespace-pre-line leading-relaxed max-w-xs">
                        {profile.bio}
                    </p>
                </motion.div>

                {/* Social Icons */}
                <motion.div variants={itemVariants} className="flex gap-4 mb-2">
                    {socialLinks.map((social, idx) => (
                        <a
                            key={idx}
                            href={social.url}
                            className="p-2 text-neutral-400 hover:text-white hover:bg-white/5 rounded-full transition-all duration-300 transform hover:-translate-y-1"
                        >
                            {social.icon}
                        </a>
                    ))}
                </motion.div>

                {/* Links Section */}
                <div className="w-full flex flex-col gap-4">
                    {links.map((link) => (
                        <motion.a
                            key={link.id}
                            variants={itemVariants}
                            href={link.url}
                            className={`
                relative group flex items-center justify-between p-4 rounded-xl border backdrop-blur-sm transition-all duration-300
                ${link.featured
                                    ? 'bg-purple-900/40 border-purple-500/30 hover:bg-purple-900/60 hover:shadow-[0_0_20px_rgba(109,40,217,0.3)]'
                                    : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10 hover:translate-y-[-2px]'
                                }
              `}
                        >
                            <div className="flex flex-col">
                                <span className={`font-medium ${link.featured ? 'text-white' : 'text-neutral-200'} group-hover:text-white transition-colors`}>
                                    {link.title}
                                </span>
                            </div>

                            <div className={`
                ${link.featured ? 'text-purple-300' : 'text-neutral-500'} 
                group-hover:translate-x-1 transition-transform duration-300
              `}>
                                {link.featured ? <ArrowRight size={20} /> : <ExternalLink size={18} />}
                            </div>
                        </motion.a>
                    ))}
                </div>

                {/* Footer */}
                <motion.div variants={itemVariants} className="mt-12 text-center text-xs text-neutral-600">
                    <p>© 2026 {profile.name.replace('@', '')}. All rights reserved.</p>
                </motion.div>

            </motion.div>
        </div>
    );
};

export default LinkInBio;
