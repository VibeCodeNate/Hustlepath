// @ts-nocheck
// Supabase Edge Function: create-checkout-session
// Deno runtime for Supabase Edge Functions

import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req: Request) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
        if (!stripeSecretKey) {
            throw new Error('Missing STRIPE_SECRET_KEY');
        }

        const stripe = new Stripe(stripeSecretKey, {
            apiVersion: '2023-10-16',
            httpClient: Stripe.createFetchHttpClient(),
        });

        // Parse request body
        let hustleTitle = 'HustlePath Pro';
        let returnUrl = req.headers.get('origin') || 'http://localhost:5173';

        try {
            const body = await req.json();
            if (body.hustleTitle) {
                hustleTitle = body.hustleTitle;
            }
            if (body.return_url) {
                returnUrl = body.return_url;
            }
            // Capture nicheId
            if (body.nicheId) {
                // We'll store this in a variable or just access it directly in metadata below
            }
        } catch {
            // No body or invalid JSON, use defaults
        }

        // Create Supabase client to get the user ID from the Authorization header
        // Note: standard Supabase Edge Function pattern uses Authorization: Bearer <token>
        // But we are Deno.serve. Let's rely on the token passed from client.

        // Actually, easiest way in Edge Functions to get user is:
        const authHeader = req.headers.get('Authorization')!;
        // We can decode JWT or just trust client passed it? No, verify.
        // Or simpler: pass user_id in body from client? NO, insecure.
        // We must verify token.

        // ... Wait, to use Supabase Client in Edge Function to getUser:
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            { global: { headers: { Authorization: authHeader } } }
        );

        const { data: { user } } = await supabaseClient.auth.getUser();

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            customer_email: user?.email, // Pre-fill email from auth
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'HustlePath Pro Access',
                            description: `Full mission data unlock for: ${hustleTitle}`,
                        },
                        unit_amount: 499, // $4.99 in cents
                        recurring: {
                            interval: 'month',
                        },
                    },
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${returnUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${returnUrl}/explainer`,
            metadata: {
                hustleTitle,
                nicheId: (await req.clone().json()).nicheId || 'general', // Get from body
                user_id: user?.id
            },
        });

        return new Response(
            JSON.stringify({ url: session.url }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            }
        );
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return new Response(
            JSON.stringify({ error: errorMessage }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400,
            }
        );
    }
});
