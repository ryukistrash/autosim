"use client";

import { useRouter } from "next/navigation";
import { Hero } from "@/components/home/Hero";
import { CarGrid } from "@/components/home/CarGrid";
import { HowItWorks } from "@/components/home/HowItWorks";
import { FAQ } from "@/components/home/FAQ";

export default function HomePage() {
  const router = useRouter();

  const handleCarSelect = (carId: string) => {
    router.push("/simulacao");
  };

  return (
    <main>
      <Hero />

      <CarGrid onCarSelect={handleCarSelect} />

      <HowItWorks />

      <FAQ />
    </main>
  );
}
