"use client";

import { useState, useCallback } from "react";
import { useBookingStore } from "@/store/bookingStore";
import { bookingService, Booking } from "@/services/booking.service";

export function useBookings() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { bookings, selectedBooking, setBookings, setSelectedBooking } =
    useBookingStore();

  const createBooking = useCallback(
    async (data: Omit<Booking, "id" | "status">) => {
      try {
        setIsLoading(true);
        setError(null);
        const booking = await bookingService.createBooking(data);
        return booking;
      } catch (err: any) {
        const errorMsg = err.message || "Failed to create booking";
        setError(errorMsg);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const getMyBookings = useCallback(
    async (page: number = 0) => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await bookingService.getMyBookings(page, 10);
        setBookings(response.content || []);
        return response;
      } catch (err: any) {
        const errorMsg = err.message || "Failed to fetch bookings";
        setError(errorMsg);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [setBookings]
  );

  const getBookingById = useCallback(
    async (id: string) => {
      try {
        setIsLoading(true);
        setError(null);
        const booking = await bookingService.getBookingById(id);
        setSelectedBooking(booking);
        return booking;
      } catch (err: any) {
        const errorMsg = err.message || "Failed to fetch booking";
        setError(errorMsg);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [setSelectedBooking]
  );

  return {
    bookings,
    selectedBooking,
    isLoading,
    error,
    createBooking,
    getMyBookings,
    getBookingById,
  };
}
