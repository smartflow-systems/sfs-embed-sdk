import HeroSection from "@/components/HeroSection";
import IntegrationExamples from "@/components/IntegrationExamples";
import FeaturesSection from "@/components/FeaturesSection";
import DocumentationSection from "@/components/DocumentationSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <IntegrationExamples />
      <FeaturesSection />
      <DocumentationSection />
      <Footer />
    </div>
  );
}
