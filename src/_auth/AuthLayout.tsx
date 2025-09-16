import { Outlet, Navigate } from "react-router-dom";
import { useEffect } from "react";

import { useUserContext } from "@/context/AuthContext";

export default function AuthLayout() {
  const { isAuthenticated } = useUserContext();

  useEffect(() => {
    // Add a class to the body element for auth pages
    document.body.classList.add('auth-page-active');
    
    // Cleanup function
    return () => {
      document.body.classList.remove('auth-page-active');
    };
  }, []);

  return (
    <>
      {isAuthenticated ? (
        <Navigate to="/" />
      ) : (
        <div className="min-h-screen flex items-center justify-center p-4 relative">
          {/* Background overlay to match the main app */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-sm"></div>
          <div className="relative z-10 w-full max-w-md">
            <Outlet />
          </div>
        </div>
      )}
    </>
  );
}
