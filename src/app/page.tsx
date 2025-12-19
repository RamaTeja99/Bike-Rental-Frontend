
"use client";

import Image from "next/image";
import Link from "next/link";
import React from 'react';

import {
  ArrowRight,
  Bike,
  CalendarCheck,
  ChevronRight,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import Autoplay from "embla-carousel-autoplay";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const howItWorks = [
  {
    icon: <CalendarCheck className="w-10 h-10 text-primary" />,
    title: "Choose Your Dates",
    description: "Select your rental start and end times. Our flexible scheduling fits your plans perfectly.",
  },
  {
    icon: <Bike className="w-10 h-10 text-primary" />,
    title: "Pick Your Bike",
    description: "Browse our wide selection of bikes and find the perfect ride for your adventure.",
  },
  {
    icon: <Wallet className="w-10 h-10 text-primary" />,
    title: "Secure Payment",
    description: "Pay securely with our integrated Razorpay gateway, supporting UPI and more.",
  },
  {
    icon: <ShieldCheck className="w-10 h-10 text-primary" />,
    title: "Enjoy Your Ride",
    description: "Pick up your bike from our verifier and hit the road with confidence.",
  },
];

const brands = PlaceHolderImages.filter(p => p.id.startsWith("brand-"));
const blogs = PlaceHolderImages.filter(p => p.id.startsWith("blog-"));
const heroImage = PlaceHolderImages.find(p => p.id === "hero-background");

export default function Home() {
    const plugin = React.useRef(
        Autoplay({ delay: 2000, stopOnInteraction: true })
    )

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <section className="relative w-full h-[60vh] md:h-[80vh] flex items-center justify-center text-center text-white">
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover -z-10 brightness-50"
              data-ai-hint={heroImage.imageHint}
              priority
            />
          )}
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto space-y-4">
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter font-headline uppercase">
                Your Ride, Your Rules.
              </h1>
              <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">
                Discover the freedom of the open road with GearShare. Premium bikes for every journey, available at your fingertips.
              </p>
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Link href="/login">
                  Find Your Ride <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="py-12 md:py-24 bg-secondary">
          <div className="container px-4 md:px-6">
            <div className="text-center space-y-3 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-headline">How It Works</h2>
              <p className="text-muted-foreground md:text-lg max-w-2xl mx-auto">
                Renting a bike with GearShare is as easy as a Sunday morning ride.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {howItWorks.map((step, index) => (
                <Card key={index} className="text-center shadow-md hover:shadow-xl transition-shadow duration-300">
                  <CardHeader>
                    <div className="mx-auto bg-secondary p-4 rounded-full w-fit">
                      {step.icon}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <h3 className="text-xl font-semibold">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="brands" className="py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 font-headline">
              Brands We Trust
            </h2>
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              plugins={[plugin.current]}
              onMouseEnter={plugin.current.stop}
              onMouseLeave={plugin.current.reset}
              className="w-full max-w-6xl mx-auto"
            >
              <CarouselContent>
                {brands.map((brand) => (
                  <CarouselItem key={brand.id} className="basis-1/3 md:basis-1/4 lg:basis-1/6">
                    <div className="p-1">
                      <div className="p-6 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300 h-24">
                         <Image
                            src={brand.imageUrl}
                            alt={brand.description}
                            width={120}
                            height={60}
                            className="object-contain"
                            data-ai-hint={brand.imageHint}
                          />
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden sm:flex"/>
              <CarouselNext className="hidden sm:flex"/>
            </Carousel>
          </div>
        </section>

        <section id="blog" className="py-12 md:py-24 bg-secondary">
          <div className="container px-4 md:px-6">
            <div className="text-center space-y-3 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-headline">From Our Blog</h2>
              <p className="text-muted-foreground md:text-lg max-w-2xl mx-auto">
                Tips, tricks, and stories from the road.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog) => (
                <Card key={blog.id} className="overflow-hidden group">
                  <div className="aspect-w-16 aspect-h-9 overflow-hidden">
                    <Image
                      src={blog.imageUrl}
                      alt={blog.description}
                      width={400}
                      height={225}
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      data-ai-hint={blog.imageHint}
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl">{blog.description}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      A short excerpt about this amazing adventure or bike maintenance tip that will change your life...
                    </CardDescription>
                  </CardContent>
                  <div className="px-6 pb-6">
                     <Button variant="link" asChild className="p-0">
                      <Link href="#">
                        Read More <ChevronRight className="w-4 h-4 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
