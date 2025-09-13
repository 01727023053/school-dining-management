import React, { useState } from 'react';
import { Plus, Search, Users, Phone, Calendar, AlertTriangle, Edit, Eye, Trash2, MessageSquare, DollarSign } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import DueCustomerForm from './DueCustomerForm';
import DueCustomerDetails from './DueCustomerDetails';
import toast from 'react-hot-toast';

const DueCustomerManager: React.FC = () => {
  const { dueCustomers } = useData();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOverdue, setFilterOverdue] = useState<boolean | null>(null);

  const filteredCustomers = dueCustomers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm);
    
    const isOverdue = new Date(customer.dueDate) < new Date();
    const matchesFilter = filterOverdue === null || 
                         (filterOverdue === true && isOverdue) ||
                         (filterOverdue === false && !isOverdue);
    
    return matchesSearch && matchesFilter;
  });

  const totalDue = dueCustomers.reduce((sum, c) => sum + c.totalDue, 0);
  const overdueCustomers = dueCustomers.filter(c => new Date(c.dueDate) < new Date());
  const totalOverdue = overdueCustomers.reduce((sum, c) => sum + c.totalDue, 0);
  const remindersSent = dueCustomers.filter(c => c.reminderSent).length;

  const sendReminder = (customerId: string) => {
    // In a real app, this would send SMS/email
    toast.success('রিমাইন্ডার পাঠানো হয়েছে');
  };

  const sendReminderToAll = () => {
    // Send reminder to all customers with due amounts
    const customersWithDue = dueCustomers.filter(c => c.totalDue > 0);
    if (customersWithDue.length === 0) {
      toast.error('কোন বকেয়া গ্রাহক নেই');
      return;
    }
    toast.success(`${customersWithDue.length} জন গ্রাহককে রিমাইন্ডার পাঠানো হয়েছে`);
  };

  const showOverdueList = () => {
    setFilterOverdue(true);
    toast(`${overdueCustomers.length} জন মেয়াদোত্তীর্ণ গ্রাহক দেখানো হচ্ছে`);
  };

  const generateMonthlyReport = () => {
    navigate('/reports');
    toast.success('মাসিক রিপোর্ট পেজে নিয়ে যাওয়া হচ্ছে');
  };

  const getDaysOverdue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = today.getTime() - due.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 font-bengali">বকেয়া গ্রাহক ব্যবস্থাপনা</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="font-bengali">নতুন গ্রাহক</span>
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 font-bengali">মোট গ্রাহক</p>
              <p className="text-2xl font-bold text-gray-900">{dueCustomers.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <DollarSign className="w-8 h-8 text-red-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 font-bengali">মোট বকেয়া</p>
              <p className="text-2xl font-bold text-red-600">৳{totalDue}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <AlertTriangle className="w-8 h-8 text-orange-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 font-bengali">মেয়াদোত্তীর্ণ</p>
              <p className="text-2xl font-bold text-orange-600">{overdueCustomers.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <MessageSquare className="w-8 h-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 font-bengali">রিমাইন্ডার পাঠানো</p>
              <p className="text-2xl font-bold text-green-600">{remindersSent}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Overdue Alert */}
      {overdueCustomers.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <h3 className="ml-2 text-lg font-semibold text-red-800 font-bengali">
              মেয়াদোত্তীর্ণ বকেয়া সতর্কতা
            </h3>
          </div>
          <p className="mt-2 text-red-700 font-bengali">
            {overdueCustomers.length} জন গ্রাহকের বকেয়া মেয়াদোত্তীর্ণ হয়েছে। মোট ৳{totalOverdue} টাকা।
          </p>
          <div className="mt-3 space-y-1">
            {overdueCustomers.slice(0, 3).map(customer => (
              <div key={customer.id} className="flex justify-between text-sm">
                <span className="font-bengali">
                  {customer.name} ({getDaysOverdue(customer.dueDate)} দিন অতিক্রান্ত)
                </span>
                <span className="font-semibold text-red-600">৳{customer.totalDue}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-6 border border-orange-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 font-bengali">দ্রুত কাজ</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={sendReminderToAll}
            className="bg-white rounded-lg p-4 border border-orange-200 hover:bg-orange-50 transition-colors"
          >
            <div className="text-center">
              <div className="text-2xl mb-2">📞</div>
              <h4 className="font-medium text-gray-800 font-bengali">সব গ্রাহককে রিমাইন্ডার</h4>
              <p className="text-sm text-gray-600 font-bengali">একসাথে সবাইকে SMS পাঠান</p>
            </div>
          </button>

          <button 
            onClick={showOverdueList}
            className="bg-white rounded-lg p-4 border border-red-200 hover:bg-red-50 transition-colors"
          >
            <div className="text-center">
              <div className="text-2xl mb-2">⚠️</div>
              <h4 className="font-medium text-gray-800 font-bengali">মেয়াদোত্তীর্ণ তালিকা</h4>
              <p className="text-sm text-gray-600 font-bengali">যাদের মেয়াদ শেষ হয়েছে</p>
            </div>
          </button>

          <button 
            onClick={generateMonthlyReport}
            className="bg-white rounded-lg p-4 border border-green-200 hover:bg-green-50 transition-colors"
          >
            <div className="text-center">
              <div className="text-2xl mb-2">📊</div>
              <h4 className="font-medium text-gray-800 font-bengali">মাসিক রিপোর্ট</h4>
              <p className="text-sm text-gray-600 font-bengali">বকেয়া পরিস্থিতির রিপোর্ট</p>
            </div>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="নাম বা ফোন নম্বর খুঁজুন..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={filterOverdue === null ? 'all' : filterOverdue ? 'overdue' : 'current'}
            onChange={(e) => {
              const value = e.target.value;
              setFilterOverdue(value === 'all' ? null : value === 'overdue');
            }}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">সব গ্রাহক</option>
            <option value="overdue">মেয়াদোত্তীর্ণ</option>
            <option value="current">চলমান</option>
          </select>

          <button 
            onClick={sendReminderToAll}
            className="flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            <span className="font-bengali">সব গ্রাহককে SMS</span>
          </button>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-bengali">
                  গ্রাহক
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-bengali">
                  ফোন
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-bengali">
                  পূর্বের বকেয়া
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-bengali">
                  আজকের বকেয়া
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-bengali">
                  জমা
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-bengali">
                  মোট বকেয়া
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-bengali">
                  মেয়াদ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-bengali">
                  অ্যাকশন
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.length > 0 ? filteredCustomers.map((customer) => {
                const isOverdue = new Date(customer.dueDate) < new Date();
                const daysOverdue = getDaysOverdue(customer.dueDate);
                
                return (
                  <tr key={customer.id} className={`hover:bg-gray-50 ${isOverdue ? 'bg-red-50' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isOverdue ? 'bg-red-100' : 'bg-blue-100'
                        }`}>
                          <span className={`text-sm font-medium ${
                            isOverdue ? 'text-red-600' : 'text-blue-600'
                          }`}>
                            {customer.name.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 font-bengali">{customer.name}</div>
                          {customer.reminderSent && (
                            <div className="text-xs text-green-600 font-bengali">রিমাইন্ডার পাঠানো</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{customer.phone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">
                        ৳{customer.previousDue}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-orange-600">
                        ৳{customer.todaysDue}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-green-600">
                        ৳{customer.deposit}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-bold ${
                        customer.totalDue > 0 ? 'text-red-600' : 'text-green-600'
                      }`}>
                        ৳{customer.totalDue}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div className={`font-medium ${isOverdue ? 'text-red-600' : 'text-gray-900'}`}>
                          {format(new Date(customer.dueDate), 'dd/MM/yyyy')}
                        </div>
                        {isOverdue && (
                          <div className="text-xs text-red-500 font-bengali">
                            {daysOverdue} দিন অতিক্রান্ত
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedCustomer(customer.id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-indigo-600 hover:text-indigo-900">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => sendReminder(customer.id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500 font-bengali">
                    কোন বকেয়া গ্রাহক পাওয়া যায়নি
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Form Modal */}
      {showForm && (
        <DueCustomerForm
          onClose={() => setShowForm(false)}
          onSave={() => setShowForm(false)}
        />
      )}

      {/* Customer Details Modal */}
      {selectedCustomer && (
        <DueCustomerDetails
          customerId={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
        />
      )}
    </div>
  );
};

export default DueCustomerManager;