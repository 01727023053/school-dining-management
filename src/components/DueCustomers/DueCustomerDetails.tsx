import React from 'react';
import { X, User, Phone, Calendar, DollarSign, Calculator, MessageSquare, AlertTriangle } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { format } from 'date-fns';

interface DueCustomerDetailsProps {
  customerId: string;
  onClose: () => void;
}

const DueCustomerDetails: React.FC<DueCustomerDetailsProps> = ({ customerId, onClose }) => {
  const { dueCustomers } = useData();
  
  const customer = dueCustomers.find(c => c.id === customerId);

  if (!customer) {
    return null;
  }

  const isOverdue = new Date(customer.dueDate) < new Date();
  const daysOverdue = Math.ceil((new Date().getTime() - new Date(customer.dueDate).getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 font-bengali">
                গ্রাহকের বিস্তারিত
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Total Due */}
              <div className="text-center">
                <div className={`text-3xl font-bold mb-2 ${
                  customer.totalDue > 0 ? 'text-red-600' : 'text-green-600'
                }`}>
                  ৳{customer.totalDue}
                </div>
                <div className="text-sm text-gray-600 font-bengali">
                  {customer.totalDue > 0 ? 'মোট বকেয়া' : 'কোন বকেয়া নেই'}
                </div>
                {isOverdue && (
                  <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-100 text-red-800">
                    <AlertTriangle className="w-4 h-4 mr-1" />
                    <span className="font-bengali">{daysOverdue} দিন মেয়াদোত্তীর্ণ</span>
                  </div>
                )}
              </div>

              {/* Customer Info */}
              <div className={`rounded-lg p-4 ${isOverdue ? 'bg-red-50 border border-red-200' : 'bg-gray-50'}`}>
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    isOverdue ? 'bg-red-100' : 'bg-blue-100'
                  }`}>
                    <span className={`text-lg font-bold ${
                      isOverdue ? 'text-red-600' : 'text-blue-600'
                    }`}>
                      {customer.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 font-bengali text-lg">
                      {customer.name}
                    </div>
                    {customer.reminderSent && (
                      <div className="text-sm text-green-600 font-bengali">
                        ✓ রিমাইন্ডার পাঠানো হয়েছে
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Details */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500 font-bengali">ফোন নম্বর</div>
                    <div className="font-medium text-gray-900">
                      {customer.phone}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500 font-bengali">পরিশোধের মেয়াদ</div>
                    <div className={`font-medium ${isOverdue ? 'text-red-600' : 'text-gray-900'}`}>
                      {format(new Date(customer.dueDate), 'dd MMMM yyyy')}
                    </div>
                  </div>
                </div>
              </div>

              {/* Financial Breakdown */}
              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-3 font-bengali">আর্থিক বিবরণ</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 font-bengali">পূর্বের বকেয়া</span>
                    <span className={`font-medium ${
                      customer.previousDue > 0 ? 'text-red-600' : 'text-gray-900'
                    }`}>
                      ৳{customer.previousDue}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 font-bengali">আজকের বকেয়া</span>
                    <span className="font-medium text-orange-600">
                      ৳{customer.todaysDue}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 font-bengali">জমা</span>
                    <span className="font-medium text-green-600">
                      ৳{customer.deposit}
                    </span>
                  </div>

                  <div className="border-t pt-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900 font-bengali">মোট বকেয়া</span>
                      <span className={`text-lg font-bold ${
                        customer.totalDue > 0 ? 'text-red-600' : 'text-green-600'
                      }`}>
                        ৳{customer.totalDue}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Calculation Formula */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <Calculator className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800 font-bengali">হিসাব</span>
                </div>
                <div className="text-xs text-blue-700 font-bengali">
                  পূর্বের বকেয়া (৳{customer.previousDue}) + আজকের বকেয়া (৳{customer.todaysDue}) - জমা (৳{customer.deposit}) = ৳{customer.totalDue}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-gray-700 font-bengali"
              >
                বন্ধ করুন
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-green-700 font-bengali">
                <MessageSquare className="w-4 h-4" />
                <span>রিমাইন্ডার পাঠান</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DueCustomerDetails;