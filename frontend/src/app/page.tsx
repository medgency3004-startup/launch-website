import { HeroSection } from "@/components/home/HeroSection";
import { PharmacyTrust } from "@/components/home/PharmacyTrust";
import { HowItWorks } from "@/components/home/HowItWorks";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";

export default function HomePage() {
  return (
    <main className="w-full">
      <HeroSection />
      <PharmacyTrust />
      <HowItWorks />
      <WhyChooseUs />
    </main>
  );
}