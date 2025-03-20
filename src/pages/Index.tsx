
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import VehicleCard from '@/components/ui/VehicleCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';

// Mock data for vehicles
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
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/2016_Ford_Transit_Connect_240_1.5.jpg/640px-2016_Ford_Transit_Connect_240_1.5.jpg',
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

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [seatsFilter, setSeatsFilter] = useState('all');

  // Apply filters
  const filteredVehicles = mockVehicles.filter(vehicle => {
    const matchesSearch = vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter;
    
    const matchesSeats = seatsFilter === 'all' || 
                         (seatsFilter === '5-' && vehicle.seats <= 5) ||
                         (seatsFilter === '5+' && vehicle.seats > 5);
    
    return matchesSearch && matchesStatus && matchesSeats;
  });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Office Vehicles</h1>
        <p className="text-muted-foreground">Browse and book available vehicles for your business needs.</p>
      </div>

      <div className="mb-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search vehicles by name, model or license plate..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="booked">Booked</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={seatsFilter} onValueChange={setSeatsFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Seats" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Seats</SelectItem>
                <SelectItem value="5-">Up to 5 seats</SelectItem>
                <SelectItem value="5+">More than 5 seats</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {filteredVehicles.length > 0 ? (
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {filteredVehicles.map((vehicle) => (
            <VehicleCard 
              key={vehicle.id}
              id={vehicle.id}
              name={vehicle.name}
              model={vehicle.model}
              image={vehicle.image}
              seats={vehicle.seats}
              fuelType={vehicle.fuelType}
              status={vehicle.status}
              licensePlate={vehicle.licensePlate}
            />
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-16 border border-dashed rounded-lg">
          <p className="text-xl text-muted-foreground">No vehicles found matching your criteria</p>
          <button 
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
              setSeatsFilter('all');
            }}
            className="text-sm text-primary mt-2 hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}
    </Layout>
  );
};

export default Index;
