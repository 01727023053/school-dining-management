import React, { useState } from 'react';
import { X, CreditCard, Smartphone, Banknote, Wallet, DollarSign } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import toast from 'react-hot-toast';

interface PaymentFormProps {
  onClose: () => void;
  onSave: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ onClose, onSave }) => {
  const { students, addPayment } = useData();
  const [formData, setFormData] = useState({
    studentId: '',
    amount: 0,
    method: 'bkash' as 'bkash' | 'nagad' | 'rocket' | 'upay' | 'cash' | 'bank',
    transactionId: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.studentId) {
      toast.error('শিক্ষার্থী নির্বাচন করুন');
      return;
    }

    if (formData.amount <= 0) {
      toast.error('সঠিক পরিমাণ লিখুন');
      return;
    }

    if ((formData.method === 'bkash' || formData.method === 'nagad' || formData.method === 'rocket' || formData.method === 'upay') && !formData.transactionId) {
      toast.error('ট্রানজেকশন ID প্রয়োজন');
      return;
    }

    addPayment({
      studentId: formData.studentId,
      amount: formData.amount,
      method: formData.method,
      transactionId: formData.transactionId || undefined,
      date: new Date().toISOString().split('T')[0],
      status: 'completed'
    });
    
    toast.success('পেমেন্ট সফলভাবে যোগ করা হয়েছে');
    onSave();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? Number(value) : value
    }));
  };

  const paymentMethods = [
    {
      value: 'bkash',
      label: 'বিকাশ',
      icon: <div className="w-5 h-5 bg-pink-500 rounded flex items-center justify-center text-white text-xs font-bold">bK</div>,
      number: '০১৩০ ৯৪ ১৯৪০',
      type: 'মার্চেন্ট',
      color: 'border-pink-200 bg-pink-50'
    },
    {
      value: 'nagad',
      label: 'নগদ',
      icon: <div className="w-5 h-5 bg-orange-500 rounded flex items-center justify-center text-white text-xs font-bold">N</div>,
      number: '০১৩০৩ ৯৪১ ৯৪০',
      type: 'পার্সোনাল',
      color: 'border-orange-200 bg-orange-50'
    },
    {
      value: 'rocket',
      label: 'রকেট',
      icon: <div className="w-5 h-5 bg-purple-500 rounded flex items-center justify-center text-white text-xs font-bold">R</div>,
      number: '০১৭১২৩৪৫৬৭৮',
      type: 'এজেন্ট',
      color: 'border-purple-200 bg-purple-50'
    },
    {
      value: 'upay',
      label: 'উপায়',
      icon: <div className="w-5 h-5 bg-blue-500 rounded flex items-center justify-center text-white text-xs font-bold">U</div>,
      number: '০১৮১২৩৪৫৬৭৮',
      type: 'পার্সোনাল',
      color: 'border-blue-200 bg-blue-50'
    },
    {
      value: 'cash',
      label: 'ক্যাশ',
      icon: <Banknote className="w-5 h-5 text-green-600" />,
      number: '',
      type: 'নগদ টাকা',
      color: 'border-green-200 bg-green-50'
    },
    {
      value: 'bank',
      label: 'ব্যাংক ট্রান্সফার',
      icon: <CreditCard className="w-5 h-5 text-indigo-600" />,
      number: 'A/C: ১২৩৪৫৬৭৮৯০',
      type: 'ব্যাংক অ্যাকাউন্ট',
      color: 'border-indigo-200 bg-indigo-50'
    }
  ];

  const selectedMethod = paymentMethods.find(m => m.value === formData.method);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900 font-bengali">
                নতুন পেমেন্ট যোগ করুন
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 font-bengali">শিক্ষার্থী নির্বাচন করুন</label>
                <select
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">নির্বাচন করুন</option>
                  {students.map(student => (
                    <option key={student.id} value={student.id}>
                      {student.name} - রোল: {student.roll} (ব্যালেন্স: ৳{student.balance})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 font-bengali mb-3">পেমেন্ট মেথড</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {paymentMethods.map(method => (
                    <label key={method.value} className={`flex items-center p-4 border-2 rounded-lg cursor-pointer hover:shadow-md transition-all ${
                      formData.method === method.value ? method.color : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <input
                        type="radio"
                        name="method"
                        value={method.value}
                        checked={formData.method === method.value}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <div className="ml-3 flex items-center space-x-3 flex-1">
                        {method.icon}
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 font-bengali">{method.label}</div>
                          {method.number && (
                            <div className="text-sm text-gray-600">
                              {method.number}
                            </div>
                          )}
                          <div className="text-xs text-gray-500 font-bengali">{method.type}</div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {selectedMethod && selectedMethod.number && (
                <div className={`border-2 rounded-lg p-4 ${selectedMethod.color}`}>
                  <div className="flex items-center space-x-3">
                    {selectedMethod.icon}
                    <div>
                      <p className="font-medium text-gray-800 font-bengali">
                        {selectedMethod.label} নম্বর: {selectedMethod.number}
                      </p>
                      <p className="text-sm text-gray-600 font-bengali">
                        এই নম্বরে পেমেন্ট পাঠান এবং ট্রানজেকশন ID নিচে লিখুন
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 font-bengali">পরিমাণ (৳)</label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                    min="1"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="পেমেন্টের পরিমাণ লিখুন"
                  />
                </div>
              </div>

              {(formData.method === 'bkash' || formData.method === 'nagad' || formData.method === 'rocket' || formData.method === 'upay' || formData.method === 'bank') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 font-bengali">
                    {formData.method === 'bank' ? 'রেফারেন্স নম্বর' : 'ট্রানজেকশন ID'} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="transactionId"
                    value={formData.transactionId}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder={formData.method === 'bank' ? 'ব্যাংক রেফারেন্স নম্বর লিখুন' : 'ট্রানজেকশন ID লিখুন'}
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 font-bengali">বিবরণ (ঐচ্ছিক)</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bangla-input"
                  placeholder="অতিরিক্ত তথ্য..."
                />
              </div>

              {/* Payment Summary */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 font-bengali mb-2">পেমেন্ট সামারি</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-bengali">পেমেন্ট মেথড:</span>
                    <span className="font-medium text-gray-900 font-bengali">{selectedMethod?.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-bengali">পরিমাণ:</span>
                    <span className="font-bold text-blue-600 text-lg">৳{formData.amount}</span>
                  </div>
                  {formData.studentId && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-bengali">শিক্ষার্থী:</span>
                      <span className="font-medium text-gray-900 font-bengali">
                        {students.find(s => s.id === formData.studentId)?.name}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 font-bengali transition-colors"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 font-bengali transition-colors flex items-center space-x-2"
                >
                  <Wallet className="w-4 h-4" />
                  <span>পেমেন্ট যোগ করুন</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;