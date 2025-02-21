import React from 'react'
import { Navigate } from 'react-router';
import { useUser } from '../../context/user';
import { isUserAdmin } from '../../utils/user';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export default function AdminAuthenticated({ children }: Props) {
  const { isAuthenticated } = useUser();

  if (!isAuthenticated) {
    return <Navigate to="/user/login" replace />;
  }

  if (!isUserAdmin()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 max-w-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-red-800 font-medium">Access Denied</h3>
              <p className="text-red-700 mt-1">
                You need administrator privileges to access this page.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
