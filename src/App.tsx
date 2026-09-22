import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { RoleEntryScreen } from './components/RoleEntryScreen';
import { UserPortal } from './components/user/UserPortal';
import { AdminPortal } from './components/admin/AdminPortal';
import { PriestPortal } from './components/priest/PriestPortal';
import { AccessDenied } from './components/AccessDenied';

const AppContent: React.FC = () => {
  const { user, currentPath, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center text-xs text-stone-500">
          <div className="w-8 h-8 rounded-full border-2 border-amber-700 border-t-transparent animate-spin mx-auto mb-2" />
          <span>Initializing TempleConnect Sacred Ecosystem...</span>
        </div>
      </div>
    );
  }

  // Routing Handler
  const renderCurrentView = () => {
    // 1. Root ("/") route:
    // If user is unauthenticated, show the "Who are you?" Role Entry screen.
    // If user is logged in, show their respective dashboard or role entry
    if (currentPath === '/' || currentPath === '') {
      if (!user) {
        return <RoleEntryScreen />;
      }
      if (user.role === 'admin') {
        return <AdminPortal />;
      }
      if (user.role === 'priest') {
        return <PriestPortal />;
      }
      return <UserPortal />;
    }

    // 2. User / Devotee Portal ("/user" or "/user/*")
    // Public directory accessible to everyone (devotees, guest visitors, admins, priests)
    if (currentPath.startsWith('/user')) {
      return <UserPortal />;
    }

    // 3. Admin Portal ("/admin" or "/admin/*")
    // Strictly protected: ONLY users with role === 'admin'
    if (currentPath.startsWith('/admin')) {
      if (!user || user.role !== 'admin') {
        return (
          <AccessDenied
            requiredRole="admin"
            resourceDescription="Temple Administration portals can only be accessed by verified temple trustees and administrators. Direct URL or API manipulation is rejected by RBAC policies."
          />
        );
      }
      return <AdminPortal />;
    }

    // 4. Priest Portal ("/priest" or "/priest/*")
    // Strictly protected: ONLY users with role === 'priest'
    if (currentPath.startsWith('/priest')) {
      if (!user || user.role !== 'priest') {
        return (
          <AccessDenied
            requiredRole="priest"
            resourceDescription="Priest employment portfolios, applications, and contributor workspaces can only be accessed by certified Vedic priests. Devotees and administrators cannot view other priests' private application documents."
          />
        );
      }
      return <PriestPortal />;
    }

    // 5. Explicit Auth / Role selection route
    if (currentPath.startsWith('/login') || currentPath.startsWith('/role-entry')) {
      return <RoleEntryScreen />;
    }

    // Default fallback to public directory
    return <UserPortal />;
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans selection:bg-amber-100 selection:text-amber-900">
      <Navbar />
      <main className="flex-1">{renderCurrentView()}</main>

      {/* Global Sacred Heritage Footer */}
      <footer className="bg-stone-900 text-stone-400 text-xs py-8 border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-cinzel text-sm font-bold text-white tracking-wide">
              Temple<span className="text-amber-500">Connect</span>
            </span>
            <span className="text-stone-600">•</span>
            <span>Vedic Temple Heritage & Consecrated Priest Employment Platform</span>
          </div>

          <div className="flex items-center gap-4 text-stone-400">
            <span>Strict Role-Based Authorization</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
