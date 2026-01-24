import { useCallback } from 'react';

// Using a CDN or public assets for sounds would be ideal.
// For now, we'll try to use reliable short MP3s hosted on GitHub or similar,
// OR generate simple beeps using Web Audio API if no files are available.
// Since I can't guarantee external URL stability, I'll use the Web Audio API for a robust standalone solution.

class SoundManager {
    private ctx: AudioContext | null = null;
    private masterGain: GainNode | null = null;

    constructor() {
        if (typeof window !== 'undefined') {
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioContextClass) {
                this.ctx = new AudioContextClass();
                this.masterGain = this.ctx.createGain();
                this.masterGain.connect(this.ctx.destination);
                this.masterGain.gain.value = 0.3; // Default volume
            }
        }
    }

    private ensureContext() {
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    playTone(freq: number, type: OscillatorType, duration: number, startTime = 0) {
        if (!this.ctx || !this.masterGain) return;
        this.ensureContext();

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + startTime);

        gain.gain.setValueAtTime(0.3, this.ctx.currentTime + startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + startTime + duration);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(this.ctx.currentTime + startTime);
        osc.stop(this.ctx.currentTime + startTime + duration);
    }

    playClick() {
        // High pitched short tick
        this.playTone(800, 'sine', 0.05);
    }

    playSuccess() {
        // Simple rising arpeggio
        this.playTone(440, 'sine', 0.1);
        this.playTone(554, 'sine', 0.1, 0.1); // C#
        this.playTone(659, 'sine', 0.2, 0.2); // E
    }

    playXPGain() {
        // Coin-like sound
        this.playTone(987, 'square', 0.1);
        this.playTone(1318, 'square', 0.15, 0.05);
    }

    playLevelUp() {
        // Final Fantasy style victory fanfare (simplified)
        const now = 0;
        const note = 0.12;
        this.playTone(523.25, 'triangle', note, now); // C
        this.playTone(523.25, 'triangle', note, now + note); // C
        this.playTone(523.25, 'triangle', note, now + note * 2); // C
        this.playTone(523.25, 'triangle', 0.4, now + note * 3); // C (hold)
        this.playTone(415.30, 'triangle', 0.4, now + note * 3 + 0.4); // G#
        this.playTone(466.16, 'triangle', 0.4, now + note * 3 + 0.8); // A#
        this.playTone(523.25, 'triangle', 0.6, now + note * 3 + 1.2); // C
    }

    playError() {
        this.playTone(150, 'sawtooth', 0.3);
    }
}

// Singleton instance
const soundManager = new SoundManager();

export function useSound() {
    const play = useCallback((sound: 'click' | 'success' | 'xp' | 'levelUp' | 'error') => {
        try {
            switch (sound) {
                case 'click': soundManager.playClick(); break;
                case 'success': soundManager.playSuccess(); break;
                case 'xp': soundManager.playXPGain(); break;
                case 'levelUp': soundManager.playLevelUp(); break;
                case 'error': soundManager.playError(); break;
            }
        } catch (e) {
            console.error('Audio playback failed', e);
        }
    }, []);

    return { play };
}
