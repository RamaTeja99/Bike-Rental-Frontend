'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function VerifierDashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Verifier Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Pending Verifications</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">5</p>
            <p className="text-sm text-muted-foreground">Users waiting for physical document verification.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Completed Verifications</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">128</p>
            <p className="text-sm text-muted-foreground">Total users verified by you.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
