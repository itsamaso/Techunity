import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  subtitle, 
  icon, 
  className = "",
  children 
}) => {
  return (
    <div className={`relative mb-6 ${className}`}>
      {/* Background decorative elements */}
      <div className="absolute -top-3 -left-3 w-24 h-24 bg-gradient-to-br from-primary-500/10 to-secondary-500/10 rounded-full blur-2xl"></div>
      <div className="absolute -top-2 -right-4 w-20 h-20 bg-gradient-to-tr from-secondary-500/10 to-accent-500/10 rounded-full blur-xl"></div>
      <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gradient-to-r from-accent-500/8 to-primary-500/8 rounded-full blur-lg"></div>
      
      {/* Main header content */}
      <div className="relative bg-gradient-to-r from-white/90 via-white/85 to-white/90 backdrop-blur-md rounded-xl border border-primary-500/20 shadow-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Icon container */}
            {icon && (
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-accent-500/20 rounded-lg blur-sm"></div>
                <div className="relative w-8 h-8 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg flex items-center justify-center shadow-md">
                  {icon}
                </div>
              </div>
            )}
            
            {/* Title and subtitle */}
            <div>
              <h1 className="text-lg lg:text-xl font-bold bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 bg-clip-text text-transparent">
                {title}
              </h1>
              {subtitle && (
                <p className="text-light-3 text-xs lg:text-sm mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          
          {/* Additional content (buttons, actions, etc.) */}
          {children && (
            <div className="flex items-center gap-2">
              {children}
            </div>
          )}
        </div>
        
        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 rounded-full opacity-60"></div>
      </div>
    </div>
  );
};

export default PageHeader;
