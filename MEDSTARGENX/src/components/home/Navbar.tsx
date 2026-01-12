import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Activity, Menu } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="bg-background/95 backdrop-blur-md border-b border-border/50 shadow-sm">
        <div className="container px-6">
          <nav className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10">
                <Activity className="w-5 h-5 text-primary" />
              </div>
              <span className="text-lg font-bold hidden sm:block">Med Star Gen X</span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Home
              </Link>
              <Link to="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Diagnostics
              </Link>
              <Link to="/research" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Research
              </Link>
              <Link to="/pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </Link>
            </div>

            {/* CTA - Show different buttons based on auth status */}
            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated ? (
                <Link to="/dashboard">
                  <Button variant="hero" size="sm">Go to Dashboard</Button>
                </Link>
              ) : (
                <>
                  <Link to="/auth">
                    <Button variant="ghost" size="sm">Sign In</Button>
                  </Link>
                  <Link to="/auth">
                    <Button variant="hero" size="sm">Get Started</Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="w-5 h-5" />
            </Button>
          </nav>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border/50 py-4 bg-background">
            <div className="container px-6 space-y-4">
              <Link to="/" className="block text-sm font-medium text-muted-foreground hover:text-foreground">Home</Link>
              <Link to="/dashboard" className="block text-sm font-medium text-muted-foreground hover:text-foreground">Diagnostics</Link>
              <Link to="/research" className="block text-sm font-medium text-muted-foreground hover:text-foreground">Research</Link>
              <Link to="/pricing" className="block text-sm font-medium text-muted-foreground hover:text-foreground">Pricing</Link>
              <div className="pt-4 space-y-2 border-t border-border/50">
                {isAuthenticated ? (
                  <Link to="/dashboard" className="block">
                    <Button variant="hero" className="w-full">Go to Dashboard</Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/auth" className="block">
                      <Button variant="ghost" className="w-full justify-start">Sign In</Button>
                    </Link>
                    <Link to="/auth" className="block">
                      <Button variant="hero" className="w-full">Get Started</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
