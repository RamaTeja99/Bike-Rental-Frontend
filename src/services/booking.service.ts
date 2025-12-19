import apiClient from '@/lib/api-client';
import { handleError } from '@/lib/error-handler';

export interface Booking {
  id: string;
  bikeId: string;
  userId: string;
  startTime: string;
  endTime: string;
  pickupLocation: string;
  dropoffLocation: string;
  totalAmount: number;
  status: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
}

export const bookingService = {
  async createBooking(data: Omit<Booking, 'id' | 'status'>): Promise<Booking> {
    try {
      const response = await apiClient.post('/bookings', data);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  async getMyBookings(page: number = 0, limit: number = 10): Promise<any> {
    try {
      const response = await apiClient.get('/bookings', {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  async getBookingById(id: string): Promise<Booking> {
    try {
      const response = await apiClient.get(`/bookings/${id}`);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  async completeBooking(id: string): Promise<Booking> {
    try {
      const response = await apiClient.post(`/bookings/${id}/complete`);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  async cancelBooking(id: string): Promise<Booking> {
    try {
      const response = await apiClient.post(`/bookings/${id}/cancel`);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  async getAllBookings(page: number = 0, limit: number = 10): Promise<any> {
    try {
      const response = await apiClient.get('/bookings/admin/all', {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },
};
