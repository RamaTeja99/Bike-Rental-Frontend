'use client';

import { useState, useCallback } from 'react';
import { useBikeStore } from '@/store/bikeStore';
import { bikeService, Bike } from '@/services/bike.service';
import { handleError } from '@/lib/error-handler';

export function useBikes() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { bikes, selectedBike, setBikes, setSelectedBike } = useBikeStore();

  const getAvailableBikes = useCallback(
    async (page: number = 0) => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await bikeService.getAvailableBikes(page, 12);
        setBikes(response.content || []);
        return response;
      } catch (err: any) {
        const errorMsg = err.message || 'Failed to fetch bikes';
        setError(errorMsg);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [setBikes]
  );

  const searchBikes = useCallback(
    async (query: string, page: number = 0) => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await bikeService.searchBikes(query, page);
        setBikes(response.content || []);
        return response;
      } catch (err: any) {
        const errorMsg = err.message || 'Search failed';
        setError(errorMsg);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [setBikes]
  );

  const getBikeById = useCallback(
    async (id: string) => {
      try {
        setIsLoading(true);
        setError(null);
        const bike = await bikeService.getBikeById(id);
        setSelectedBike(bike);
        return bike;
      } catch (err: any) {
        const errorMsg = err.message || 'Failed to fetch bike';
        setError(errorMsg);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [setSelectedBike]
  );

  return {
    bikes,
    selectedBike,
    isLoading,
    error,
    getAvailableBikes,
    searchBikes,
    getBikeById,
  };
}
