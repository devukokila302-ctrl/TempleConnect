import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Compass,
  ShieldCheck,
  Flame,
  ArrowRight,
  Sparkles,
  Lock,
  Mail,
  UserCheck,
  Building,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { UserRole } from '../types';

export const RoleEntryScreen: React.FC = () => {
  const { login, register, switchDemoUser, navigate } = useAuth();

  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [templeName, setTempleName] = useState('');
  const [city, setCity] = useState('');
  const [experienceYears, setExperienceYears] = useState('5');
  const [vedaTradition, setVedaTradition] = useState('Rigveda - Shakala Shakha');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setError(null);
    if (role === 'user') {
      setEmail('devotee@templeconnect.org');
    } else if (role === 'admin') {
      setEmail('admin@meenakshi.org');
    } else if (role === 'priest') {
      setEmail('priest.sharma@vedic.org');
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (authMode === 'login') {
        await login({ email, role: selectedRole || undefined, password });
      } else {
        await register({
          name,
          email,
          role: selectedRole || 'user',
          phone,
          templeName,
          city,
          experienceYears,
          vedaTradition,
        });
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (demoEmail: string) => {
    setError(null);
    setLoading(true);
    try {
      await switchDemoUser(demoEmail);
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with demo credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-stone-50 via-amber-50/20 to-stone-100">
      <div className="max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-200 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            Sacred Heritage & Priest Employment Ecosystem
          </div>
          <h1 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-stone-900 mb-3">
            Who are you?
          </h1>
          <p className="text-stone-600 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            TempleConnect brings verified temple records, devotee discovery, and certified Vedic priest employment under one trusted umbrella. Select your persona to begin:
          </p>
        </div>

        {/* 3 Main Role Selector Cards */}
        {!selectedRole ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* 1. Devotee Card */}
            <div
              onClick={() => handleRoleSelect('user')}
              className="bg-white rounded-2xl p-6 border-2 border-stone-200/80 hover:border-amber-500 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group relative overflow-hidden"
              id="role-card-devotee"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-bl-full -z-0 group-hover:scale-110 transition-transform" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-4 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                  <Compass className="w-6 h-6" />
                </div>
                <div className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-1">
                  Public & Community
                </div>
                <h3 className="font-cinzel text-xl font-bold text-stone-900 mb-2">
                  User / Devotee
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed mb-4">
                  Find sacred temples near your location with actual GPS distance calculation, view daily darshan timings, explore pujas, ask the AI temple guide, and contribute missing temples.
                </p>
                <div className="space-y-1.5 text-xs text-stone-500 mb-6">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Real 5–100 km Radius Locator</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Grounded Temple AI Assistant</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Community Contributions</span>
                  </div>
                </div>
              </div>
              <div className="relative z-10 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 flex items-center justify-center gap-2 group-hover:bg-amber-600 group-hover:text-white transition-all shadow-2xs"
                >
                  <span>Select Devotee Role</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleQuickDemo('devotee@templeconnect.org');
                  }}
                  className="w-full mt-2 py-1.5 text-[11px] font-semibold text-stone-500 hover:text-amber-800 text-center block"
                >
                  ⚡ Fast Login: Ramesh Kumar (Demo)
                </button>
              </div>
            </div>

            {/* 2. Temple Administrator Card */}
            <div
              onClick={() => handleRoleSelect('admin')}
              className="bg-white rounded-2xl p-6 border-2 border-stone-200/80 hover:border-orange-500 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group relative overflow-hidden"
              id="role-card-admin"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-bl-full -z-0 group-hover:scale-110 transition-transform" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-800 flex items-center justify-center mb-4 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div className="text-xs font-bold uppercase tracking-wider text-orange-800 mb-1">
                  Management & Oversight
                </div>
                <h3 className="font-cinzel text-xl font-bold text-stone-900 mb-2">
                  Temple Administrator
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed mb-4">
                  Manage your authorized temple's sanctum timings, pujas, festival events, post priest vacancies, review and shortlist applicants, and govern verified contributor access.
                </p>
                <div className="space-y-1.5 text-xs text-stone-500 mb-6">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Direct Sanctum Data Authority</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Post Vacancies & AI Screening</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Review Contributor Proposals</span>
                  </div>
                </div>
              </div>
              <div className="relative z-10 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-orange-900 bg-orange-50 hover:bg-orange-100 border border-orange-200 flex items-center justify-center gap-2 group-hover:bg-orange-600 group-hover:text-white transition-all shadow-2xs"
                >
                  <span>Select Admin Role</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleQuickDemo('admin@meenakshi.org');
                  }}
                  className="w-full mt-2 py-1.5 text-[11px] font-semibold text-stone-500 hover:text-orange-800 text-center block"
                >
                  ⚡ Fast Login: Meenakshi Admin (Demo)
                </button>
              </div>
            </div>

            {/* 3. Priest / Job Seeker Card */}
            <div
              onClick={() => handleRoleSelect('priest')}
              className="bg-white rounded-2xl p-6 border-2 border-stone-200/80 hover:border-emerald-500 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group relative overflow-hidden"
              id="role-card-priest"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -z-0 group-hover:scale-110 transition-transform" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <Flame className="w-6 h-6" />
                </div>
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1">
                  Vedic & Purohitham
                </div>
                <h3 className="font-cinzel text-xl font-bold text-stone-900 mb-2">
                  Priest / Job Seeker
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed mb-4">
                  Create your comprehensive Vedic ritual profile, search verified temple employment vacancies, apply with real-time AI skill matching, and propose updates for temples where granted contributor access.
                </p>
                <div className="space-y-1.5 text-xs text-stone-500 mb-6">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Purohitham Skill Portfolio</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Job Search & Status Tracking</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Authorized Contributor Updates</span>
                  </div>
                </div>
              </div>
              <div className="relative z-10 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 flex items-center justify-center gap-2 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-2xs"
                >
                  <span>Select Priest Role</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleQuickDemo('priest.sharma@vedic.org');
                  }}
                  className="w-full mt-2 py-1.5 text-[11px] font-semibold text-stone-500 hover:text-emerald-800 text-center block"
                >
                  ⚡ Fast Login: Pt. Rajesh Sharma (Demo)
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Role-Specific Login / Register Screen */
          <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-md max-w-lg mx-auto animate-in fade-in slide-in-from-bottom-2 duration-200">
            {/* Top Bar with back button */}
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-stone-100">
              <button
                type="button"
                onClick={() => setSelectedRole(null)}
                className="text-xs font-semibold text-stone-500 hover:text-stone-900 flex items-center gap-1"
              >
                ← Back to Role Selection
              </button>
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200/60">
                {selectedRole === 'admin' ? (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5 text-orange-600" />
                    <span>Admin Portal Entry</span>
                  </>
                ) : selectedRole === 'priest' ? (
                  <>
                    <Flame className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Priest Portal Entry</span>
                  </>
                ) : (
                  <>
                    <Compass className="w-3.5 h-3.5 text-amber-600" />
                    <span>Devotee Portal Entry</span>
                  </>
                )}
              </div>
            </div>

            {/* Title */}
            <div className="mb-6">
              <h2 className="font-cinzel text-2xl font-bold text-stone-900">
                {authMode === 'login' ? 'Sign In to Your Account' : 'Register New Account'}
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                {selectedRole === 'admin' && 'Access authorized temple management, priest applications, and vacancies.'}
                {selectedRole === 'priest' && 'Access your Vedic employment profile, applications, and contributor tools.'}
                {selectedRole === 'user' && 'Access temple search, radius filters, and community contribution tools.'}
              </p>
            </div>

            {/* Demo Quick Button */}
            <div className="mb-6 p-3 bg-amber-50/70 border border-amber-200 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-amber-900 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                    Quick Testing Credentials
                  </span>
                  <p className="text-[11px] text-amber-800/80">
                    Use pre-configured demo account with rich test data:
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (selectedRole === 'admin') handleQuickDemo('admin@meenakshi.org');
                    else if (selectedRole === 'priest') handleQuickDemo('priest.sharma@vedic.org');
                    else handleQuickDemo('devotee@templeconnect.org');
                  }}
                  className="px-3 py-1.5 text-xs font-bold text-white bg-amber-700 hover:bg-amber-800 rounded-lg shadow-2xs transition-colors shrink-0"
                >
                  Load Demo User
                </button>
              </div>
            </div>

            {/* Toggle Login / Register */}
            <div className="flex border border-stone-200 p-1 rounded-xl bg-stone-50 mb-6">
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                  authMode === 'login' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('register')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                  authMode === 'register' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                Register
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Auth Form */}
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authMode === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={selectedRole === 'priest' ? 'e.g., Pandit Rajesh Sharma' : 'e.g., Ramesh Kumar'}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@temple.org"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {authMode === 'register' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                    />
                  </div>

                  {selectedRole === 'admin' && (
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Temple Name to Manage</label>
                      <input
                        type="text"
                        required
                        value={templeName}
                        onChange={(e) => setTempleName(e.target.value)}
                        placeholder="e.g. Arulmigu Murugan Temple"
                        className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                      />
                    </div>
                  )}

                  {selectedRole === 'priest' && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">Experience (Years)</label>
                        <input
                          type="number"
                          value={experienceYears}
                          onChange={(e) => setExperienceYears(e.target.value)}
                          className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">Vedic Shakha</label>
                        <input
                          type="text"
                          value={vedaTradition}
                          onChange={(e) => setVedaTradition(e.target.value)}
                          placeholder="e.g. Rigveda"
                          className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                        />
                      </div>
                    </div>
                  )}
                </>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-amber-700 hover:bg-amber-800 shadow-sm transition-colors flex items-center justify-center gap-2"
                id="auth-submit-btn"
              >
                {loading ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <span>{authMode === 'login' ? 'Sign In to Portal' : 'Create Account'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Quick guest browse link */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/user')}
            className="text-xs font-semibold text-amber-800 hover:text-amber-900 underline underline-offset-4"
          >
            Or explore public temple directory as Guest visitor →
          </button>
        </div>
      </div>
    </div>
  );
};
