import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Search, Bell, Flame, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface TopbarProps {
  onMobileMenuToggle?: () => void;
  onSearch?: (query: string) => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onMobileMenuToggle, onSearch }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchVal, setSearchVal] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchVal);
    } else if (searchVal.trim()) {
      navigate(`/study-rooms?search=${encodeURIComponent(searchVal)}`);
    }
  };

  const notifications = [
    {
      id: 'welcome',
      text: `Welcome to StudySphere, ${user?.name || 'Scholar'}! Jump into a room or ask a doubt to get started.`,
      time: 'Just now',
      read: false,
    },
    ...(user?.streak && user.streak > 0
      ? [
          {
            id: 'streak',
            text: `🔥 Active streak: ${user.streak} day${user.streak === 1 ? '' : 's'}! Keep the momentum going today.`,
            time: 'Today',
            read: false,
          },
        ]
      : []),
    ...(user?.points && user.points > 0
      ? [
          {
            id: 'points',
            text: `⭐ You have accumulated ${user.points.toLocaleString()} mastery points!`,
            time: 'Today',
            read: true,
          },
        ]
      : []),
  ];

  return (
    <header className="h-16 bg-[#F8F9FB] border-b border-[#E5E7EB] px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Left side links & mobile toggle */}
      <div className="flex items-center gap-6">
        <button
          onClick={onMobileMenuToggle}
          className="lg:hidden p-2 text-[#667085] hover:text-[#151C2F] rounded-lg"
          aria-label="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-6 text-sm font-medium text-[#667085]">
          <NavLink
            to="/study-rooms"
            className={({ isActive }) =>
              `hover:text-[#151C2F] transition-colors ${
                isActive ? 'text-[#151C2F] font-semibold' : ''
              }`
            }
          >
            Focus Mode
          </NavLink>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `hover:text-[#151C2F] transition-colors ${
                isActive ? 'text-[#151C2F] font-semibold' : ''
              }`
            }
          >
            Schedule
          </NavLink>
        </div>
      </div>

      {/* Right side search and actions */}
      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative hidden md:block w-72">
          <Search className="w-4 h-4 text-[#98A2B3] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search rooms, subjects..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="w-full bg-[#F3F4F6] border border-transparent hover:border-[#E5E7EB] focus:border-[#0057BE] focus:bg-white text-sm text-[#151C2F] placeholder-[#98A2B3] rounded-full pl-9 pr-4 py-1.5 outline-none transition-all"
          />
        </form>

        {/* Bell with red badge */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-[#667085] hover:text-[#151C2F] hover:bg-white rounded-full transition-colors relative"
            aria-label="View notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#EF4444]" />
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl border border-[#E5E7EB] shadow-lg p-3 z-50">
              <div className="flex items-center justify-between px-2 py-1 border-b border-gray-100 pb-2">
                <span className="text-xs font-bold text-[#151C2F]">Notifications</span>
                <span className="text-[11px] text-[#0057BE] font-medium cursor-pointer">Mark all as read</span>
              </div>
              <div className="flex flex-col gap-2 mt-2">
                {notifications.map((n) => (
                  <div key={n.id} className="p-2 rounded-lg hover:bg-gray-50 text-xs flex flex-col gap-0.5">
                    <p className="text-[#151C2F] font-medium">{n.text}</p>
                    <span className="text-[10px] text-[#98A2B3]">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Fire Streak */}
        <div
          title={`${user?.streak ?? 0} Day Streak!`}
          className="flex items-center gap-1.5 text-[#10B981] hover:text-[#059669] cursor-pointer p-1.5 px-2 rounded-full hover:bg-white transition-colors"
        >
          <Flame className="w-5 h-5 fill-current" />
          <span className="text-xs font-bold text-[#10B981]">{user?.streak ?? 0}</span>
        </div>

        {/* Notifications Button */}
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="hidden sm:inline-flex items-center px-3.5 py-1.5 rounded-full bg-[#EAF2FC] text-[#0057BE] text-xs font-semibold hover:bg-[#D8E8FA] transition-colors"
        >
          Notifications
        </button>
      </div>
    </header>
  );
};
