
import { getItem, setItem, generateId } from '@/lib/localStorage';
import { updateVehicleStatus } from './vehicleService';

export type BookingStatus = "active" | "completed" | "cancelled";

export type Booking = {
  id?: string;
  vehicleId: string;
  vehicleName: string;
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  purpose: string;
  bookedBy: string;
  status: BookingStatus;
  createdAt?: Date;
};

const STORAGE_KEY = 'bookings';

// Helper to convert date strings back to Date objects when retrieving from localStorage
const processBookingDates = (booking: any): Booking => {
  return {
    ...booking,
    startDate: booking.startDate ? new Date(booking.startDate) : new Date(),
    endDate: booking.endDate ? new Date(booking.endDate) : new Date(),
    createdAt: booking.createdAt ? new Date(booking.createdAt) : new Date()
  };
};

// Get all bookings
export const getBookings = async (): Promise<Booking[]> => {
  const bookings = getItem<any[]>(STORAGE_KEY, []);
  return bookings.map(processBookingDates);
};

// Get booking by ID
export const getBookingById = async (id: string): Promise<Booking | null> => {
  const bookings = getItem<any[]>(STORAGE_KEY, []);
  const booking = bookings.find(b => b.id === id);
  
  if (!booking) {
    return null;
  }
  
  return processBookingDates(booking);
};

// Get bookings by vehicle ID
export const getBookingsByVehicle = async (vehicleId: string): Promise<Booking[]> => {
  const bookings = getItem<any[]>(STORAGE_KEY, []);
  const filteredBookings = bookings.filter(b => b.vehicleId === vehicleId);
  
  return filteredBookings.map(processBookingDates);
};

// Get bookings by status
export const getBookingsByStatus = async (status: BookingStatus): Promise<Booking[]> => {
  const bookings = getItem<any[]>(STORAGE_KEY, []);
  const filteredBookings = bookings.filter(b => b.status === status);
  
  return filteredBookings.map(processBookingDates);
};

// Create booking
export const createBooking = async (booking: Omit<Booking, 'id'>): Promise<string> => {
  // Set vehicle status to booked
  await updateVehicleStatus(booking.vehicleId, "booked");
  
  const bookings = getItem<any[]>(STORAGE_KEY, []);
  const id = generateId();
  
  // Add timestamp
  const newBooking = {
    ...booking,
    id,
    createdAt: new Date()
  };
  
  bookings.push(newBooking);
  setItem(STORAGE_KEY, bookings);
  
  return id;
};

// Update booking
export const updateBooking = async (id: string, updatedFields: Partial<Booking>): Promise<void> => {
  const bookings = getItem<any[]>(STORAGE_KEY, []);
  const index = bookings.findIndex(b => b.id === id);
  
  if (index !== -1) {
    bookings[index] = { ...bookings[index], ...updatedFields };
    setItem(STORAGE_KEY, bookings);
  }
};

// Cancel booking
export const cancelBooking = async (id: string): Promise<void> => {
  const booking = await getBookingById(id);
  if (booking) {
    // Update booking status
    await updateBooking(id, { status: "cancelled" });
    
    // Set vehicle status back to available
    await updateVehicleStatus(booking.vehicleId, "available");
  }
};

// Complete booking
export const completeBooking = async (id: string): Promise<void> => {
  const booking = await getBookingById(id);
  if (booking) {
    // Update booking status
    await updateBooking(id, { status: "completed" });
    
    // Set vehicle status back to available
    await updateVehicleStatus(booking.vehicleId, "available");
  }
};
