import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from '@/components/ui/calendar';
import { Button } from "@/components/ui/button"
import { format } from 'date-fns';
import { cn } from "@/lib/utils";

// Define our booking type with specific status values
type Booking = {
  id: string;
  vehicleId: string;
  vehicleName: string;
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  purpose: string;
  bookedBy: string;
  status: "active" | "completed" | "cancelled";
};

const CalendarPage = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    // Simulate fetching bookings from an API
    const mockBookings: Booking[] = [
      {
        id: '1',
        vehicleId: '1',
        vehicleName: 'Tesla Model S',
        startDate: new Date(2023, 5, 15),
        endDate: new Date(2023, 5, 15),
        startTime: '09:00',
        endTime: '11:00',
        purpose: 'Client Meeting',
        bookedBy: 'John Doe',
        status: "active",
      },
      {
        id: '2',
        vehicleId: '2',
        vehicleName: 'Toyota Camry',
        startDate: new Date(2023, 5, 16),
        endDate: new Date(2023, 5, 16),
        startTime: '14:00',
        endTime: '16:00',
        purpose: 'Team Lunch',
        bookedBy: 'Jane Smith',
        status: "completed",
      },
      {
        id: '3',
        vehicleId: '3',
        vehicleName: 'BMW X5',
        startDate: new Date(2023, 5, 17),
        endDate: new Date(2023, 5, 17),
        startTime: '10:00',
        endTime: '12:00',
        purpose: 'Site Visit',
        bookedBy: 'Alice Johnson',
        status: "active",
      },
      {
        id: '4',
        vehicleId: '1',
        vehicleName: 'Tesla Model S',
        startDate: new Date(2023, 5, 18),
        endDate: new Date(2023, 5, 18),
        startTime: '13:00',
        endTime: '15:00',
        purpose: 'Airport Transfer',
        bookedBy: 'Bob Williams',
        status: "cancelled",
      },
    ];
    
    setBookings(mockBookings);
  }, []);

  const filteredBookings = bookings.filter(booking => {
    const bookingDate = new Date(booking.startDate);
    const selectedDate = new Date(date as Date);
    return bookingDate.toDateString() === selectedDate.toDateString();
  });

  return (
    <Layout>
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-bold mb-5">Calendar</h1>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/3">
            <div className="border rounded-md p-4 shadow-sm">
              <h2 className="text-lg font-semibold mb-2">Select a Date</h2>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className={cn("border-none shadow-none p-0")}
              />
            </div>
          </div>
          <div className="w-full md:w-2/3">
            <div className="border rounded-md p-4 shadow-sm">
              <h2 className="text-lg font-semibold mb-2">
                Bookings for {date ? format(date, 'PPP') : 'Select a date'}
              </h2>
              {filteredBookings.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {filteredBookings.map(booking => (
                    <li key={booking.id} className="py-3">
                      <p className="font-medium">{booking.vehicleName}</p>
                      <p className="text-sm text-gray-500">
                        {booking.startTime} - {booking.endTime} | Purpose: {booking.purpose}
                      </p>
                      <p className="text-sm text-gray-500">
                        Booked by: {booking.bookedBy} | Status: {booking.status}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex flex-col items-center justify-center h-32">
                  <CalendarIcon className="h-6 w-6 text-gray-400 mb-2" />
                  <p className="text-gray-500">No bookings for this date.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CalendarPage;
