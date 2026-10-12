import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings as SettingsIcon, Bell, Volume2, Shield, LogOut, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';

export const Settings: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [chimeEnabled, setChimeEnabled] = useState(true);
  const [timerAlerts, setTimerAlerts] = useState(true);
  const [doubtNotifications, setDoubtNotifications] = useState(true);
  const [defaultDuration, setDefaultDuration] = useState('25');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="space-y-8 font-sans max-w-4xl mx-auto pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#151C2F] tracking-tight">
          Settings & Preferences
        </h1>
        <p className="text-sm text-[#667085] mt-1">
          Customize your study workspace, audio alerts, and session defaults.
        </p>
      </div>

      {saved && (
        <div className="p-3 bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl text-xs font-bold text-[#065F46] flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Preferences updated successfully!</span>
        </div>
      )}

      {/* Focus & Audio Settings */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 sm:p-7 shadow-xs space-y-6">
        <h3 className="text-base font-extrabold text-[#151C2F] flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-[#0057BE]" />
          <span>Session Audio & Pomodoro</span>
        </h3>

        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between py-2 border-b border-[#E5E7EB]">
            <div>
              <div className="font-bold text-[#151C2F]">Session Completion Chime</div>
              <div className="text-[#667085]">Play gentle acoustic chime when Pomodoro interval ends</div>
            </div>
            <input
              type="checkbox"
              checked={chimeEnabled}
              onChange={(e) => setChimeEnabled(e.target.checked)}
              className="w-4 h-4 text-[#0057BE] rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between py-2 border-b border-[#E5E7EB]">
            <div>
              <div className="font-bold text-[#151C2F]">Default Pomodoro Duration</div>
              <div className="text-[#667085]">Standard deep work interval in minutes</div>
            </div>
            <select
              value={defaultDuration}
              onChange={(e) => setDefaultDuration(e.target.value)}
              className="bg-[#F8F9FB] border border-[#E5E7EB] rounded-lg px-3 py-1.5 text-xs font-semibold outline-none"
            >
              <option value="25">25 Minutes (Standard)</option>
              <option value="45">45 Minutes (Extended)</option>
              <option value="50">50 Minutes (Deep Work)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 sm:p-7 shadow-xs space-y-6">
        <h3 className="text-base font-extrabold text-[#151C2F] flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#0057BE]" />
          <span>Notification Alerts</span>
        </h3>

        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between py-2 border-b border-[#E5E7EB]">
            <div>
              <div className="font-bold text-[#151C2F]">Live Doubt Alerts in Study Rooms</div>
              <div className="text-[#667085]">Display pop-up banners when peers raise questions</div>
            </div>
            <input
              type="checkbox"
              checked={doubtNotifications}
              onChange={(e) => setDoubtNotifications(e.target.checked)}
              className="w-4 h-4 text-[#0057BE] rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between py-2 border-b border-[#E5E7EB]">
            <div>
              <div className="font-bold text-[#151C2F]">Bounty Points & Leaderboard Updates</div>
              <div className="text-[#667085]">Notify when your answers earn verified bounties</div>
            </div>
            <input
              type="checkbox"
              checked={timerAlerts}
              onChange={(e) => setTimerAlerts(e.target.checked)}
              className="w-4 h-4 text-[#0057BE] rounded cursor-pointer"
            />
          </div>
        </div>

        <Button
          variant="dark"
          size="sm"
          onClick={handleSave}
          className="rounded-lg text-xs font-bold bg-[#151C2F]"
        >
          Save Preferences
        </Button>
      </div>

      {/* Account & Sign out */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 sm:p-7 shadow-xs space-y-4">
        <h3 className="text-base font-extrabold text-[#151C2F] flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#0057BE]" />
          <span>Account</span>
        </h3>

        <div className="flex items-center justify-between pt-2">
          <div>
            <div className="text-xs font-bold text-[#151C2F]">Sign out of session</div>
            <div className="text-xs text-[#667085]">Safely logs out of StudySphere on this device</div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="rounded-lg text-xs font-bold border-red-300 text-red-600 hover:bg-red-50"
          >
            <LogOut className="w-3.5 h-3.5 mr-1.5" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};
