import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { z } from 'zod';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

const createPaymentIntentSchema = z.object({
  amount: z.number().positive(),
  currency: z.enum(['usd']).default('usd'),
  userId: z.string(),
  guideId: z.string().optional(),
  subscriptionType: z.enum(['monthly', 'yearly']).optional(),
  metadata: z.record(z.string()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createPaymentIntentSchema.parse(body);

    const { amount, currency, userId, guideId, subscriptionType, metadata } = validatedData;

    // Create payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata: {
        userId,
        guideId: guideId || '',
        subscriptionType: subscriptionType || '',
        ...metadata,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Store payment intent in database (optional)
    // await supabaseHelpers.createPaymentIntent({
    //   intentId: paymentIntent.id,
    //   userId,
    //   amount,
    //   currency: currency.toUpperCase() as 'USD',
    //   status: 'pending',
    //   guideId,
    //   stripePaymentIntentId: paymentIntent.id,
    // });

    return NextResponse.json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      }
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { success: false, error: 'Payment processing error', details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const paymentIntentId = searchParams.get('paymentIntentId');

    if (!paymentIntentId) {
      return NextResponse.json(
        { success: false, error: 'Payment Intent ID is required' },
        { status: 400 }
      );
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    return NextResponse.json({
      success: true,
      data: {
        id: paymentIntent.id,
        status: paymentIntent.status,
        amount: paymentIntent.amount / 100, // Convert back to dollars
        currency: paymentIntent.currency,
        metadata: paymentIntent.metadata,
      }
    });
  } catch (error) {
    console.error('Error retrieving payment intent:', error);
    
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { success: false, error: 'Payment processing error', details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to retrieve payment intent' },
      { status: 500 }
    );
  }
}
