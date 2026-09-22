import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Bell,
  Building2,
  Compass,
  User as UserIcon,
  LogOut,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Briefcase,
  Flame,
  FileCheck2,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    user,
    currentPath,
    navigate,
    logout,
    switchDemoUser,
    notifications,
    unreadCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  } = useAuth();

  const [showDemoMenu, setShowDemoMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  const demoAccounts = [
    { email: 'devotee@templeconnect.org', name: 'Ramesh Kumar', role: 'Devotee / User', color: 'text-amber-700 bg-amber-50' },
    { email: 'admin@meenakshi.org', name: 'Sundaram Gurukkal', role: 'Admin (Meenakshi Temple)', color: 'text-orange-700 bg-orange-50' },
    { email: 'admin@somnath.org', name: 'Dharmendra Shastri', role: 'Admin (Somnath Temple)', color: 'text-orange-700 bg-orange-50' },
    { email: 'priest.sharma@vedic.org', name: 'Pt. Rajesh Sharma', role: 'Priest (Rigveda Scholar)', color: 'text-emerald-700 bg-emerald-50' },
    { email: 'priest.venkat@vedic.org', name: 'Shri Venkatachari', role: 'Priest (Agama Praveena)', color: 'text-emerald-700 bg-emerald-50' },
  ];

  const getRoleBadge = () => {
    if (!user) return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-stone-100 text-stone-700 border border-stone-200">Visitor</span>;
    if (user.role === 'admin')
      return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-800 border border-orange-200"><ShieldCheck className="w-3.5 h-3.5" /> Temple Admin</span>;
    if (user.role === 'priest')
      return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200"><Flame className="w-3.5 h-3.5" /> Vedic Priest</span>;
    return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200"><Compass className="w-3.5 h-3.5" /> Devotee</span>;
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2.5 text-left group focus:outline-hidden"
              id="navbar-brand-btn"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-orange-700 flex items-center justify-center text-white shadow-sm ring-2 ring-amber-100 group-hover:scale-105 transition-transform">
                <Building2 className="w-5 h-5 text-amber-100" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-cinzel text-xl font-bold tracking-tight text-stone-900">
                    Temple<span className="text-amber-700">Connect</span>
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 font-medium tracking-wide uppercase">
                  Heritage & Priest Platform
                </p>
              </div>
            </button>

            {/* Role Badge */}
            <div className="hidden sm:block ml-2">{getRoleBadge()}</div>
          </div>

          {/* Primary Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => navigate('/user')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPath.startsWith('/user')
                  ? 'bg-amber-50 text-amber-900 border border-amber-200/60'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/60'
              }`}
            >
              Temple Directory
            </button>

            {user?.role === 'admin' && (
              <button
                onClick={() => navigate('/admin')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  currentPath.startsWith('/admin')
                    ? 'bg-orange-50 text-orange-900 border border-orange-200/60 font-semibold'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/60'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-orange-600" />
                Admin Portal
              </button>
            )}

            {user?.role === 'priest' && (
              <button
                onClick={() => navigate('/priest')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  currentPath.startsWith('/priest')
                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-200/60 font-semibold'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/60'
                }`}
              >
                <Briefcase className="w-4 h-4 text-emerald-600" />
                Priest Portal
              </button>
            )}
          </nav>

          {/* Right Controls: Demo Role Switcher, Notifications, Auth */}
          <div className="flex items-center gap-2.5">
            {/* Quick Demo Persona Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowDemoMenu(!showDemoMenu)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-amber-300 bg-amber-50/80 hover:bg-amber-100/70 text-xs font-semibold text-amber-900 transition-colors shadow-2xs"
                id="demo-role-switcher-btn"
                title="Switch demo persona for testing roles"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                <span className="hidden sm:inline">Demo Persona</span>
                <ChevronDown className="w-3 h-3 text-amber-700" />
              </button>

              {showDemoMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-stone-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-1.5 border-b border-stone-100">
                    <p className="text-xs font-semibold text-stone-700 uppercase tracking-wider">
                      Switch Role (1-Click Test)
                    </p>
                    <p className="text-[11px] text-stone-500">
                      Test role-based views and security restrictions.
                    </p>
                  </div>
                  <div className="max-h-80 overflow-y-auto py-1">
                    {demoAccounts.map((acc) => (
                      <button
                        key={acc.email}
                        onClick={async () => {
                          setShowDemoMenu(false);
                          await switchDemoUser(acc.email);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs hover:bg-stone-50 flex items-start gap-2 transition-colors ${
                          user?.email === acc.email ? 'bg-amber-50/70 font-semibold' : ''
                        }`}
                      >
                        <div className="flex-1">
                          <div className="text-stone-900 font-medium">{acc.name}</div>
                          <div className="text-[11px] text-stone-500">{acc.role}</div>
                        </div>
                        {user?.email === acc.email && (
                          <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Notifications Bell */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setShowNotifMenu(!showNotifMenu)}
                  className="relative p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors focus:outline-hidden"
                  id="notifications-bell-btn"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {showNotifMenu && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-stone-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-stone-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                        Notifications ({notifications.length})
                      </span>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllNotificationsAsRead}
                          className="text-[11px] text-amber-700 hover:text-amber-800 font-semibold"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto divide-y divide-stone-100">
                      {notifications.length === 0 ? (
                        <div className="px-4 py-6 text-center text-xs text-stone-500">
                          No notifications yet.
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            onClick={() => {
                              markNotificationAsRead(n.id);
                              if (n.link) {
                                setShowNotifMenu(false);
                                navigate(n.link);
                              }
                            }}
                            className={`px-4 py-3 text-xs hover:bg-stone-50 cursor-pointer transition-colors ${
                              !n.read ? 'bg-amber-50/40 font-medium' : 'text-stone-600'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-semibold text-stone-900">{n.title}</span>
                              <span className="text-[10px] text-stone-400">
                                {new Date(n.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-stone-600 line-clamp-2">{n.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* User Profile / Auth Action */}
            {user ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (user.role === 'admin') navigate('/admin');
                    else if (user.role === 'priest') navigate('/priest');
                    else navigate('/user');
                  }}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg border border-stone-200 hover:border-stone-300 text-xs font-medium text-stone-800 bg-stone-50/60"
                  id="user-profile-header-btn"
                >
                  <div className="w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs font-bold uppercase">
                    {user.name.charAt(0)}
                  </div>
                  <span className="hidden sm:inline font-semibold">{user.name.split(' ')[0]}</span>
                </button>
                <button
                  onClick={logout}
                  className="p-2 rounded-lg text-stone-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                  title="Sign Out"
                  id="logout-btn"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate('/')}
                className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-amber-700 hover:bg-amber-800 shadow-sm transition-colors"
                id="sign-in-btn"
              >
                Sign In / Role Entry
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
