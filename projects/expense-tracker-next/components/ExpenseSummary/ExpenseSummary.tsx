import React from 'react';

interface ExpenseSummaryProps {
  totalAmount: number;
  expenseCount: number;
  period?: string;
}

const ExpenseSummary: React.FC<ExpenseSummaryProps> = ({ 
  totalAmount, 
  expenseCount, 
  period = "All Time" 
}) => {
  const formattedTotal = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(totalAmount);

  return (
    <section className="bg-white rounded-lg p-6 mb-8 shadow-sm border border-gray-200">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pb-4 border-b border-gray-200 mb-5">
        <h2 className="text-xl font-bold text-gray-900 mb-2 sm:mb-0">
          Expense Summary
        </h2>
        <span className="
          bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium
          self-start sm:self-auto
        ">
          {period}
        </span>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="text-center sm:text-left">
          <span className="block text-sm font-medium text-gray-600 mb-2">
            Total Spent
          </span>
          <span className="text-3xl font-bold text-gray-900">
            {formattedTotal}
          </span>
        </div>
        
        <div className="text-center sm:text-left">
          <span className="block text-sm font-medium text-gray-600 mb-2">
            Expenses
          </span>
          <span className="text-3xl font-bold text-gray-900">
            {expenseCount}
          </span>
        </div>
      </div>
    </section>
  );
};

export default ExpenseSummary;