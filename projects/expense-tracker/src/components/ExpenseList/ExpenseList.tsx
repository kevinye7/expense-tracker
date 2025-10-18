// src/components/ExpenseList/ExpenseList.tsx
import React, { useState } from 'react';
import ExpenseCard from '../ExpenseCard/ExpenseCard';
import type { SortOption, ExpenseCategory } from '../ExpenseCard/ExpenseCard';
import type { Expense } from '../../App';

interface ExpenseListProps {
  expenses: Expense[];
  onDelete?: (id: string) => void; 
}

type FilterOption = 'All' | ExpenseCategory;

/**
 * ExpenseList Component - FIXED VERSION
 * 
 * IMPORTANT CHANGE: This component no longer manages expense data in local state.
 * It receives expenses as props from App.tsx and only manages UI state (filtering).
 * 
 * This fixes the "duplicate state" bug where:
 * - App.tsx had expense state (updated by form)
 * - ExpenseList had separate expense state (never updated)
 * 
 * Now there's a SINGLE SOURCE OF TRUTH in App.tsx
 * 
 * @param {ExpenseListProps} props - Component props
 * @returns {JSX.Element} Rendered expense list with filtering controls
 */
const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, onDelete }) => {
  
  // ONLY manage UI state (filtering) - NOT expense data
  const [filterCategory, setFilterCategory] = useState<FilterOption>('All');

  // Filter expenses from props (not local state)
  const filteredExpenses = filterCategory === 'All' 
    ? expenses  // Use expenses from props
    : expenses.filter(expense => expense.category === filterCategory);

  // Calculate total for the currently filtered expenses
  const filteredTotal = filteredExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  /**
   * Handles category filter change from select dropdown
   * @param {React.ChangeEvent<HTMLSelectElement>} event - Select change event
   */
  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterCategory(event.target.value as FilterOption);
  };

  const [sortOption, setSortOption] = useState<SortOption>('date');

  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    switch (sortOption) {
      case 'date':
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case 'amount':
        return a.amount - b.amount;
      case 'category':
        return a.category.localeCompare(b.category);
      default:
        return 0;
    }
  });

  return (
    <div className="bg-white rounded-lg p-6 mb-8 shadow-sm border border-gray-200">
      {/* Header and Controls */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 m-0">Your Expenses</h2>
        
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Filter Controls */}
          <div className="flex items-center gap-2">
            <label htmlFor="category-filter" className="text-sm font-medium text-gray-700">
              Filter by category:
            </label>
            <select 
              id="category-filter"
              value={filterCategory}
              onChange={handleCategoryChange}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white text-gray-700 cursor-pointer transition-colors duration-200 hover:border-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-700 focus:border-transparent"
            >
              <option value="All">All Categories</option>
              <option value="Food">Food</option>
              <option value="Transportation">Transportation</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Shopping">Shopping</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Sort Controls */}
          <div className="flex items-center gap-2">
            <label htmlFor="sort-select" className="text-sm font-medium text-gray-700">
              Sort by:
            </label>
            <select
              id="sort-select"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white text-gray-700 cursor-pointer transition-colors duration-200 hover:border-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-700 focus:border-transparent"
            >
              <option value="date">Date</option>
              <option value="amount">Amount</option>
              <option value="category">Category</option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary Section */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
        <p className="text-lg font-semibold text-purple-800 m-0">
          Total: ${filteredTotal.toFixed(2)} ({filteredExpenses.length} expenses)
        </p>
      </div>

      {/* Expense Items */}
      <div className="space-y-3">
        {sortedExpenses.length === 0 ? (
          <div className="text-center py-10 px-5 text-gray-500">
            <p className="text-base m-0">
              {expenses.length === 0 
                ? "No expenses found. Add some expenses to get started!"
                : "No expenses match your current filter."
              }
            </p>
          </div>
        ) : (
          sortedExpenses.map(expense => (
            <ExpenseCard
              key={expense.id}
              {...expense}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ExpenseList;