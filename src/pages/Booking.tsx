import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import BookingForm from '@/components/ui/BookingForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Car, Fuel, Users, CalendarDays } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { getVehicleById } from '@/services/vehicleService';
import { createBooking } from '@/services/bookingService';

const Booking = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchVehicle = async () => {
      setIsLoading(true);
      
      try {
        if (!id) {
          toast.error("Vehicle ID is required");
          navigate('/');
          return;
        }
        
        const vehicleData = await getVehicleById(id);
        
        if (vehicleData) {
          setVehicle(vehicleData);
        } else {
          toast.error("Vehicle not found");
          navigate('/');
        }
      } catch (error) {
        console.error("Error fetching vehicle:", error);
        toast.error("Failed to load vehicle details");
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicle();
  }, [id, navigate]);

  const handleBookingSubmit = async (data: any) => {
    if (!vehicle || !vehicle.id) {
      toast.error("Vehicle information is missing");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const bookingData = {
        vehicleId: vehicle.id,
        vehicleName: `${vehicle.name} ${vehicle.model}`,
        startDate: data.startDate,
        endDate: data.endDate || data.startDate,
        startTime: data.startTime,
        endTime: data.endTime,
        purpose: data.purpose,
        bookedBy: "Current User",
        status: "active" as const,
        passengers: data.passengers,
        notes: data.notes
      };
      
      await createBooking(bookingData);
      
      toast.success("Vehicle booked successfully!");
      navigate('/calendar');
    } catch (error) {
      console.error("Error creating booking:", error);
      toast.error("Failed to create booking");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <CalendarDays className="h-12 w-12 mx-auto text-muted-foreground opacity-20 mb-4" />
            <h2 className="text-xl font-medium">Loading vehicle information...</h2>
          </div>
        </div>
      </Layout>
    );
  }

  if (!vehicle) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <CalendarDays className="h-12 w-12 mx-auto text-muted-foreground opacity-20 mb-4" />
            <h2 className="text-xl font-medium">Vehicle not found</h2>
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="mt-4"
            >
              Return to Home
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-6 flex items-center">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/')} 
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Book a Vehicle</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          className="lg:col-span-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="rounded-lg overflow-hidden border border-gray-200/70 bg-white">
            <div className="aspect-video relative overflow-hidden">
              <img 
                src={vehicle.image || '/placeholder.svg'} 
                alt={`${vehicle.name} ${vehicle.model}`} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-5">
              <h2 className="text-xl font-semibold mb-1">
                {vehicle.name} {vehicle.model}
              </h2>
              <p className="text-muted-foreground text-sm mb-4">
                License Plate: {vehicle.licensePlate}
              </p>
              
              <Separator className="my-4" />
              
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <Car className="h-4 w-4 mr-3 text-muted-foreground" />
                  <span>Vehicle Type: {vehicle.model}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Users className="h-4 w-4 mr-3 text-muted-foreground" />
                  <span>Capacity: {vehicle.seats} seats</span>
                </div>
                <div className="flex items-center text-sm">
                  <Fuel className="h-4 w-4 mr-3 text-muted-foreground" />
                  <span>Fuel Type: {vehicle.fuelType}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="lg:col-span-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <BookingForm 
            vehicleId={vehicle.id}
            vehicleName={`${vehicle.name} ${vehicle.model}`}
            onSubmit={handleBookingSubmit}
            isLoading={isSubmitting}
          />
        </motion.div>
      </div>
    </Layout>
  );
};

export default Booking;
