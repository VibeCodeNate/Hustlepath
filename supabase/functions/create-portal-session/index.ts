// Supabase Edge Function: create-portal-session
// Deno runtime for Supabase Edge Functions

import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";

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

        const origin = req.headers.get('origin') || 'http://localhost:5173';

        // Parse request body for email
        // In a production app, we should get the email from the JWT (req.headers.get('Authorization'))
        // For this MVP, we will accept it from the body to link the customer.
        const { email } = await req.json();

        if (!email) {
            throw new Error('Email is required to find subscription');
        }

        // 1. Find the customer by email
        const customers = await stripe.customers.list({
            email: email,
            limit: 1,
        });

        if (customers.data.length === 0) {
            throw new Error('No billing account found for this email. Have you upgraded to Pro yet?');
        }

        const customer = customers.data[0];

        // 2. Create Portal Session
        const session = await stripe.billingPortal.sessions.create({
            customer: customer.id,
            return_url: `${origin}/settings`,
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
        console.error('Portal Error:', errorMessage);

        return new Response(
            JSON.stringify({ error: errorMessage }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400,
            }
        );
    }
});
