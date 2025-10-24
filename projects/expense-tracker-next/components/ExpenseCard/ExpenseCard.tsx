'use client'

import React from 'react';

export type ExpenseCategory = 'Food' | 'Transportation' | 'Entertainment' | 'Shopping' | 'Other';

export interface ExpenseCardProps {
  id: number;
  description: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
  receiptUrl?: string;   
  onDelete?: (id: number) => void;
  highlighted?: boolean;
  showCategory?: boolean;
}

const ExpenseCard: React.FC<ExpenseCardProps> = ({
  id,
  description,
  amount,
  category,
  date,
  receiptUrl,
  highlighted = false,
  showCategory = true,
  onDelete
}) => {
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);

  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC"
  });

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(id);
    }
  };

  return (
    <article className={`
      bg-white rounded-lg p-4 mb-3 shadow-md
      hover:shadow-lg transition-all duration-200
      border-l-4 relative cursor-pointer
      ${highlighted ? 'border-l-orange-500 bg-orange-50' : 'border-l-blue-500'}
    `}>
      <div className="flex justify-between items-center mb-2">
        {showCategory && (
          <span className="inline-block bg-blue-500 text-white px-2 py-1 rounded text-xs font-semibold uppercase">
            {category}
          </span>
        )}
        <time className="text-sm text-gray-500" dateTime={date}>
          {formattedDate}
        </time>
      </div>
      
      <div className="space-y-4">
        <h3 className="mb-2 text-base font-medium text-gray-900">{description}</h3>
        <p className="m-0 text-lg font-bold text-green-600">{formattedAmount}</p>
      </div>

      {/* Receipt display section */}
      {receiptUrl && (
        <div className="mt-3 border-t border-gray-100 pt-3">
          <div className="flex items-center gap-3">
            <a 
              href={receiptUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              <span>View Receipt</span>
            </a>
            <span className="text-xs text-gray-500">• Attached</span>
          </div>
        </div>
      )}
        
      {onDelete && (
        <div className="flex justify-end pt-2 border-t border-gray-100">
          <button
            className="
              text-red-500 hover:text-white
              hover:bg-red-500
              border border-red-500
              rounded px-3 py-1
              text-sm font-medium
              transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-red-400
            "
            onClick={handleDelete}
            aria-label="Delete expense"
          >
            Delete
          </button>
        </div>
      )}
    </article>
  );
};

export default ExpenseCard;

