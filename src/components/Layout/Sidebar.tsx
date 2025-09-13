import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Users,
  UserCheck,
  CreditCard,
  ShoppingCart,
  UserX,
  Wallet,
  BarChart3,
  Settings,
  Home,
  QrCode,
  Fingerprint,
  DollarSign,
  Smartphone,
  Zap,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar: React.FC = () => {
  const { user } = useAuth();

  const menuItems = [
    { path: '/', icon: Home, label: 'ড্যাশবোর্ড', roles: ['admin', 'supervisor', 'student'] },
    { path: '/student-payment', icon: CreditCard, label: '💳 পেমেন্ট করুন', roles: ['student'], special: true },
    { path: '/students', icon: Users, label: 'শিক্ষার্থী', roles: ['admin', 'supervisor'] },
    { path: '/attendance', icon: UserCheck, label: 'উপস্থিতি', roles: ['admin', 'supervisor'] },
    { path: '/biometric-attendance', icon: Fingerprint, label: 'বায়োমেট্রিক হাজিরা', roles: ['admin', 'supervisor'] },
    { path: '/qr-attendance', icon: QrCode, label: 'QR উপস্থিতি', roles: ['admin', 'supervisor'] },
    { path: '/payments', icon: CreditCard, label: 'পেমেন্ট', roles: ['admin', 'supervisor'] },
    { path: '/mobile-payment', icon: Smartphone, label: 'মোবাইল পেমেন্ট', roles: ['admin', 'supervisor'] },
    { path: '/expenses', icon: ShoppingCart, label: 'খরচ', roles: ['admin', 'supervisor'] },
    { path: '/suppliers', icon: Users, label: 'সরবরাহকারী', roles: ['admin', 'supervisor'] },
    { path: '/due-customers', icon: UserX, label: 'বকেয়া গ্রাহক', roles: ['admin', 'supervisor'] },
    { path: '/cash-tracking', icon: Wallet, label: 'ক্যাশ ট্র্যাকিং', roles: ['admin', 'supervisor'] },
    { path: '/reports', icon: BarChart3, label: 'রিপোর্ট', roles: ['admin', 'supervisor'] },
    { path: '/settings', icon: Settings, label: 'সেটিংস', roles: ['admin'] }
  ];

  const filteredItems = menuItems.filter(item => 
    user && item.roles.includes(user.role)
  );

  return (
    <div className="w-64 bg-white shadow-lg h-full flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Home className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800 leading-tight font-bengali">স্কুল ডাইনিং</h1>
            <p className="text-sm text-gray-600 leading-tight font-bengali">ম্যানেজমেন্ট সিস্টেম</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 py-4 overflow-y-auto h-full">
        <div className="space-y-1 px-3">
          {filteredItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 group ${
                  item.special ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg hover:from-green-600 hover:to-blue-600 transform hover:scale-105' :
                  isActive
                    ? 'bg-blue-50 text-blue-700 shadow-sm border-l-4 border-blue-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`flex-shrink-0 w-5 h-5 mr-3 transition-colors ${
                    item.special ? 'text-white' :
                    isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'
                  }`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className={`flex-1 text-left font-medium leading-tight font-bengali ${
                    item.special ? 'text-white font-bold' : ''
                  }`} style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
                    {item.label}
                  </span>
                  {/* Special badges */}
                  {item.special && (
                    <div className="ml-2">
                      <ArrowRight className="w-4 h-4 text-white animate-pulse" />
                    </div>
                  )}
                  {(item.path === '/payments' || item.path === '/mobile-payment') && !item.special && (
                    <div className="ml-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <DollarSign className="w-3 h-3 mr-1" />
                        Pay
                      </span>
                    </div>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center font-bengali">
          © ২০২৫ স্কুল ডাইনিং সিস্টেম
        </div>
      </div>
    </div>
  );
};

export default Sidebar;