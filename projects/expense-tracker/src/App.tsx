// src/App.tsx - Updated with centralized state management
import { useState } from 'react';
import Header from './components/Header/Header';
import ExpenseSummary from './components/ExpenseSummary/ExpenseSummary';
import ExpenseList from './components/ExpenseList/ExpenseList';
import ExpenseForm from './components/ExpenseForm/ExpenseForm';
import type { ExpenseCategory } from './components/ExpenseCard/ExpenseCard';

// Type for expense data
export interface Expense {
  id: string;                    // Professional: UUIDs are strings
  description: string;
  amount: number;
  category: ExpenseCategory;     // Your union type
  date: string;                 // ISO date string
  createdAt?: string;           // Optional metadata
  updatedAt?: string;           // Professional tracking
  tags?: string[];              // Optional future features
}

/**
 * Root application component managing global expense state and component coordination
 * IMPORTANT: This is the SINGLE SOURCE OF TRUTH for all expense data
 */
function App() {
  // Application state for expense data - this is the only place expenses are stored
  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: Date.now().toString(),
      description: "Lunch at downtown cafe",
      amount: 12.50,
      category: "Food",
      date: "2024-01-15",
      createdAt: new Date().toISOString()
    },
    {
      id: Date.now().toString(),
      description: "Monthly bus pass",
      amount: 95.00,
      category: "Transportation",
      date: "2024-01-14",
      createdAt: new Date().toISOString()
    }
  ]);

  /**
   * Adds new expense to application state
   * This function is passed down to ExpenseForm component
   * @param {Omit<Expense, 'id'>} expenseData - New expense data without ID
   */
  const handleAddExpense = (expenseData: Omit<Expense, 'id'>): void => {
    const newExpense: Expense = {
      ...expenseData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: undefined,               
      tags: [],
    };
    setExpenses(prev => [...prev, newExpense]);
  };

  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto p-5">
        <Header 
          title="Expense Tracker" 
          subtitle="Manage your spending with confidence" 
        />
        
        <main className="space-y-8">
          <ExpenseSummary 
            totalAmount={totalAmount}
            expenseCount={expenses.length}
            period="This Month"
          />
          
          <ExpenseForm onSubmit={handleAddExpense} />
          
          {/* FIXED: Pass expenses directly, not as initialExpenses */}
          <ExpenseList 
            expenses={expenses} 
            onDelete={(id) => setExpenses(prev => prev.filter(e => e.id !== id))}
          />
        </main>
      </div>
    </div>
  );
}

export default App;