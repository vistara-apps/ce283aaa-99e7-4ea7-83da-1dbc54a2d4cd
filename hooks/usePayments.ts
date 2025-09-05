import { useState, useCallback } from "react";
import { loadStripe, Stripe, StripeElements } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

interface PaymentIntentData {
  amount: number;
  currency?: "usd";
  userId: string;
  guideId?: string;
  subscriptionType?: "monthly" | "yearly";
  metadata?: Record<string, string>;
}

interface UsePaymentsOptions {
  onPaymentSuccess?: (paymentIntent: any) => void;
  onPaymentError?: (error: Error) => void;
}

export function usePayments(options: UsePaymentsOptions = {}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const createPaymentIntent = useCallback(
    async (data: PaymentIntentData) => {
      try {
        setIsProcessing(true);
        setPaymentError(null);

        const response = await fetch("/api/payments/create-intent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error || "Failed to create payment intent");
        }

        setClientSecret(result.data.clientSecret);
        return result.data;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Payment failed";
        setPaymentError(errorMessage);
        options.onPaymentError?.(error as Error);
        throw error;
      } finally {
        setIsProcessing(false);
      }
    },
    [options],
  );

  const confirmPayment = useCallback(
    async (
      elements: StripeElements,
      confirmationData?: {
        return_url?: string;
        payment_method_data?: {
          billing_details?: {
            name?: string;
            email?: string;
            phone?: string;
          };
        };
      },
    ) => {
      if (!clientSecret) {
        throw new Error("No payment intent created");
      }

      try {
        setIsProcessing(true);
        setPaymentError(null);

        const stripe = await stripePromise;
        if (!stripe) {
          throw new Error("Stripe failed to load");
        }

        const { error, paymentIntent } = await stripe.confirmPayment({
          elements,
          clientSecret,
          confirmParams: {
            return_url:
              confirmationData?.return_url ||
              `${window.location.origin}/payment-success`,
            ...(confirmationData?.payment_method_data && {
              payment_method_data: confirmationData.payment_method_data,
            }),
          },
          redirect: "if_required",
        });

        if (error) {
          throw new Error(error.message || "Payment confirmation failed");
        }

        if (paymentIntent && paymentIntent.status === "succeeded") {
          options.onPaymentSuccess?.(paymentIntent);
          return paymentIntent;
        }

        return paymentIntent;
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Payment confirmation failed";
        setPaymentError(errorMessage);
        options.onPaymentError?.(error as Error);
        throw error;
      } finally {
        setIsProcessing(false);
      }
    },
    [clientSecret, options],
  );

  const processOneTimePayment = useCallback(
    async (
      elements: StripeElements,
      paymentData: PaymentIntentData,
      confirmationData?: Parameters<typeof confirmPayment>[1],
    ) => {
      try {
        // Create payment intent
        await createPaymentIntent(paymentData);

        // Confirm payment
        const result = await confirmPayment(elements, confirmationData);

        return result;
      } catch (error) {
        throw error;
      }
    },
    [createPaymentIntent, confirmPayment],
  );

  const purchaseStateGuide = useCallback(
    async (
      elements: StripeElements,
      userId: string,
      guideId: string,
      amount: number,
      userDetails?: {
        name?: string;
        email?: string;
      },
    ) => {
      return processOneTimePayment(
        elements,
        {
          amount,
          userId,
          guideId,
          metadata: {
            type: "state_guide_purchase",
            guideId,
          },
        },
        {
          payment_method_data: {
            billing_details: userDetails,
          },
        },
      );
    },
    [processOneTimePayment],
  );

  const createSubscription = useCallback(
    async (
      elements: StripeElements,
      userId: string,
      subscriptionType: "monthly" | "yearly",
      amount: number,
      userDetails?: {
        name?: string;
        email?: string;
      },
    ) => {
      return processOneTimePayment(
        elements,
        {
          amount,
          userId,
          subscriptionType,
          metadata: {
            type: "subscription",
            subscriptionType,
          },
        },
        {
          payment_method_data: {
            billing_details: userDetails,
          },
        },
      );
    },
    [processOneTimePayment],
  );

  const getPaymentStatus = useCallback(async (paymentIntentId: string) => {
    try {
      const response = await fetch(
        `/api/payments/create-intent?paymentIntentId=${paymentIntentId}`,
      );
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to get payment status");
      }

      return result.data;
    } catch (error) {
      console.error("Error getting payment status:", error);
      throw error;
    }
  }, []);

  const resetPayment = useCallback(() => {
    setClientSecret(null);
    setPaymentError(null);
    setIsProcessing(false);
  }, []);

  return {
    // State
    isProcessing,
    paymentError,
    clientSecret,

    // Actions
    createPaymentIntent,
    confirmPayment,
    processOneTimePayment,
    purchaseStateGuide,
    createSubscription,
    getPaymentStatus,
    resetPayment,

    // Utilities
    stripePromise,
  };
}
