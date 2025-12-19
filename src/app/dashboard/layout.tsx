'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  LogOut,
  User,
  ShieldCheck,
  LayoutDashboard,
  Bike,
  BookMarked,
  Users,
} from 'lucide-react';
import { GearShareLogo } from '@/components/icons';
import { useAuth, useDoc, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';
import { doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';

function DashboardSidebar() {
  const { user } = useUser();
  const firestore = useFirestore();
  const auth = useAuth();
  const router = useRouter();
  const { setOpen } = useSidebar();

  const userDocRef = useMemoFirebase(() => user ? doc(firestore, 'users', user.uid) : null, [firestore, user]);
  const { data: userData } = useDoc<{ role: string }>(userDocRef);
  const userRole = userData?.role;
  const avatarImage = PlaceHolderImages.find((p) => p.id === 'user-avatar-1');

  const handleLogout = async () => {
    if (auth) {
      await auth.signOut();
    }
    router.push('/login');
  };

  const navItems = [
    { href: '/dashboard/customer', label: 'Dashboard', icon: <LayoutDashboard />, roles: ['customer'] },
    { href: '/dashboard/customer/bookings', label: 'My Bookings', icon: <BookMarked />, roles: ['customer'] },
    { href: '/dashboard/customer/bikes', label: 'Browse Bikes', icon: <Bike />, roles: ['customer'] },
    { href: '/dashboard/admin', label: 'Dashboard', icon: <LayoutDashboard />, roles: ['admin'] },
    { href: '/dashboard/admin/bikes', label: 'Manage Bikes', icon: <Bike />, roles: ['admin'] },
    { href: '/dashboard/admin/users', label: 'Manage Users', icon: <Users />, roles: ['admin'] },
    { href: '/dashboard/verifier', label: 'Dashboard', icon: <LayoutDashboard />, roles: ['verifier'] },
    { href: '/dashboard/verifier/verifications', label: 'Verifications', icon: <ShieldCheck />, roles: ['verifier'] },
  ].filter(item => userRole && item.roles.includes(userRole));

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <div className="flex items-center gap-2 p-2">
            <GearShareLogo className="h-8 w-8 text-primary" />
            <span className="text-lg font-semibold font-headline">GearShare</span>
          </div>
        </SidebarGroup>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton
                onClick={() => {
                  router.push(item.href);
                  setOpen(false);
                }}
              >
                {item.icon}
                <span>{item.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        <div className="mt-auto">
          <SidebarGroup>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout}>
                  <LogOut />
                  <span>Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  const userDocRef = useMemoFirebase(() => user ? doc(firestore, 'users', user.uid) : null, [firestore, user]);
  const { data: userData, isLoading: isUserDocLoading } = useDoc<{
    role: string;
    phoneNumber: string;
  }>(userDocRef);
  const avatarImage = PlaceHolderImages.find((p) => p.id === 'user-avatar-1');


  if (isUserLoading || isUserDocLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!user) {
    router.push('/login');
    return null;
  }
  
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
          <div className="flex items-center gap-4">
             <SidebarTrigger className="md:hidden"/>
            <h1 className="text-xl font-semibold">
                {`Welcome, ${userData?.role || 'user'}!`}
            </h1>
          </div>
          <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground hidden sm:inline-block">{userData?.phoneNumber}</span>
              <Avatar className="h-9 w-9">
                {avatarImage && <AvatarImage src={avatarImage.imageUrl} alt="User Avatar" />}
                <AvatarFallback>
                  <User />
                </AvatarFallback>
              </Avatar>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
