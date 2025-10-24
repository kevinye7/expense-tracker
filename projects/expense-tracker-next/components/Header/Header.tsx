import React from 'react';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  return (
    <header className="
      bg-gradient-to-br from-blue-500 to-purple-600
      text-white shadow-lg mb-8
      flex flex-col lg:flex-row lg:justify-between lg:items-center
      p-6 rounded-xl gap-6
    ">
      <div className="flex-1">
        <h1 className="text-3xl font-bold mb-2 text-white">
          {title}
        </h1>
        {subtitle && (
          <p className="text-blue-100 opacity-90">
            {subtitle}
          </p>
        )}
      </div>
      
      <nav className="flex flex-wrap gap-3 justify-center lg:justify-end">
        <button className="
          bg-white/20 hover:bg-white/30 
          text-white border border-white/30 hover:border-white/40
          px-4 py-2 rounded-md text-sm font-medium
          transition-all duration-200 hover:-translate-y-0.5
          focus:outline-none focus:ring-2 focus:ring-white/50
        ">
          Dashboard
        </button>
        <button className="
          bg-white/10 hover:bg-white/20 
          text-white border border-white/20 hover:border-white/30
          px-4 py-2 rounded-md text-sm font-medium
          transition-all duration-200 hover:-translate-y-0.5
          focus:outline-none focus:ring-2 focus:ring-white/50
        ">
          Analytics
        </button>
        <button className="
          bg-white/10 hover:bg-white/20 
          text-white border border-white/20 hover:border-white/30
          px-4 py-2 rounded-md text-sm font-medium
          transition-all duration-200 hover:-translate-y-0.5
          focus:outline-none focus:ring-2 focus:ring-white/50
        ">
          Settings
        </button>
      </nav>
    </header>
  );
};

export default Header;