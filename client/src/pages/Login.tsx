import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { BookOpen, Trophy, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('alex@studysphere.io');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Invalid email or password');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOAuthDemo = (provider: string) => {
    login(`${provider.toLowerCase()}@studysphere.io`, 'demo123');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center p-4 sm:p-6 lg:p-10 font-sans">
      <div className="max-w-5xl w-full bg-white rounded-2xl shadow-sm border border-[#E5E7EB] overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        {/* Left: Sign In Form */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between">
          <div>
            {/* Logo */}
            <NavLink to="/" className="inline-flex items-center gap-2.5 mb-8">
              <div className="w-8 h-8 rounded-lg bg-[#151C2F] flex items-center justify-center text-white shadow-xs">
                <BookOpen className="w-4 h-4 stroke-[2.2]" />
              </div>
              <span className="font-bold text-xl text-[#151C2F] tracking-tight">StudySphere</span>
            </NavLink>

            {/* Title & Subtitle */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#151C2F] tracking-tight">
              Sign In to StudySphere
            </h1>
            <p className="text-sm text-[#667085] mt-1.5 mb-6">
              Welcome back! Please enter your details.
            </p>

            {/* OAuth Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                type="button"
                onClick={() => handleOAuthDemo('Google')}
                className="flex items-center justify-center gap-2.5 px-4 py-2.5 border border-[#E5E7EB] rounded-lg text-xs font-semibold text-[#151C2F] hover:bg-[#F8F9FB] transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Google</span>
              </button>

              <button
                type="button"
                onClick={() => handleOAuthDemo('Discord')}
                className="flex items-center justify-center gap-2.5 px-4 py-2.5 border border-[#E5E7EB] rounded-lg text-xs font-semibold text-[#151C2F] hover:bg-[#F8F9FB] transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4 fill-[#5865F2]" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
                <span>Discord</span>
              </button>
            </div>

            {/* Separator */}
            <div className="relative flex items-center justify-center mb-6">
              <div className="border-t border-[#E5E7EB] w-full" />
              <span className="bg-white px-3 text-xs font-semibold text-[#98A2B3] uppercase absolute">
                Or with email
              </span>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 mb-4 rounded-lg bg-red-50 border border-red-200 text-xs text-red-600 font-medium">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email"
                type="email"
                placeholder="alex@studysphere.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-8.5 text-[#98A2B3] hover:text-[#151C2F] cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-[#D0D5DD] text-[#0057BE] focus:ring-[#0057BE]"
                  />
                  <span className="text-[#667085] font-medium">Remember for 30 days</span>
                </label>
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Password reset link sent to ' + email);
                  }}
                  className="font-semibold text-[#0057BE] hover:underline"
                >
                  Forgot password?
                </a>
              </div>

              <Button
                type="submit"
                variant="dark"
                size="lg"
                fullWidth
                isLoading={isSubmitting}
                className="mt-2 bg-[#151C2F] hover:bg-[#1E293B] font-bold text-sm"
              >
                Sign in
              </Button>
            </form>
          </div>

          {/* Footer link */}
          <div className="text-center text-xs text-[#667085] mt-6">
            Don't have an account?{' '}
            <NavLink to="/register" className="font-bold text-[#0057BE] hover:underline">
              Sign up
            </NavLink>
          </div>
        </div>

        {/* Right: Feature Showcase (Dark Card) */}
        <div className="hidden lg:flex lg:col-span-5 bg-[#151C2F] text-white p-10 flex-col justify-between relative overflow-hidden">
          {/* Subtle decorative background circles */}
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#0057BE]/15 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-[#8B5CF6]/10 blur-3xl pointer-events-none" />

          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-white text-xs font-semibold backdrop-blur-xs self-start border border-white/10">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span>2X Doubt Perks Active</span>
          </div>

          {/* Middle Content */}
          <div className="space-y-6 relative z-10 my-auto">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#F59E0B] to-[#FBBF24] flex items-center justify-center text-[#151C2F] shadow-lg shadow-amber-500/20">
              <Trophy className="w-7 h-7 stroke-[2.2]" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-extrabold text-white leading-tight">
                Solve Doubts & Earn Real Perks
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Get recognized on the global leaderboard, earn bounty points, and unlock 2x study
                multipliers for your favorite subjects.
              </p>
            </div>

            {/* Social proof */}
            <div className="pt-4 border-t border-white/10 flex items-center gap-3">
              <div className="flex -space-x-2">
                <img
                  className="w-8 h-8 rounded-full border-2 border-[#151C2F] object-cover"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  alt="Student 1"
                />
                <img
                  className="w-8 h-8 rounded-full border-2 border-[#151C2F] object-cover"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                  alt="Student 2"
                />
                <img
                  className="w-8 h-8 rounded-full border-2 border-[#151C2F] object-cover"
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80"
                  alt="Student 3"
                />
              </div>
              <span className="text-xs font-medium text-gray-300">
                Join <strong className="text-white">10,000+ students</strong> studying right now
              </span>
            </div>
          </div>

          {/* Bottom badge */}
          <div className="text-xs text-gray-400">
            StudySphere v2.4 • Academic Collaboration Engine
          </div>
        </div>
      </div>
    </div>
  );
};
