
import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc, query, where, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

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

const vehiclesCollection = collection(db, 'vehicles');

// Get all vehicles
export const getVehicles = async (): Promise<Vehicle[]> => {
  const vehicleSnapshot = await getDocs(vehiclesCollection);
  const vehicleList = vehicleSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Vehicle[];
  
  return vehicleList;
};

// Get vehicle by ID
export const getVehicleById = async (id: string): Promise<Vehicle | null> => {
  try {
    const vehicleRef = doc(db, 'vehicles', id);
    const vehicleSnap = await getDoc(vehicleRef);
    
    if (!vehicleSnap.exists()) {
      return null;
    }
    
    return {
      id: vehicleSnap.id,
      ...vehicleSnap.data()
    } as Vehicle;
  } catch (error) {
    console.error("Error getting vehicle by ID:", error);
    return null;
  }
};

// Get vehicles by status
export const getVehiclesByStatus = async (status: VehicleStatus): Promise<Vehicle[]> => {
  const vehicleQuery = query(vehiclesCollection, where("status", "==", status));
  const vehicleSnapshot = await getDocs(vehicleQuery);
  const vehicleList = vehicleSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Vehicle[];
  
  return vehicleList;
};

// Add new vehicle
export const addVehicle = async (vehicle: Omit<Vehicle, 'id'>): Promise<string> => {
  const docRef = await addDoc(vehiclesCollection, vehicle);
  return docRef.id;
};

// Update vehicle
export const updateVehicle = async (id: string, vehicle: Partial<Vehicle>): Promise<void> => {
  const vehicleRef = doc(db, 'vehicles', id);
  await updateDoc(vehicleRef, vehicle);
};

// Delete vehicle
export const deleteVehicle = async (id: string): Promise<void> => {
  const vehicleRef = doc(db, 'vehicles', id);
  await deleteDoc(vehicleRef);
};

// Update vehicle status
export const updateVehicleStatus = async (id: string, status: VehicleStatus): Promise<void> => {
  const vehicleRef = doc(db, 'vehicles', id);
  await updateDoc(vehicleRef, { status });
};
