import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Droplets, Bug, Sprout, Landmark, UserCircle, LogOut } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Soil Suitability', path: '/suitability', icon: Landmark },
    { name: 'Crop Disease', path: '/disease', icon: Bug },
    { name: 'Drought Prediction', path: '/drought', icon: Droplets },
    { name: 'Crop Recommendation', path: '/crop-recommendation', icon: Sprout },
    { name: 'Profile', path: '/profile', icon: UserCircle },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
    window.location.reload();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0B110A]/80 backdrop-blur-md border-b border-white/5 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-primary font-serif italic text-xl">Digital Agriculture</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `relative text-xs font-bold uppercase tracking-widest transition-colors hover:text-primary ${
                  isActive ? 'text-primary' : 'text-text-body'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {item.name}
                  {isActive && (
                    <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                  )}
                </>
              )}
            </NavLink>
          ))}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-text-body hover:text-red-500 transition-colors cursor-pointer"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;