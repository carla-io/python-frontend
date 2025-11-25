import React, { useState, useEffect, useRef } from 'react';
import { Package, TrendingUp, Users, Calendar, RefreshCw, Loader, AlertTriangle, Download, FileText, Building, Phone, Mail } from 'lucide-react';
import Navigation from '../components/Navigation';
import '../CSS/InventoryReports.css';

const API_BASE_URL = 'https://python-backend-8x39.onrender.com';

const InventoryReports = () => {
  const [stockSummary, setStockSummary] = useState(null);
  const [categoryBreakdown, setCategoryBreakdown] = useState([]);
  const [supplierPerformance, setSupplierPerformance] = useState([]);
  const [usageTrends, setUsageTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const receiptRef = useRef(null);

  const fetchReportsData = async (showRefreshLoader = false) => {
    try {
      if (showRefreshLoader) {
        setIsRefreshing(true);
      } else {
        setLoading(true);
      }
      
      setError('');

      const [summaryRes, categoryRes, supplierRes, trendsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/electronics/reports/stock-summary`),
        fetch(`${API_BASE_URL}/electronics/reports/category-breakdown`),
        fetch(`${API_BASE_URL}/electronics/reports/supplier-performance`),
        fetch(`${API_BASE_URL}/electronics/reports/usage-trends`)
      ]);

      const summaryData = await summaryRes.json();
      const categoryData = await categoryRes.json();
      const supplierData = await supplierRes.json();
      const trendsData = await trendsRes.json();

      setStockSummary(summaryData);
      setCategoryBreakdown(categoryData.categories || []);
      setSupplierPerformance(supplierData.suppliers || []);
      setUsageTrends(trendsData.monthly_trends || []);
    } catch (err) {
      console.error('Error fetching reports:', err);
      
      // Mock data fallback
      setStockSummary({
        total_items: 156,
        low_stock_items: 12,
        in_stock_items: 144,
        total_stock_quantity: 3245
      });

      setCategoryBreakdown([
        { category: 'Microcontroller', count: 25, total_stock: 450 },
        { category: 'Sensor', count: 42, total_stock: 680 },
        { category: 'Motor', count: 18, total_stock: 290 },
        { category: 'Display', count: 15, total_stock: 180 },
        { category: 'Power Supply', count: 22, total_stock: 520 },
        { category: 'Communication Module', count: 12, total_stock: 340 }
      ]);

      setSupplierPerformance([
        { supplier: 'Electronics Hub', total_items: 45, total_stock: 890, low_stock_items: 3 },
        { supplier: 'Component World', total_items: 38, total_stock: 720, low_stock_items: 5 },
        { supplier: 'Tech Supply Co', total_items: 32, total_stock: 650, low_stock_items: 2 },
        { supplier: 'Global Parts', total_items: 28, total_stock: 580, low_stock_items: 1 }
      ]);

      setUsageTrends([
        { year: 2024, month: 7, items_added: 15 },
        { year: 2024, month: 8, items_added: 22 },
        { year: 2024, month: 9, items_added: 18 },
        { year: 2024, month: 10, items_added: 25 },
        { year: 2024, month: 11, items_added: 20 }
      ]);

      setError('Using sample data - API connection unavailable');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchReportsData();
  }, []);

  const handleRefresh = () => {
    fetchReportsData(true);
  };

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      // Dynamic import of html2pdf
      const html2pdf = (await import('html2pdf.js')).default;
      
      const element = receiptRef.current;
      const opt = {
        margin: 10,
        filename: `inventory-report-${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      await html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.error('Error generating PDF:', err);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const getCurrentDate = () => {
    const now = new Date();
    return now.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="dashboard-container">
          <div className="dashboard-content">
            <div className="loading-container">
              <Loader className="loading-spinner" />
              <p>Loading reports...</p>
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
          {/* Header Actions */}
          <div className="header-actions">
            <button 
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="action-button refresh-btn"
            >
              <RefreshCw className={`icon ${isRefreshing ? 'spinning' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
            </button>
            <button 
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className="action-button download-btn"
            >
              <Download className="icon" />
              {isDownloading ? 'Generating PDF...' : 'Download PDF'}
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="error-banner">
              <AlertTriangle size={16} />
              <span>{error}</span>
              <button onClick={() => setError('')} className="error-dismiss">×</button>
            </div>
          )}

          {/* Receipt Container */}
          <div className="receipt-container" ref={receiptRef}>
            {/* Receipt Header */}
            <div className="receipt-header">
              <div className="company-logo">
                <Package size={48} />
              </div>
              <h1 className="company-name">Electronics Inventory System</h1>
              <p className="company-tagline">Inventory Management Report</p>
              <div className="company-info">
                <div className="info-item">
                  <Building size={14} />
                  <span>123 Tech Street, Innovation City</span>
                </div>
                <div className="info-item">
                  <Phone size={14} />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="info-item">
                  <Mail size={14} />
                  <span>inventory@electronics.com</span>
                </div>
              </div>
            </div>

            <div className="receipt-divider"></div>

            {/* Report Info */}
            <div className="report-info">
              <div className="report-meta">
                <div className="meta-item">
                  <span className="meta-label">Report Date:</span>
                  <span className="meta-value">{getCurrentDate()}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Report Type:</span>
                  <span className="meta-value">Full Inventory Analysis</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Report ID:</span>
                  <span className="meta-value">INV-{Date.now().toString().slice(-8)}</span>
                </div>
              </div>
            </div>

            <div className="receipt-divider"></div>

            {/* Summary Section */}
            <div className="receipt-section">
              <h2 className="section-title">
                <FileText size={20} />
                INVENTORY SUMMARY
              </h2>
              <div className="summary-grid">
                <div className="summary-item">
                  <span className="summary-label">Total Items</span>
                  <span className="summary-value">{stockSummary?.total_items || 0}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">In Stock Items</span>
                  <span className="summary-value success">{stockSummary?.in_stock_items || 0}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Low Stock Items</span>
                  <span className="summary-value warning">{stockSummary?.low_stock_items || 0}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Total Stock Quantity</span>
                  <span className="summary-value">{stockSummary?.total_stock_quantity || 0}</span>
                </div>
              </div>
            </div>

            <div className="receipt-divider"></div>

            {/* Category Breakdown */}
            <div className="receipt-section">
              <h2 className="section-title">
                <Package size={20} />
                CATEGORY BREAKDOWN
              </h2>
              <table className="receipt-table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th className="text-center">Items</th>
                    <th className="text-right">Stock Qty</th>
                    <th className="text-right">Avg/Item</th>
                  </tr>
                </thead>
                <tbody>
                  {categoryBreakdown.map((category, index) => (
                    <tr key={index}>
                      <td className="category-name">{category.category}</td>
                      <td className="text-center">{category.count}</td>
                      <td className="text-right font-bold">{category.total_stock}</td>
                      <td className="text-right">{(category.total_stock / category.count).toFixed(1)}</td>
                    </tr>
                  ))}
                  <tr className="total-row">
                    <td className="font-bold">TOTAL</td>
                    <td className="text-center font-bold">{categoryBreakdown.reduce((sum, cat) => sum + cat.count, 0)}</td>
                    <td className="text-right font-bold">{categoryBreakdown.reduce((sum, cat) => sum + cat.total_stock, 0)}</td>
                    <td className="text-right">—</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="receipt-divider"></div>

            {/* Supplier Performance */}
            <div className="receipt-section">
              <h2 className="section-title">
                <Users size={20} />
                SUPPLIER PERFORMANCE
              </h2>
              <table className="receipt-table">
                <thead>
                  <tr>
                    <th>Supplier Name</th>
                    <th className="text-center">Items</th>
                    <th className="text-center">Total Stock</th>
                    <th className="text-center">Low Stock</th>
                    <th className="text-center">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {supplierPerformance.map((supplier, index) => {
                    const score = ((supplier.total_items - supplier.low_stock_items) / supplier.total_items * 100).toFixed(0);
                    return (
                      <tr key={index}>
                        <td className="category-name">{supplier.supplier}</td>
                        <td className="text-center">{supplier.total_items}</td>
                        <td className="text-center">{supplier.total_stock}</td>
                        <td className="text-center">
                          <span className={supplier.low_stock_items > 0 ? 'warning' : 'success'}>
                            {supplier.low_stock_items}
                          </span>
                        </td>
                        <td className="text-center">
                          <span className={score >= 90 ? 'success' : 'warning'}>
                            {score}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="receipt-divider"></div>

            {/* Usage Trends */}
            <div className="receipt-section">
              <h2 className="section-title">
                <Calendar size={20} />
                MONTHLY USAGE TRENDS
              </h2>
              <table className="receipt-table">
                <thead>
                  <tr>
                    <th>Month</th>
                    <th className="text-center">Year</th>
                    <th className="text-right">Items Added</th>
                  </tr>
                </thead>
                <tbody>
                  {usageTrends.map((trend, index) => (
                    <tr key={index}>
                      <td className="category-name">{monthNames[trend.month - 1]}</td>
                      <td className="text-center">{trend.year}</td>
                      <td className="text-right font-bold">{trend.items_added}</td>
                    </tr>
                  ))}
                  <tr className="total-row">
                    <td className="font-bold" colSpan="2">TOTAL ITEMS ADDED</td>
                    <td className="text-right font-bold">
                      {usageTrends.reduce((sum, trend) => sum + trend.items_added, 0)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="receipt-divider"></div>

            {/* Footer */}
            <div className="receipt-footer">
              <p className="footer-text">This is a computer-generated report.</p>
              <p className="footer-text">For questions or concerns, please contact our inventory team.</p>
              <div className="footer-signature">
                <div className="signature-line"></div>
                <p className="signature-label">Authorized Signature</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InventoryReports;