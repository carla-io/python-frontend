import React, { useState, useEffect } from 'react';
import { BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Package, AlertTriangle, TrendingUp, Box, RefreshCw, Loader } from 'lucide-react';
import Navigation from '../components/Navigation';
import API_BASE_URL from '../utils/api';
import '../CSS/dashboard.css';

const InventoryDashboard = () => {
  const [stats, setStats] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch inventory data from API
  const fetchInventoryData = async (showRefreshLoader = false) => {
    try {
      if (showRefreshLoader) {
        setIsRefreshing(true);
      } else {
        setLoading(true);
      }
      
      setError('');

      // Fetch stats
      const statsResponse = await fetch(`${API_BASE_URL}/electronics/stats`);
      const statsData = await statsResponse.json();

      // Fetch inventory items
      const inventoryResponse = await fetch(`${API_BASE_URL}/electronics/all-items`);
      const inventoryData = await inventoryResponse.json();

      // Process inventory data
      const processedInventory = (inventoryData.electronics || inventoryData).map(item => ({
        name: item.name,
        category: item.category,
        stock: item.stock,
        min_stock: item.min_stock || item.minStock,
        status: item.stock <= (item.min_stock || item.minStock) ? 'Low Stock' : 'In Stock'
      }));

      setStats(statsData);
      setInventory(processedInventory);
    } catch (err) {
      console.error('Error fetching data:', err);
      
      // Fallback to mock data if API fails
      const mockStats = {
        total_components: 156,
        low_stock_items: 12,
        total_stock: 3245,
        categories: {
          'Microcontroller': 25,
          'Sensor': 42,
          'Motor': 18,
          'Display': 15,
          'Power Supply': 22,
          'Communication Module': 12,
          'Storage': 8,
          'Passive Component': 14
        }
      };

      const mockInventory = [
        { name: 'Arduino Uno', category: 'Microcontroller', stock: 45, min_stock: 20, status: 'In Stock' },
        { name: 'DHT22 Sensor', category: 'Sensor', stock: 8, min_stock: 15, status: 'Low Stock' },
        { name: 'Servo Motor', category: 'Motor', stock: 12, min_stock: 10, status: 'In Stock' },
        { name: 'LCD Display', category: 'Display', stock: 5, min_stock: 8, status: 'Low Stock' },
        { name: 'ESP32', category: 'Communication Module', stock: 30, min_stock: 15, status: 'In Stock' },
        { name: 'Power Adapter', category: 'Power Supply', stock: 25, min_stock: 20, status: 'In Stock' }
      ];

      setStats(mockStats);
      setInventory(mockInventory);
      setError('Using sample data - API connection unavailable');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchInventoryData();
  }, []);

  const handleRefresh = () => {
    fetchInventoryData(true);
  };

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="dashboard-container">
          <div className="dashboard-content">
            <div className="loading-container">
              <Loader className="loading-spinner" />
              <p>Loading dashboard...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error && inventory.length === 0) {
    return (
      <>
        <Navigation />
        <div className="dashboard-container">
          <div className="dashboard-content">
            <div className="error-container">
              <AlertTriangle className="error-icon" />
              <h3>Unable to Load Dashboard</h3>
              <p>{error}</p>
              <button onClick={() => fetchInventoryData()} className="retry-button">
                <RefreshCw size={16} />
                Try Again
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Prepare data for charts
  const categoryData = Object.entries(stats.categories).map(([name, value]) => ({
    name,
    value
  }));

  const stockStatusData = [
    { name: 'In Stock', value: stats.total_components - stats.low_stock_items },
    { name: 'Low Stock', value: stats.low_stock_items }
  ];

  const topStockItems = inventory
    .sort((a, b) => b.stock - a.stock)
    .slice(0, 5)
    .map(item => ({
      name: item.name,
      stock: item.stock
    }));

  const COLORS = ['#ec4899', '#f472b6', '#fb7185', '#f9a8d4', '#fda4af', '#fbbf24', '#a78bfa', '#60a5fa'];
  const STATUS_COLORS = ['#10b981', '#ef4444'];

  return (
    <>
      <Navigation />
      <div className="dashboard-container">
        <div className="dashboard-content">
          {/* Header */}
          <div className="header">
            <div>
              <h1>Inventory Dashboard</h1>
              <p>Electronics Components Overview</p>
            </div>
            <button 
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="refresh-button"
            >
              <RefreshCw className={`refresh-icon ${isRefreshing ? 'spinning' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>

          {/* Error Banner */}
          {error && inventory.length > 0 && (
            <div className="error-banner">
              <AlertTriangle size={16} />
              <span>{error}</span>
              <button onClick={() => setError('')} className="error-dismiss">×</button>
            </div>
          )}

          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card stat-card-pink">
              <div className="stat-card-content">
                <div>
                  <p className="stat-card-title">Total Components</p>
                  <p className="stat-card-value stat-card-value-pink">{stats.total_components}</p>
                </div>
                <Package className="stat-card-icon" />
              </div>
            </div>

            <div className="stat-card stat-card-red">
              <div className="stat-card-content">
                <div>
                  <p className="stat-card-title">Low Stock Items</p>
                  <p className="stat-card-value stat-card-value-red">{stats.low_stock_items}</p>
                </div>
                <AlertTriangle className="stat-card-icon" />
              </div>
            </div>

            <div className="stat-card stat-card-rose">
              <div className="stat-card-content">
                <div>
                  <p className="stat-card-title">Total Stock</p>
                  <p className="stat-card-value stat-card-value-rose">{stats.total_stock}</p>
                </div>
                <Box className="stat-card-icon" />
              </div>
            </div>

            <div className="stat-card stat-card-orange">
              <div className="stat-card-content">
                <div>
                  <p className="stat-card-title">Categories</p>
                  <p className="stat-card-value stat-card-value-orange">{Object.keys(stats.categories).length}</p>
                </div>
                <TrendingUp className="stat-card-icon" />
              </div>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="charts-grid">
            {/* Category Distribution Bar Chart */}
            <div className="chart-card">
              <h2 className="chart-title">Components by Category</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} tick={{ fontSize: 12, fontWeight: 600 }} />
                  <YAxis tick={{ fontSize: 12, fontWeight: 600 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '2px solid #ec4899',
                      borderRadius: '12px',
                      fontWeight: 600
                    }} 
                  />
                  <Bar dataKey="value" fill="#ec4899" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Stock Status Pie Chart */}
            <div className="chart-card">
              <h2 className="chart-title">Stock Status</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={stockStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {stockStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '2px solid #ec4899',
                      borderRadius: '12px',
                      fontWeight: 600
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Category Distribution Pie Chart */}
            <div className="chart-card">
              <h2 className="chart-title">Category Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name.substring(0, 10)}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '2px solid #ec4899',
                      borderRadius: '12px',
                      fontWeight: 600
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Top Stock Items */}
            <div className="chart-card">
              <h2 className="chart-title">Top 5 Stock Items</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topStockItems} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" tick={{ fontSize: 12, fontWeight: 600 }} />
                  <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 11, fontWeight: 600 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '2px solid #ec4899',
                      borderRadius: '12px',
                      fontWeight: 600
                    }} 
                  />
                  <Bar dataKey="stock" fill="#f472b6" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Low Stock Alert Table */}
          <div className="medicine-table-container">
            <div className="medicine-table-header">
              <h2 className="medicine-table-title" style={{ display: 'flex', alignItems: 'center' }}>
                <AlertTriangle style={{ marginRight: '0.5rem' }} size={20} />
                Low Stock Alerts
              </h2>
            </div>
            
            <div className="table-wrapper">
              <table className="medicine-table">
                <thead className="table-header">
                  <tr>
                    <th>Component</th>
                    <th>Category</th>
                    <th>Current Stock</th>
                    <th>Min Stock</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.filter(item => item.status === 'Low Stock').map((item, index) => (
                    <tr key={index} className="table-row">
                      <td className="table-cell">
                        <div className="medicine-name">{item.name}</div>
                      </td>
                      <td className="table-cell">
                        <span className="category-badge">{item.category}</span>
                      </td>
                      <td className="table-cell">
                        <div className="stock-main" style={{ color: '#ef4444', fontWeight: '600' }}>{item.stock}</div>
                      </td>
                      <td className="table-cell">
                        <div className="stock-min">{item.min_stock}</div>
                      </td>
                      <td className="table-cell">
                        <div className="status-container">
                          <div className="status-indicator status-indicator-red"></div>
                          <span className="status-badge status-badge-red">{item.status}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {inventory.filter(item => item.status === 'Low Stock').length === 0 && (
                    <tr>
                      <td colSpan="5" className="table-cell" style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                        No low stock items - all components are well stocked!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .charts-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        @media (min-width: 768px) {
          .charts-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .chart-card {
          background-color: white;
          border-radius: 0.75rem;
          padding: 1.5rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          border: 1px solid #fbcfe8;
        }

        .chart-title {
          color: #831843;
          font-size: 1.125rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }
      `}</style>
    </>
  );
};

export default InventoryDashboard;