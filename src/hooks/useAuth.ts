"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { authService } from "@/services/auth.service";
import { handleError } from "@/lib/error-handler";

export function useAuth() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user, isAuthenticated, setUser, setAuthenticated, clearAuth } =
    useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("auth_token");

      if (!token) {
        setAuthenticated(false);
        setIsLoading(false);
        return;
      }

      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      setAuthenticated(true);
    } catch (err) {
      setAuthenticated(false);
      clearAuth();
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (phoneNumber: string, firebaseUid: string) => {
    try {
      setError(null);
      const response = await authService.verifyOtp({
        phoneNumber,
        firebaseUid,
      });

      setUser(response.user);
      setAuthenticated(true);
      return response;
    } catch (err: any) {
      const errorMsg = err.message || "OTP verification failed";
      setError(errorMsg);
      throw err;
    }
  };

  const logout = () => {
    authService.logout();
    clearAuth();
    setError(null);
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    verifyOtp,
    logout,
    refetch: checkAuth,
  };
}
