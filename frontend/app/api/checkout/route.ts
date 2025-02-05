import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(req: Request) {
  try {
    const { price, planType } = await req.json();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `ChessDetective ${planType} Plan`,
              description: planType === 'monthly'
                ? 'Monthly subscription to ChessDetective Premium'
                : 'Yearly subscription to ChessDetective Premium',
            },
            unit_amount: Math.round(parseFloat(price.replace('€', '')) * 100),
            recurring: {
              interval: planType === 'monthly' ? 'month' : 'year',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing?canceled=true`,
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (err) {
    console.error('Error:', err);
    return NextResponse.json(
      { error: 'Error creating checkout session' },
      { status: 500 }
    );
  }
}