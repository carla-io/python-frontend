import React, { useState } from 'react';
import { 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  Users, 
  Settings, 
  Bell,
  Search,
  BarChart3,
  FileText,
  Truck,
  AlertTriangle,
  Home,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';

const InventorySidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState('dashboard');

  const menuItems = [
    {
      id: 'dashboard',
      icon: Home,
      label: 'Dashboard',
      badge: null
    },
    {
      id: 'inventory',
      icon: Package,
      label: 'Inventory',
      badge: '1,234'
    },
    {
      id: 'orders',
      icon: ShoppingCart,
      label: 'Orders',
      badge: '23'
    },
    {
      id: 'suppliers',
      icon: Truck,
      label: 'Suppliers',
      badge: null
    },
    {
      id: 'customers',
      icon: Users,
      label: 'Customers',
      badge: null
    },
    {
      id: 'analytics',
      icon: BarChart3,
      label: 'Analytics',
      badge: null
    },
    {
      id: 'reports',
      icon: FileText,
      label: 'Reports',
      badge: null
    },
    {
      id: 'alerts',
      icon: AlertTriangle,
      label: 'Low Stock Alerts',
      badge: '12'
    }
  ];

  const bottomMenuItems = [
    {
      id: 'notifications',
      icon: Bell,
      label: 'Notifications',
      badge: '5'
    },
    {
      id: 'settings',
      icon: Settings,
      label: 'Settings',
      badge: null
    }
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleItemClick = (itemId) => {
    setActiveItem(itemId);
  };

  const MenuItem = ({ item, isBottom = false }) => {
    const Icon = item.icon;
    const isActive = activeItem === item.id;

    return (
      <div
        className={`menu-item ${isActive ? 'active' : ''} ${isCollapsed ? 'collapsed' : ''}`}
        onClick={() => handleItemClick(item.id)}
      >
        <div className="menu-item-content">
          <Icon className="menu-icon" size={20} />
          {!isCollapsed && (
            <>
              <span className="menu-label">{item.label}</span>
              {item.badge && (
                <span className="menu-badge">{item.badge}</span>
              )}
            </>
          )}
        </div>
        {isActive && !isCollapsed && (
          <ChevronRight className="menu-arrow" size={16} />
        )}
      </div>
    );
  };

  return (
    <div className="inventory-app">
      <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        {/* Header */}
        <div className="sidebar-header">
          <div className="brand">
            <div className="brand-icon">
              <Package size={24} />
            </div>
            {!isCollapsed && (
              <div className="brand-text">
                <h1>InventoryPro</h1>
                <p>Management System</p>
              </div>
            )}
          </div>
          <button className="toggle-btn" onClick={toggleSidebar}>
            {isCollapsed ? <Menu size={20} /> : <X size={20} />}
          </button>
        </div>

        {/* Search */}
        {!isCollapsed && (
          <div className="search-container">
            <Search className="search-icon" size={16} />
            <input 
              type="text" 
              placeholder="Search items..." 
              className="search-input"
            />
          </div>
        )}

        {/* Stats Cards */}
        {!isCollapsed && (
          <div className="stats-section">
            <div className="stat-card">
              <div className="stat-icon">
                <TrendingUp size={16} />
              </div>
              <div className="stat-content">
                <span className="stat-value">$24,580</span>
                <span className="stat-label">Total Value</span>
              </div>
            </div>
          </div>
        )}

        {/* Main Menu */}
        <div className="menu-section">
          <div className="menu-items">
            {menuItems.map((item) => (
              <MenuItem key={item.id} item={item} />
            ))}
          </div>
        </div>

        {/* Bottom Menu */}
        <div className="bottom-menu">
          {bottomMenuItems.map((item) => (
            <MenuItem key={item.id} item={item} isBottom={true} />
          ))}
        </div>

        {/* User Profile */}
        <div className="user-profile">
          <div className="user-avatar">
            <img 
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" 
              alt="User"
              className="avatar-img"
            />
          </div>
          {!isCollapsed && (
            <div className="user-info">
              <span className="user-name">John Smith</span>
              <span className="user-role">Admin</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="main-content">
        <div className="content-header">
          <h1>Welcome to InventoryPro</h1>
          <p>Manage your inventory efficiently with our comprehensive dashboard.</p>
        </div>
        <div className="content-body">
          <div className="demo-card">
            <h2>Dashboard Overview</h2>
            <p>This is where your main content would go. The sidebar is fully functional and responsive!</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .inventory-app {
          display: flex;
          height: 100vh;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: #faf7f7;
        }

        .sidebar {
          width: 280px;
          background: linear-gradient(135deg, #ec4899 0%, #be185d 100%);
          color: white;
          display: flex;
          flex-direction: column;
          transition: all 0.3s ease;
          box-shadow: 4px 0 20px rgba(236, 72, 153, 0.15);
          position: relative;
          overflow: hidden;
        }

        .sidebar.collapsed {
          width: 70px;
        }

        .sidebar-header {
          padding: 20px 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .brand-icon {
          background: rgba(255, 255, 255, 0.15);
          padding: 8px;
          border-radius: 10px;
          backdrop-filter: blur(10px);
        }

        .brand-text h1 {
          font-size: 18px;
          font-weight: 700;
          margin: 0;
          letter-spacing: -0.5px;
        }

        .brand-text p {
          font-size: 11px;
          opacity: 0.8;
          margin: 2px 0 0 0;
          font-weight: 400;
        }

        .toggle-btn {
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: white;
          padding: 8px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          backdrop-filter: blur(10px);
        }

        .toggle-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: scale(1.05);
        }

        .search-container {
          padding: 16px;
          position: relative;
        }

        .search-input {
          width: 100%;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 10px;
          padding: 10px 12px 10px 36px;
          color: white;
          font-size: 14px;
          backdrop-filter: blur(10px);
        }

        .search-input::placeholder {
          color: rgba(255, 255, 255, 0.6);
        }

        .search-input:focus {
          outline: none;
          border-color: rgba(255, 255, 255, 0.4);
          background: rgba(255, 255, 255, 0.15);
        }

        .search-icon {
          position: absolute;
          left: 28px;
          top: 26px;
          opacity: 0.6;
        }

        .stats-section {
          padding: 16px;
        }

        .stat-card {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .stat-icon {
          background: rgba(255, 255, 255, 0.2);
          padding: 8px;
          border-radius: 8px;
        }

        .stat-content {
          flex: 1;
        }

        .stat-value {
          display: block;
          font-size: 18px;
          font-weight: 700;
          line-height: 1;
        }

        .stat-label {
          display: block;
          font-size: 12px;
          opacity: 0.8;
          margin-top: 2px;
        }

        .menu-section {
          flex: 1;
          padding: 8px 0;
          overflow-y: auto;
        }

        .menu-items {
          padding: 0 8px;
        }

        .menu-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          margin: 4px 0;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
        }

        .menu-item:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateX(4px);
        }

        .menu-item.active {
          background: rgba(255, 255, 255, 0.15);
          border-left: 3px solid #fbbf24;
        }

        .menu-item.collapsed {
          justify-content: center;
        }

        .menu-item-content {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
        }

        .menu-label {
          font-size: 14px;
          font-weight: 500;
        }

        .menu-badge {
          background: #fbbf24;
          color: #92400e;
          font-size: 11px;
          font-weight: 600;
          padding: 2px 6px;
          border-radius: 10px;
          margin-left: auto;
        }

        .menu-arrow {
          opacity: 0.6;
        }

        .bottom-menu {
          padding: 8px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .user-profile {
          padding: 16px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .user-avatar {
          position: relative;
        }

        .avatar-img {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          border: 2px solid rgba(255, 255, 255, 0.2);
        }

        .user-info {
          flex: 1;
        }

        .user-name {
          display: block;
          font-size: 14px;
          font-weight: 600;
          line-height: 1;
        }

        .user-role {
          display: block;
          font-size: 12px;
          opacity: 0.7;
          margin-top: 2px;
        }

        .main-content {
          flex: 1;
          padding: 32px;
          overflow-y: auto;
        }

        .content-header h1 {
          font-size: 28px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 8px 0;
        }

        .content-header p {
          color: #6b7280;
          margin: 0 0 32px 0;
          font-size: 16px;
        }

        .demo-card {
          background: white;
          border-radius: 16px;
          padding: 32px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          border: 1px solid #f3f4f6;
        }

        .demo-card h2 {
          color: #1f2937;
          margin: 0 0 12px 0;
          font-size: 20px;
          font-weight: 600;
        }

        .demo-card p {
          color: #6b7280;
          margin: 0;
          line-height: 1.6;
        }

        /* Custom scrollbar */
        .menu-section::-webkit-scrollbar {
          width: 4px;
        }

        .menu-section::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
        }

        .menu-section::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 2px;
        }

        .menu-section::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
};

export default InventorySidebar;