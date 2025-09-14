import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { INavLink } from "@/types";
import { sidebarLinks } from "@/constants";
import Loader from "./Loader";
import { Button } from "@/components/ui/button";
import { useSignOutAccount } from "@/lib/react-query/queries";
import { useUserContext, INITIAL_USER } from "@/context/AuthContext";

const Sidebar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user, setUser, setIsAuthenticated, isLoading } = useUserContext();

  const { mutate: signOut } = useSignOutAccount();

  const handleSignOut = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    signOut();
    setIsAuthenticated(false);
    setUser(INITIAL_USER);
    navigate("/sign-in");
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-80 bg-white/80 backdrop-blur-xl border-r border-white/20 shadow-2xl z-50 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-8 right-8 w-32 h-32 bg-gradient-to-br from-primary-500/8 to-secondary-500/6 rounded-full blur-3xl"></div>
      <div className="absolute bottom-8 left-8 w-24 h-24 bg-gradient-to-tr from-secondary-500/6 to-accent-500/8 rounded-full blur-2xl"></div>
      <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-gradient-to-r from-accent-500/4 to-primary-500/4 rounded-full blur-xl"></div>
      
      <div className="flex flex-col h-full p-6 relative z-10">
        {/* Brand Section */}
        <Link to="/" className="flex flex-col items-center text-center group mb-8 relative overflow-hidden">
          {/* Animated background glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 via-secondary-500/4 to-accent-500/5 rounded-3xl blur-xl opacity-100 group-hover:opacity-100 transition-all duration-700 scale-75 group-hover:scale-100 group-hover:from-primary-500/10 group-hover:via-secondary-500/8 group-hover:to-accent-500/10"></div>
          
          {/* Floating particles */}
          <div className="absolute -top-4 -left-4 w-3 h-3 bg-primary-500/30 rounded-full animate-ping opacity-60 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute -top-2 -right-6 w-2 h-2 bg-secondary-500/30 rounded-full animate-ping opacity-60 group-hover:opacity-100 transition-opacity duration-700 delay-100"></div>
          <div className="absolute -bottom-3 -left-2 w-2.5 h-2.5 bg-accent-500/30 rounded-full animate-ping opacity-60 group-hover:opacity-100 transition-opacity duration-900 delay-200"></div>
          <div className="absolute -bottom-2 -right-4 w-1.5 h-1.5 bg-primary-500/30 rounded-full animate-ping opacity-60 group-hover:opacity-100 transition-opacity duration-600 delay-300"></div>
          
          {/* Brand name with enhanced effects */}
          <div className="relative">
            <h1 className="text-4xl font-black bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 bg-clip-text text-transparent group-hover:scale-110 group-hover:rotate-1 transition-all duration-500 drop-shadow-xl tracking-tight relative z-10 animate-pulse">
              Techunity
            </h1>
            {/* Text shadow glow effect */}
            <div className="absolute inset-0 text-4xl font-black bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 bg-clip-text text-transparent blur-sm opacity-30 group-hover:opacity-60 transition-all duration-500 group-hover:scale-115 group-hover:rotate-2 -z-10">
              Techunity
            </div>
            {/* Animated underline */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/3 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 group-hover:w-full transition-all duration-700 rounded-full animate-pulse"></div>
          </div>
          
          {/* Slogan with enhanced effects */}
          <div className="relative mt-2">
            <p className="text-xl font-bold bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 bg-clip-text text-transparent group-hover:from-primary-600 group-hover:via-secondary-600 group-hover:to-accent-600 group-hover:scale-105 group-hover:-rotate-1 transition-all duration-500 leading-tight tracking-wider relative z-10">
              CC&G
            </p>
            {/* Slogan shadow glow effect */}
            <div className="absolute inset-0 text-xl font-bold bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 bg-clip-text text-transparent blur-sm opacity-25 group-hover:opacity-50 transition-all duration-500 group-hover:scale-110 group-hover:-rotate-2 -z-10">
              CC&G
            </div>
            {/* Pulsing dots */}
            <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-1 h-1 bg-primary-500/50 rounded-full animate-pulse opacity-70 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-1 h-1 bg-secondary-500/50 rounded-full animate-pulse opacity-70 group-hover:opacity-100 transition-opacity duration-500 delay-200"></div>
          </div>
          
          {/* Ripple effect on click */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary-500/20 to-secondary-500/20 scale-0 group-active:scale-100 transition-transform duration-300 opacity-0 group-active:opacity-100"></div>
        </Link>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-2">
          {sidebarLinks.map((link: INavLink) => {
            const isActive = pathname === link.route;

            return (
              <NavLink
                key={link.label}
                to={link.route}
                className={`group flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2 lg:py-3 rounded-xl transition-all duration-500 ${
                  isActive 
                    ? "bg-gradient-to-r from-primary-500 to-secondary-500 shadow-xl" 
                    : "bg-white/30 hover:bg-white/50 border border-white/40 hover:border-white/60 shadow-lg hover:shadow-xl backdrop-blur-md"
                }`}>
                <div className={`relative p-1.5 rounded-lg transition-all duration-500 ${
                  isActive 
                    ? "bg-white/20 backdrop-blur-sm shadow-md" 
                    : "group-hover:bg-primary-500/10 group-hover:shadow-sm group-hover:shadow-primary-500/20"
                }`}>
                  <div className={`absolute inset-0 rounded-lg transition-all duration-500 ${
                    isActive 
                      ? "bg-gradient-to-br from-primary-500/30 to-secondary-500/30" 
                      : "bg-gradient-to-br from-primary-500/8 to-secondary-500/6 group-hover:from-primary-500/20 group-hover:to-secondary-500/20"
                  }`}></div>
                  {link.label === "Home" && (
                    <svg className={`relative w-6 h-6 lg:w-7 lg:h-7 transition-all duration-500 ${
                      isActive 
                        ? "text-white drop-shadow-sm scale-110" 
                        : "text-gray-700 brightness-110 contrast-105 drop-shadow-sm group-hover:scale-125 group-hover:drop-shadow-lg group-hover:brightness-125 group-hover:contrast-115 group-hover:rotate-3 group-hover:text-primary-600"
                    }`} 
                    style={{
                      filter: isActive 
                        ? "drop-shadow(0 0 8px rgba(255,255,255,0.3))" 
                        : "drop-shadow(0 0 6px rgba(59,130,246,0.15)) brightness(1.1) contrast(1.05)"
                    }}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  )}
                  {link.label === "Explore" && (
                    <svg className={`relative w-6 h-6 lg:w-7 lg:h-7 transition-all duration-500 ${
                      isActive 
                        ? "text-white drop-shadow-sm scale-110" 
                        : "text-gray-700 brightness-110 contrast-105 drop-shadow-sm group-hover:scale-125 group-hover:drop-shadow-lg group-hover:brightness-125 group-hover:contrast-115 group-hover:rotate-3 group-hover:text-primary-600"
                    }`} 
                    style={{
                      filter: isActive 
                        ? "drop-shadow(0 0 8px rgba(255,255,255,0.3))" 
                        : "drop-shadow(0 0 6px rgba(59,130,246,0.15)) brightness(1.1) contrast(1.05)"
                    }}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  )}
                  {link.label === "People" && (
                    <svg className={`relative w-6 h-6 lg:w-7 lg:h-7 transition-all duration-500 ${
                      isActive 
                        ? "text-white drop-shadow-sm scale-110" 
                        : "text-gray-700 brightness-110 contrast-105 drop-shadow-sm group-hover:scale-125 group-hover:drop-shadow-lg group-hover:brightness-125 group-hover:contrast-115 group-hover:rotate-3 group-hover:text-primary-600"
                    }`} 
                    style={{
                      filter: isActive 
                        ? "drop-shadow(0 0 8px rgba(255,255,255,0.3))" 
                        : "drop-shadow(0 0 6px rgba(59,130,246,0.15)) brightness(1.1) contrast(1.05)"
                    }}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  )}
                  {link.label === "Saved" && (
                    <svg className={`relative w-6 h-6 lg:w-7 lg:h-7 transition-all duration-500 ${
                      isActive 
                        ? "text-white drop-shadow-sm scale-110" 
                        : "text-gray-700 brightness-110 contrast-105 drop-shadow-sm group-hover:scale-125 group-hover:drop-shadow-lg group-hover:brightness-125 group-hover:contrast-115 group-hover:rotate-3 group-hover:text-primary-600"
                    }`} 
                    style={{
                      filter: isActive 
                        ? "drop-shadow(0 0 8px rgba(255,255,255,0.3))" 
                        : "drop-shadow(0 0 6px rgba(59,130,246,0.15)) brightness(1.1) contrast(1.05)"
                    }}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  )}
                  {link.label === "Post" && (
                    <svg className={`relative w-6 h-6 lg:w-7 lg:h-7 transition-all duration-500 ${
                      isActive 
                        ? "text-white drop-shadow-sm scale-110" 
                        : "text-gray-700 brightness-110 contrast-105 drop-shadow-sm group-hover:scale-125 group-hover:drop-shadow-lg group-hover:brightness-125 group-hover:contrast-115 group-hover:rotate-3 group-hover:text-primary-600"
                    }`} 
                    style={{
                      filter: isActive 
                        ? "drop-shadow(0 0 8px rgba(255,255,255,0.3))" 
                        : "drop-shadow(0 0 6px rgba(59,130,246,0.15)) brightness(1.1) contrast(1.05)"
                    }}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  )}
                  {link.label === "Coding" && (
                    <svg className={`relative w-6 h-6 lg:w-7 lg:h-7 transition-all duration-500 ${
                      isActive 
                        ? "text-white drop-shadow-sm scale-110" 
                        : "text-gray-700 brightness-110 contrast-105 drop-shadow-sm group-hover:scale-125 group-hover:drop-shadow-lg group-hover:brightness-125 group-hover:contrast-115 group-hover:rotate-3 group-hover:text-primary-600"
                    }`} 
                    style={{
                      filter: isActive 
                        ? "drop-shadow(0 0 8px rgba(255,255,255,0.3))" 
                        : "drop-shadow(0 0 6px rgba(59,130,246,0.15)) brightness(1.1) contrast(1.05)"
                    }}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  )}
                  {link.label === "Interact" && (
                    <svg className={`relative w-6 h-6 lg:w-7 lg:h-7 transition-all duration-500 ${
                      isActive 
                        ? "text-white drop-shadow-sm scale-110" 
                        : "text-gray-700 brightness-110 contrast-105 drop-shadow-sm group-hover:scale-125 group-hover:drop-shadow-lg group-hover:brightness-125 group-hover:contrast-115 group-hover:rotate-3 group-hover:text-primary-600"
                    }`} 
                    style={{
                      filter: isActive 
                        ? "drop-shadow(0 0 8px rgba(255,255,255,0.3))" 
                        : "drop-shadow(0 0 6px rgba(59,130,246,0.15)) brightness(1.1) contrast(1.05)"
                    }}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  )}
                  {/* Glow effect */}
                  <div className={`absolute inset-0 rounded-lg transition-all duration-500 ${
                    isActive 
                      ? "shadow-[0_0_20px_rgba(59,130,246,0.4)]" 
                      : "shadow-[0_0_8px_rgba(59,130,246,0.2)] group-hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] group-hover:shadow-primary-500/30"
                  }`}></div>
                  {/* Animated border */}
                  <div className={`absolute inset-0 rounded-lg transition-all duration-500 ${
                    isActive 
                      ? "border-2 border-white/30" 
                      : "border border-primary-500/15 group-hover:border-primary-500/40 group-hover:border-2"
                  }`}></div>
                </div>
                <span className={`text-base lg:text-lg font-bold transition-all duration-300 ${
                  isActive 
                    ? "text-white drop-shadow-sm" 
                    : "text-gray-800 drop-shadow-sm group-hover:text-primary-600 group-hover:drop-shadow-md"
                }`}>
                  {link.label}
                </span>
              </NavLink>
            );
          })}
        </nav>

        {/* User Profile and Logout - Centered in remaining space */}
        <div className="flex-1 flex items-center justify-center">
          {isLoading ? (
            <div className="h-16 w-full flex items-center justify-center">
              <Loader />
            </div>
          ) : user && user.email ? (
            <div className="flex flex-col items-center justify-center gap-6">
              <Link to={`/profile/${user.id}`} className="group relative p-4 rounded-3xl bg-gradient-to-r from-primary-500/10 to-secondary-500/10 hover:from-primary-500/20 hover:to-secondary-500/20 transition-all duration-500 shadow-xl hover:shadow-2xl hover:scale-105 overflow-hidden">
                {/* Animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/8 via-transparent to-secondary-500/8 opacity-100 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
                
                {/* Glowing ring effect */}
                <div className="absolute inset-0 rounded-3xl ring-2 ring-primary-500/20 group-hover:ring-primary-500/40 group-hover:ring-offset-2 group-hover:ring-offset-white/50 transition-all duration-500"></div>
                
                {/* Profile image container */}
                <div className="relative z-10">
                  <div className="relative">
                    <img
                      src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
                      alt="profile"
                      className="h-14 w-14 rounded-full ring-4 ring-primary-500/30 group-hover:ring-primary-500/50 transition-all duration-500 shadow-2xl group-hover:scale-110 group-hover:rotate-3"
                    />
                    
                    {/* Animated status indicator */}
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-green-400 to-green-500 rounded-full border-4 border-white shadow-xl animate-pulse group-hover:animate-bounce"></div>
                    
                    {/* Floating particles effect */}
                    <div className="absolute -top-2 -left-2 w-2 h-2 bg-primary-500/60 rounded-full opacity-100 animate-ping transition-all duration-500"></div>
                    <div className="absolute -top-1 -right-3 w-1.5 h-1.5 bg-secondary-500/60 rounded-full opacity-100 animate-ping transition-all duration-700"></div>
                    <div className="absolute -bottom-2 -left-1 w-1 h-1 bg-accent-500/60 rounded-full opacity-100 animate-ping transition-all duration-900"></div>
                  </div>
                  
                  {/* Subtle glow effect */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-500/15 to-secondary-500/15 blur-lg opacity-100 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                </div>
              </Link>

              {/* User Name Display */}
              <div className="text-center">
                <div className="text-lg font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent drop-shadow-lg tracking-wide">
                  {user.name?.split(' ')[0] || 'First'}
                </div>
                <div className="text-lg font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent drop-shadow-lg tracking-wide">
                  {user.name?.split(' ').slice(1).join(' ') || 'Last'}
                </div>
              </div>

              <Button
                variant="ghost"
                className="px-6 py-4 rounded-2xl transition-all duration-500 group hover:bg-gradient-to-r hover:from-red-500/10 hover:to-orange-500/10 border-2 border-red-500/20 shadow-lg hover:shadow-xl hover:shadow-red-500/20"
                onClick={(e) => handleSignOut(e)}>
                <div className="relative p-2 rounded-xl bg-red-500/10 group-hover:bg-red-500/20 transition-all duration-500">
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-red-500/20 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                  <svg 
                    className="relative w-6 h-6 transition-all duration-500 group-hover:scale-125 group-hover:rotate-6 group-hover:brightness-110 group-hover:contrast-110 group-hover:drop-shadow-lg text-red-600 group-hover:text-red-700"
                    style={{
                      filter: "group-hover:drop-shadow(0 0 10px rgba(239,68,68,0.4))"
                    }}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <div className="absolute inset-0 rounded-xl shadow-[0_0_15px_rgba(239,68,68,0.3)] opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                  <div className="absolute inset-0 rounded-xl border border-transparent group-hover:border-red-500/40 group-hover:border-2 transition-all duration-500"></div>
                </div>
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 p-4">
              <div className="h-16 w-16 rounded-full bg-gradient-to-r from-primary-500/20 to-secondary-500/20 shadow-lg"></div>
              <span className="text-lg text-gray-600 font-semibold">Loading...</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
