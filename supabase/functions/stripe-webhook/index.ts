
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") as string, {
    apiVersion: "2023-10-16",
    httpClient: Stripe.createFetchHttpClient(),
});

// IMPORTANT: This must match the signing secret in your Stripe Dashboard for this webhook endpoint
const endpointSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

Deno.serve(async (req) => {
    const signature = req.headers.get("Stripe-Signature");

    if (!signature || !endpointSecret) {
        return new Response("Missing signature or secret", { status: 400 });
    }

    let event;
    try {
        const body = await req.text();
        event = await stripe.webhooks.constructEventAsync(body, signature, endpointSecret);
    } catch (err: any) {
        console.error(`Webhook signature verification failed: ${err.message}`);
        return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }

    // Handle the event
    console.log(`Received event: ${event.type}`);

    // Initialize Supabase Admin Client (Service Role)
    const supabaseAdmin = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    try {
        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object;
                const customerEmail = session.customer_details?.email;
                const customerId = session.customer; // Stripe Customer ID

                // 1. Try to find user by ID from metadata
                const userId = session.metadata?.user_id;

                if (userId) {
                    console.log(`Upgrading user by ID: ${userId}`);
                    const { error: updateError } = await supabaseAdmin
                        .from("profiles")
                        .update({
                            is_pro: true,
                            stripe_customer_id: customerId,
                            pro_since: new Date().toISOString()
                        })
                        .eq("id", userId);

                    if (updateError) console.error("Profile update failed:", updateError);
                    else console.log(`User ${userId} upgraded to Pro!`);

                } else if (customerEmail) {
                    // 2. Fallback: Find user by email
                    console.log(`Upgrading user by Email: ${customerEmail}`);

                    const { data: { users }, error: userError } = await supabaseAdmin.auth.admin.listUsers();

                    if (userError || !users) {
                        console.error("Failed to list users", userError);
                        throw new Error("User lookup failed");
                    }

                    const user = users.find(u => u.email?.toLowerCase() === customerEmail.toLowerCase());

                    if (user) {
                        const { error: updateError } = await supabaseAdmin
                            .from("profiles")
                            .update({
                                is_pro: true,
                                stripe_customer_id: customerId,
                                pro_since: new Date().toISOString()
                            })
                            .eq("id", user.id);

                        if (updateError) console.error("Profile update failed:", updateError);
                        else console.log(`User ${user.id} upgraded to Pro!`);
                    } else {
                        console.warn(`No user found for email: ${customerEmail}`);
                    }
                }
                break;
            }

            case "customer.subscription.deleted": {
                const subscription = event.data.object;
                const customerId = subscription.customer;

                console.log(`Downgrading customer: ${customerId}`);

                // Find profile by stripe_customer_id and remove Pro status
                const { error: downError } = await supabaseAdmin
                    .from("profiles")
                    .update({ is_pro: false })
                    .eq("stripe_customer_id", customerId);

                if (downError) console.error("Downgrade failed:", downError);
                break;
            }

            default:
            // Unhandled event type
        }
    } catch (err: any) {
        console.error(`Error processing webhook: ${err.message}`);
        return new Response(`Error: ${err.message}`, { status: 400 });
    }

    return new Response(JSON.stringify({ received: true }), {
        headers: { "Content-Type": "application/json" },
    });
});
