import OpenAI from 'openai';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

if (!apiKey) {
    console.warn('Missing OpenAI API key');
}

export const openai = new OpenAI({
    apiKey: apiKey || 'dummy',
    dangerouslyAllowBrowser: true // For MVP only - ideally move to backend later
});
