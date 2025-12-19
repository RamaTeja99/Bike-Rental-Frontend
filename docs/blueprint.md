# **App Name**: GearShare

## Core Features:

- User Authentication: Phone number login with OTP verification using Firebase authentication with invisible reCAPTCHA to authenticate customers, verifiers and admins. Redirects to corresponding dashboard based on user role.
- ID Proof Verification: User verification through digilocker, validating aadhar/pan card and driving license before renting a bike.
- Bike Search and Sort: Search and sort available bikes based on name, brand, and price.
- Rental Booking: Select start/end date/time, check bike availability within 9 am - 10 pm every 30 minutes. Fixed price rental with Razorpay payment gateway (UPI enabled), inventory update and store bookings to the database.
- Admin Dashboard: Admin access to view present bookings and available bikes. CRUD operations on bikes. Physical user verification bypass (one-time use), including photo uploads of ID and driving license.
- Verifier Dashboard: Verifier manages bike handover, takes user photos, and updates user profile for verification. Physical verification bypass (one-time use) with ID/driving license photo uploads. Bike status updates (ready to rent, in process, not available, completed), uploading bike pics to database after return.
- Landing Page: A landing page presenting bike rental services and bike brand listings with the help of high quality visuals to engage users to the maximum amount possible. There will be integration to customer support using available methods

## Style Guidelines:

- Primary color: Vibrant Blue (#29ABE2) to represent trust, reliability, and the open road. 
- Background color: Light Blue (#E1F5FE), a very light tint of the primary to provide a clean, uncluttered backdrop.
- Accent color: Electric Green (#7CFC00), used for interactive elements and highlights to convey activity, eco-friendliness, and a call to action. 
- Body and headline font: 'Inter', sans-serif, providing a clean, modern, easily readable typeface that works well on both desktop and mobile platforms. 
- Minimalistic line icons to represent various features and categories, ensuring clarity and ease of understanding. Icons related to time, distance, payment, and user profiles should be distinct and easily recognizable.
- A responsive, mobile-first design that adapts seamlessly to different screen sizes. Clean and spacious layouts with clear visual hierarchy to guide users through the booking process. Use of cards to present bike options and booking details in a structured manner.
- Subtle transitions and animations to enhance user engagement, such as loading animations, button hover effects, and smooth scrolling.