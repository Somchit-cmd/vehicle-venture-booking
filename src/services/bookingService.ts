
import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, query, where, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { updateVehicleStatus } from './vehicleService';

export type BookingStatus = "active" | "completed" | "cancelled";

export type Booking = {
  id?: string;
  vehicleId: string;
  vehicleName: string;
  startDate: Date | Timestamp;
  endDate: Date | Timestamp;
  startTime: string;
  endTime: string;
  purpose: string;
  bookedBy: string;
  status: BookingStatus;
  createdAt?: Date | Timestamp;
};

const bookingsCollection = collection(db, 'bookings');

// Get all bookings
export const getBookings = async (): Promise<Booking[]> => {
  const bookingSnapshot = await getDocs(bookingsCollection);
  return bookingSnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      startDate: data.startDate instanceof Timestamp ? data.startDate.toDate() : data.startDate,
      endDate: data.endDate instanceof Timestamp ? data.endDate.toDate() : data.endDate,
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt,
    } as Booking;
  });
};

// Get booking by ID
export const getBookingById = async (id: string): Promise<Booking | null> => {
  const bookingRef = doc(db, 'bookings', id);
  const bookingSnap = await getDoc(bookingRef);
  
  if (!bookingSnap.exists()) {
    return null;
  }
  
  const data = bookingSnap.data();
  return {
    id: bookingSnap.id,
    ...data,
    startDate: data.startDate instanceof Timestamp ? data.startDate.toDate() : data.startDate,
    endDate: data.endDate instanceof Timestamp ? data.endDate.toDate() : data.endDate,
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt,
  } as Booking;
};

// Get bookings by vehicle ID
export const getBookingsByVehicle = async (vehicleId: string): Promise<Booking[]> => {
  const bookingQuery = query(bookingsCollection, where("vehicleId", "==", vehicleId));
  const bookingSnapshot = await getDocs(bookingQuery);
  
  return bookingSnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      startDate: data.startDate instanceof Timestamp ? data.startDate.toDate() : data.startDate,
      endDate: data.endDate instanceof Timestamp ? data.endDate.toDate() : data.endDate,
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt,
    } as Booking;
  });
};

// Get bookings by status
export const getBookingsByStatus = async (status: BookingStatus): Promise<Booking[]> => {
  const bookingQuery = query(bookingsCollection, where("status", "==", status));
  const bookingSnapshot = await getDocs(bookingQuery);
  
  return bookingSnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      startDate: data.startDate instanceof Timestamp ? data.startDate.toDate() : data.startDate,
      endDate: data.endDate instanceof Timestamp ? data.endDate.toDate() : data.endDate,
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt,
    } as Booking;
  });
};

// Create booking
export const createBooking = async (booking: Omit<Booking, 'id'>): Promise<string> => {
  // Set vehicle status to booked
  await updateVehicleStatus(booking.vehicleId, "booked");
  
  // Add timestamp
  const bookingWithTimestamp = {
    ...booking,
    createdAt: new Date()
  };
  
  const docRef = await addDoc(bookingsCollection, bookingWithTimestamp);
  return docRef.id;
};

// Update booking
export const updateBooking = async (id: string, booking: Partial<Booking>): Promise<void> => {
  const bookingRef = doc(db, 'bookings', id);
  await updateDoc(bookingRef, booking);
};

// Cancel booking
export const cancelBooking = async (id: string): Promise<void> => {
  const booking = await getBookingById(id);
  if (booking) {
    // Update booking status
    const bookingRef = doc(db, 'bookings', id);
    await updateDoc(bookingRef, { status: "cancelled" });
    
    // Set vehicle status back to available
    await updateVehicleStatus(booking.vehicleId, "available");
  }
};

// Complete booking
export const completeBooking = async (id: string): Promise<void> => {
  const booking = await getBookingById(id);
  if (booking) {
    // Update booking status
    const bookingRef = doc(db, 'bookings', id);
    await updateDoc(bookingRef, { status: "completed" });
    
    // Set vehicle status back to available
    await updateVehicleStatus(booking.vehicleId, "available");
  }
};
