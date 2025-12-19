'use client';
import { useState } from 'react';
import {
  collection,
  doc,
} from 'firebase/firestore';
import {
  useFirestore,
  useCollection,
  useMemoFirebase,
  addDocumentNonBlocking,
  updateDocumentNonBlocking,
  deleteDocumentNonBlocking,
} from '@/firebase';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MoreHorizontal, PlusCircle, Trash, Edit, Bike as BikeIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bike } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

const bikeStatuses: Bike['status'][] = [
  'ready to rent',
  'in process',
  'not available',
  'completed',
];

export default function ManageBikesPage() {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedBike, setSelectedBike] = useState<Partial<Bike> | null>(null);
  const firestore = useFirestore();
  const bikesCollectionRef = useMemoFirebase(
    () => collection(firestore, 'bikes'),
    [firestore]
  );
  const {
    data: bikes,
    isLoading,
    error,
  } = useCollection<Bike>(bikesCollectionRef);

  const handleSaveBike = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedBike || !bikesCollectionRef) return;

    const bikeData = {
      brand: selectedBike.brand || '',
      model: selectedBike.model || '',
      rentalPrice: Number(selectedBike.rentalPrice) || 0,
      status: selectedBike.status || 'not available',
      photoUrls: selectedBike.photoUrls || [],
    };

    if (selectedBike.id) {
      // Update existing bike
      const bikeDocRef = doc(firestore, 'bikes', selectedBike.id);
      updateDocumentNonBlocking(bikeDocRef, bikeData);
    } else {
      // Create new bike
      addDocumentNonBlocking(bikesCollectionRef, bikeData);
    }

    setDialogOpen(false);
    setSelectedBike(null);
  };

  const handleEdit = (bike: Bike) => {
    setSelectedBike(bike);
    setDialogOpen(true);
  };

  const handleAddNew = () => {
    setSelectedBike({});
    setDialogOpen(true);
  };

  const handleDelete = (bikeId: string) => {
    if (window.confirm('Are you sure you want to delete this bike?')) {
      const bikeDocRef = doc(firestore, 'bikes', bikeId);
      deleteDocumentNonBlocking(bikeDocRef);
    }
  };

  if (isLoading) {
    return <div>Loading bikes...</div>;
  }

  if (error) {
    return <div>Error loading bikes: {error.message}</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Manage Bikes</h1>
        <Button onClick={handleAddNew}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Bike
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bike Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bikes &&
                bikes.map((bike) => (
                  <TableRow key={bike.id}>
                    <TableCell>
                      {bike.photoUrls && bike.photoUrls[0] ? (
                        <Image
                          src={bike.photoUrls[0]}
                          alt={`${bike.brand} ${bike.model}`}
                          width={64}
                          height={64}
                          className="rounded-md object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center">
                          <BikeIcon className="w-8 h-8 text-muted-foreground" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{bike.brand}</TableCell>
                    <TableCell>{bike.model}</TableCell>
                    <TableCell>₹{bike.rentalPrice.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          bike.status === 'ready to rent'
                            ? 'default'
                            : 'destructive'
                        }
                      >
                        {bike.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleEdit(bike)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(bike.id)}
                            className="text-red-500"
                          >
                            <Trash className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedBike?.id ? 'Edit Bike' : 'Add New Bike'}
            </DialogTitle>
            <DialogDescription>
              Fill in the details below to add or update a bike.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveBike}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="brand" className="text-right">
                  Brand
                </Label>
                <Input
                  id="brand"
                  value={selectedBike?.brand || ''}
                  onChange={(e) =>
                    setSelectedBike({ ...selectedBike, brand: e.target.value })
                  }
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="model" className="text-right">
                  Model
                </Label>
                <Input
                  id="model"
                  value={selectedBike?.model || ''}
                  onChange={(e) =>
                    setSelectedBike({ ...selectedBike, model: e.target.value })
                  }
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="rentalPrice" className="text-right">
                  Rental Price
                </Label>
                <Input
                  id="rentalPrice"
                  type="number"
                  value={selectedBike?.rentalPrice || ''}
                  onChange={(e) =>
                    setSelectedBike({
                      ...selectedBike,
                      rentalPrice: parseFloat(e.target.value),
                    })
                  }
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select
                  value={selectedBike?.status || ''}
                  onValueChange={(value: Bike['status']) =>
                    setSelectedBike({ ...selectedBike, status: value })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {bikeStatuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="photoUrl" className="text-right">
                  Photo URL
                </Label>
                <Input
                  id="photoUrl"
                  value={(selectedBike?.photoUrls && selectedBike.photoUrls[0]) || ''}
                  onChange={(e) =>
                    setSelectedBike({ ...selectedBike, photoUrls: [e.target.value] })
                  }
                  className="col-span-3"
                  placeholder="https://example.com/bike.jpg"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
