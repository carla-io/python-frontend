import React, { useState, useEffect } from 'react';
import { Cpu, AlertTriangle, Plus, Search, Calendar, TrendingDown, RefreshCw, Loader, Trash2, Edit } from 'lucide-react';
import axios from 'axios';
import Navigation from '../components/Navigation';
import AddElectronicsModal from '../pages/AddElectronics';
import API_BASE_URL from '../utils/api';
import '../CSS/dashboard.css';

const ElectronicsInventoryDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  // Sample data for electronics inventory (fallback)
  const sampleElectronics = [
    {
      id: '1',
      name: 'Arduino Uno R3',
      category: 'Microcontroller',
      stock: 45,
      minStock: 20,
      specifications: 'ATmega328P, 16MHz, 5V, 14 Digital I/O',
      supplier: 'Arduino'
    },
    {
      id: '2',
      name: 'DHT22 Temperature Sensor',
      category: 'Sensor',
      stock: 12,
      minStock: 15,
      specifications: '-40 to 80°C, ±0.5°C accuracy, Humidity',
      supplier: 'Adafruit'
    },
    {
      id: '3',
      name: 'ESP32 DevKit',
      category: 'Microcontroller',
      stock: 8,
      minStock: 10,
      specifications: 'WiFi/BT, Dual-core 240MHz, 4MB Flash',
      supplier: 'Espressif'
    },
    {
      id: '4',
      name: 'OLED Display 0.96"',
      category: 'Display',
      stock: 67,
      minStock: 30,
      specifications: '128x64, I2C/SPI, White/Blue',
      supplier: 'Adafruit'
    },
    {
      id: '5',
      name: 'HC-05 Bluetooth Module',
      category: 'Communication Module',
      stock: 23,
      minStock: 15,
      specifications: 'Class 2, 10m range, UART interface',
      supplier: 'SparkFun'
    }
  ];

  const [electronics, setElectronics] = useState([]);

  // Fetch all electronics from the backend
  const fetchElectronics = async (showRefreshLoader = false) => {
    try {
      if (showRefreshLoader) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      
      setError('');
      
      const response = await axios.get(`${API_BASE_URL}/electronics/all-items`);
      
      if (response.status === 200) {
        // Backend returns {count: number, electronics: array}
        const electronicsData = response.data.electronics || response.data;
        
        // Map backend data to match frontend structure
        const mappedData = electronicsData.map(item => ({
          id: item._id || item.id,
          name: item.name,
          category: item.category,
          stock: item.stock,
          minStock: item.min_stock || item.minStock,
          specifications: item.specifications || '',
          supplier: item.supplier
        }));
        
        setElectronics(mappedData);
        console.log('Electronics loaded successfully:', mappedData);
      }
      
    } catch (error) {
      console.error('Error fetching electronics:', error);
      
      let errorMessage = 'Failed to load electronics. Please try again.';
      
      if (error.response) {
        if (error.response.status === 404) {
          errorMessage = 'Electronics endpoint not found.';
        } else if (error.response.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        }
      } else if (error.request) {
        errorMessage = 'Network error. Please check your connection.';
      }
      
      setError(errorMessage);
      // Fallback to sample data if API fails
      setElectronics(sampleElectronics);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Fetch electronics on component mount
  useEffect(() => {
    fetchElectronics();
  }, []);

  // Handle adding new electronics
  const handleAddElectronics = async (electronicsData) => {
    if (editingItem) {
      // Update existing item
      setElectronics(prev => prev.map(item => 
        item.id === editingItem.id 
          ? { ...item, ...electronicsData, minStock: electronicsData.min_stock }
          : item
      ));
      setEditingItem(null);
    } else {
      // Refresh to get from backend after adding
      await fetchElectronics(true);
    }
  };

  // Handle edit
  const handleEdit = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this component?')) {
      try {
        const response = await axios.delete(`${API_BASE_URL}/electronics/${id}-delete`);
        
        if (response.status === 200) {
          setElectronics(prev => prev.filter(item => item.id !== id));
          console.log('Component deleted successfully');
        }
      } catch (error) {
        console.error('Error deleting component:', error);
        
        let errorMessage = 'Failed to delete component. Please try again.';
        
        if (error.response) {
          if (error.response.status === 404) {
            errorMessage = 'Component not found.';
          } else if (error.response.status === 500) {
            errorMessage = 'Server error. Please try again later.';
          }
        }
        
        setError(errorMessage);
      }
    }
  };

  // Handle manual refresh
  const handleRefresh = () => {
    fetchElectronics(true);
  };

  // Calculate statistics
  const totalComponents = electronics.length;
  const lowStockCount = electronics.filter(item => item.stock <= item.minStock).length;
  const totalStock = electronics.reduce((sum, item) => sum + item.stock, 0);
  const microcontrollerCount = electronics.filter(item => 
    item.category === 'Microcontroller'
  ).length;

  // Filter electronics based on search
  const filteredElectronics = electronics.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.specifications && item.specifications.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const StatCard = ({ icon: Icon, title, value, cardClass, textClass }) => (
    <div className={`stat-card ${cardClass}`}>
      <div className="stat-card-content">
        <div>
          <p className="stat-card-title">{title}</p>
          <p className={`stat-card-value ${textClass}`}>{value}</p>
        </div>
        <Icon className="stat-card-icon" />
      </div>
    </div>
  );

  const getStockStatus = (item) => {
    if (item.stock <= item.minStock) {
      return { status: 'Low Stock', color: 'status-badge-red', indicator: 'status-indicator-red' };
    }
    return { status: 'In Stock', color: 'status-badge-green', indicator: 'status-indicator-green' };
  };

  // Loading state
  if (isLoading) {
    return (
      <>
        <Navigation />
        <div className="dashboard-container">
          <div className="dashboard-content">
            <div className="loading-container">
              <Loader className="loading-spinner" />
              <p>Loading electronics inventory...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Error state
  if (error && electronics.length === 0) {
    return (
      <>
        <Navigation />
        <div className="dashboard-container">
          <div className="dashboard-content">
            <div className="error-container">
              <AlertTriangle className="error-icon" />
              <h3>Unable to Load Electronics</h3>
              <p>{error}</p>
              <button onClick={() => fetchElectronics()} className="retry-button">
                <RefreshCw size={16} />
                Try Again
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="dashboard-container">
        <div className="dashboard-content">
          {/* header-dashboard */}
          <div className="header">
            <div>
              <h1>Electronics Inventory Dashboard</h1>
              <p>Track and manage microcontrollers, sensors, and electronic components</p>
            </div>
            <button 
              onClick={handleRefresh} 
              className="refresh-button"
              disabled={isRefreshing}
            >
              <RefreshCw className={`refresh-icon ${isRefreshing ? 'spinning' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>

          {/* Error Banner (if error but electronics still showing) */}
          {error && electronics.length > 0 && (
            <div className="error-banner">
              <AlertTriangle size={16} />
              <span>{error}</span>
              <button onClick={() => setError('')} className="error-dismiss">×</button>
            </div>
          )}

          {/* Statistics Cards */}
          <div className="stats-grid">
            <StatCard 
              icon={Cpu} 
              title="Total Components" 
              value={totalComponents} 
              cardClass="stat-card-pink" 
              textClass="stat-card-value-pink"
            />
            <StatCard 
              icon={TrendingDown} 
              title="Total Stock" 
              value={totalStock} 
              cardClass="stat-card-rose" 
              textClass="stat-card-value-rose"
            />
            <StatCard 
              icon={AlertTriangle} 
              title="Low Stock Items" 
              value={lowStockCount} 
              cardClass="stat-card-red" 
              textClass="stat-card-value-red"
            />
            <StatCard 
              icon={Cpu} 
              title="Microcontrollers" 
              value={microcontrollerCount} 
              cardClass="stat-card-orange" 
              textClass="stat-card-value-orange"
            />
          </div>

          {/* Search and Actions */}
          <div className="search-actions-section">
            <div className="search-actions-content">
              <div className="search-container">
                <Search className="search-icon" />
                <input
                  type="text"
                  placeholder="Search components..."
                  className="search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button 
                className="add-button"
                onClick={() => {
                  setEditingItem(null);
                  setIsModalOpen(true);
                }}
              >
                <Plus className="add-button-icon" />
                Add Component
              </button>
            </div>
          </div>

          {/* Electronics List */}
          <div className="medicine-table-container">
            <div className="medicine-table-header">
              <h2 className="medicine-table-title">Electronics Inventory</h2>
              {filteredElectronics.length === 0 && searchTerm && (
                <p className="no-results">No components found matching "{searchTerm}"</p>
              )}
            </div>
            
            {filteredElectronics.length > 0 ? (
              <div className="table-wrapper">
                <table className="medicine-table">
                  <thead className="table-header">
                    <tr>
                      <th>Component Name</th>
                      <th>Category</th>
                      <th>Stock</th>
                      <th>Status</th>
                      <th>Specifications</th>
                      <th>Supplier</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredElectronics.map((item) => {
                      const stockStatus = getStockStatus(item);
                      
                      return (
                        <tr key={item.id} className="table-row">
                          <td className="table-cell">
                            <div className="medicine-name">{item.name}</div>
                          </td>
                          <td className="table-cell">
                            <span className="category-badge">
                              {item.category}
                            </span>
                          </td>
                          <td className="table-cell">
                            <div className="stock-main">{item.stock}</div>
                            <div className="stock-min">Min: {item.minStock}</div>
                          </td>
                          <td className="table-cell">
                            <div className="status-container">
                              <div className={`status-indicator ${stockStatus.indicator}`}></div>
                              <span className={`status-badge ${stockStatus.color}`}>
                                {stockStatus.status}
                              </span>
                            </div>
                          </td>
                          <td className="table-cell">
                            <div className="expiry-date">
                              {item.specifications || 'N/A'}
                            </div>
                          </td>
                          <td className="table-cell supplier-text">{item.supplier}</td>
                          <td className="table-cell">
                            <div className="action-buttons">
                              <button 
                                className="action-btn edit-btn"
                                onClick={() => handleEdit(item)}
                                title="Edit component"
                              >
                                <Edit size={18} />
                              </button>
                              <button 
                                className="action-btn delete-btn"
                                onClick={() => handleDelete(item.id)}
                                title="Delete component"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              !searchTerm && (
                <div className="empty-state">
                  <Cpu className="empty-state-icon" />
                  <h3>No components in inventory</h3>
                  <p>Add your first component to get started</p>
                  <button 
                    className="add-button"
                    onClick={() => {
                      setEditingItem(null);
                      setIsModalOpen(true);
                    }}
                  >
                    <Plus className="add-button-icon" />
                    Add Component
                  </button>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Electronics Modal */}
      <AddElectronicsModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
        }}
        onSubmit={handleAddElectronics}
        editingItem={editingItem}
      />
    </>
  );
};

export default ElectronicsInventoryDashboard;