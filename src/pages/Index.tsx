
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Car, Plus, Search } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { getVehicles, Vehicle, VehicleStatus } from '@/services/vehicleService';

const Index = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

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

  // Fetch vehicles from Firestore
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setIsLoading(true);
        const vehicleData = await getVehicles();
        setVehicles(vehicleData);
        setFilteredVehicles(vehicleData);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
        toast.error("Failed to load vehicles");
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicles();
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

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-lg overflow-hidden border border-gray-200/70 bg-white p-4 h-64 animate-pulse">
              <div className="w-full h-32 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      ) : filteredVehicles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredVehicles.map((vehicle) => (
            <motion.div
              key={vehicle.id}
              className="rounded-lg overflow-hidden border border-gray-200/70 bg-white hover:scale-102 transition-transform cursor-pointer"
              onClick={() => handleVehicleClick(vehicle.id || '')}
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
      ) : (
        <div className="text-center py-16 border border-dashed rounded-lg">
          <Car className="h-12 w-12 mx-auto text-gray-300 mb-2" />
          <h3 className="text-lg font-medium text-gray-500">No vehicles found</h3>
          <p className="text-sm text-gray-400">Try adjusting your search or add new vehicles</p>
        </div>
      )}
    </Layout>
  );
};

export default Index;
