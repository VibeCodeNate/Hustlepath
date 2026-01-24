import { motion } from 'framer-motion';

interface MapPathProps {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    isCompleted: boolean;
    isActive: boolean;
}

export function MapPath({
    startX,
    startY,
    endX,
    endY,
    isCompleted,
    isActive
}: MapPathProps) {
    // Calculate path with curve
    const midX = (startX + endX) / 2;
    const midY = (startY + endY) / 2;

    // Add some curve variation based on position
    const curveOffset = ((startX + startY) % 3 - 1) * 3;
    const controlX = midX + curveOffset;
    const controlY = midY - Math.abs(curveOffset);

    const pathD = `M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`;

    const getPathColor = () => {
        if (isCompleted) return '#22c55e'; // green-500
        if (isActive) return '#bef264'; // primary
        return '#3f3f46'; // zinc-700
    };

    return (
        <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ overflow: 'visible' }}
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
        >
            {/* Background path */}
            <path
                d={pathD}
                fill="none"
                stroke="#27272a"
                strokeWidth="0.8"
                strokeLinecap="round"
            />

            {/* Animated progress path */}
            <motion.path
                d={pathD}
                fill="none"
                stroke={getPathColor()}
                strokeWidth="0.5"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: isCompleted || isActive ? 1 : 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className={isActive && !isCompleted ? 'path-animated' : ''}
            />

            {/* Glow effect for active paths */}
            {isActive && (
                <motion.path
                    d={pathD}
                    fill="none"
                    stroke={getPathColor()}
                    strokeWidth="2"
                    strokeLinecap="round"
                    opacity="0.2"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    style={{ filter: 'blur(4px)' }}
                />
            )}
        </svg>
    );
}
