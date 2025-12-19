import apiClient from '@/lib/api-client';
import { handleError } from '@/lib/error-handler';

export interface VerificationStatus {
  aadharVerified: boolean;
  licenseVerified: boolean;
  panVerified: boolean;
  digiLockerConnected: boolean;
}

export const verificationService = {
  async uploadDocument(formData: FormData): Promise<any> {
    try {
      const response = await apiClient.post('/verification/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  async getVerificationStatus(): Promise<VerificationStatus> {
    try {
      const response = await apiClient.get('/verification/status');
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  async initiateDigiLocker(): Promise<{ digilockerUrl: string; referenceId: string }> {
    try {
      const response = await apiClient.post('/verification/digilocker/create-url');
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  async handleDigiLockerCallback(code: string, state: string): Promise<any> {
    try {
      const response = await apiClient.post('/verification/digilocker/callback', {
        code,
        state,
      });
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },
};