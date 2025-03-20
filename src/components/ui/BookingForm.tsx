
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';
import { CalendarIcon, Clock } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

// Define form schema with Zod
const bookingFormSchema = z.object({
  startDate: z.date({
    required_error: "Start date is required",
  }),
  endDate: z.date({
    required_error: "End date is required",
  }).optional(),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  purpose: z.string().min(5, "Purpose must be at least 5 characters"),
  passengers: z.string().optional(),
  notes: z.string().optional(),
}).refine((data) => {
  // If dates are the same, ensure end time is after start time
  if (data.endDate && data.startDate && 
      data.endDate.toDateString() === data.startDate.toDateString()) {
    return data.endTime > data.startTime;
  }
  return true;
}, {
  message: "Return time must be after start time on the same day",
  path: ["endTime"]
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

interface BookingFormProps {
  vehicleId: string;
  vehicleName: string;
  onSubmit: (data: BookingFormValues) => void;
  isLoading?: boolean;
}

const BookingForm: React.FC<BookingFormProps> = ({
  vehicleId,
  vehicleName,
  onSubmit,
  isLoading = false,
}) => {
  // Initialize form
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      startDate: new Date(),
      endDate: new Date(),
      startTime: '09:00',
      endTime: '17:00',
      purpose: '',
      passengers: '',
      notes: '',
    },
  });

  // Time options
  const timeOptions = Array.from({ length: 24 * 4 }, (_, i) => {
    const hour = Math.floor(i / 4);
    const minute = (i % 4) * 15;
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  });

  // Get values from form to use for validation
  const startDate = form.watch('startDate');
  const endDate = form.watch('endDate');
  const startTime = form.watch('startTime');

  // Filter endTime options based on startTime when dates are the same
  const filteredEndTimeOptions = timeOptions.filter(time => {
    if (endDate && startDate && endDate.toDateString() === startDate.toDateString()) {
      return time > startTime;
    }
    return true;
  });

  // Update endTime if it's before startTime on same day
  useEffect(() => {
    const currentEndTime = form.getValues('endTime');
    const currentStartTime = form.getValues('startTime');
    const currentEndDate = form.getValues('endDate');
    const currentStartDate = form.getValues('startDate');
    
    if (currentEndDate && currentStartDate && 
        currentEndDate.toDateString() === currentStartDate.toDateString() &&
        currentEndTime <= currentStartTime) {
      // Find the next available time after startTime
      const nextTime = timeOptions.find(time => time > currentStartTime);
      if (nextTime) {
        form.setValue('endTime', nextTime);
      }
    }
  }, [startTime, startDate, endDate, form, timeOptions]);

  // Handle form submission
  const handleSubmit = (data: BookingFormValues) => {
    try {
      onSubmit(data);
      toast.success("Booking submitted successfully!");
    } catch (error) {
      toast.error("There was an error submitting your booking.");
      console.error(error);
    }
  };

  return (
    <Card className="w-full shadow-sm border border-gray-200/70">
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Booking Details for {vehicleName}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Start Date */}
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* End Date */}
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Return Date (Optional)</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Same as start date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => {
                              const startDate = form.getValues().startDate;
                              return date < startDate;
                            }}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Start Time */}
                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Time</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select start time" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-[200px]">
                          {timeOptions.map((time) => (
                            <SelectItem key={`start-${time}`} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* End Time */}
                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Return Time</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select return time" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-[200px]">
                          {filteredEndTimeOptions.map((time) => (
                            <SelectItem key={`end-${time}`} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Purpose */}
              <FormField
                control={form.control}
                name="purpose"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Purpose of Trip</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter the purpose of your trip" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Passengers */}
              <FormField
                control={form.control}
                name="passengers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Passengers (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter passenger names if any" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Notes */}
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Any additional information regarding your booking" 
                        className="min-h-[80px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <CardFooter className="px-0 pt-2 pb-0 flex justify-end">
              <Button
                type="submit"
                className="w-full sm:w-auto"
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Submit Booking'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default BookingForm;
