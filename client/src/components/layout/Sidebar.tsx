import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutGrid,
  Users,
  HelpCircle,
  Sparkles,
  ShoppingBag,
  Settings,
  LifeBuoy,
  BookOpen,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';

interface SidebarProps {
  onNewSessionClick?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onNewSessionClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutGrid },
    { label: 'Study Rooms', path: '/study-rooms', icon: Users },
    { label: 'Doubts', path: '/doubts', icon: HelpCircle },
    { label: 'AI Tools', path: '/ai-tools', icon: Sparkles },
    { label: 'Marketplace', path: '/pricing', icon: ShoppingBag },
  ];

  const bottomNavItems = [
    { label: 'Settings', path: '/settings', icon: Settings },
    { label: 'Support', path: '/settings?tab=support', icon: LifeBuoy },
  ];

  return (
    <aside className="w-60 bg-white border-r border-[#E5E7EB] flex flex-col justify-between h-screen sticky top-0 shrink-0 select-none z-30">
      {/* Top Part */}
      <div className="p-5 flex flex-col gap-6">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#151C2F] flex items-center justify-center text-white shadow-xs">
            <BookOpen className="w-4 h-4 stroke-[2.2]" />
          </div>
          <span className="font-bold text-xl text-[#151C2F] tracking-tight">StudySphere</span>
        </NavLink>

        {/* User Card */}
        {user ? (
          <NavLink
            to="/profile"
            className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-[#F8F9FB] transition-colors group"
          >
            <Avatar
              src={user.avatar}
              name={user.name}
              size="md"
              plan={user.plan || 'free'}
              showPlanBadge={true}
            />
            <div className="overflow-hidden text-left">
              <div className="flex items-center gap-1.5">
                <h4 className="text-sm font-bold text-[#151C2F] truncate leading-tight">
                  {user.name}
                </h4>
                {user.plan === 'pro' && (
                  <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-xs">
                    PRO
                  </span>
                )}
                {user.plan === 'university' && (
                  <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-gradient-to-r from-[#0057BE] to-indigo-600 text-white shadow-xs">
                    UNI
                  </span>
                )}
              </div>
              <p
                className={`text-[12px] font-semibold truncate ${
                  user.plan === 'pro'
                    ? 'text-[#D97706]'
                    : user.plan === 'university'
                    ? 'text-[#0057BE]'
                    : 'text-[#667085]'
                }`}
              >
                {user.plan === 'pro'
                  ? 'Pro Scholar'
                  : user.plan === 'university'
                  ? 'University Circle'
                  : user.tier || 'Novice Scholar'}{' '}
                • {(user.points ?? 0).toLocaleString()} pts
              </p>
            </div>
          </NavLink>
        ) : (
          <NavLink
            to="/login"
            className="flex items-center justify-center gap-2 p-2.5 rounded-lg border border-[#E5E7EB] hover:bg-[#F8F9FB] text-xs font-bold text-[#0057BE] transition-colors"
          >
            Sign In / Register
          </NavLink>
        )}

        {/* Main Navigation */}
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'text-[#0057BE] bg-[#EAF2FC]/70 font-semibold'
                      : 'text-[#667085] hover:text-[#151C2F] hover:bg-[#F8F9FB]'
                  }`
                }
              >
                <Icon className="w-4 h-4 stroke-[2]" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Part */}
      <div className="p-5 border-t border-[#E5E7EB] flex flex-col gap-4">
        <nav className="flex flex-col gap-1">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'text-[#0057BE] font-semibold bg-[#EAF2FC]/70'
                      : 'text-[#667085] hover:text-[#151C2F] hover:bg-[#F8F9FB]'
                  }`
                }
              >
                <Icon className="w-4 h-4 stroke-[2]" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
          {user && (
            <button
              onClick={() => {
                logout();
                navigate('/login', { replace: true });
              }}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-all text-left w-full cursor-pointer"
            >
              <LogOut className="w-4 h-4 stroke-[2]" />
              <span>Sign Out</span>
            </button>
          )}
        </nav>

        {/* New Study Session CTA */}
        <Button
          variant="dark"
          size="md"
          fullWidth
          className="rounded-lg font-medium text-sm py-2.5 bg-[#151C2F] hover:bg-[#1E293B]"
          onClick={onNewSessionClick || (() => navigate('/study-rooms'))}
        >
          New Study Session
        </Button>
      </div>
    </aside>
  );
};
