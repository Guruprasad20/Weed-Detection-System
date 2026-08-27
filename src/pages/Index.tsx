import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import StatsSection from "@/components/StatsSection";
import ClassificationGallery from "@/components/ClassificationGallery";
import UploadSection from "@/components/UploadSection";
import AboutSection from "@/components/AboutSection";
import FAQ from "@/components/FAQ";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => (
  <div className="min-h-screen">
    <Navbar />
    <main>
      <h1 className="sr-only">WeedVision AI — AI-powered weed detection and classification</h1>
      <HeroSection />
      <HowItWorks />
      <StatsSection />
      <ClassificationGallery />
      <UploadSection />
      <AboutSection />
      <FAQ />
      <ContactSection />
    </main>
    <Footer />
  </div>
);

export default Index;
