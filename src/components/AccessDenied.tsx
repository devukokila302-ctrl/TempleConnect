import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, ArrowLeft, UserCheck, Lock } from 'lucide-react';
import { UserRole } from '../types';

interface AccessDeniedProps {
  requiredRole: UserRole | UserRole[];
  resourceDescription?: string;
}

export const AccessDenied: React.FC<AccessDeniedProps> = ({ requiredRole, resourceDescription }) => {
  const { user, navigate, switchDemoUser } = useAuth();

  const requiredRolesArray = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
  const requiredRolesString = requiredRolesArray.map((r) => r.toUpperCase()).join(' or ');

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-stone-100">
      <div className="max-w-md w-full bg-white rounded-2xl p-8 border border-red-200 shadow-sm text-center">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-red-100 text-red-700 flex items-center justify-center mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-red-100 text-red-800 border border-red-200 mb-2">
          Strict Security Enforcement (403 Forbidden)
        </span>

        <h2 className="font-cinzel text-2xl font-bold text-stone-900 mb-2">
          Access Restricted
        </h2>

        <p className="text-xs text-stone-600 mb-4 leading-relaxed">
          {resourceDescription || 'This portal and its underlying API endpoints are strictly protected by role-based authorization.'}
        </p>

        <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl text-left text-xs mb-6 space-y-1">
          <div className="flex justify-between">
            <span className="text-stone-500">Your Current Role:</span>
            <span className="font-bold text-stone-900 uppercase">
              {user ? user.role : 'Unauthenticated Visitor (Guest)'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-500">Required Role:</span>
            <span className="font-bold text-red-700">{requiredRolesString}</span>
          </div>
        </div>

        {/* Quick actions */}
        <div className="space-y-2">
          {requiredRolesArray.includes('admin') && (
            <button
              onClick={() => switchDemoUser('admin@meenakshi.org')}
              className="w-full py-2 px-3 rounded-xl text-xs font-bold text-white bg-orange-700 hover:bg-orange-800 transition-colors shadow-2xs flex items-center justify-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Switch to Temple Administrator Demo</span>
            </button>
          )}

          {requiredRolesArray.includes('priest') && (
            <button
              onClick={() => switchDemoUser('priest.sharma@vedic.org')}
              className="w-full py-2 px-3 rounded-xl text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 transition-colors shadow-2xs flex items-center justify-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Switch to Vedic Priest Demo</span>
            </button>
          )}

          <button
            onClick={() => navigate(user?.role === 'admin' ? '/admin' : user?.role === 'priest' ? '/priest' : '/user')}
            className="w-full py-2 px-3 rounded-xl text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 transition-colors flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Your Authorized Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
};
