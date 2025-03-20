
import React, { useState } from 'react';
import { Calendar as CalendarUI } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Clock, MapPin, User, Calendar, Car } from 'lucide-react';
import { format, isSameDay } from 'date-fns';

// Define types for bookings
interface Booking {
  id: string;
  vehicleId: string;
  vehicleName: string;
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  purpose: string;
  bookedBy: string;
  status: 'active' | 'completed' | 'cancelled';
}

interface Vehicle {
  id: string;
  name: string;
  model: string;
}

interface CalendarViewProps {
  bookings: Booking[];
  vehicles: Vehicle[];
}

const CalendarView: React.FC<CalendarViewProps> = ({ bookings, vehicles }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedVehicle, setSelectedVehicle] = useState<string | undefined>(undefined);

  // Filter bookings based on selected date and vehicle
  const filteredBookings = bookings.filter(booking => {
    const matchesDate = selectedDate 
      ? (isSameDay(new Date(booking.startDate), selectedDate) || 
         isSameDay(new Date(booking.endDate), selectedDate))
      : true;
    
    const matchesVehicle = selectedVehicle 
      ? booking.vehicleId === selectedVehicle
      : true;
    
    return matchesDate && matchesVehicle;
  });

  // Get dates with bookings
  const bookingDates = bookings.map(booking => ({
    date: new Date(booking.startDate),
    vehicleId: booking.vehicleId
  }));

  // Function to check if a date has any bookings
  const isDayWithBooking = (date: Date) => {
    return bookingDates.some(bookingDate => 
      isSameDay(bookingDate.date, date) && 
      (selectedVehicle ? bookingDate.vehicleId === selectedVehicle : true)
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-1 border border-gray-200/70">
        <CardHeader>
          <CardTitle>Calendar</CardTitle>
          <CardDescription>Select a date to view bookings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Select
              value={selectedVehicle}
              onValueChange={(value) => setSelectedVehicle(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Vehicles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={undefined}>All Vehicles</SelectItem>
                {vehicles.map(vehicle => (
                  <SelectItem key={vehicle.id} value={vehicle.id}>
                    {vehicle.name} - {vehicle.model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <CalendarUI
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
              modifiers={{
                booked: (date) => isDayWithBooking(date),
              }}
              modifiersClassNames={{
                booked: "bg-primary/10 text-primary font-medium",
              }}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2 border border-gray-200/70">
        <CardHeader>
          <CardTitle>{selectedDate ? format(selectedDate, 'EEEE, MMMM d, yyyy') : 'All Bookings'}</CardTitle>
          <CardDescription>
            {selectedVehicle 
              ? `Filtered by ${vehicles.find(v => v.id === selectedVehicle)?.name || 'selected vehicle'}`
              : 'Showing all vehicles'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredBookings.length > 0 ? (
              filteredBookings.map((booking) => (
                <div 
                  key={booking.id} 
                  className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center">
                      <Car className="h-5 w-5 text-primary mr-2" />
                      <h3 className="font-medium">{booking.vehicleName}</h3>
                    </div>
                    <Badge 
                      variant={
                        booking.status === 'active' ? 'default' :
                        booking.status === 'completed' ? 'outline' : 'destructive'
                      }
                    >
                      {booking.status}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3">{booking.purpose}</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>
                        {format(new Date(booking.startDate), 'MMM d, yyyy')}
                        {!isSameDay(new Date(booking.startDate), new Date(booking.endDate)) && 
                          ` - ${format(new Date(booking.endDate), 'MMM d, yyyy')}`}
                      </span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{booking.startTime} - {booking.endTime}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <User className="h-4 w-4 mr-2" />
                      <span>{booking.bookedBy}</span>
                    </div>
                  </div>

                  <Separator className="my-3" />
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center">
                      <span>ID: {booking.id.substring(0, 8)}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground opacity-20 mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground">No bookings found</h3>
                <p className="text-sm text-muted-foreground/60 mt-1">
                  {selectedDate ? `No bookings for ${format(selectedDate, 'MMMM d, yyyy')}` : 'No bookings match your filters'}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarView;
