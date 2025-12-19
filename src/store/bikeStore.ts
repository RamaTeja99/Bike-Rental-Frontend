import { create } from "zustand";

interface Bike {
  id: string;
  brand: string;
  model: string;
  pricePerHour: number;
  status: string;
}

interface BikeStore {
  bikes: Bike[];
  selectedBike: Bike | null;
  setBikes: (bikes: Bike[]) => void;
  setSelectedBike: (bike: Bike | null) => void;
}

export const useBikeStore = create<BikeStore>((set) => ({
  bikes: [],
  selectedBike: null,
  setBikes: (bikes) => set({ bikes }),
  setSelectedBike: (bike) => set({ selectedBike: bike }),
}));
