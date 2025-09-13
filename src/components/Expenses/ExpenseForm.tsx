import React, { useState, useEffect } from 'react';
import { X, Calculator } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import toast from 'react-hot-toast';

interface ExpenseFormProps {
  onClose: () => void;
  onSave: () => void;
  editExpenseId?: string;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ onClose, onSave, editExpenseId }) => {
  const { addExpense, updateExpense, suppliers, expenses } = useData();
  const [formData, setFormData] = useState({
    category: '',
    item: '',
    quantity: 1,
    unitPrice: 0,
    supplierId: '',
    description: ''
  });

  const categories = [
    'চাল-ডাল',
    'সবজি',
    'মাছ-মাংস',
    'তেল-মসলা',
    'গ্যাস',
    'বিদ্যুৎ',
    'পানি',
    'অন্যান্য'
  ];

  const totalPrice = formData.quantity * formData.unitPrice;
  const isEditing = !!editExpenseId;

  useEffect(() => {
    if (isEditing && editExpenseId) {
      const expenseToEdit = expenses.find(expense => expense.id === editExpenseId);
      if (expenseToEdit) {
        setFormData({
          category: expenseToEdit.category,
          item: expenseToEdit.item,
          quantity: expenseToEdit.quantity,
          unitPrice: expenseToEdit.unitPrice,
          supplierId: expenseToEdit.supplierId || '',
          description: expenseToEdit.description || ''
        });
      }
    }
  }, [editExpenseId, expenses, isEditing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.category || !formData.item) {
      toast.error('সব প্রয়োজনীয় তথ্য পূরণ করুন');
      return;
    }

    if (formData.quantity <= 0 || formData.unitPrice <= 0) {
      toast.error('সঠিক পরিমাণ এবং দাম লিখুন');
      return;
    }

    if (isEditing && editExpenseId) {
      updateExpense(editExpenseId, {
        category: formData.category,
        item: formData.item,
        quantity: formData.quantity,
        unitPrice: formData.unitPrice,
        totalPrice: totalPrice,
        supplierId: formData.supplierId || undefined,
        description: formData.description || undefined
      });

      toast.success('খরচ সফলভাবে আপডেট করা হয়েছে');
    } else {
      addExpense({
        category: formData.category,
        item: formData.item,
        quantity: formData.quantity,
        unitPrice: formData.unitPrice,
        totalPrice: totalPrice,
        supplierId: formData.supplierId || undefined,
        date: new Date().toISOString().split('T')[0],
        description: formData.description || undefined
      });

      toast.success('খরচ সফলভাবে যোগ করা হয়েছে');
    }
    onSave();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' || name === 'unitPrice' ? Number(value) : value
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
                {isEditing ? 'খরচ সম্পাদনা করুন' : 'নতুন খরচ যোগ করুন'}
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
                <label className="block text-sm font-medium text-gray-700 font-bengali">ক্যাটেগরি</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">নির্বাচন করুন</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 font-bengali">আইটেমের নাম</label>
                <input
                  type="text"
                  name="item"
                  value={formData.item}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="যেমন: বাসমতি চাল, আলু, রুই মাছ"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 font-bengali">পরিমাণ</label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    required
                    min="0.1"
                    step="0.1"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 font-bengali">একক দাম (৳)</label>
                  <input
                    type="number"
                    name="unitPrice"
                    value={formData.unitPrice}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Total Price Display */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calculator className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-blue-800 font-bengali">মোট দাম</span>
                  </div>
                  <span className="text-2xl font-bold text-blue-600">৳{totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 font-bengali">সরবরাহকারী (ঐচ্ছিক)</label>
                <select
                  name="supplierId"
                  value={formData.supplierId}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">নির্বাচন করুন</option>
                  {suppliers.map(supplier => (
                    <option key={supplier.id} value={supplier.id}>
                      {supplier.name} - {supplier.phone}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 font-bengali">বিবরণ (ঐচ্ছিক)</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="অতিরিক্ত তথ্য..."
                />
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
                  {isEditing ? 'আপডেট করুন' : 'খরচ যোগ করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseForm;
