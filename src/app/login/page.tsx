"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2, LogIn, KeyRound } from "lucide-react";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";


import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { GearShareLogo } from "@/components/icons";
import { useAuth, useFirestore } from "@/firebase";

const phoneSchema = z.object({
  phone: z.string().length(10, {
    message: "Phone number must be 10 digits.",
  }).regex(/^\d{10}$/, "Phone number must only contain digits."),
});

const otpSchema = z.object({
  otp: z.string().min(6, {
    message: "OTP must be 6 digits.",
  }),
});

type LoginStep = "phone" | "otp";

const ADMIN_NUMBER = "9963400955";
const VERIFIER_NUMBERS = [
  "9876543210",
  "9876543211",
  "9876543212",
  "9876543213",
  "9876543214",
  "9876543215",
  "9876543216",
  "9876543217",
  "9876543218",
  "9876543219",
];


export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const firestore = useFirestore();

  const [step, setStep] = useState<LoginStep>("phone");
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  useEffect(() => {
    if (auth && !window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        'size': 'invisible',
        'callback': (response: any) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
        }
      });
    }
  }, [auth]);

  const phoneForm = useForm<z.infer<typeof phoneSchema>>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phone: "" },
  });

  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  async function onSendOtp(values: z.infer<typeof phoneSchema>) {
    setIsLoading(true);
    setPhoneNumber(values.phone);
    const fullPhoneNumber = "+91" + values.phone;
    console.log("Sending OTP to: " + fullPhoneNumber);
    
    if (!auth) {
      toast({ variant: "destructive", title: "Authentication service not available." });
      setIsLoading(false);
      return;
    }

    try {
      const appVerifier = window.recaptchaVerifier;
      const confirmation = await signInWithPhoneNumber(auth, fullPhoneNumber, appVerifier);
      setConfirmationResult(confirmation);
      toast({
        title: "OTP Sent",
        description: "Check your phone for the verification code.",
      });
      setStep("otp");
    } catch (error: any) {
      console.error("Error sending OTP:", error);
      let title = "Failed to Send OTP";
      let description = "An unknown error occurred. Please try again.";

      switch (error.code) {
        case 'auth/too-many-requests':
          description = "You've made too many requests. Please try again later.";
          break;
        case 'auth/invalid-phone-number':
          description = "The phone number you entered is not valid.";
          break;
        case 'auth/operation-not-allowed':
          title = "Configuration Error";
          description = "Phone sign-in is not enabled for this app. Please contact support.";
          break;
        case 'auth/missing-client-identifier':
           title = "Verification Failed";
           description = "reCAPTCHA verification failed. Please refresh and try again.";
           break;
        case 'auth/billing-not-enabled':
          title = "Billing Not Enabled";
          description = "The project's phone authentication quota has been reached. Please upgrade to a paid plan in Firebase.";
          break;
      }
      
      toast({
        variant: "destructive",
        title: title,
        description: description,
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function onVerifyOtp(values: z.infer<typeof otpSchema>) {
    if (!confirmationResult) {
      toast({ variant: "destructive", title: "Verification process not started." });
      return;
    }
    setIsVerifying(true);
    console.log("Verifying OTP:", values.otp);
    
    try {
      const result = await confirmationResult.confirm(values.otp);
      const user = result.user;

      let role: "customer" | "admin" | "verifier" = "customer";
      if (phoneNumber === ADMIN_NUMBER) {
        role = "admin";
      } else if (VERIFIER_NUMBERS.includes(phoneNumber)) {
        role = "verifier";
      }

      if (firestore) {
        const userRef = doc(firestore, "users", user.uid);
        await setDoc(userRef, {
          id: user.uid,
          phoneNumber: user.phoneNumber,
          role: role,
          digilockerVerified: false,
          physicalVerificationBypass: false,
        }, { merge: true });
      }


      toast({
        title: "Login Successful",
        description: `Redirecting to ${role} dashboard...`,
      });

      router.push(`/dashboard/${role}`);

    } catch (error: any) {
      console.error("Error verifying OTP:", error);
       toast({
        variant: "destructive",
        title: "Invalid OTP",
        description: "The code you entered is incorrect. Please try again.",
      });
    } finally {
        setIsVerifying(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <GearShareLogo className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold font-headline">Welcome to GearShare</CardTitle>
          <CardDescription>
            {step === "phone" ? "Enter your phone number to begin." : `Enter the OTP sent to +91 ${phoneNumber}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === "phone" ? (
            <Form {...phoneForm}>
              <form onSubmit={phoneForm.handleSubmit(onSendOtp)} className="space-y-6">
                <FormField
                  control={phoneForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <div className="flex items-center">
                          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-background text-muted-foreground sm:text-sm">
                            +91
                          </span>
                          <Input placeholder="9876543210" {...field} className="rounded-l-none" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <LogIn className="mr-2 h-4 w-4" />
                  )}
                  Send OTP
                </Button>
              </form>
            </Form>
          ) : (
            <div className="space-y-6">
                <Form {...otpForm}>
                <form onSubmit={otpForm.handleSubmit(onVerifyOtp)} className="space-y-6">
                    <FormField
                    control={otpForm.control}
                    name="otp"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Verification Code</FormLabel>
                        <FormControl>
                            <Input placeholder="123456" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <Button type="submit" className="w-full" disabled={isVerifying}>
                    {isVerifying ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <KeyRound className="mr-2 h-4 w-4" />
                    )}
                    Verify & Login
                    </Button>
                </form>
                </Form>
                 <Button variant="link" size="sm" onClick={() => { setStep('phone'); setPhoneNumber(''); }} className="w-full">
                    Use a different phone number
                </Button>
            </div>
          )}
          <div id="recaptcha-container" className="mt-4"></div>
        </CardContent>
      </Card>
    </div>
  );
}
