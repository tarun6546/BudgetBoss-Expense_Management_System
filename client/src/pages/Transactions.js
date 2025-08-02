import React, { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import axios from 'axios';
import Spinner from '../components/Spinner';
import moment from 'moment';

const Transactions = () => {
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editTransaction, setEditTransaction] = useState(null);
  const [frequency, setFrequency] = useState('30');
  const [type, setType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [customDateRange, setCustomDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [useCustomDate, setUseCustomDate] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    amount: '',
    type: '',
    category: '',
    description: '',
    reference: '',
    date: new Date().toISOString().split('T')[0]
  });

  const categories = [
    'salary', 'tip', 'project', 'food', 'movie', 'bills',
    'medical', 'fees', 'shopping', 'travel', 'other'
  ];

  const fetchTransactions = useCallback(async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      setLoading(true);

      let requestData = {
        userid: user._id,
        frequency: useCustomDate ? 'custom' : frequency,
        type
      };

      // Add custom date range if enabled
      if (useCustomDate && customDateRange.startDate && customDateRange.endDate) {
        requestData.selectedDate = [customDateRange.startDate, customDateRange.endDate];
      }

      const res = await axios.post('/get-transactions', requestData);

      setTransactions(res.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      message.error('Failed to fetch transactions');
    }
  }, [frequency, type, useCustomDate, customDateRange]);

  const filterTransactions = useCallback(() => {
    let filtered = transactions;

    if (searchTerm) {
      filtered = filtered.filter(t =>
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.reference.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort by date in descending order (newest first)
    filtered = filtered.sort((a, b) => new Date(b.Date) - new Date(a.Date));

    setFilteredTransactions(filtered);
  }, [transactions, searchTerm]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  useEffect(() => {
    filterTransactions();
  }, [filterTransactions]);

  const handleCustomDateChange = (field, value) => {
    setCustomDateRange(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCustomDateToggle = () => {
    setUseCustomDate(!useCustomDate);
    if (!useCustomDate) {
      // Reset to default when enabling custom date
      setFrequency('30');
    }
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
      fetchTransactions();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.amount || !formData.type || !formData.category || !formData.description) {
      message.error('Please fill all required fields');
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      setLoading(true);

      if (editTransaction) {
        await axios.post('/edit-transaction', {
          payload: {
            ...formData,
            userid: user._id
          },
          transactioId: editTransaction._id
        });
        message.success('Transaction updated successfully');
      } else {
        const response = await axios.post('/add-transaction', {
          ...formData,
          userid: user._id
        });

        message.success('Transaction added successfully');

        // Show budget alert if exists
        if (response.data.budgetAlert) {
          const alertType = response.data.budgetAlert.type === 'over_budget' ? 'error' : 'warning';
          message[alertType](response.data.budgetAlert.message);
        }
      }

      setShowModal(false);
      setEditTransaction(null);
      setFormData({
        amount: '',
        type: '',
        category: '',
        description: '',
        reference: '',
        date: new Date().toISOString().split('T')[0]
      });

      await fetchTransactions();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error('Something went wrong');
    }
  };

  const handleEdit = (transaction) => {
    setEditTransaction(transaction);
    setFormData({
      amount: transaction.amount,
      type: transaction.type,
      category: transaction.category,
      description: transaction.description,
      reference: transaction.reference || '',
      date: moment(transaction.Date).format('YYYY-MM-DD')
    });
    setShowModal(true);
  };

  const handleDelete = async (transaction) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) {
      return;
    }

    try {
      setLoading(true);
      await axios.post('/delete-transaction', {
        transactionId: transaction._id
      });
      message.success('Transaction deleted successfully');
      await fetchTransactions();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error('Failed to delete transaction');
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <>
      {loading && <Spinner />}

      {/* Header with filters and add button */}
      <div className="transactions-table">
        <div className="table-header">
          <h3 className="table-title">All Transactions</h3>
          <div className="table-filters">
            {/* Custom Date Range Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
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

            {/* Custom Date Range Inputs */}
            {useCustomDate && (
              <div style={{
                display: 'flex',
                gap: '10px',
                alignItems: 'center',
                marginBottom: '10px',
                flexWrap: 'wrap'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '500' }}>Start Date</label>
                  <input
                    type="date"
                    value={customDateRange.startDate}
                    onChange={(e) => handleCustomDateChange('startDate', e.target.value)}
                    style={{
                      padding: '8px 12px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '500' }}>End Date</label>
                  <input
                    type="date"
                    value={customDateRange.endDate}
                    onChange={(e) => handleCustomDateChange('endDate', e.target.value)}
                    style={{
                      padding: '8px 12px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <button
                  className="btn btn-primary"
                  onClick={applyCustomDateFilter}
                  style={{
                    height: '35px',
                    marginTop: '20px',
                    fontSize: '12px',
                    padding: '0 15px'
                  }}
                >
                  Apply Filter
                </button>
              </div>
            )}

            {/* Regular Filters */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
              {!useCustomDate && (
                <select
                  className="filter-select"
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                >
                  <option value="7">Last 7 Days</option>
                  <option value="30">Last 30 Days</option>
                  <option value="365">Last 1 Year</option>
                </select>
              )}

              <select
                className="filter-select"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>

              <input
                type="text"
                className="filter-select"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              <button
                className="btn btn-primary"
                onClick={() => setShowModal(true)}
              >
                Add Transaction
              </button>
            </div>
          </div>
        </div>

        {/* Transactions List */}
        {filteredTransactions.length > 0 ? (
          <div>
            {filteredTransactions.map((transaction) => (
              <div key={transaction._id} className="transaction-item">
                <div className="transaction-info">
                  <div className="transaction-category">
                    {transaction.category.charAt(0).toUpperCase() + transaction.category.slice(1)}
                  </div>
                  <div className="transaction-description">{transaction.description}</div>
                  <div className="transaction-date">
                    {moment(transaction.Date).format('MMM DD, YYYY')}
                    {transaction.reference && <span> • {transaction.reference}</span>}
                  </div>
                </div>
                <div className="flex gap-15">
                  <div className={`transaction-amount ${transaction.type}-amount`}>
                    {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                  </div>
                  <div className="transaction-actions">
                    <button
                      className="action-btn edit-btn"
                      onClick={() => handleEdit(transaction)}
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      className="action-btn delete-btn"
                      onClick={() => handleDelete(transaction)}
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#7f8c8d' }}>
            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>💸</div>
            <h3>No transactions found</h3>
            <p>Start by adding your first transaction</p>
            <button
              className="btn btn-primary mt-20"
              onClick={() => setShowModal(true)}
            >
              Add Your First Transaction
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Transaction Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                {editTransaction ? 'Edit Transaction' : 'Add New Transaction'}
              </h3>
              <button
                className="modal-close"
                onClick={() => {
                  setShowModal(false);
                  setEditTransaction(null);
                  setFormData({
                    amount: '',
                    type: '',
                    category: '',
                    description: '',
                    reference: '',
                    date: new Date().toISOString().split('T')[0]
                  });
                }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Amount *</label>
                <input
                  type="number"
                  name="amount"
                  className="form-input"
                  placeholder="Enter amount"
                  value={formData.amount}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Type *</label>
                <select
                  name="type"
                  className="form-select"
                  value={formData.type}
                  onChange={handleFormChange}
                  required
                >
                  <option value="">Select type</option>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Category *</label>
                <select
                  name="category"
                  className="form-select"
                  value={formData.category}
                  onChange={handleFormChange}
                  required
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Description *</label>
                <input
                  type="text"
                  name="description"
                  className="form-input"
                  placeholder="Enter description"
                  value={formData.description}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Reference</label>
                <input
                  type="text"
                  name="reference"
                  className="form-input"
                  placeholder="Enter reference (optional)"
                  value={formData.reference}
                  onChange={handleFormChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Date</label>
                <input
                  type="date"
                  name="date"
                  className="form-input"
                  value={formData.date}
                  onChange={handleFormChange}
                />
              </div>

              <div className="flex gap-15 mt-30">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowModal(false);
                    setEditTransaction(null);
                    setFormData({
                      amount: '',
                      type: '',
                      category: '',
                      description: '',
                      reference: '',
                      date: new Date().toISOString().split('T')[0]
                    });
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editTransaction ? 'Update' : 'Add'} Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Transactions;
