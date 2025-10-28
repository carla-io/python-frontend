import React, { useState, useEffect } from 'react';
import { X, Cpu, AlertCircle, CheckCircle } from 'lucide-react';
import axios from 'axios';
import API_BASE_URL from '../utils/api';
import '../CSS/addmedicine.css';

const AddElectronicsModal = ({ isOpen, onClose, onSubmit, editingItem }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    stock: '',
    min_stock: '',
    specifications: '',
    supplier: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  const categories = [
    'Microcontroller',
    'Sensor',
    'Motor',
    'Display',
    'Power Supply',
    'Communication Module',
    'Storage',
    'Passive Component',
    'Other'
  ];

  const suppliers = [
    'Arduino',
    'Raspberry Pi',
    'Adafruit',
    'SparkFun',
    'Seeed Studio',
    'DFRobot',
    'Pololu',
    'Texas Instruments',
    'STMicroelectronics',
    'Espressif',
    'Other'
  ];

  // Populate form when editing
  useEffect(() => {
    if (editingItem) {
      setFormData({
        name: editingItem.name || '',
        category: editingItem.category || '',
        stock: editingItem.stock?.toString() || '',
        min_stock: editingItem.minStock?.toString() || editingItem.min_stock?.toString() || '',
        specifications: editingItem.specifications || '',
        supplier: editingItem.supplier || ''
      });
    } else {
      // Reset form for adding new item
      setFormData({
        name: '',
        category: '',
        stock: '',
        min_stock: '',
        specifications: '',
        supplier: ''
      });
    }
    setErrors({});
  }, [editingItem, isOpen]);

  // Show toast notification
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 3000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Component name is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.stock) {
      newErrors.stock = 'Stock quantity is required';
    } else if (parseInt(formData.stock) < 0) {
      newErrors.stock = 'Stock quantity must be positive';
    }

    if (!formData.min_stock) {
      newErrors.min_stock = 'Minimum stock is required';
    } else if (parseInt(formData.min_stock) < 0) {
      newErrors.min_stock = 'Minimum stock must be positive';
    }

    if (!formData.supplier) {
      newErrors.supplier = 'Supplier is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors(prev => ({ ...prev, submit: '' }));

    try {
      const processedData = {
        ...formData,
        stock: parseInt(formData.stock),
        min_stock: parseInt(formData.min_stock)
      };

      let response;
      
      if (editingItem) {
        // Update existing component
        response = await axios.put(
          `${API_BASE_URL}/electronics/${editingItem.id}-update`, 
          processedData,
          {
            headers: {
              'Content-Type': 'application/json',
            }
          }
        );
        
        if (response.status === 200) {
          console.log('Component updated successfully:', response.data);
          
          if (onSubmit) {
            onSubmit(processedData);
          }
          
          showToast('Component updated successfully!', 'success');
          
          setTimeout(() => {
            handleClose();
          }, 1500);
        }
      } else {
        // Add new component
        response = await axios.post(
          `${API_BASE_URL}/electronics/add-electronics`, 
          processedData,
          {
            headers: {
              'Content-Type': 'application/json',
            }
          }
        );

        if (response.status === 201) {
          console.log('Component added successfully:', response.data);
          
          if (onSubmit) {
            onSubmit(response.data.electronics || processedData);
          }
          
          showToast('Component added successfully!', 'success');
          
          setTimeout(() => {
            handleClose();
          }, 1500);
        }
      }

    } catch (error) {
      console.error(`Error ${editingItem ? 'updating' : 'adding'} component:`, error);
      
      let errorMessage = `Failed to ${editingItem ? 'update' : 'add'} component. Please try again.`;
      
      if (error.response) {
        if (error.response.status === 400) {
          errorMessage = error.response.data.error || 'Invalid data provided';
        } else if (error.response.status === 404) {
          errorMessage = 'Component not found';
        } else if (error.response.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        }
      } else if (error.request) {
        errorMessage = 'Network error. Please check your connection.';
      }
      
      setErrors(prev => ({
        ...prev,
        submit: errorMessage
      }));
      
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      category: '',
      stock: '',
      min_stock: '',
      specifications: '',
      supplier: ''
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-container">
            <Cpu className="modal-icon" />
            <h2 className="modal-title">
              {editingItem ? 'Edit Component' : 'Add New Component'}
            </h2>
          </div>
          <button 
            onClick={handleClose}
            className="modal-close-button"
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-form">
          <div className="form-grid">
            {/* Component Name */}
            <div className="form-group">
              <label className="form-label">
                Component Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`form-input ${errors.name ? 'form-input-error' : ''}`}
                placeholder="e.g., Arduino Uno R3"
              />
              {errors.name && (
                <div className="error-message">
                  <AlertCircle size={16} />
                  {errors.name}
                </div>
              )}
            </div>

            {/* Category */}
            <div className="form-group">
              <label className="form-label">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={`form-select ${errors.category ? 'form-input-error' : ''}`}
              >
                <option value="">Select category</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category && (
                <div className="error-message">
                  <AlertCircle size={16} />
                  {errors.category}
                </div>
              )}
            </div>

            {/* Stock Quantity */}
            <div className="form-group">
              <label className="form-label">
                Stock Quantity *
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                className={`form-input ${errors.stock ? 'form-input-error' : ''}`}
                placeholder="0"
                min="0"
              />
              {errors.stock && (
                <div className="error-message">
                  <AlertCircle size={16} />
                  {errors.stock}
                </div>
              )}
            </div>

            {/* Minimum Stock */}
            <div className="form-group">
              <label className="form-label">
                Minimum Stock *
              </label>
              <input
                type="number"
                name="min_stock"
                value={formData.min_stock}
                onChange={handleInputChange}
                className={`form-input ${errors.min_stock ? 'form-input-error' : ''}`}
                placeholder="0"
                min="0"
              />
              {errors.min_stock && (
                <div className="error-message">
                  <AlertCircle size={16} />
                  {errors.min_stock}
                </div>
              )}
            </div>

            {/* Specifications */}
            <div className="form-group">
              <label className="form-label">
                Specifications
              </label>
              <input
                type="text"
                name="specifications"
                value={formData.specifications}
                onChange={handleInputChange}
                className="form-input"
                placeholder="e.g., ATmega328P, 16MHz, 5V"
              />
            </div>

            {/* Supplier */}
            <div className="form-group">
              <label className="form-label">
                Supplier *
              </label>
              <select
                name="supplier"
                value={formData.supplier}
                onChange={handleInputChange}
                className={`form-select ${errors.supplier ? 'form-input-error' : ''}`}
              >
                <option value="">Select supplier</option>
                {suppliers.map(supplier => (
                  <option key={supplier} value={supplier}>
                    {supplier}
                  </option>
                ))}
              </select>
              {errors.supplier && (
                <div className="error-message">
                  <AlertCircle size={16} />
                  {errors.supplier}
                </div>
              )}
            </div>
          </div>

          {/* Submit Error Message */}
          {errors.submit && (
            <div className="submit-error-message">
              <AlertCircle size={16} />
              {errors.submit}
            </div>
          )}

          <div className="form-actions">
            <button 
              type="button" 
              onClick={handleClose}
              className="button-secondary"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button 
              type="button"
              onClick={handleSubmit}
              className="button-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="spinner"></div>
                  {editingItem ? 'Updating...' : 'Adding...'}
                </>
              ) : (
                editingItem ? 'Update Component' : 'Add Component'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <div className={`toast toast-${toast.type}`}>
          <div className="toast-content">
            {toast.type === 'success' ? (
              <CheckCircle className="toast-icon" size={20} />
            ) : (
              <AlertCircle className="toast-icon" size={20} />
            )}
            <span className="toast-message">{toast.message}</span>
            <button 
              onClick={() => setToast({ show: false, message: '', type: '' })}
              className="toast-close"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddElectronicsModal;