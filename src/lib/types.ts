export type Bike = {
    id: string;
    brand: string;
    model: string;
    rentalPrice: number;
    status: 'ready to rent' | 'in process' | 'not available' | 'completed';
    photoUrls: string[];
};

export type User = {
    id: string;
    phoneNumber: string;
    role: 'customer' | 'verifier' | 'admin';
    digilockerVerified: boolean;
    physicalVerificationBypass: boolean;
    idProofPhotoUrl?: string;
    drivingLicensePhotoUrl?: string;
};

export type Booking = {
    id: string;
    userId: string;
    bikeId: string;
    startTime: Date;
    endTime: Date;
    totalPrice: number;
    bookingStatus: 'upcoming' | 'active' | 'completed' | 'cancelled';
};
