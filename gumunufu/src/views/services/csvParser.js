import Papa from 'papaparse';

/**
 * Parse a CSV file and return an array of transaction objects
 * @param {File} file - The CSV file to parse
 * @returns {Promise<Array>} - Array of transaction objects
 */
export const parseTransactionCSV = (file) => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const transactions = results.data
            .map((row, index) => {
              // Normalize column names to lowercase
              const normalize = (key) => key.toLowerCase().trim();
              const getValue = (...keys) => {
                for (const key of keys) {
                  const normalized = normalize(key);
                  const value = Object.keys(row).find(k => normalize(k) === normalized);
                  if (value) return row[value];
                }
                return null;
              };

              // Extract fields
              const date = getValue('date', 'transaction_date', 'transaction date');
              const name = getValue('name', 'merchant', 'description', 'vendor');
              const amount = getValue('amount', 'amount_spent', 'amount spent');
              const category = getValue('category', 'categories', 'type') || 'Other';
              const necessityScore = getValue('necessity_score', 'necessity score');

              // check fields
              if (!date || !name || !amount) {
                console.warn(`Skipping row ${index + 1}: missing required fields`);
                return null;
              }

              // Parse amount (remove currency symbols, keep numbers and decimal)
              const parsedAmount = parseFloat(String(amount).replace(/[^0-9.-]/g, ''));
              if (isNaN(parsedAmount)) {
                console.warn(`Skipping row ${index + 1}: invalid amount`);
                return null;
              }

              // Parse date: convert MM/DD/YYYY or DD/MM/YYYY to YYYY-MM-DD
              const parseDate = (dateStr) => {
                if (dateStr.includes('/')) {
                  const [part1, part2, part3] = dateStr.split('/');
                  return `${part3}-${part1.padStart(2, '0')}-${part2.padStart(2, '0')}`;
                }
                return dateStr;
              };

              return {
                date: parseDate(date),
                name: String(name).trim(),
                amount: parsedAmount,
                category: String(category).trim(),
                necessityScore: necessityScore ? parseFloat(necessityScore) : null,
              };
            })
            .filter(transaction => transaction !== null);

          resolve(transactions);
        } catch (error) {
          reject(new Error(`Error parsing CSV: ${error.message}`));
        }
      },
      error: (error) => {
        reject(new Error(`CSV parsing error: ${error.message}`));
      },
    });
  });
};

