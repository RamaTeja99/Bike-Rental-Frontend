'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';


export default function CustomerDashboardPage() {
  return (
    <div className="space-y-6">
        <Card className="bg-primary text-primary-foreground">
            <CardHeader>
                <CardTitle>Ready for an Adventure?</CardTitle>
                <CardDescription className="text-primary-foreground/80">Your next ride is just a few clicks away. Browse our selection and hit the road.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button asChild variant="secondary">
                    <Link href="/dashboard/customer/bikes">
                        Browse Bikes <ArrowRight className="ml-2" />
                    </Link>
                </Button>
            </CardContent>
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
                <CardHeader>
                    <CardTitle>My Upcoming Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">You have no upcoming bookings. Time to plan a trip!</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Verification Status</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-2">
                         <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                        </span>
                        <p className="text-orange-500 font-semibold">Digilocker Verification Pending</p>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">Complete your verification to unlock seamless bookings.</p>
                    <Button size="sm" className="mt-4">Verify with Digilocker</Button>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
