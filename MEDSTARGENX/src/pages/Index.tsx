import Navbar from '@/components/home/Navbar';
import HeroSection from '@/components/home/HeroSection';
import ValueProposition from '@/components/home/ValueProposition';
import ProductPreview from '@/components/home/ProductPreview';
import SocialProof from '@/components/home/SocialProof';
import Footer from '@/components/home/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <ValueProposition />
      <ProductPreview />
      <SocialProof />
      <Footer />
    </div>
  );
};

export default Index;
