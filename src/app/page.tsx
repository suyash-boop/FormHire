import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import JobFeedSection from "@/components/home/JobFeedSection";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FormHire - Your Ultimate Job Search Companion",
  description:
    "Find your dream job from thousands of opportunities across industries. The perfect platform for job seekers and employers.",
};

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <JobFeedSection />
      <FeaturesSection />
      <Footer />
    </main>
  );
}
