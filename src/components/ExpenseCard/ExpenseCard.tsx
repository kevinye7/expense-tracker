// src/components/ExpenseCard/ExpenseCard.tsx
import React from 'react';

export type ExpenseCategory = 'Food' | 'Transportation' | 'Entertainment' | 'Shopping' | 'Other';
export type SortOption = 'date' | 'amount' | 'category';

export interface ExpenseCardProps {
  id: string;
  description: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
  onDelete?: (id: string) => void;
  highlighted?: boolean;
  showCategory?: boolean;
}

/**
 * Displays a single expense item with formatted currency and professional styling
 * @param {Object} props - Component props
 * @param {number} props.id - Unique identifier for the expense entry
 * @param {string} props.description - Human-readable description of the expense
 * @param {number} props.amount - Expense amount in dollars (will be formatted as currency)
 * @param {string} props.category - Expense category for organization and filtering
 * @param {string} props.date - Date when expense occurred (ISO string format)
 */
const ExpenseCard: React.FC<ExpenseCardProps> = ({ 
  id, 
  description, 
  amount, 
  category, 
  date,
  highlighted = false,
  showCategory = true,
  onDelete
}) => {
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <article className={`
      bg-white rounded-lg p-4 mb-3 shadow-md
      transition-all duration-200 border-l-4
      hover:translate-y-[-2px] hover:shadow-lg
      ${highlighted ? 'bg-purple-70 border-l-purple-700' : 'border-l-purple-700'}
    `}>
      <div className="flex justify-between items-center mb-2">
        {showCategory && (
          <span className="bg-purple-700 text-white px-2 py-1 rounded text-xs font-semibold uppercase">
            {category}
          </span>
        )}
        <time className="text-gray-500 text-sm" dateTime={date}>
          {formattedDate}
        </time>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-gray-900 text-base font-medium mb-2">{description}</h3>
        <p className="text-green-600 text-lg font-bold">{formattedAmount}</p>
      </div>

      {onDelete && (
        <button 
          className="bg-gray-300 text-gray-800 px-2.5 py-1 rounded-md border-0 cursor-pointer text-sm transition-colors duration-200 hover:bg-gray-400 hover:text-black mt-2"
          onClick={() => onDelete(id)}
        >
          Delete
        </button>
      )}
    </article>
  );
};

export default ExpenseCard;