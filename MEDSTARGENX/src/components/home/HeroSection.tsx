import { Button } from '@/components/ui/button';
import { ArrowRight, Dna, Activity, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const HeroSection = () => {
  const { isAuthenticated } = useAuth();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 gradient-mesh" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/5 rounded-full blur-3xl animate-pulse-slow delay-1000" />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

      <div className="container relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 animate-fade-in">
            <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
            <span className="text-sm text-muted-foreground">AI-Powered Diagnostics • Now Available</span>
          </div>

          {/* Main heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <span className="text-foreground">Predicting the </span>
            <span className="text-secondary glow-text">Unseen</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
            AI-Driven Early Cancer Detection. Transform patient CSV data into actionable diagnostic insights with unprecedented accuracy.
          </p>

          {/* CTA buttons - Show different buttons based on auth status */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <Link to="/dashboard">
              <Button variant="hero" size="xl" className="w-full sm:w-auto">
                {isAuthenticated ? 'Go to Dashboard' : 'Start Diagnosis'}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button variant="heroOutline" size="xl">
              View Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-secondary mb-1">98.7%</div>
              <div className="text-sm text-muted-foreground">Accuracy Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-secondary mb-1">2M+</div>
              <div className="text-sm text-muted-foreground">Patients Analyzed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-secondary mb-1">&lt;3s</div>
              <div className="text-sm text-muted-foreground">Analysis Time</div>
            </div>
          </div>
        </div>

        {/* Floating elements */}
        <div className="absolute top-20 right-10 hidden lg:block animate-float">
          <div className="glass-card p-4 rounded-2xl">
            <Dna className="w-8 h-8 text-secondary" />
          </div>
        </div>
        <div className="absolute bottom-32 left-10 hidden lg:block animate-float" style={{ animationDelay: '2s' }}>
          <div className="glass-card p-4 rounded-2xl">
            <Activity className="w-8 h-8 text-success" />
          </div>
        </div>
        <div className="absolute top-40 left-20 hidden lg:block animate-float" style={{ animationDelay: '4s' }}>
          <div className="glass-card p-4 rounded-2xl">
            <Shield className="w-8 h-8 text-secondary" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
