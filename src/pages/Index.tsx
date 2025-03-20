import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Car, Plus, Search } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

// Define the vehicle status type
type VehicleStatus = "available" | "booked" | "maintenance";

// Define the vehicle type
type Vehicle = {
  id: string;
  name: string;
  model: string;
  image: string;
  seats: number;
  fuelType: string;
  status: VehicleStatus;
  licensePlate: string;
};

const Index = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    const filtered = vehicles.filter(
      (vehicle) =>
        vehicle.name.toLowerCase().includes(query.toLowerCase()) ||
        vehicle.model.toLowerCase().includes(query.toLowerCase()) ||
        vehicle.licensePlate.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredVehicles(filtered);
  };

  // Simulating fetching data from an API
  useEffect(() => {
    // In a real app, this would be an API call
    const mockVehicles: Vehicle[] = [
      {
        id: '1',
        name: 'Tesla',
        model: 'Model S',
        image: 'https://images.unsplash.com/photo-1617704548623-340376564e68?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3',
        seats: 5,
        fuelType: 'Electric',
        status: "available",
        licensePlate: 'EV-123456',
      },
      {
        id: '2',
        name: 'Toyota',
        model: 'Camry',
        image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3',
        seats: 5,
        fuelType: 'Hybrid',
        status: "booked",
        licensePlate: 'HY-789012',
      },
      {
        id: '3',
        name: 'BMW',
        model: 'X5',
        image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3',
        seats: 7,
        fuelType: 'Diesel',
        status: "available",
        licensePlate: 'BM-345678',
      },
      {
        id: '4',
        name: 'Ford',
        model: 'Transit',
        image: 'https://images.unsplash.com/photo-1604659238904-21e563526090?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.0.3',
        seats: 9,
        fuelType: 'Diesel',
        status: "maintenance",
        licensePlate: 'FT-901234',
      },
      {
        id: '5',
        name: 'Audi',
        model: 'A4',
        image: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3',
        seats: 5,
        fuelType: 'Petrol',
        status: "available",
        licensePlate: 'AU-567890',
      },
      {
        id: '6',
        name: 'Mercedes',
        model: 'E-Class',
        image: 'https://images.unsplash.com/photo-1616455579100-2ceaa4eb2d37?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3',
        seats: 5,
        fuelType: 'Diesel',
        status: "available",
        licensePlate: 'MB-123789',
      }
    ];

    setVehicles(mockVehicles);
    setFilteredVehicles(mockVehicles);
  }, []);

  const handleVehicleClick = (id: string) => {
    const vehicle = vehicles.find(v => v.id === id);
    if (vehicle) {
      if (vehicle.status === 'available') {
        navigate(`/booking/${id}`);
      } else {
        toast.error(`Vehicle ${vehicle.name} ${vehicle.model} is currently ${vehicle.status}.`);
      }
    } else {
      toast.error('Vehicle not found.');
    }
  };

  return (
    <Layout>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Vehicle Fleet</h1>
        <Button onClick={() => navigate('/management')}>
          <Plus className="h-4 w-4 mr-2" />
          Add Vehicle
        </Button>
      </div>

      <div className="relative w-full max-w-md mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
        <Input
          type="search"
          placeholder="Search vehicles..."
          className="pl-10"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredVehicles.map((vehicle) => (
          <motion.div
            key={vehicle.id}
            className="rounded-lg overflow-hidden border border-gray-200/70 bg-white hover:scale-102 transition-transform cursor-pointer"
            onClick={() => handleVehicleClick(vehicle.id)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="aspect-video relative overflow-hidden">
              <img
                src={vehicle.image || '/placeholder.svg'}
                alt={`${vehicle.name} ${vehicle.model}`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-2">{vehicle.name} {vehicle.model}</h2>
              <p className="text-sm text-gray-500">License Plate: {vehicle.licensePlate}</p>
              <div className="flex items-center mt-3">
                <Car className="h-4 w-4 mr-2 text-gray-400" />
                <span className="text-sm">{vehicle.status}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Layout>
  );
};

export default Index;
