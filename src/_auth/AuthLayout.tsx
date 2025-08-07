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
        <div style={{ 
          minHeight: '100vh', 
          backgroundColor: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <Outlet />
        </div>
      )}
    </>
  );
}
