import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { message } from 'antd';
import Spinner from '../components/Spinner';
import moment from 'moment';

const Reports = () => {
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [reportType, setReportType] = useState('monthly');
  const [selectedMonth, setSelectedMonth] = useState(moment().format('YYYY-MM'));
  const [selectedYear, setSelectedYear] = useState(moment().format('YYYY'));
  const [customDateRange, setCustomDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [useCustomDate, setUseCustomDate] = useState(false);

  const fetchReportData = useCallback(async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      setLoading(true);

      let frequency = '30';
      if (reportType === 'yearly') {
        frequency = '365';
      } else if (reportType === 'weekly') {
        frequency = '7';
      }

      let requestData = {
        userid: user._id,
        frequency: useCustomDate ? 'custom' : frequency,
        type: 'all'
      };

      // Add custom date range if enabled
      if (useCustomDate && customDateRange.startDate && customDateRange.endDate) {
        requestData.selectedDate = [customDateRange.startDate, customDateRange.endDate];
      }

      const res = await axios.post('/get-transactions', requestData);

      let filteredData = res.data;

      // Filter by selected period (only if not using custom date)
      if (!useCustomDate) {
        if (reportType === 'monthly') {
          filteredData = res.data.filter(t =>
            moment(t.createdAt).format('YYYY-MM') === selectedMonth
          );
        } else if (reportType === 'yearly') {
          filteredData = res.data.filter(t =>
            moment(t.createdAt).format('YYYY') === selectedYear
          );
        }
      }

      setTransactions(filteredData);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      message.error('Failed to fetch report data');
    }
  }, [reportType, selectedMonth, selectedYear, useCustomDate, customDateRange]);

  useEffect(() => {
    fetchReportData();
  }, [fetchReportData]);

  const handleCustomDateChange = (field, value) => {
    setCustomDateRange(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCustomDateToggle = () => {
    setUseCustomDate(!useCustomDate);
  };

  const validateCustomDateRange = () => {
    if (!customDateRange.startDate || !customDateRange.endDate) {
      message.error('Please select both start and end dates');
      return false;
    }

    if (moment(customDateRange.startDate).isAfter(moment(customDateRange.endDate))) {
      message.error('Start date cannot be after end date');
      return false;
    }

    return true;
  };

  const applyCustomDateFilter = () => {
    if (validateCustomDateRange()) {
      fetchReportData();
    }
  };

  const generateReport = () => {
    const income = transactions.filter(t => t.type === 'income');
    const expenses = transactions.filter(t => t.type === 'expense');

    const totalIncome = income.reduce((acc, t) => acc + t.amount, 0);
    const totalExpenses = expenses.reduce((acc, t) => acc + t.amount, 0);

    // Category breakdown
    const categoryBreakdown = {};
    transactions.forEach(t => {
      if (!categoryBreakdown[t.category]) {
        categoryBreakdown[t.category] = { income: 0, expense: 0 };
      }
      categoryBreakdown[t.category][t.type] += t.amount;
    });

    return {
      totalIncome,
      totalExpenses,
      netBalance: totalIncome - totalExpenses,
      totalTransactions: transactions.length,
      incomeCount: income.length,
      expenseCount: expenses.length,
      categoryBreakdown
    };
  };

  const exportReport = () => {
    const report = generateReport();
    const reportData = {
      period: reportType === 'monthly' ? selectedMonth : selectedYear,
      type: reportType,
      summary: report,
      transactions: transactions
    };

    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `expense-report-${reportType}-${reportType === 'monthly' ? selectedMonth : selectedYear}.json`;
    link.click();

    message.success('Report exported successfully');
  };

  const printReport = () => {
    window.print();
  };

  const report = generateReport();

  return (
    <>
      {loading && <Spinner />}

      {/* Report Controls */}
      <div className="dashboard-card mb-30">
        <div className="card-header">
          <h3 className="card-title">Generate Reports</h3>
          <div className="flex gap-15">
            <button className="btn btn-secondary" onClick={exportReport}>
              📥 Export
            </button>
            <button className="btn btn-primary" onClick={printReport}>
              🖨️ Print
            </button>
          </div>
        </div>

        <div className="flex gap-20" style={{ alignItems: 'end' }}>
          {/* Custom Date Range Toggle */}
          <div className="form-group">
            <label className="form-label">Filter Type</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500' }}>
                <input
                  type="checkbox"
                  checked={useCustomDate}
                  onChange={handleCustomDateToggle}
                  style={{ marginRight: '8px' }}
                />
                Custom Date Range
              </label>
            </div>
          </div>

          {/* Custom Date Range Inputs */}
          {useCustomDate && (
            <>
              <div className="form-group">
                <label className="form-label">Start Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={customDateRange.startDate}
                  onChange={(e) => handleCustomDateChange('startDate', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">End Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={customDateRange.endDate}
                  onChange={(e) => handleCustomDateChange('endDate', e.target.value)}
                />
              </div>

              <button className="btn btn-primary" onClick={applyCustomDateFilter}>
                Apply Filter
              </button>
            </>
          )}

          {/* Regular Report Type Selection */}
          {!useCustomDate && (
            <>
              <div className="form-group">
                <label className="form-label">Report Type</label>
                <select
                  className="form-select"
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                >
                  <option value="weekly">Weekly Report</option>
                  <option value="monthly">Monthly Report</option>
                  <option value="yearly">Yearly Report</option>
                </select>
              </div>

              {reportType === 'monthly' && (
                <div className="form-group">
                  <label className="form-label">Select Month</label>
                  <input
                    type="month"
                    className="form-input"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                  />
                </div>
              )}

              {reportType === 'yearly' && (
                <div className="form-group">
                  <label className="form-label">Select Year</label>
                  <input
                    type="number"
                    className="form-input"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    min="2020"
                    max={new Date().getFullYear()}
                  />
                </div>
              )}

              <button className="btn btn-primary" onClick={fetchReportData}>
                Generate Report
              </button>
            </>
          )}
        </div>
      </div>

      {/* Report Summary */}
      <div className="stats-grid mb-30">
        <div className="stat-card">
          <div className="stat-value income-stat">₹{report.totalIncome.toLocaleString()}</div>
          <div className="stat-label">Total Income</div>
          <div style={{ fontSize: '0.8rem', color: '#7f8c8d', marginTop: '5px' }}>
            {report.incomeCount} transactions
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-value expense-stat">₹{report.totalExpenses.toLocaleString()}</div>
          <div className="stat-label">Total Expenses</div>
          <div style={{ fontSize: '0.8rem', color: '#7f8c8d', marginTop: '5px' }}>
            {report.expenseCount} transactions
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-value" style={{
            color: report.netBalance >= 0 ? '#27ae60' : '#e74c3c'
          }}>
            ₹{report.netBalance.toLocaleString()}
          </div>
          <div className="stat-label">Net Balance</div>
          <div style={{ fontSize: '0.8rem', color: '#7f8c8d', marginTop: '5px' }}>
            {report.netBalance >= 0 ? 'Profit' : 'Loss'}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-value transactions-stat">{report.totalTransactions}</div>
          <div className="stat-label">Total Transactions</div>
          <div style={{ fontSize: '0.8rem', color: '#7f8c8d', marginTop: '5px' }}>
            This {reportType}
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="dashboard-card mb-30">
        <div className="card-header">
          <h3 className="card-title">Category Breakdown</h3>
        </div>

        {Object.keys(report.categoryBreakdown).length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {Object.entries(report.categoryBreakdown).map(([category, data]) => (
              <div key={category} style={{
                padding: '20px',
                background: '#f8f9ff',
                borderRadius: '8px'
              }}>
                <h4 style={{
                  textTransform: 'capitalize',
                  marginBottom: '15px',
                  color: '#2c3e50'
                }}>
                  <span style={{ fontWeight: 'bold' }}>Category:</span> {category}
                </h4>
                {data.income > 0 && (
                  <div style={{ marginBottom: '10px' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '5px'
                    }}>
                      <span><span style={{ fontWeight: 'bold' }}>Type:</span> Income</span>
                      <span style={{ color: '#27ae60', fontWeight: '600' }}>
                        ₹{data.income.toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}
                {data.expense > 0 && (
                  <div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '5px'
                    }}>
                      <span><span style={{ fontWeight: 'bold' }}>Type:</span> Expense</span>
                      <span style={{ color: '#e74c3c', fontWeight: '600' }}>
                        ₹{data.expense.toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}
                <div style={{
                  marginTop: '10px',
                  paddingTop: '10px',
                  borderTop: '1px solid #e1e8ed'
                }}>
                  <strong>Net: ₹{(data.income - data.expense).toLocaleString()}</strong>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', color: '#7f8c8d', padding: '40px' }}>
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📊</div>
            <p>No data available for the selected period</p>
          </div>
        )}
      </div>

      {/* Detailed Transactions */}
      <div className="dashboard-card">
        <div className="card-header">
          <h3 className="card-title">Detailed Transactions</h3>
          <span style={{ color: '#7f8c8d' }}>
            {transactions.length} transactions found
          </span>
        </div>

        {transactions.length > 0 ? (
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {transactions.map((transaction) => (
              <div key={transaction._id} className="transaction-item">
                <div className="transaction-info">
                  <div className="transaction-category">
                    <span style={{ fontWeight: 'bold' }}>Type:</span> {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)} | <span style={{ fontWeight: 'bold' }}>Category:</span> {transaction.category.charAt(0).toUpperCase() + transaction.category.slice(1)}
                  </div>
                  {transaction.reference && (
                    <div className="transaction-reference" style={{ color: '#7f8c8d', fontSize: '13px', marginBottom: '2px' }}>
                      <span style={{ fontWeight: 'bold' }}>Reference:</span> {transaction.reference}
                    </div>
                  )}
                  <div className="transaction-description">{transaction.description}</div>
                  <div className="transaction-date">
                    {moment(transaction.createdAt).format('MMM DD, YYYY HH:mm')}
                  </div>
                </div>
                <div className={`transaction-amount ${transaction.type}-amount`}>
                  {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', color: '#7f8c8d', padding: '40px' }}>
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📋</div>
            <p>No transactions found for the selected period</p>
          </div>
        )}
      </div>
    </>
  );
};

export default Reports;
