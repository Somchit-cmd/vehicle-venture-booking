
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import BookingForm from '@/components/ui/BookingForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Car, Fuel, Users, CalendarDays } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

// Mock vehicle data (replace with actual API call)
const mockVehicles = [
  {
    id: '1',
    name: 'Tesla',
    model: 'Model S',
    image: 'https://images.unsplash.com/photo-1617704548623-340376564e68?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3',
    seats: 5,
    fuelType: 'Electric',
    status: 'available',
    licensePlate: 'EV-123456',
  },
  {
    id: '2',
    name: 'Toyota',
    model: 'Camry',
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3',
    seats: 5,
    fuelType: 'Hybrid',
    status: 'booked',
    licensePlate: 'HY-789012',
  },
  {
    id: '3',
    name: 'BMW',
    model: 'X5',
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3',
    seats: 7,
    fuelType: 'Diesel',
    status: 'available',
    licensePlate: 'BM-345678',
  },
  {
    id: '4',
    name: 'Ford',
    model: 'Transit',
    image: 'https://images.unsplash.com/photo-1604659238904-21e563526090?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.0.3',
    seats: 9,
    fuelType: 'Diesel',
    status: 'maintenance',
    licensePlate: 'FT-901234',
  },
  {
    id: '5',
    name: 'Audi',
    model: 'A4',
    image: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3',
    seats: 5,
    fuelType: 'Petrol',
    status: 'available',
    licensePlate: 'AU-567890',
  },
  {
    id: '6',
    name: 'Mercedes',
    model: 'E-Class',
    image: 'https://images.unsplash.com/photo-1616455579100-2ceaa4eb2d37?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3',
    seats: 5,
    fuelType: 'Diesel',
    status: 'available',
    licensePlate: 'MB-123789',
  }
];

const Booking = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Simulate API call to get vehicle details
    const fetchVehicle = async () => {
      // In a real app, you would fetch from an API
      const foundVehicle = mockVehicles.find(v => v.id === id);
      
      if (foundVehicle) {
        setVehicle(foundVehicle);
      } else {
        toast.error("Vehicle not found");
        navigate('/');
      }
    };

    fetchVehicle();
  }, [id, navigate]);

  const handleBookingSubmit = (data: any) => {
    setIsLoading(true);
    
    // Simulate API call to create booking
    setTimeout(() => {
      console.log('Booking data:', data);
      setIsLoading(false);
      
      // In a real app, you would create a booking in Firebase
      toast.success("Vehicle booked successfully!");
      navigate('/calendar');
    }, 1500);
  };

  if (!vehicle) {
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
            isLoading={isLoading}
          />
        </motion.div>
      </div>
    </Layout>
  );
};

export default Booking;
