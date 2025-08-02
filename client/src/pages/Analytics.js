import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { message } from 'antd';
import Spinner from '../components/Spinner';

const categories = [
  'salary', 'tip', 'project', 'food', 'movie', 'bills',
  'medical', 'fees', 'shopping', 'travel', 'other'
];

const Analytics = () => {
  const [loading, setLoading] = useState(false);
  const [analytics, setAnalytics] = useState({
    totalIncome: 0,
    totalExpense: 0,
    incomeTransactions: 0,
    expenseTransactions: 0,
    categoryBreakdown: {}
  });
  const [error, setError] = useState(null);

  const fetchAnalyticsData = useCallback(async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      setLoading(true);
      
      const res = await axios.post('/get-transactions', {
        userid: user._id,
        frequency: '365',
        type: 'all'
      });
      
      const data = res.data;
      
      // Calculate analytics
      const totalIncome = data
        .filter(t => t.type === 'income')
        .reduce((acc, t) => acc + t.amount, 0);
      
      const totalExpense = data
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => acc + t.amount, 0);
      
      const incomeTransactions = data.filter(t => t.type === 'income').length;
      const expenseTransactions = data.filter(t => t.type === 'expense').length;
      
      // Category breakdown
      const categoryBreakdown = {};
      categories.forEach(category => {
        categoryBreakdown[category] = {
          income: data
            .filter(t => t.type === 'income' && t.category === category)
            .reduce((acc, t) => acc + t.amount, 0),
          expense: data
            .filter(t => t.type === 'expense' && t.category === category)
            .reduce((acc, t) => acc + t.amount, 0)
        };
      });
      
      setAnalytics({
        totalIncome,
        totalExpense,
        incomeTransactions,
        expenseTransactions,
        categoryBreakdown
      });
      
      setLoading(false);
      setError(null);
    } catch (error) {
      console.log(error);
      setLoading(false);
      setError('Failed to fetch analytics data');
      message.error('Failed to fetch analytics data');
    }
  }, []);

  useEffect(() => {
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  const getPercentage = (value, total) => {
    return total > 0 ? ((value / total) * 100).toFixed(1) : 0;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <>
      {loading && <Spinner />}
      
      {error && (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px', 
          color: '#e74c3c',
          background: '#fdf2f2',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>⚠️</div>
          <p>{error}</p>
          <button 
            onClick={fetchAnalyticsData}
            style={{
              marginTop: '10px',
              padding: '8px 16px',
              background: '#e74c3c',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Try Again
          </button>
        </div>
      )}
      
      {/* Summary Cards */}
      <div className="stats-grid mb-30">
        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">Total Transactions</h3>
            <div className="card-icon transactions-card">📊</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div className="stat-value transactions-stat">
                {analytics.incomeTransactions + analytics.expenseTransactions}
              </div>
              <div className="stat-label">Total Count</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: '#27ae60', fontWeight: '600' }}>
                Income: {analytics.incomeTransactions}
              </div>
              <div style={{ color: '#e74c3c', fontWeight: '600' }}>
                Expense: {analytics.expenseTransactions}
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">Income vs Expense</h3>
            <div className="card-icon balance-card">💰</div>
          </div>
          <div>
            <div style={{ marginBottom: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span>Income</span>
                <span style={{ color: '#27ae60', fontWeight: '600' }}>
                  {formatCurrency(analytics.totalIncome)}
                </span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill income-progress"
                  style={{ 
                    width: `${getPercentage(analytics.totalIncome, analytics.totalIncome + analytics.totalExpense)}%`
                  }}
                ></div>
              </div>
            </div>
            
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span>Expense</span>
                <span style={{ color: '#e74c3c', fontWeight: '600' }}>
                  {formatCurrency(analytics.totalExpense)}
                </span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill expense-progress"
                  style={{ 
                    width: `${getPercentage(analytics.totalExpense, analytics.totalIncome + analytics.totalExpense)}%`
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">Net Balance</h3>
            <div className="card-icon balance-card">🏦</div>
          </div>
          <div className="stat-value" style={{ 
            color: analytics.totalIncome - analytics.totalExpense >= 0 ? '#27ae60' : '#e74c3c' 
          }}>
            {formatCurrency(analytics.totalIncome - analytics.totalExpense)}
          </div>
          <div className="stat-label">
            {analytics.totalIncome - analytics.totalExpense >= 0 ? 'Profit' : 'Loss'}
          </div>
        </div>
      </div>

      {/* Category Analysis */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '30px' }}>
        {/* Income Categories */}
        <div className="chart-container">
          <h3 className="chart-title">Income by Category</h3>
          {analytics.totalIncome > 0 ? (
            <div>
              {categories.map(category => {
                const amount = analytics.categoryBreakdown[category]?.income || 0;
                const percentage = getPercentage(amount, analytics.totalIncome);
                
                if (amount === 0) return null;
                
                return (
                  <div key={category} style={{ marginBottom: '15px' }}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      marginBottom: '5px' 
                    }}>
                      <span style={{ textTransform: 'capitalize' }}>{category}</span>
                      <span style={{ fontWeight: '600' }}>
                        {formatCurrency(amount)} ({percentage}%)
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill income-progress"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: '#7f8c8d', padding: '40px' }}>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>💰</div>
              <p>No income data available</p>
            </div>
          )}
        </div>

        {/* Expense Categories */}
        <div className="chart-container">
          <h3 className="chart-title">Expenses by Category</h3>
          {analytics.totalExpense > 0 ? (
            <div>
              {categories.map(category => {
                const amount = analytics.categoryBreakdown[category]?.expense || 0;
                const percentage = getPercentage(amount, analytics.totalExpense);
                
                if (amount === 0) return null;
                
                return (
                  <div key={category} style={{ marginBottom: '15px' }}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      marginBottom: '5px' 
                    }}>
                      <span style={{ textTransform: 'capitalize' }}>{category}</span>
                      <span style={{ fontWeight: '600' }}>
                        {formatCurrency(amount)} ({percentage}%)
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill expense-progress"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: '#7f8c8d', padding: '40px' }}>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>💸</div>
              <p>No expense data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Monthly Summary */}
      <div className="chart-container">
        <h3 className="chart-title">Financial Overview</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          <div style={{ textAlign: 'center', padding: '20px', background: '#f8f9ff', borderRadius: '8px' }}>
            <div style={{ fontSize: '1.5rem', color: '#27ae60', fontWeight: '600' }}>
              {analytics.incomeTransactions}
            </div>
            <div style={{ color: '#7f8c8d' }}>Income Transactions</div>
          </div>
          
          <div style={{ textAlign: 'center', padding: '20px', background: '#f8f9ff', borderRadius: '8px' }}>
            <div style={{ fontSize: '1.5rem', color: '#e74c3c', fontWeight: '600' }}>
              {analytics.expenseTransactions}
            </div>
            <div style={{ color: '#7f8c8d' }}>Expense Transactions</div>
          </div>
          
          <div style={{ textAlign: 'center', padding: '20px', background: '#f8f9ff', borderRadius: '8px' }}>
            <div style={{ fontSize: '1.5rem', color: '#3498db', fontWeight: '600' }}>
              {formatCurrency(analytics.totalIncome > 0 ? (analytics.totalIncome / analytics.incomeTransactions) : 0)}
            </div>
            <div style={{ color: '#7f8c8d' }}>Avg Income/Transaction</div>
          </div>
          
          <div style={{ textAlign: 'center', padding: '20px', background: '#f8f9ff', borderRadius: '8px' }}>
            <div style={{ fontSize: '1.5rem', color: '#9b59b6', fontWeight: '600' }}>
              {formatCurrency(analytics.totalExpense > 0 ? (analytics.totalExpense / analytics.expenseTransactions) : 0)}
            </div>
            <div style={{ color: '#7f8c8d' }}>Avg Expense/Transaction</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Analytics;
