
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { 
  Search, 
  CheckCircle, 
  XCircle, 
  Calendar, 
  Clock,
  User,
  Car
} from 'lucide-react';

// Mock data for active bookings
const mockActiveBookings = [
  {
    id: 'booking1',
    vehicleId: '1',
    vehicleName: 'Tesla Model S',
    startDate: new Date(),
    endDate: new Date(),
    startTime: '09:00',
    endTime: '12:00',
    purpose: 'Client meeting in downtown',
    bookedBy: 'John Smith',
    status: 'active',
  },
  {
    id: 'booking2',
    vehicleId: '3',
    vehicleName: 'BMW X5',
    startDate: new Date(new Date().setDate(new Date().getDate() + 1)),
    endDate: new Date(new Date().setDate(new Date().getDate() + 1)),
    startTime: '13:00',
    endTime: '17:00',
    purpose: 'Site inspection at construction site',
    bookedBy: 'Emma Johnson',
    status: 'active',
  },
  {
    id: 'booking3',
    vehicleId: '5',
    vehicleName: 'Audi A4',
    startDate: new Date(new Date().setDate(new Date().getDate() - 1)),
    endDate: new Date(new Date().setDate(new Date().getDate() + 2)),
    startTime: '08:00',
    endTime: '18:00',
    purpose: 'Conference transport',
    bookedBy: 'Michael Brown',
    status: 'active',
  },
];

// Mock data for past bookings
const mockPastBookings = [
  {
    id: 'booking4',
    vehicleId: '2',
    vehicleName: 'Toyota Camry',
    startDate: new Date(new Date().setDate(new Date().getDate() - 3)),
    endDate: new Date(new Date().setDate(new Date().getDate() - 3)),
    startTime: '14:00',
    endTime: '16:30',
    purpose: 'Airport pickup for executives',
    bookedBy: 'Sarah Williams',
    status: 'completed',
  },
  {
    id: 'booking5',
    vehicleId: '6',
    vehicleName: 'Mercedes E-Class',
    startDate: new Date(new Date().setDate(new Date().getDate() - 5)),
    endDate: new Date(new Date().setDate(new Date().getDate() - 4)),
    startTime: '09:30',
    endTime: '17:00',
    purpose: 'Business trip to regional office',
    bookedBy: 'David Miller',
    status: 'completed',
  },
  {
    id: 'booking6',
    vehicleId: '1',
    vehicleName: 'Tesla Model S',
    startDate: new Date(new Date().setDate(new Date().getDate() - 7)),
    endDate: new Date(new Date().setDate(new Date().getDate() - 7)),
    startTime: '11:00',
    endTime: '15:00',
    purpose: 'Client demonstration',
    bookedBy: 'Jennifer Lee',
    status: 'cancelled',
  },
];

const Management = () => {
  const [activeBookings, setActiveBookings] = useState(mockActiveBookings);
  const [pastBookings, setPastBookings] = useState(mockPastBookings);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('active');

  // Filter bookings based on search term
  const filteredActiveBookings = activeBookings.filter(booking => 
    booking.vehicleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.bookedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.purpose.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPastBookings = pastBookings.filter(booking => 
    booking.vehicleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.bookedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.purpose.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle completing a booking
  const handleCompleteBooking = (bookingId: string) => {
    const booking = activeBookings.find(b => b.id === bookingId);
    if (!booking) return;

    // Update booking status
    const updatedBooking = { ...booking, status: 'completed' };
    
    // Remove from active bookings
    setActiveBookings(prev => prev.filter(b => b.id !== bookingId));
    
    // Add to past bookings
    setPastBookings(prev => [updatedBooking, ...prev]);
    
    toast.success(`${booking.vehicleName} has been returned successfully.`);
  };

  // Handle cancelling a booking
  const handleCancelBooking = (bookingId: string) => {
    const booking = activeBookings.find(b => b.id === bookingId);
    if (!booking) return;

    // Update booking status
    const updatedBooking = { ...booking, status: 'cancelled' };
    
    // Remove from active bookings
    setActiveBookings(prev => prev.filter(b => b.id !== bookingId));
    
    // Add to past bookings
    setPastBookings(prev => [updatedBooking, ...prev]);
    
    toast.success(`Booking for ${booking.vehicleName} has been cancelled.`);
  };

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Booking Management</h1>
          <p className="text-muted-foreground">View and manage your vehicle bookings.</p>
        </div>

        <Card className="border border-gray-200/70">
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle>Your Bookings</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search bookings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-[300px] pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="active" onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="active" className="flex gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Active Bookings</span>
                  {activeBookings.length > 0 && (
                    <Badge className="ml-1 bg-primary/20 text-primary hover:bg-primary/30 text-xs">
                      {activeBookings.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="past" className="flex gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Past Bookings</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="active" className="mt-0">
                {filteredActiveBookings.length > 0 ? (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Vehicle</TableHead>
                          <TableHead>Date & Time</TableHead>
                          <TableHead>Purpose</TableHead>
                          <TableHead>Booked By</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredActiveBookings.map((booking) => (
                          <TableRow key={booking.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center">
                                <Car className="h-4 w-4 mr-2 text-primary" />
                                {booking.vehicleName}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                                  <span className="text-sm">
                                    {format(new Date(booking.startDate), 'MMM d, yyyy')}
                                    {!format(new Date(booking.startDate), 'MMM d, yyyy').includes(format(new Date(booking.endDate), 'MMM d, yyyy')) && 
                                      ` - ${format(new Date(booking.endDate), 'MMM d, yyyy')}`}
                                  </span>
                                </div>
                                <div className="flex items-center">
                                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                                  <span className="text-sm">{booking.startTime} - {booking.endTime}</span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{booking.purpose}</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                                {booking.bookedBy}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="h-8 gap-1 text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
                                  onClick={() => handleCompleteBooking(booking.id)}
                                >
                                  <CheckCircle className="h-4 w-4" />
                                  <span>Return</span>
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="h-8 gap-1 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                                  onClick={() => handleCancelBooking(booking.id)}
                                >
                                  <XCircle className="h-4 w-4" />
                                  <span>Cancel</span>
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-16 border border-dashed rounded-lg">
                    <Calendar className="h-12 w-12 mx-auto text-muted-foreground opacity-20 mb-4" />
                    <h3 className="text-lg font-medium text-muted-foreground">No active bookings</h3>
                    <p className="text-sm text-muted-foreground/60 mt-1">
                      {searchTerm ? 'No bookings match your search criteria' : 'You have no active vehicle bookings'}
                    </p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="past" className="mt-0">
                {filteredPastBookings.length > 0 ? (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Vehicle</TableHead>
                          <TableHead>Date & Time</TableHead>
                          <TableHead>Purpose</TableHead>
                          <TableHead>Booked By</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredPastBookings.map((booking) => (
                          <TableRow key={booking.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center">
                                <Car className="h-4 w-4 mr-2 text-primary" />
                                {booking.vehicleName}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                                  <span className="text-sm">
                                    {format(new Date(booking.startDate), 'MMM d, yyyy')}
                                    {!format(new Date(booking.startDate), 'MMM d, yyyy').includes(format(new Date(booking.endDate), 'MMM d, yyyy')) && 
                                      ` - ${format(new Date(booking.endDate), 'MMM d, yyyy')}`}
                                  </span>
                                </div>
                                <div className="flex items-center">
                                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                                  <span className="text-sm">{booking.startTime} - {booking.endTime}</span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{booking.purpose}</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                                {booking.bookedBy}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant={booking.status === 'completed' ? 'outline' : 'destructive'}
                                className={booking.status === 'completed' 
                                  ? 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200'
                                  : ''}
                              >
                                {booking.status === 'completed' ? 'Completed' : 'Cancelled'}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-16 border border-dashed rounded-lg">
                    <Clock className="h-12 w-12 mx-auto text-muted-foreground opacity-20 mb-4" />
                    <h3 className="text-lg font-medium text-muted-foreground">No past bookings</h3>
                    <p className="text-sm text-muted-foreground/60 mt-1">
                      {searchTerm ? 'No bookings match your search criteria' : 'You have no past vehicle bookings'}
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </Layout>
  );
};

export default Management;
