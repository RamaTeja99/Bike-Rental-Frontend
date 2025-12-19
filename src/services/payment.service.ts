import apiClient from "@/lib/api-client";
import { handleError } from "@/lib/error-handler";

export interface CreateOrderResponse {
  orderId: string;
  amount: number;
  currency: string;
}

export interface VerifyPaymentRequest {
  orderId: string;
  paymentId: string;
  signature: string;
}

export const paymentService = {
  async createOrder(bookingId: string): Promise<CreateOrderResponse> {
    try {
      const response = await apiClient.post("/payments/razorpay/create-order", {
        bookingId,
      });
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  async verifyPayment(data: VerifyPaymentRequest): Promise<any> {
    try {
      const response = await apiClient.post("/payments/razorpay/verify", data);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  async getPaymentHistory(page: number = 0): Promise<any> {
    try {
      const response = await apiClient.get("/payments/history", {
        params: { page },
      });
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },
};
