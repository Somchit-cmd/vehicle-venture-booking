
import { Vehicle, VehicleStatus } from '@/services/vehicleService';
import { Booking, BookingStatus } from '@/services/bookingService';
import { getItem, setItem } from './localStorage';

// Demo vehicles data
const demoVehicles: Vehicle[] = [
  {
    id: 'v1',
    name: 'Tesla',
    model: 'Model S',
    image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399',
    seats: 5,
    fuelType: 'Electric',
    status: 'available',
    licensePlate: 'EV-1234'
  },
  {
    id: 'v2',
    name: 'Toyota',
    model: 'Camry',
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb',
    seats: 5,
    fuelType: 'Hybrid',
    status: 'available',
    licensePlate: 'HY-5678'
  },
  {
    id: 'v3',
    name: 'BMW',
    model: 'X5',
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2',
    seats: 7,
    fuelType: 'Diesel',
    status: 'booked',
    licensePlate: 'BM-9012'
  },
  {
    id: 'v4',
    name: 'Honda',
    model: 'CR-V',
    image: 'https://images.unsplash.com/photo-1568844293986-ca4c357d527d',
    seats: 5,
    fuelType: 'Petrol',
    status: 'available',
    licensePlate: 'HO-3456'
  },
  {
    id: 'v5',
    name: 'Audi',
    model: 'A4',
    image: 'https://images.unsplash.com/photo-1606152421802-db97b9c7a11b',
    seats: 5,
    fuelType: 'Petrol',
    status: 'maintenance',
    licensePlate: 'AU-7890'
  }
];

// Calculate dates
const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);
const twoDaysAgo = new Date(today);
twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
const threeDaysAgo = new Date(today);
threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

// Demo bookings data
const demoBookings: Booking[] = [
  {
    id: 'b1',
    vehicleId: 'v3',
    vehicleName: 'BMW X5',
    startDate: today,
    endDate: tomorrow,
    startTime: '09:00',
    endTime: '17:00',
    purpose: 'Client meeting in downtown',
    bookedBy: 'John Smith',
    status: 'active',
    createdAt: yesterday
  },
  {
    id: 'b2',
    vehicleId: 'v1',
    vehicleName: 'Tesla Model S',
    startDate: tomorrow,
    endDate: tomorrow,
    startTime: '13:00',
    endTime: '18:00',
    purpose: 'Airport pickup for executives',
    bookedBy: 'Emma Johnson',
    status: 'active',
    createdAt: today
  },
  {
    id: 'b3',
    vehicleId: 'v4',
    vehicleName: 'Honda CR-V',
    startDate: twoDaysAgo,
    endDate: yesterday,
    startTime: '08:00',
    endTime: '16:00',
    purpose: 'Site inspection',
    bookedBy: 'Michael Brown',
    status: 'completed',
    createdAt: threeDaysAgo
  }
];

// Initialize demo data
export const initializeDemoData = () => {
  // Only initialize if data doesn't exist yet
  if (getItem<Vehicle[]>('vehicles', []).length === 0) {
    setItem('vehicles', demoVehicles);
  }
  
  if (getItem<Booking[]>('bookings', []).length === 0) {
    setItem('bookings', demoBookings);
  }
};
