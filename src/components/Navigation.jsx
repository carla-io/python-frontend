import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Cpu, 
  Home, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Activity,
  FileText
} from 'lucide-react';
import '../css/navigation.css';

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const userType = localStorage.getItem('userType');

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userType');
    localStorage.removeItem('userName');
    localStorage.removeItem('userData');
    navigate('/login');
  };

  const navigationItems = [
    { 
      name: 'Dashboard', 
      href: userType === 'admin' ? '/admin' : userType === 'technician' ? '/technician' : '/dashboard', 
      icon: Home 
    },
    { 
      name: 'Electronics Inventory', 
      href: '/inventory', 
      icon: Cpu 
    },
    { 
      name: 'Reports', 
      href: '/reports', 
      icon: FileText 
    },
    { 
      name: 'Analytics', 
      href: '/analytics', 
      icon: Activity 
    },
  ];

  // Add admin-only items
  if (userType === 'admin') {
    navigationItems.push(
      { 
        name: 'Users', 
        href: '/users', 
        icon: Users 
      },
      { 
        name: 'Settings', 
        href: '/settings', 
        icon: Settings 
      }
    );
  }

  const isCurrentPath = (href) => {
    return location.pathname === href;
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-content">
          {/* Logo and brand */}
          <div className="nav-brand">
            <Cpu className="brand-icon" />
            <span className="brand-text">Electronics Inventory</span>
          </div>

          {/* Desktop menu */}
          <div className="nav-desktop-menu">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  onClick={() => navigate(item.href)}
                  className={`nav-item ${isCurrentPath(item.href) ? 'nav-item-active' : ''}`}
                >
                  <Icon className="nav-item-icon" />
                  {item.name}
                </button>
              );
            })}
            
            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="nav-item nav-logout"
            >
              <LogOut className="nav-item-icon" />
              Logout
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="nav-mobile-toggle">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="mobile-menu-btn"
            >
              {isMobileMenuOpen ? (
                <X className="mobile-menu-icon" />
              ) : (
                <Menu className="mobile-menu-icon" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="nav-mobile-menu">
            <div className="mobile-menu-items">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.name}
                    onClick={() => {
                      navigate(item.href);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`mobile-nav-item ${isCurrentPath(item.href) ? 'mobile-nav-item-active' : ''}`}
                  >
                    <Icon className="mobile-nav-icon" />
                    {item.name}
                  </button>
                );
              })}
              
              {/* Mobile logout button */}
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="mobile-nav-item mobile-nav-logout"
              >
                <LogOut className="mobile-nav-icon" />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;