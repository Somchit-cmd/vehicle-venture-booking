
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from "@/lib/utils";
import { getBookings } from '@/services/bookingService';
import { getVehicles } from '@/services/vehicleService';
import { toast } from 'sonner';
import { Booking } from '@/services/bookingService';
import { Vehicle } from '@/services/vehicleService';

const CalendarPage = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch bookings and vehicles in parallel
        const [bookingData, vehicleData] = await Promise.all([
          getBookings(),
          getVehicles()
        ]);
        
        setBookings(bookingData);
        setVehicles(vehicleData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load calendar data");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const filteredBookings = bookings.filter(booking => {
    if (!date) return false;
    
    const bookingDate = booking.startDate instanceof Date 
      ? booking.startDate 
      : new Date(booking.startDate);
      
    const selectedDate = new Date(date);
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
              
              {isLoading ? (
                <div className="space-y-3 py-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse flex space-x-4">
                      <div className="flex-1 space-y-2 py-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredBookings.length > 0 ? (
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
