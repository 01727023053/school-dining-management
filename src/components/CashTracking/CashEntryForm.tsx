import React, { useState } from 'react';
import { X, Calculator, TrendingUp, TrendingDown, Home, Utensils, Truck, Store, CreditCard, Package } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import toast from 'react-hot-toast';

interface CashEntryFormProps {
  onClose: () => void;
  onSave: () => void;
  initialType?: 'income' | 'expense';
  initialSource?: string;
}

const CashEntryForm: React.FC<CashEntryFormProps> = ({ onClose, onSave, initialType = 'income', initialSource = '' }) => {
  const { addCashEntry } = useData();
  const [formData, setFormData] = useState({
    source: initialSource,
    amount: 0,
    description: '',
    type: initialType
  });

  const sources = [
    { value: 'home', label: 'বাড়ি থেকে', icon: Home },
    { value: 'meal_payment', label: 'মিল পেমেন্ট', icon: Utensils },
    { value: 'match', label: 'ডেলিভারি থেকে', icon: Truck },
    { value: 'shop', label: 'দোকান', icon: Store },
    { value: 'expense', label: 'খরচ', icon: CreditCard },
    { value: 'other', label: 'অন্যান্য', icon: Package }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.source || !formData.description) {
      toast.error('সব প্রয়োজনীয় তথ্য পূরণ করুন');
      return;
    }

    if (formData.amount <= 0) {
      toast.error('সঠিক পরিমাণ লিখুন');
      return;
    }

    const finalAmount = formData.type === 'expense' ? -formData.amount : formData.amount;

    addCashEntry({
      source: formData.source,
      amount: finalAmount,
      description: formData.description,
      date: new Date().toISOString().split('T')[0]
    });
    
    toast.success('ক্যাশ এন্ট্রি সফলভাবে যোগ করা হয়েছে');
    onSave();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? Number(value) : value
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
                নতুন ক্যাশ এন্ট্রি যোগ করুন
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Entry Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 font-bengali mb-2">এন্ট্রির ধরন</label>
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="type"
                      value="income"
                      checked={formData.type === 'income'}
                      onChange={handleChange}
                      className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300"
                    />
                    <div className="ml-3 flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-green-800 font-bengali">আয়</span>
                    </div>
                  </label>

                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="type"
                      value="expense"
                      checked={formData.type === 'expense'}
                      onChange={handleChange}
                      className="w-4 h-4 text-red-600 focus:ring-red-500 border-gray-300"
                    />
                    <div className="ml-3 flex items-center space-x-2">
                      <TrendingDown className="w-5 h-5 text-red-600" />
                      <span className="font-medium text-red-800 font-bengali">খরচ</span>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 font-bengali">সোর্স</label>
                <select
                  name="source"
                  value={formData.source}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bangla-input"
                >
                  <option value="">নির্বাচন করুন</option>
                  {sources.map(source => {
                    return (
                      <option key={source.value} value={source.value}>
                        {source.label}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 font-bengali">পরিমাণ (৳)</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  min="1"
                  step="0.01"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bangla-input"
                  placeholder="পরিমাণ লিখুন"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 font-bengali">বিবরণ</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bangla-input form-textarea-bangla"
                  placeholder="বিস্তারিত বিবরণ লিখুন... (বিজয় ৫২ কীবোর্ড ব্যবহার করতে পারেন)"
                  lang="bn"
                  dir="ltr"
                />
              </div>

              {/* Amount Preview */}
              <div className={`border rounded-lg p-4 ${
                formData.type === 'income' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calculator className={`w-5 h-5 ${
                      formData.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`} />
                    <span className={`font-medium font-bengali ${
                      formData.type === 'income' ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {formData.type === 'income' ? 'আয়' : 'খরচ'}
                    </span>
                  </div>
                  <span className={`text-2xl font-bold ${
                    formData.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formData.type === 'expense' ? '-' : '+'}৳{formData.amount}
                  </span>
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
                  এন্ট্রি যোগ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CashEntryForm;