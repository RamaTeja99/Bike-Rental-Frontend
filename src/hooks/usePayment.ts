"use client";

import { useState } from "react";
import { paymentService } from "@/services/payment.service";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export function usePayment() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createOrder = async (bookingId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const orderData = await paymentService.createOrder(bookingId);
      return orderData;
    } catch (err: any) {
      const errorMsg = err.message || "Failed to create order";
      setError(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyPayment = async (data: any) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await paymentService.verifyPayment(data);
      return response;
    } catch (err: any) {
      const errorMsg = err.message || "Payment verification failed";
      setError(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  return {
    isLoading,
    error,
    createOrder,
    verifyPayment,
    loadRazorpayScript,
  };
}
