import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, firebaseUid } = await request.json();

    // Verify with your backend/database
    // const user = await db.users.findByPhoneNumber(phoneNumber);

    // Generate JWT token
    const token = jwt.sign(
      { phoneNumber, firebaseUid, role: "CUSTOMER" },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "7d" }
    );

    return NextResponse.json({
      token,
      user: {
        id: firebaseUid,
        phoneNumber,
        role: "CUSTOMER",
      },
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
