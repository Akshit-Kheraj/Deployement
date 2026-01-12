import { Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="relative py-16 border-t border-border/30">
      <div className="container px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-secondary/10">
              <Activity className="w-6 h-6 text-secondary" />
            </div>
            <span className="text-xl font-bold">Med Star Gen X</span>
          </div>

          <nav className="flex items-center gap-8">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
            <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">Diagnostics</Link>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Documentation</a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Contact</a>
          </nav>

          <p className="text-sm text-muted-foreground">
            © 2025 Med Star Gen X. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
