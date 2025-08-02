import React from 'react';

const Analytics = ({ allTransaction = [] }) => {
  const categories = [
    'salary', 'tip', 'project', 'food', 'movie', 'bills',
    'medical', 'fees', 'shopping', 'travel', 'other'
  ];

  // Calculate totals
  const totalTransactions = allTransaction.length;
  const incomeTransactions = allTransaction.filter(t => t.type === 'income');
  const expenseTransactions = allTransaction.filter(t => t.type === 'expense');
  
  const totalIncome = incomeTransactions.reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = expenseTransactions.reduce((acc, t) => acc + t.amount, 0);
  const totalTurnover = totalIncome + totalExpense;
  
  const incomePercent = totalTransactions > 0 ? (incomeTransactions.length / totalTransactions) * 100 : 0;
  const expensePercent = totalTransactions > 0 ? (expenseTransactions.length / totalTransactions) * 100 : 0;
  
  const incomeTurnoverPercent = totalTurnover > 0 ? (totalIncome / totalTurnover) * 100 : 0;
  const expenseTurnoverPercent = totalTurnover > 0 ? (totalExpense / totalTurnover) * 100 : 0;

  // Get category-wise breakdown
  const getCategoryAmount = (category, type) => {
    return allTransaction
      .filter(t => t.type === type && t.category === category)
      .reduce((acc, t) => acc + t.amount, 0);
  };

  const getCategoryPercentage = (amount, total) => {
    return total > 0 ? ((amount / total) * 100).toFixed(0) : 0;
  };

  if (totalTransactions === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px', color: '#7f8c8d' }}>
        <div style={{ fontSize: '3rem', marginBottom: '20px' }}>📊</div>
        <h3>No data to analyze</h3>
        <p>Add some transactions to see analytics</p>
      </div>
    );
  }

  return (
    <div>
      {/* Summary Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '20px', 
        marginBottom: '30px' 
      }}>
        {/* Transaction Count Analysis */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">Transaction Analysis</h3>
            <div className="card-icon transactions-card">📊</div>
          </div>
          <div>
            <div style={{ marginBottom: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span>Total Transactions</span>
                <strong>{totalTransactions}</strong>
              </div>
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span style={{ color: '#27ae60' }}>Income</span>
                <span style={{ color: '#27ae60', fontWeight: '600' }}>
                  {incomeTransactions.length} ({incomePercent.toFixed(0)}%)
                </span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill income-progress"
                  style={{ width: `${incomePercent}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span style={{ color: '#e74c3c' }}>Expense</span>
                <span style={{ color: '#e74c3c', fontWeight: '600' }}>
                  {expenseTransactions.length} ({expensePercent.toFixed(0)}%)
                </span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill expense-progress"
                  style={{ width: `${expensePercent}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Amount Analysis */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">Amount Analysis</h3>
            <div className="card-icon balance-card">💰</div>
          </div>
          <div>
            <div style={{ marginBottom: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span>Total Turnover</span>
                <strong>₹{totalTurnover.toLocaleString()}</strong>
              </div>
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span style={{ color: '#27ae60' }}>Income</span>
                <span style={{ color: '#27ae60', fontWeight: '600' }}>
                  ₹{totalIncome.toLocaleString()} ({incomeTurnoverPercent.toFixed(0)}%)
                </span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill income-progress"
                  style={{ width: `${incomeTurnoverPercent}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span style={{ color: '#e74c3c' }}>Expense</span>
                <span style={{ color: '#e74c3c', fontWeight: '600' }}>
                  ₹{totalExpense.toLocaleString()} ({expenseTurnoverPercent.toFixed(0)}%)
                </span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill expense-progress"
                  style={{ width: `${expenseTurnoverPercent}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Net Balance */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">Net Balance</h3>
            <div className="card-icon balance-card">🏦</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div className="stat-value" style={{ 
              color: totalIncome - totalExpense >= 0 ? '#27ae60' : '#e74c3c',
              marginBottom: '10px'
            }}>
              ₹{(totalIncome - totalExpense).toLocaleString()}
            </div>
            <div className="stat-label">
              {totalIncome - totalExpense >= 0 ? 'Profit' : 'Loss'}
            </div>
            
            <div style={{ marginTop: '20px', fontSize: '0.9rem', color: '#7f8c8d' }}>
              <div>Avg Income: ₹{incomeTransactions.length > 0 ? (totalIncome / incomeTransactions.length).toLocaleString() : 0}</div>
              <div>Avg Expense: ₹{expenseTransactions.length > 0 ? (totalExpense / expenseTransactions.length).toLocaleString() : 0}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '30px' 
      }}>
        {/* Income Categories */}
        <div className="chart-container">
          <h3 className="chart-title">Income by Category</h3>
          {totalIncome > 0 ? (
            <div>
              {categories.map(category => {
                const amount = getCategoryAmount(category, 'income');
                const percentage = getCategoryPercentage(amount, totalIncome);
                
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
                        ₹{amount.toLocaleString()} ({percentage}%)
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
          {totalExpense > 0 ? (
            <div>
              {categories.map(category => {
                const amount = getCategoryAmount(category, 'expense');
                const percentage = getCategoryPercentage(amount, totalExpense);
                
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
                        ₹{amount.toLocaleString()} ({percentage}%)
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
    </div>
  );
};

export default Analytics;
