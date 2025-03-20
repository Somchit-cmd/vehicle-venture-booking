
import { getItem, setItem, generateId } from '@/lib/localStorage';

export type VehicleStatus = "available" | "booked" | "maintenance";

export type Vehicle = {
  id?: string;
  name: string;
  model: string;
  image: string;
  seats: number;
  fuelType: string;
  status: VehicleStatus;
  licensePlate: string;
};

const STORAGE_KEY = 'vehicles';

// Get all vehicles
export const getVehicles = async (): Promise<Vehicle[]> => {
  return getItem<Vehicle[]>(STORAGE_KEY, []);
};

// Get vehicle by ID
export const getVehicleById = async (id: string): Promise<Vehicle | null> => {
  try {
    const vehicles = getItem<Vehicle[]>(STORAGE_KEY, []);
    const vehicle = vehicles.find(v => v.id === id);
    return vehicle || null;
  } catch (error) {
    console.error("Error getting vehicle by ID:", error);
    return null;
  }
};

// Get vehicles by status
export const getVehiclesByStatus = async (status: VehicleStatus): Promise<Vehicle[]> => {
  const vehicles = getItem<Vehicle[]>(STORAGE_KEY, []);
  return vehicles.filter(vehicle => vehicle.status === status);
};

// Add new vehicle
export const addVehicle = async (vehicle: Omit<Vehicle, 'id'>): Promise<string> => {
  const vehicles = getItem<Vehicle[]>(STORAGE_KEY, []);
  const id = generateId();
  const newVehicle = { ...vehicle, id };
  
  vehicles.push(newVehicle);
  setItem(STORAGE_KEY, vehicles);
  
  return id;
};

// Update vehicle
export const updateVehicle = async (id: string, updatedFields: Partial<Vehicle>): Promise<void> => {
  const vehicles = getItem<Vehicle[]>(STORAGE_KEY, []);
  const index = vehicles.findIndex(v => v.id === id);
  
  if (index !== -1) {
    vehicles[index] = { ...vehicles[index], ...updatedFields };
    setItem(STORAGE_KEY, vehicles);
  }
};

// Delete vehicle
export const deleteVehicle = async (id: string): Promise<void> => {
  const vehicles = getItem<Vehicle[]>(STORAGE_KEY, []);
  const filteredVehicles = vehicles.filter(v => v.id !== id);
  setItem(STORAGE_KEY, filteredVehicles);
};

// Update vehicle status
export const updateVehicleStatus = async (id: string, status: VehicleStatus): Promise<void> => {
  await updateVehicle(id, { status });
};
