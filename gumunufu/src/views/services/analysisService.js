import { fetchTransactionsFromSupabase } from './transactionService';

/**
 * Calculate spending from transactions
 * @param {Array} transactions - Array of transaction objects
 * @returns {Object} - Analysis results
 */
export const calculateSpendingAnalysis = (transactions) => {
  if (!transactions || transactions.length === 0) {
    return {
      totalSpending: 0,
      averageTransaction: 0,
      categoryBreakdown: {},
      monthlySpending: {},
      topMerchants: [],
      totalTransactions: 0,
    };
  }

  // Calculate totals
  const totalSpending = transactions.reduce((sum, items) => sum + Math.abs(items.amount), 0);
  const averageTransaction = totalSpending / transactions.length;

  // Category breakdown
  const categoryBreakdown = {};
  transactions.forEach(items => {
    const category = items.category || 'Other';
    if (!categoryBreakdown[category]) {
      categoryBreakdown[category] = { total: 0, count: 0 };
    }
    categoryBreakdown[category].total += Math.abs(items.amount);
    categoryBreakdown[category].count += 1;
  });

  // Monthly spending - parse date string directly to avoid timezone issues
  const monthlySpending = {};
  transactions.forEach(items => {
    // Parse date string directly to avoid timezone issues
    const dateStr = String(items.date).trim();
    let year, month;
    
    // Handle ISO format with time (e.g., "2025-10-01T00:00:00.000Z" or "2025-10-01T00:00:00")
    if (dateStr.includes('T')) {
      const datePart = dateStr.split('T')[0];
      const parts = datePart.split('-');
      year = parts[0];
      month = parts[1];
    } else if (dateStr.includes('-')) {
      // Format: YYYY-MM-DD
      const parts = dateStr.split('-');
      year = parts[0];
      month = parts[1];
    } else if (dateStr.includes('/')) {
      // Format: MM/DD/YYYY or DD/MM/YYYY - assume MM/DD/YYYY
      const parts = dateStr.split('/');
      year = parts[2];
      month = parts[0].padStart(2, '0');
    } else {
      // Fallback: try to extract from any date-like string
      const dateMatch = dateStr.match(/(\d{4})[-\/](\d{1,2})/);
      if (dateMatch) {
        year = dateMatch[1];
        month = dateMatch[2].padStart(2, '0');
      } else {
        // Last resort: use Date object (may have timezone issues)
        const date = new Date(dateStr);
        year = date.getFullYear();
        month = String(date.getMonth() + 1).padStart(2, '0');
      }
    }
    
    const monthKey = `${year}-${month.padStart(2, '0')}`;
    if (!monthlySpending[monthKey]) {
      monthlySpending[monthKey] = 0;
    }
    monthlySpending[monthKey] += Math.abs(items.amount);
  });

  // Top merchants
  const merchantTotals = {};
  transactions.forEach(items => {
    const merchant = items.name;
    if (!merchantTotals[merchant]) {
      merchantTotals[merchant] = 0;
    }
    merchantTotals[merchant] += Math.abs(items.amount);
  });

  const topMerchants = Object.entries(merchantTotals)
    .map(([name, total]) => ({ name, total, count: transactions.filter(items => items.name === name).length }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);

  return {
    totalSpending,
    averageTransaction,
    categoryBreakdown,
    monthlySpending,
    topMerchants,
    totalTransactions: transactions.length,
  };
};

/**
 * Fetch transactions and calculate analysis
 * @returns {Promise<Object>} - Analysis results with success status
 */
export const getAnalysisData = async () => {
  try {
    const result = await fetchTransactionsFromSupabase();
    
    if (!result.success) {
      console.error('Failed to fetch transactions:', result.error);
      return { success: false, error: result.error, analysis: null, transactions: [] };
    }

    if (!result.transactions || result.transactions.length === 0) {
      console.log('No transactions found in database');
      return { 
        success: true, 
        transactions: [], 
        analysis: calculateSpendingAnalysis([]) 
      };
    }

    console.log(`Fetched ${result.transactions.length} transactions`);
    const analysis = calculateSpendingAnalysis(result.transactions);
    console.log('Analysis calculated:', analysis);
    
    return {
      success: true,
      transactions: result.transactions,
      analysis,
    };
  } catch (error) {
    console.error('Exception getting analysis data:', error);
    return { success: false, error: error.message, analysis: null, transactions: [] };
  }
};

