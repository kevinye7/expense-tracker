// src/components/ExpenseForm/ExpenseForm.tsx
import React, { useState } from 'react';
import type { ExpenseCategory } from '../ExpenseCard/ExpenseCard';

// Form data interface
interface ExpenseFormData {
  description: string;
  amount: string;
  category: ExpenseCategory;
  date: string;
}

interface FormErrors {
  description?: string;
  amount?: string;
  category?: string;
  date?: string;
}

/**
 * Form component for creating new expense entries with validation
 * @param {Object} props - Component props
 * @param {function} props.onSubmit - Callback function when form is submitted, receives expense data
 */
interface ExpenseFormProps {
  onSubmit: (expenseData: {
    description: string;
    amount: number;
    category: ExpenseCategory;
    date: string;
  }) => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ onSubmit }) => {
  // Form state using controlled components pattern
  const [formData, setFormData] = useState<ExpenseFormData>({
    description: '',
    amount: '',
    category: 'Food',
    date: new Date().toISOString().split('T')[0] // Today's date as default
  });

  /**
   * Handles input changes for all form fields using computed property names
   * @param {React.ChangeEvent<HTMLInputElement | HTMLSelectElement>} e - Change event from form inputs
   */
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (data: ExpenseFormData): FormErrors => {
    const errors: FormErrors = {};

    if (!data.description.trim()) errors.description = "Description is required";
    
    const amount = parseFloat(data.amount);
    if (!data.amount) errors.amount = "Amount is required";
    else if (isNaN(amount) || amount <= 0) errors.amount = "Amount must be greater than 0";

    if (!data.category) errors.category = "Category is required";

    if (!data.date) errors.date = "Date is required";

    return errors;
  };

  /**
   * Handles form submission with validation and data processing
   * @param {React.FormEvent<HTMLFormElement>} e - Form submission event
   */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.description.trim() || !formData.amount || !formData.date) {
      alert('Please fill in all required fields');
      return;
    }

    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors); // show errors
      return;
    }

    const amount = parseFloat(formData.amount);
    if (amount <= 0) {
      alert('Amount must be greater than 0');
      return;
    }

    // Submit processed data
    onSubmit({
      description: formData.description.trim(),
      amount: amount,
      category: formData.category,
      date: formData.date
    });

    // Reset form after successful submission
    setFormData({
      description: '',
      amount: '',
      category: 'Food',
      date: new Date().toISOString().split('T')[0]
    });

    setErrors({});
  };

  return (
    <form 
      className="bg-white rounded-lg p-6 mb-8 shadow-sm border border-gray-200"
      onSubmit={handleSubmit}
    >
      <h3 className="text-xl font-bold text-gray-900 mb-5">Add New Expense</h3>
      
      <div className="mb-4">
        <label 
          htmlFor="description" 
          className="block text-sm font-medium text-gray-700 mb-1.5"
        >
          Description *
        </label>
        <input
          type="text"
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="What did you spend money on?"
          className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm bg-white text-gray-700 transition-colors duration-200 hover:border-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-700 focus:border-transparent placeholder-gray-400"
          required
        />
        {errors.description && (
          <p className="text-red-500 text-xs mt-1">{errors.description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label 
            htmlFor="amount" 
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            Amount *
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleInputChange}
            placeholder="0.00"
            step="0.01"
            min="0"
            className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm bg-white text-gray-700 transition-colors duration-200 hover:border-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-700 focus:border-transparent"
            required
          />
          {errors.amount && (
            <p className="text-red-500 text-xs mt-1">{errors.amount}</p>
          )}
        </div>

        <div>
          <label 
            htmlFor="category" 
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm bg-white text-gray-700 transition-colors duration-200 hover:border-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-700 focus:border-transparent cursor-pointer"
          >
            <option value="Food">Food</option>
            <option value="Transportation">Transportation</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Shopping">Shopping</option>
            <option value="Other">Other</option>
          </select>
          {errors.category && (
            <p className="text-red-500 text-xs mt-1">{errors.category}</p>
          )}
        </div>
      </div>

      <div className="mb-6">
        <label 
          htmlFor="date" 
          className="block text-sm font-medium text-gray-700 mb-1.5"
        >
          Date
        </label>
        <input
          type="date"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleInputChange}
          className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm bg-white text-gray-700 transition-colors duration-200 hover:border-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-700 focus:border-transparent"
          required
        />
        {errors.date && (
          <p className="text-red-500 text-xs mt-1">{errors.date}</p>
        )}
      </div>

      <button 
        type="submit" 
        className="w-full bg-purple-700 hover:bg-purple-800 text-white py-2.5 px-4 rounded-md text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-purple-700 focus:ring-offset-2"
      >
        Add Expense
      </button>
    </form>
  );
};

export default ExpenseForm;