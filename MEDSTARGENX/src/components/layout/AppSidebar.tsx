import { Link, useLocation } from 'react-router-dom';
import { Activity, Home, Stethoscope, Users, Settings, ChevronLeft, ChevronRight, ShieldCheck, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

const navItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Stethoscope, label: 'Diagnostics', path: '/dashboard' },
  { icon: Users, label: 'Patient Records', path: '/records' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

const adminNavItem = { icon: ShieldCheck, label: 'Admin Panel', path: '/admin' };

const AppSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen glass border-r border-border/50 transition-all duration-300 z-40 flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="p-4 border-b border-border/50">
        <Link to="/" className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-secondary/10 glow-cyan-soft shrink-0">
            <Activity className="w-5 h-5 text-secondary" />
          </div>
          {!collapsed && (
            <span className="text-lg font-bold whitespace-nowrap">Med Star Gen X</span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.label} to={item.path}>
              <Button
                variant={isActive ? 'secondary' : 'ghost'}
                className={cn(
                  "w-full justify-start gap-3",
                  collapsed && "justify-center px-2"
                )}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Button>
            </Link>
          );
        })}

        {/* Admin Panel - Only visible for admins */}
        {user?.role === 'admin' && (
          <Link to={adminNavItem.path}>
            <Button
              variant={location.pathname === adminNavItem.path ? 'secondary' : 'ghost'}
              className={cn(
                "w-full justify-start gap-3",
                collapsed && "justify-center px-2"
              )}
            >
              <adminNavItem.icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span>{adminNavItem.label}</span>}
            </Button>
          </Link>
        )}
      </nav>

      {/* Collapse toggle */}
      <div className="p-4 border-t border-border/50 space-y-2">
        {/* Logout button - only show when user is logged in */}
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
            {!collapsed && <span>Logout</span>}
          </Button>
        )}

        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-center"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5 mr-2" />
              <span>Collapse</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  );
};

export default AppSidebar;
