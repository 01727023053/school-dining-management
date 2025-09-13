import React, { useState } from 'react';
import { X, Calculator, Calendar } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import toast from 'react-hot-toast';

interface DueCustomerFormProps {
  onClose: () => void;
  onSave: () => void;
}

const DueCustomerForm: React.FC<DueCustomerFormProps> = ({ onClose, onSave }) => {
  const { addDueCustomer } = useData();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    previousDue: 0,
    todaysDue: 0,
    deposit: 0,
    dueDate: ''
  });

  const totalDue = formData.previousDue + formData.todaysDue - formData.deposit;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.dueDate) {
      toast.error('সব প্রয়োজনীয় তথ্য পূরণ করুন');
      return;
    }

    addDueCustomer({
      name: formData.name,
      phone: formData.phone,
      previousDue: formData.previousDue,
      todaysDue: formData.todaysDue,
      deposit: formData.deposit,
      totalDue: totalDue,
      dueDate: formData.dueDate,
      reminderSent: false
    });
    
    toast.success('বকেয়া গ্রাহক সফলভাবে যোগ করা হয়েছে');
    onSave();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'previousDue' || name === 'todaysDue' || name === 'deposit' 
        ? Number(value) : value
    }));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900 font-bengali">
                নতুন বকেয়া গ্রাহক যোগ করুন
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 font-bengali">গ্রাহকের নাম</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="যেমন: মোঃ করিম"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 font-bengali">ফোন নম্বর</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="০১৭১২৩৪৫৬৭৮"
                />
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 font-bengali">পূর্বের বকেয়া (৳)</label>
                  <input
                    type="number"
                    name="previousDue"
                    value={formData.previousDue}
                    onChange={handleChange}
                    min="0"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="০"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 font-bengali">আজকের বকেয়া (৳)</label>
                  <input
                    type="number"
                    name="todaysDue"
                    value={formData.todaysDue}
                    onChange={handleChange}
                    min="0"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="০"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 font-bengali">জমা (৳)</label>
                  <input
                    type="number"
                    name="deposit"
                    value={formData.deposit}
                    onChange={handleChange}
                    min="0"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="০"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 font-bengali">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  পরিশোধের মেয়াদ
                </label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Total Due Calculation */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calculator className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-blue-800 font-bengali">মোট বকেয়া</span>
                  </div>
                  <span className={`text-2xl font-bold ${totalDue > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    ৳{totalDue}
                  </span>
                </div>
                <div className="mt-2 text-sm text-blue-700 font-bengali">
                  পূর্বের বকেয়া (৳{formData.previousDue}) + আজকের বকেয়া (৳{formData.todaysDue}) - জমা (৳{formData.deposit}) = ৳{totalDue}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 font-bengali"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 font-bengali"
                >
                  গ্রাহক যোগ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DueCustomerForm;