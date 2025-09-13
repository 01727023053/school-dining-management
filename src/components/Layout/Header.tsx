import React from 'react';
import { Bell, LogOut, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { students } = useData();

  // Count students with low balance
  const lowBalanceStudents = students.filter(s => s.balance <= 300).length;

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center">
          <h2 className="text-lg font-semibold text-gray-800">
            স্বাগতম, {user?.name}
          </h2>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Notification Bell */}
          <div className="relative">
            <Bell className="w-6 h-6 text-gray-600 cursor-pointer hover:text-gray-800" />
            {lowBalanceStudents > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {lowBalanceStudents}
              </span>
            )}
          </div>
          
          {/* User Menu */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <User className="w-8 h-8 text-gray-600 bg-gray-100 rounded-full p-1" />
              <div className="text-sm">
                <p className="text-gray-800 font-medium">{user?.name}</p>
                <p className="text-gray-500 capitalize">{user?.role}</p>
              </div>
            </div>
            
            <button
              onClick={logout}
              className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">লগআউট</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;