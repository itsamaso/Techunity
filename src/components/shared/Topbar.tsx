import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

import { INavLink } from "@/types";
import { sidebarLinks } from "@/constants";
import Loader from "./Loader";
import { Button } from "@/components/ui/button";
import { useSignOutAccount } from "@/lib/react-query/queries";
import { useUserContext, INITIAL_USER } from "@/context/AuthContext";

const TopBar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user, setUser, setIsAuthenticated, isLoading } = useUserContext();

  const { mutate: signOut } = useSignOutAccount();

  console.log('TopBar rendering at pathname:', pathname);

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
    <nav 
      className="topbar bg-gradient-to-r from-primary-500/10 via-secondary-500/8 to-primary-500/10 border-b border-primary-500/20 relative overflow-hidden backdrop-blur-sm" 
      style={{ 
        display: 'block',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        width: '100%',
        minHeight: '80px'
      }}
    >
      {/* Background decorative elements */}
      <div className="absolute top-4 right-24 w-40 h-40 bg-gradient-to-br from-primary-500/5 to-secondary-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-4 left-24 w-32 h-32 bg-gradient-to-tr from-secondary-500/5 to-primary-500/5 rounded-full blur-2xl"></div>
      
      <div className="flex items-center justify-between h-20 px-8 relative z-10">
        {/* Logo Section - Always visible */}
        <Link to="/" className="flex flex-col items-center group">
          <div className="relative">
            <h1 className="text-3xl font-black bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500 bg-clip-text text-transparent group-hover:scale-105 transition-all duration-300 drop-shadow-xl tracking-tight">
              Techunity
            </h1>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full animate-pulse shadow-xl"></div>
          </div>
          <p className="text-sm font-bold bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500 bg-clip-text text-transparent group-hover:from-primary-600 group-hover:via-secondary-600 group-hover:to-primary-600 transition-all duration-300 mt-1 leading-tight tracking-wide">
            Connect, Collaborate & Grow
          </p>
        </Link>

        {/* Navigation Links - Always visible */}
        <div className="flex items-center gap-3">
          {sidebarLinks.map((link: INavLink) => {
            const isActive = pathname === link.route;

            return (
              <NavLink
                key={link.label}
                to={link.route}
                className={`group flex items-center gap-3 px-5 py-2.5 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? "bg-gradient-to-r from-primary-500 to-secondary-500 shadow-xl" 
                    : "hover:bg-gradient-to-r hover:from-primary-500/10 hover:to-secondary-500/10"
                }`}>
                <div className={`p-2 rounded-lg transition-all duration-300 ${
                  isActive 
                    ? "bg-white/20 backdrop-blur-sm shadow-md" 
                    : "group-hover:bg-primary-500/10 group-hover:shadow-sm"
                }`}>
                  <img
                    src={link.imgURL}
                    alt={link.label}
                    className={`w-5 h-5 transition-all duration-300 ${
                      isActive 
                        ? "invert-white drop-shadow-sm" 
                        : "group-hover:scale-110 group-hover:drop-shadow-md"
                    }`}
                  />
                </div>
                <span className={`text-base font-semibold transition-all duration-300 ${
                  isActive 
                    ? "text-white drop-shadow-sm" 
                    : "text-light-1 group-hover:text-primary-500"
                }`}>
                  {link.label}
                </span>
              </NavLink>
            );
          })}
        </div>

        {/* User Profile and Logout */}
        <div className="flex items-center gap-5">
          {isLoading ? (
            <div className="h-10 w-10">
              <Loader />
            </div>
          ) : user && user.email ? (
            <>
              <Link to={`/profile/${user.id}`} className="flex items-center gap-3 group p-2.5 rounded-lg hover:bg-gradient-to-r hover:from-primary-500/10 hover:to-secondary-500/10 transition-all duration-300">
                <div className="relative">
                  <img
                    src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
                    alt="profile"
                    className="h-10 w-10 rounded-full ring-2 ring-primary-500/30 group-hover:ring-primary-500/50 transition-all duration-300 shadow-lg group-hover:scale-105"
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-gradient-to-r from-green-400 to-green-500 rounded-full border-2 border-white shadow-md animate-pulse"></div>
                </div>
                <div className="flex flex-col">
                  <h3 className="text-sm font-bold text-light-1 group-hover:text-primary-500 transition-colors duration-300 leading-tight">{user.name}</h3>
                  <p className="text-xs text-light-3 group-hover:text-light-2 transition-colors duration-300 font-medium">@{user.username}</p>
                </div>
              </Link>

              <Button
                variant="ghost"
                className="px-4 py-2.5 rounded-xl transition-all duration-300 group hover:bg-gradient-to-r hover:from-red-500/10 hover:to-orange-500/10 border border-red-500/20"
                onClick={(e) => handleSignOut(e)}>
                <div className="p-2 rounded-lg bg-red-500/10 group-hover:bg-red-500/20 transition-all duration-300">
                  <img 
                    src="/assets/icons/logout.svg"
                    alt="logout"
                    width={20}
                    height={20}
                    className="group-hover:scale-110 transition-all duration-300"
                  />
                </div>
                <span className="text-sm font-semibold text-red-600 group-hover:text-red-700 ml-2">Logout</span>
              </Button>
            </>
          ) : (
            // Fallback when user is not available
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary-500/20 to-secondary-500/20"></div>
              <span className="text-sm text-light-3">Loading...</span>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default TopBar; 