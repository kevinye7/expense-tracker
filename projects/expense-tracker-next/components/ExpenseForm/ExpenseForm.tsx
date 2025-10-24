'use client'

import React, { useState } from 'react';
import type { ExpenseCategory } from '@/components/ExpenseCard/ExpenseCard';

interface FormErrors {
  description?: string;
  amount?: string;
  category?: string;
  date?: string;
  receipt?: string;
}

interface ExpenseFormData {
  description: string;
  amount: string;
  category: ExpenseCategory;
  date: string;
}

interface ExpenseFormProps {
  onSubmit: (expenseData: {
    description: string;
    amount: number;
    category: ExpenseCategory;
    date: string;
    receiptUrl?: string;
  }) => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<ExpenseFormData>({
    description: '',
    amount: '',
    category: 'Food',
    date: new Date().toISOString().split('T')[0]
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [receipt, setReceipt] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  /**
   * Handles receipt file selection from file input
   * Validates file type and size before storing in state
   */
  const handleReceiptChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    // Check if user selected a file
    // e.target.files is FileList (array-like) or null
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // VALIDATION 1: Check file type
      // file.type is MIME type: 'image/jpeg', 'image/png', etc.
      // .startsWith('image/') accepts any image type
      // Rejects: 'application/pdf', 'text/plain', 'video/mp4', etc.
      if (!file.type.startsWith('image/')) {
        // Set error message for user
        setErrors(prev => ({ 
          ...prev, 
          receipt: 'Please select an image file (JPG, PNG, GIF)' 
        }));
        // Clear selected file
        setReceipt(null);
        return; // Stop here, don't proceed
      }
      
      // VALIDATION 2: Check file size
      // file.size is in bytes
      // 5MB = 5 * 1024 KB = 5 * 1024 * 1024 bytes = 5,242,880 bytes
      const MAX_SIZE = 5 * 1024 * 1024; // 5MB
      if (file.size > MAX_SIZE) {
        setErrors(prev => ({ 
          ...prev, 
          receipt: 'File size must be less than 5MB' 
        }));
        setReceipt(null);
        return;
      }
      
      // File is valid! Store it in state
      setReceipt(file);
      
      // Clear any previous errors
      setErrors(prev => ({ ...prev, receipt: undefined }));
    }
  };

  const validateExpenseForm = (data: ExpenseFormData): {isValid: boolean; errors: FormErrors} => {
    const validationErrors: FormErrors = {};

    if (!data.description.trim()) {
      validationErrors.description = 'Description is required';
    }

    const amount = parseFloat(data.amount);
    if (isNaN(amount) || amount <= 0) {
      validationErrors.amount = 'Amount must be a positive number';
    }

    if (!data.category) {
      validationErrors.category = 'Category is required';
    }

    if (!data.date) {
      validationErrors.date = 'Date is required';
    }

    return {
      isValid: Object.keys(validationErrors).length === 0,
      errors: validationErrors
    };
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  /**
   * Handles form submission
   * Two-step process:
   * 1. Upload receipt to S3 (if selected)
   * 2. Submit expense data with receipt URL to parent
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    // Prevent default form submission (page reload)
    e.preventDefault();

    // STEP 1: Validate expense form fields (unchanged from before)
    const validationErrors: FormErrors = {};
    
    if (!formData.description.trim()) {
      validationErrors.description = 'Description is required';
    }
    
    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      validationErrors.amount = 'Amount must be a positive number';
    }
    
    if (!formData.date) {
      validationErrors.date = 'Date is required';
    }

    // If any validation errors, show them and stop
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Validation passed - clear errors and start upload
    setErrors({});
    setUploading(true); // Disable button, show "Uploading..." text

    try {
      // Variable to store receipt URL (if uploaded)
      let receiptUrl: string | undefined;

      // STEP 2: Upload receipt if user selected one (NEW!)
      if (receipt) {
        // Create FormData to send file to API
        // FormData is the browser's way to send files in HTTP requests
        const receiptFormData = new FormData();
        
        // Append file with field name 'receipt'
        // This name must match what the API expects: formData.get('receipt')
        receiptFormData.append('receipt', receipt);

        // Send POST request to upload API
        const uploadResponse = await fetch('/api/upload-receipt', {
          method: 'POST',
          body: receiptFormData,  // Browser sets correct Content-Type automatically
        });

        // Check if upload was successful
        if (!uploadResponse.ok) {
          // Upload failed - get error message from API response
          const errorData = await uploadResponse.json();
          throw new Error(errorData.error || 'Failed to upload receipt');
        }

        // Upload succeeded - extract receipt URL from response
        const uploadData = await uploadResponse.json();
        // uploadData structure: { success: true, filename: "...", url: "http://..." }
        receiptUrl = uploadData.url;
        
        // At this point, receipt is in S3 and we have its URL!
      }

      // STEP 3: Submit expense data to parent component (MODIFIED!)
      // Now includes optional receiptUrl
      onSubmit({
        description: formData.description.trim(),
        amount: parseFloat(formData.amount),
        category: formData.category,
        date: formData.date,
        receiptUrl,  // NEW: Will be S3 URL or undefined (if no receipt)
      });

      // STEP 4: Reset form on success (MODIFIED!)
      // Clear all form fields
      setFormData({
        description: '',
        amount: '',
        category: 'Food',
        date: new Date().toISOString().split('T')[0]
      });
      
      // NEW: Clear receipt state
      setReceipt(null);
      
      // NEW: Reset file input element (otherwise shows "file selected")
      const fileInput = document.getElementById('receipt-input') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = ''; // Clear the file input
      }

    } catch (error) {
      // NEW: Handle receipt upload errors
      console.error('Submission error:', error);
      
      // Show error to user
      setErrors({ 
        receipt: error instanceof Error 
          ? error.message  // Use specific error message if available
          : 'Failed to upload receipt' 
      });
    } finally {
      // NEW: Always reset uploading flag (whether success or error)
      // Ensures button re-enables so user can try again
      setUploading(false);
    }
  };

  return (
    <form className="bg-white rounded-lg p-6 mb-8 shadow-sm border border-gray-200" onSubmit={handleSubmit}>
      <h3 className="text-lg font-semibold text-gray-900 mb-5">Add New Expense</h3>
      
      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1.5">
          Description *
        </label>
        <input
          type="text"
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="What did you spend money on?"
          className={`
            w-full px-3 py-2.5 
            border rounded-md
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            placeholder-gray-400 text-sm bg-white
            transition-colors duration-200
            ${errors.description 
              ? 'border-red-300 focus:ring-red-500' 
              : 'border-gray-300'
            }
          `}
        />
        {errors.description && (
          <span className="text-red-500 text-xs mt-1 block">{errors.description}</span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1.5">
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
            className={`
              w-full px-3 py-2.5 
              border rounded-md
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              placeholder-gray-400 text-sm bg-white
              transition-colors duration-200
              ${errors.amount 
                ? 'border-red-300 focus:ring-red-500' 
                : 'border-gray-300'
              }
            `}
          />
          {errors.amount && (
            <span className="text-red-500 text-xs mt-1 block">{errors.amount}</span>
          )}
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1.5">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className={`
              w-full px-3 py-2.5 
              border rounded-md
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              text-sm bg-white cursor-pointer
              transition-colors duration-200
              ${errors.category 
                ? 'border-red-300 focus:ring-red-500' 
                : 'border-gray-300'
              }
            `}
          >
            <option value="Food">Food</option>
            <option value="Transportation">Transportation</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Shopping">Shopping</option>
            <option value="Other">Other</option>
          </select>
          {errors.category && (
            <span className="text-red-500 text-xs mt-1 block">{errors.category}</span>
          )}
        </div>
      </div>

      <div className="mb-6">
        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1.5">
          Date
        </label>
        <input
          type="date"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleInputChange}
          className={`
            w-full px-3 py-2.5 
            border rounded-md
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            text-sm bg-white
            transition-colors duration-200
            ${errors.date 
              ? 'border-red-300 focus:ring-red-500' 
              : 'border-gray-300'
            }
          `}
        />
        {errors.date && (
          <span className="text-red-500 text-xs mt-1 block">{errors.date}</span>
        )}
      </div>

      {/* Receipt upload field */}
      <div className="mb-6">
        <label htmlFor="receipt-input" className="block text-sm font-medium text-gray-700 mb-1.5">
          Receipt (Optional)
        </label>
        <input
          type="file"
          id="receipt-input"
          accept="image/*"
          onChange={handleReceiptChange}
          disabled={uploading}
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
        />
        {receipt && (
          <p className="mt-2 text-sm text-gray-600">
            Selected: <span className="font-medium">{receipt.name}</span>
            {' '}({(receipt.size / 1024).toFixed(2)} KB)
          </p>
        )}
        {errors.receipt && (
          <span className="text-red-500 text-xs mt-1 block">{errors.receipt}</span>
        )}
        <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
      </div>

      {/* Update submit button. THIS REPLACES THE OLD SUBMIT BUTTON */}
      <button 
        type="submit" 
        disabled={uploading}
        className={`w-full py-3 px-4 rounded-md font-medium ${
          uploading
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-blue-500 hover:bg-blue-600 text-white'
        }`}
      >
        {uploading ? 'Uploading Receipt...' : 'Add Expense'}
      </button>
    </form>
  );
};

export default ExpenseForm;