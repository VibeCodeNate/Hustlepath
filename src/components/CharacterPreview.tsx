// Avatar Configuration Type
export interface AvatarConfig {
    skinColor: string;
    hairStyle: 'short' | 'long' | 'mohawk' | 'bald';
    hairColor: string;
    topColor: string;
    bottomColor: string;
    accessory: 'none' | 'glasses' | 'hat' | 'headphones';
    background: string;
}

export const DEFAULT_AVATAR: AvatarConfig = {
    skinColor: '#f5d0b0',
    hairStyle: 'short',
    hairColor: '#4a3000',
    topColor: '#BEF264', // Primary Text Color
    bottomColor: '#1e293b',
    accessory: 'none',
    background: 'bg-black/20'
};

interface CharacterPreviewProps {
    config?: AvatarConfig;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

export function CharacterPreview({ config = DEFAULT_AVATAR, size = 'md', className = '' }: CharacterPreviewProps) {
    const sizeMap = {
        sm: { w: 40, h: 40, scale: 0.5 },
        md: { w: 80, h: 80, scale: 1 },
        lg: { w: 160, h: 160, scale: 2 },
        xl: { w: 320, h: 320, scale: 4 }
    };

    const { w, h, scale } = sizeMap[size];

    return (
        <div
            className={`relative rounded-xl overflow-hidden flex items-center justify-center ${config.background} ${className}`}
            style={{ width: w, height: h }}
        >
            <div style={{ transform: `scale(${scale})` }}>
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="pixel-art">
                    {/* Shadow */}
                    <ellipse cx="32" cy="58" rx="16" ry="4" fill="black" fillOpacity="0.2" />

                    {/* Body/Head */}
                    <rect x="24" y="20" width="16" height="14" fill={config.skinColor} />
                    {/* Neck */}
                    <rect x="29" y="34" width="6" height="4" fill={config.skinColor} fillOpacity="0.9" />

                    {/* Hair */}
                    {config.hairStyle === 'short' && (
                        <>
                            <rect x="22" y="16" width="20" height="6" fill={config.hairColor} />
                            <rect x="22" y="20" width="4" height="6" fill={config.hairColor} />
                            <rect x="38" y="20" width="4" height="6" fill={config.hairColor} />
                        </>
                    )}
                    {config.hairStyle === 'long' && (
                        <>
                            <rect x="22" y="16" width="20" height="8" fill={config.hairColor} />
                            <rect x="20" y="20" width="6" height="16" fill={config.hairColor} />
                            <rect x="38" y="20" width="6" height="16" fill={config.hairColor} />
                        </>
                    )}
                    {config.hairStyle === 'mohawk' && (
                        <>
                            <rect x="28" y="12" width="8" height="10" fill={config.hairColor} />
                        </>
                    )}

                    {/* Face */}
                    <rect x="27" y="25" width="2" height="2" fill="#1a1a1a" /> {/* Left Eye */}
                    <rect x="35" y="25" width="2" height="2" fill="#1a1a1a" /> {/* Right Eye */}
                    <rect x="30" y="30" width="4" height="1" fill="#c2745e" /> {/* Mouth */}

                    {/* Torso */}
                    <path d="M20 38 L44 38 L44 50 L20 50 Z" fill={config.topColor} />
                    {/* Arms */}
                    <rect x="16" y="38" width="4" height="10" fill={config.skinColor} />
                    <rect x="44" y="38" width="4" height="10" fill={config.skinColor} />

                    {/* Legs */}
                    <rect x="24" y="50" width="6" height="10" fill={config.bottomColor} />
                    <rect x="34" y="50" width="6" height="10" fill={config.bottomColor} />

                    {/* Accessories */}
                    {config.accessory === 'glasses' && (
                        <g>
                            <rect x="26" y="24" width="4" height="4" fill="black" fillOpacity="0.5" />
                            <rect x="34" y="24" width="4" height="4" fill="black" fillOpacity="0.5" />
                            <rect x="30" y="25" width="4" height="1" fill="black" />
                        </g>
                    )}
                    {config.accessory === 'hat' && (
                        <g>
                            <rect x="20" y="14" width="24" height="4" fill="#333" />
                            <rect x="22" y="10" width="20" height="4" fill="#333" />
                        </g>
                    )}
                    {config.accessory === 'headphones' && (
                        <g>
                            <rect x="18" y="22" width="4" height="8" fill="#444" />
                            <rect x="42" y="22" width="4" height="8" fill="#444" />
                            <rect x="22" y="14" width="20" height="2" fill="#444" />
                        </g>
                    )}
                </svg>
            </div>
        </div>
    );
}
