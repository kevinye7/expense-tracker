// src/components/Header/Header.tsx
import React from 'react';

/**
 * Application header with title and navigation elements
 * @param {Object} props - Component props
 * @param {string} props.title - Main application title to display in header
 * @param {string} props.subtitle - Optional subtitle or tagline for additional context
 */
interface HeaderProps {
  title: string;
  subtitle?: string;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  return (
    <header className="
      bg-gradient-to-br from-blue-500 to-purple-700 
      text-white shadow-lg mb-8 w-full 
      px-5 py-6 rounded-xl 
      flex flex-col md:flex-row justify-between items-center
      box-border
    ">
      <div className="flex-1 text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white">
          {title}
        </h1>
        {subtitle && (
          <p className="text-base m-0 opacity-90 text-blue-100">
            {subtitle}
          </p>
        )}
      </div>
      <nav className="
        flex flex-col sm:flex-row gap-3 flex-wrap 
        justify-center mt-5 md:mt-0
      ">
        <button className="
          bg-white/10 border border-white/20 
          text-white px-4 py-2 rounded-md 
          text-sm font-medium cursor-pointer 
          transition-all duration-200 
          hover:bg-white/20 hover:-translate-y-0.5
          focus:outline-none focus:ring-2 focus:ring-white/50
          active:bg-white/20 active:border-white/40
        ">
          Dashboard
        </button>
        <button className="
          bg-white/10 border border-white/20 
          text-white px-4 py-2 rounded-md 
          text-sm font-medium cursor-pointer 
          transition-all duration-200 
          hover:bg-white/20 hover:-translate-y-0.5
          focus:outline-none focus:ring-2 focus:ring-white/50
        ">
          Analytics
        </button>
        <button className="
          bg-white/20 border border-white/40 
          text-white px-4 py-2 rounded-md 
          text-sm font-medium cursor-pointer 
          transition-all duration-200 
          hover:bg-white/20 hover:-translate-y-0.5
          focus:outline-none focus:ring-2 focus:ring-white/50
        ">
          Settings
        </button>
      </nav>
    </header>
  );
};

export default Header;