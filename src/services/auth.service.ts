import apiClient from "@/lib/api-client";
import { handleError } from "@/lib/error-handler";

interface VerifyOtpRequest {
  phoneNumber: string;
  firebaseUid: string;
  otp?: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    phoneNumber: string;
    email?: string;
    role: "CUSTOMER" | "ADMIN" | "VERIFIER";
    fullName?: string;
  };
}

export const authService = {
  async verifyOtp(data: VerifyOtpRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post("/auth/verify-otp", data);

      // Store token
      if (response.data.token) {
        localStorage.setItem("auth_token", response.data.token);
      }

      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  async getCurrentUser() {
    try {
      const response = await apiClient.get("/auth/me");
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  async updateProfile(data: Record<string, any>) {
    try {
      const response = await apiClient.put("/auth/profile", data);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  logout() {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
  },
};
