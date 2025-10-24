'use client'

import React, { useState } from 'react';
import ExpenseCard from '@/components/ExpenseCard/ExpenseCard';
import type { ExpenseCardProps, ExpenseCategory } from '@/components/ExpenseCard/ExpenseCard';

type Expense = ExpenseCardProps;
type FilterOption = 'All' | ExpenseCategory;

interface ExpenseListProps {
  expenses: Expense[];
  onDeleteExpense?: (id: number) => void;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ 
  expenses,
  onDeleteExpense
}) => {
  const [filterCategory, setFilterCategory] = useState<FilterOption>('All');

  const filteredExpenses = filterCategory === 'All' 
    ? expenses
    : expenses.filter(expense => expense.category === filterCategory);

  const filteredTotal = filteredExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterCategory(event.target.value as FilterOption);
  };

  return (
    <div className="bg-white rounded-lg p-6 mb-8 shadow-sm border border-gray-200">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <h2 className="text-xl font-bold text-gray-900">Your Expenses</h2>
        
        <div className="flex items-center gap-3">
          <label htmlFor="category-filter" className="text-sm font-medium text-gray-700">
            Filter by category:
          </label>
          <select 
            id="category-filter"
            value={filterCategory}
            onChange={handleCategoryChange}
            className="
              px-3 py-1.5 
              border border-gray-300 rounded-md
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              text-sm bg-white cursor-pointer
              transition-colors duration-200
            "
          >
            <option value="All">All Categories</option>
            <option value="Food">Food</option>
            <option value="Transportation">Transportation</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Shopping">Shopping</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-gray-700 font-medium">
          Total: <span className="text-lg font-bold text-green-600">${filteredTotal.toFixed(2)}</span>
        </p>
        <p className="text-sm text-gray-500">
          ({filteredExpenses.length} expenses)
        </p>
      </div>

      <div className="space-y-3">
        {filteredExpenses.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            No expenses found. Add some expenses to get started!
          </p>
        ) : (
          filteredExpenses.map(expense => (
            <ExpenseCard
              key={expense.id}
              {...expense}
              onDelete={onDeleteExpense}
              highlighted={expense.amount > 50}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ExpenseList;