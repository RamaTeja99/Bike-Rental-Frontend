import apiClient from "@/lib/api-client";
import { handleError } from "@/lib/error-handler";

export interface Bike {
  id: string;
  brand: string;
  model: string;
  registrationNumber: string;
  pricePerHour: number;
  currentLocation: string;
  status: "READY" | "IN_PROCESS" | "MAINTENANCE";
  mileage: number;
  yearOfManufacture: number;
  color: string;
}

export const bikeService = {
  async getAvailableBikes(page: number = 0, limit: number = 10): Promise<any> {
    try {
      const response = await apiClient.get("/bikes", {
        params: { page, limit, status: "READY" },
      });
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  async searchBikes(query: string, page: number = 0): Promise<any> {
    try {
      const response = await apiClient.get("/bikes/search", {
        params: { q: query, page },
      });
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  async getBikeById(id: string): Promise<Bike> {
    try {
      const response = await apiClient.get(`/bikes/${id}`);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  async createBike(bike: Partial<Bike>): Promise<Bike> {
    try {
      const response = await apiClient.post("/bikes", bike);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  async updateBike(id: string, updates: Partial<Bike>): Promise<Bike> {
    try {
      const response = await apiClient.put(`/bikes/${id}`, updates);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  async deleteBike(id: string): Promise<void> {
    try {
      await apiClient.delete(`/bikes/${id}`);
    } catch (error) {
      throw handleError(error);
    }
  },
};
