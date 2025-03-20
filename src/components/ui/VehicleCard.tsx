
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Car, Users, Fuel, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface VehicleCardProps {
  id: string;
  name: string;
  model: string;
  image: string;
  seats: number;
  fuelType: string;
  status: 'available' | 'booked' | 'maintenance';
  licensePlate: string;
}

const VehicleCard: React.FC<VehicleCardProps> = ({
  id,
  name,
  model,
  image,
  seats,
  fuelType,
  status,
  licensePlate
}) => {
  const navigate = useNavigate();
  
  const statusColors = {
    available: 'bg-green-100 text-green-800 border-green-200',
    booked: 'bg-orange-100 text-orange-800 border-orange-200',
    maintenance: 'bg-red-100 text-red-800 border-red-200'
  };
  
  const statusText = {
    available: 'Available',
    booked: 'Booked',
    maintenance: 'Maintenance'
  };

  const handleBookClick = () => {
    navigate(`/booking/${id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-md border border-gray-200/70">
        <div className="relative pt-[56.25%] bg-secondary/30 overflow-hidden">
          <img 
            src={image || '/placeholder.svg'} 
            alt={`${name} ${model}`} 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            loading="lazy"
          />
          <Badge 
            className={`absolute top-3 right-3 ${statusColors[status]} border px-2 py-1`}
            variant="outline"
          >
            {statusText[status]}
          </Badge>
        </div>
        <CardContent className="p-5 flex-grow">
          <h3 className="text-lg font-semibold mb-1 text-foreground">{name}</h3>
          <p className="text-sm text-muted-foreground mb-4">{model}</p>
          
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center text-muted-foreground">
              <Users className="h-4 w-4 mr-2" />
              <span>{seats} seats</span>
            </div>
            <div className="flex items-center text-muted-foreground">
              <Fuel className="h-4 w-4 mr-2" />
              <span>{fuelType}</span>
            </div>
            <div className="flex items-center text-muted-foreground col-span-2">
              <Car className="h-4 w-4 mr-2" />
              <span>{licensePlate}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="px-5 pb-5 pt-0">
          <Button 
            onClick={handleBookClick}
            className="w-full"
            disabled={status !== 'available'}
            variant={status === 'available' ? 'default' : 'outline'}
          >
            {status === 'available' ? (
              <>
                <Calendar className="mr-2 h-4 w-4" />
                Book Vehicle
              </>
            ) : 'Not Available'}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default VehicleCard;
