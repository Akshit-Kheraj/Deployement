import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, ShieldCheck, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

interface AdminLayoutProps {
    children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
    const { user, logout } = useAuth();
    const location = useLocation();

    return (
        <div className="min-h-screen flex w-full">
            <aside className="fixed left-0 top-0 h-screen w-64 glass border-r border-border/50 z-40 flex flex-col">
                {/* Logo */}
                <div className="p-4 border-b border-border/50">
                    <Link to="/" className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-secondary/10 glow-cyan-soft shrink-0">
                            <Activity className="w-5 h-5 text-secondary" />
                        </div>
                        <span className="text-lg font-bold whitespace-nowrap">Med Star Gen X</span>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2">
                    <Link to="/admin">
                        <Button
                            variant={location.pathname === '/admin' ? 'secondary' : 'ghost'}
                            className="w-full justify-start gap-3"
                        >
                            <ShieldCheck className="w-5 h-5 shrink-0" />
                            <span>Admin Dashboard</span>
                        </Button>
                    </Link>
                </nav>

                {/* Logout button */}
                <div className="p-4 border-t border-border/50">
                    {user && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={async () => {
                                await logout();
                                window.location.href = '/auth';
                            }}
                        >
                            <LogOut className="w-5 h-5 shrink-0" />
                            <span>Logout</span>
                        </Button>
                    )}
                </div>
            </aside>

            <main className="flex-1 ml-64 transition-all duration-300">
                {children}
            </main>
        </div>
    );
};

export default AdminLayout;
