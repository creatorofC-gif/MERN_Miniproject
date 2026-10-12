import React from 'react';
import { NavLink } from 'react-router-dom';
import { BookOpen, Home, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center p-6 text-center font-sans">
      <div className="max-w-md w-full bg-white rounded-2xl border border-[#E5E7EB] p-8 shadow-xs space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-[#EAF2FC] text-[#0057BE] flex items-center justify-center mx-auto text-2xl font-black">
          404
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-[#151C2F]">Page Not Found</h1>
          <p className="text-xs text-[#667085] mt-1.5">
            The study room, discussion, or page you are looking for has been moved or does not exist.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 pt-2">
          <NavLink to="/dashboard">
            <Button variant="dark" size="md" className="rounded-xl text-xs font-bold bg-[#151C2F]">
              <Home className="w-4 h-4 mr-1.5" />
              Go to Dashboard
            </Button>
          </NavLink>
        </div>
      </div>
    </div>
  );
};
