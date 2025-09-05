import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseHelpers } from '@/lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature')!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;
      
      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
        break;
      
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;
      
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
      
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      
      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;
      
      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  try {
    const { userId, guideId } = paymentIntent.metadata;

    if (guideId && userId) {
      // Add the guide to user's paid guides
      const user = await supabaseHelpers.getUserById(userId);
      const updatedPaidGuides = [...(user.paid_state_guides || []), guideId];
      
      // Update user's paid guides (this would need to be implemented in supabaseHelpers)
      console.log(`User ${userId} successfully purchased guide ${guideId}`);
    }

    console.log(`Payment succeeded: ${paymentIntent.id}`);
  } catch (error) {
    console.error('Error handling payment success:', error);
  }
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  try {
    const { userId, guideId } = paymentIntent.metadata;
    
    console.log(`Payment failed for user ${userId}, guide ${guideId}: ${paymentIntent.id}`);
    
    // You might want to send a notification to the user or log this for analytics
  } catch (error) {
    console.error('Error handling payment failure:', error);
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  try {
    const customerId = subscription.customer as string;
    
    // Get customer details
    const customer = await stripe.customers.retrieve(customerId);
    
    if (customer.deleted) {
      console.error('Customer was deleted');
      return;
    }

    const userId = customer.metadata?.userId;
    
    if (userId) {
      console.log(`Subscription created for user ${userId}: ${subscription.id}`);
      // Update user's subscription status in database
    }
  } catch (error) {
    console.error('Error handling subscription creation:', error);
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  try {
    const customerId = subscription.customer as string;
    const customer = await stripe.customers.retrieve(customerId);
    
    if (customer.deleted) {
      console.error('Customer was deleted');
      return;
    }

    const userId = customer.metadata?.userId;
    
    if (userId) {
      console.log(`Subscription updated for user ${userId}: ${subscription.id}`);
      // Update user's subscription status in database
    }
  } catch (error) {
    console.error('Error handling subscription update:', error);
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  try {
    const customerId = subscription.customer as string;
    const customer = await stripe.customers.retrieve(customerId);
    
    if (customer.deleted) {
      console.error('Customer was deleted');
      return;
    }

    const userId = customer.metadata?.userId;
    
    if (userId) {
      console.log(`Subscription cancelled for user ${userId}: ${subscription.id}`);
      // Update user's subscription status in database
    }
  } catch (error) {
    console.error('Error handling subscription deletion:', error);
  }
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  try {
    const customerId = invoice.customer as string;
    const customer = await stripe.customers.retrieve(customerId);
    
    if (customer.deleted) {
      console.error('Customer was deleted');
      return;
    }

    const userId = customer.metadata?.userId;
    
    if (userId) {
      console.log(`Invoice payment succeeded for user ${userId}: ${invoice.id}`);
      // Update user's subscription status or extend access
    }
  } catch (error) {
    console.error('Error handling invoice payment success:', error);
  }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  try {
    const customerId = invoice.customer as string;
    const customer = await stripe.customers.retrieve(customerId);
    
    if (customer.deleted) {
      console.error('Customer was deleted');
      return;
    }

    const userId = customer.metadata?.userId;
    
    if (userId) {
      console.log(`Invoice payment failed for user ${userId}: ${invoice.id}`);
      // Handle failed payment (send notification, suspend access, etc.)
    }
  } catch (error) {
    console.error('Error handling invoice payment failure:', error);
  }
}
