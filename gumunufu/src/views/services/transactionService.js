import { supabase } from './supabase_connection';

/**
 * Save transactions to Supabase
 * @param {Array} transactions - Array of transaction objects
 * @returns {Promise<Object>} - Result object with success status and data/error
 */
export const saveTransactionsToSupabase = async (transactions) => {
  try {
    if (!transactions || transactions.length === 0) {
      return { success: false, error: 'No transactions to save' };
    }

    // add transactions into Supabase
    const { data, error } = await supabase
      .from('transactions')
      .insert(transactions.map(item => ({
        date: item.date,
        name: item.name,
        amount: item.amount,
        category: item.category,
        necessity_score: item.necessityScore,
        created_at: new Date().toISOString(),
      })));

    if (error) {
      console.error('Error saving transactions:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data, count: transactions.length };
  } catch (error) {
    console.error('Exception saving transactions:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Fetch all transactions from Supabase
 * @returns {Promise<Object>} - Result object with success status and data/error
 */
export const fetchTransactionsFromSupabase = async () => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching transactions:', error);
      return { success: false, error: error.message, transactions: [] };
    }

    // Transform Supabase data to match format
    const transactions = (data || []).map(item => ({
      id: item.id,
      date: item.date,
      name: item.name,
      amount: item.amount,
      category: item.category,
      necessityScore: item.necessity_score,
    }));

    return { success: true, transactions };
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return { success: false, error: error.message, transactions: [] };
  }
};

/**
 * Delete all transactions from Supabase
 * @returns {Promise<Object>} - Result object with success status
 */
export const clearAllTransactions = async () => {
  try {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .neq('id', 0); 

    if (error) {
      console.error('Error clearing transactions:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Exception clearing transactions:', error);
    return { success: false, error: error.message };
  }
};

