"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { usePayment } from "@/hooks/usePayment";
import { useBookings } from "@/hooks/useBookings";
import { useEffect, useState } from "react";
import { toast } from "sonner";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");

  const { createOrder, verifyPayment, loadRazorpayScript, isLoading } =
    usePayment();
  const { getBookingById, selectedBooking } = useBookings();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (bookingId) {
      getBookingById(bookingId);
    }
  }, [bookingId]);

  const handlePayment = async () => {
    if (!bookingId) return;

    try {
      setIsProcessing(true);

      // Create order
      const orderData = await createOrder(bookingId);

      // Load Razorpay script
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        throw new Error("Failed to load Razorpay script");
      }

      // Open payment gateway
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "BikeRental Pro",
        description: `Booking #${bookingId}`,
        order_id: orderData.orderId,
        handler: async (response: any) => {
          try {
            // Verify payment
            const verifyResponse = await verifyPayment({
              orderId: orderData.orderId,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            });

            if (verifyResponse.success) {
              toast.success("Payment successful!");
              router.push("/dashboard");
            }
          } catch (err) {
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          contact: "9876543210",
          email: "user@example.com",
        },
        theme: {
          color: "#06b6d4",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-8">Payment</h1>

      {selectedBooking && (
        <div className="mb-6 p-4 bg-slate-50 rounded-lg">
          <h3 className="font-semibold mb-2">Booking Details</h3>
          <p className="text-sm text-slate-600 mb-2">
            ID: {selectedBooking.id}
          </p>
          <p className="text-sm text-slate-600 mb-4">
            Amount: ₹{selectedBooking.totalAmount}
          </p>
        </div>
      )}

      <button
        onClick={handlePayment}
        disabled={isLoading || isProcessing || !bookingId}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
      >
        {isProcessing ? "Processing..." : "Pay with Razorpay"}
      </button>
    </div>
  );
}
