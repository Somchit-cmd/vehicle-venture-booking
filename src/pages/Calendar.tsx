
import React from 'react';
import Layout from '@/components/layout/Layout';
import CalendarView from '@/components/calendar/CalendarView';
import { motion } from 'framer-motion';

// Sample mock data
const mockVehicles = [
  { id: '1', name: 'Tesla', model: 'Model S' },
  { id: '2', name: 'Toyota', model: 'Camry' },
  { id: '3', name: 'BMW', model: 'X5' },
  { id: '4', name: 'Ford', model: 'Transit' },
  { id: '5', name: 'Audi', model: 'A4' },
  { id: '6', name: 'Mercedes', model: 'E-Class' }
];

const mockBookings = [
  {
    id: 'booking1',
    vehicleId: '1',
    vehicleName: 'Tesla Model S',
    startDate: new Date(),
    endDate: new Date(),
    startTime: '09:00',
    endTime: '12:00',
    purpose: 'Client meeting in downtown',
    bookedBy: 'John Smith',
    status: 'active',
  },
  {
    id: 'booking2',
    vehicleId: '3',
    vehicleName: 'BMW X5',
    startDate: new Date(new Date().setDate(new Date().getDate() + 1)),
    endDate: new Date(new Date().setDate(new Date().getDate() + 1)),
    startTime: '13:00',
    endTime: '17:00',
    purpose: 'Site inspection at construction site',
    bookedBy: 'Emma Johnson',
    status: 'active',
  },
  {
    id: 'booking3',
    vehicleId: '5',
    vehicleName: 'Audi A4',
    startDate: new Date(new Date().setDate(new Date().getDate() - 1)),
    endDate: new Date(new Date().setDate(new Date().getDate() + 2)),
    startTime: '08:00',
    endTime: '18:00',
    purpose: 'Conference transport',
    bookedBy: 'Michael Brown',
    status: 'active',
  },
  {
    id: 'booking4',
    vehicleId: '2',
    vehicleName: 'Toyota Camry',
    startDate: new Date(),
    endDate: new Date(),
    startTime: '14:00',
    endTime: '16:30',
    purpose: 'Airport pickup for executives',
    bookedBy: 'Sarah Williams',
    status: 'completed',
  },
];

const Calendar = () => {
  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Booking Calendar</h1>
          <p className="text-muted-foreground">View and manage all vehicle bookings in one place.</p>
        </div>

        <CalendarView bookings={mockBookings} vehicles={mockVehicles} />
      </motion.div>
    </Layout>
  );
};

export default Calendar;
