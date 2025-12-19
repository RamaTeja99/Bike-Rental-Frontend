// Add all types here for full type safety
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

export interface Booking {
  id: string;
  bikeId: string;
  userId: string;
  startTime: string;
  endTime: string;
  pickupLocation: string;
  dropoffLocation: string;
  totalAmount: number;
  status: "PENDING" | "CONFIRMED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
}

export interface User {
  id: string;
  phoneNumber: string;
  email?: string;
  role: "CUSTOMER" | "ADMIN" | "VERIFIER";
  fullName?: string;
}
